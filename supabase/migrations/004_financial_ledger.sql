-- =====================================================
-- Financial Ledger System Migration
-- Payment Schedules, LC Management, and P&L Tracking
-- =====================================================

-- =====================================================
-- 1. DEAL PAYMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.deal_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- Payment Details
  payment_type TEXT NOT NULL CHECK (
    payment_type IN ('Advance', 'Balance', 'LC', 'Final', 'Other')
  ),
  percentage NUMERIC(5, 2) CHECK (percentage >= 0 AND percentage <= 100),
  amount_usd NUMERIC(12, 2),
  amount_inr NUMERIC(15, 2),
  
  -- Dates
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (
    status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')
  ),
  
  -- Payment Method
  payment_method TEXT NOT NULL CHECK (
    payment_method IN ('Wire Transfer', 'Letter of Credit', 'Cash', 'Check', 'Other')
  ),
  
  -- LC Specific Fields
  lc_number TEXT,
  lc_latest_shipment_date DATE,
  lc_issuing_bank TEXT,
  lc_beneficiary TEXT,
  
  -- Proof Document
  proof_document_path TEXT,
  proof_document_name TEXT,
  
  -- Metadata
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.deal_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view payments for deals they can access"
  ON public.deal_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals d
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE d.id = deal_id
      AND (
        p.role IN ('Admin', 'Trader') OR
        (p.role = 'Viewer' AND d.status != 'Draft')
      )
    )
  );

CREATE POLICY "Traders and Admins can create payments"
  ON public.deal_payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Traders and Admins can update payments"
  ON public.deal_payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Only Admins can delete payments"
  ON public.deal_payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deal_payments_deal_id 
  ON public.deal_payments(deal_id);

CREATE INDEX IF NOT EXISTS idx_deal_payments_status 
  ON public.deal_payments(status);

CREATE INDEX IF NOT EXISTS idx_deal_payments_due_date 
  ON public.deal_payments(due_date);

-- =====================================================
-- 2. DEAL EXPENSES ACTUAL TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.deal_expenses_actual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- Expense Details
  expense_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_inr NUMERIC(15, 2) NOT NULL,
  amount_usd NUMERIC(12, 2),
  
  -- Payment Details
  paid_date DATE NOT NULL,
  vendor_name TEXT,
  invoice_number TEXT,
  
  -- Proof Document
  proof_document_path TEXT,
  proof_document_name TEXT,
  
  -- Metadata
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.deal_expenses_actual ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view expenses for deals they can access"
  ON public.deal_expenses_actual FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals d
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE d.id = deal_id
      AND (
        p.role IN ('Admin', 'Trader') OR
        (p.role = 'Viewer' AND d.status != 'Draft')
      )
    )
  );

CREATE POLICY "Traders and Admins can create expenses"
  ON public.deal_expenses_actual FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Traders and Admins can update expenses"
  ON public.deal_expenses_actual FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Only Admins can delete expenses"
  ON public.deal_expenses_actual FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deal_expenses_actual_deal_id 
  ON public.deal_expenses_actual(deal_id);

CREATE INDEX IF NOT EXISTS idx_deal_expenses_actual_paid_date 
  ON public.deal_expenses_actual(paid_date);

-- =====================================================
-- 3. FUNCTIONS FOR P&L CALCULATIONS
-- =====================================================

-- Get P&L summary for a deal
CREATE OR REPLACE FUNCTION public.get_deal_pl_summary(p_deal_id UUID)
RETURNS TABLE (
  deal_id UUID,
  deal_ref TEXT,
  estimated_cost_inr NUMERIC,
  actual_cost_inr NUMERIC,
  variance_inr NUMERIC,
  variance_percentage NUMERIC,
  total_payments_inr NUMERIC,
  total_paid_inr NUMERIC,
  total_pending_inr NUMERIC,
  sell_price_inr NUMERIC,
  profit_inr NUMERIC,
  profit_margin_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as deal_id,
    d.deal_ref,
    d.total_landed_cost_inr as estimated_cost_inr,
    COALESCE(SUM(de.amount_inr), 0) as actual_cost_inr,
    d.total_landed_cost_inr - COALESCE(SUM(de.amount_inr), 0) as variance_inr,
    CASE 
      WHEN d.total_landed_cost_inr > 0 THEN
        ((d.total_landed_cost_inr - COALESCE(SUM(de.amount_inr), 0)) / d.total_landed_cost_inr * 100)
      ELSE 0
    END as variance_percentage,
    COALESCE(SUM(dp.amount_inr), 0) as total_payments_inr,
    COALESCE(SUM(dp.amount_inr) FILTER (WHERE dp.status = 'Paid'), 0) as total_paid_inr,
    COALESCE(SUM(dp.amount_inr) FILTER (WHERE dp.status = 'Pending'), 0) as total_pending_inr,
    d.target_sell_price_inr as sell_price_inr,
    d.target_sell_price_inr - COALESCE(SUM(de.amount_inr), d.total_landed_cost_inr) as profit_inr,
    CASE 
      WHEN d.target_sell_price_inr > 0 THEN
        ((d.target_sell_price_inr - COALESCE(SUM(de.amount_inr), d.total_landed_cost_inr)) / d.target_sell_price_inr * 100)
      ELSE 0
    END as profit_margin_percentage
  FROM public.deals d
  LEFT JOIN public.deal_expenses_actual de ON de.deal_id = d.id
  LEFT JOIN public.deal_payments dp ON dp.deal_id = d.id
  WHERE d.id = p_deal_id
  GROUP BY d.id, d.deal_ref, d.total_landed_cost_inr, d.target_sell_price_inr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get LC alerts (deals with LCs expiring soon)
CREATE OR REPLACE FUNCTION public.get_lc_alerts(p_days_threshold INT DEFAULT 5)
RETURNS TABLE (
  payment_id UUID,
  deal_id UUID,
  deal_ref TEXT,
  lc_number TEXT,
  lc_latest_shipment_date DATE,
  days_until_shipment INT,
  alert_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.id as payment_id,
    d.id as deal_id,
    d.deal_ref,
    dp.lc_number,
    dp.lc_latest_shipment_date,
    (dp.lc_latest_shipment_date - CURRENT_DATE) as days_until_shipment,
    CASE 
      WHEN (dp.lc_latest_shipment_date - CURRENT_DATE) < 0 THEN 'EXPIRED'
      WHEN (dp.lc_latest_shipment_date - CURRENT_DATE) = 0 THEN 'TODAY'
      WHEN (dp.lc_latest_shipment_date - CURRENT_DATE) <= p_days_threshold THEN 'WARNING'
      ELSE 'OK'
    END as alert_level
  FROM public.deal_payments dp
  JOIN public.deals d ON d.id = dp.deal_id
  WHERE dp.payment_method = 'Letter of Credit'
    AND dp.lc_latest_shipment_date IS NOT NULL
    AND dp.status != 'Cancelled'
    AND (dp.lc_latest_shipment_date - CURRENT_DATE) <= p_days_threshold
  ORDER BY dp.lc_latest_shipment_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. TRIGGER: AUTO-UPDATE PAYMENT STATUS TO OVERDUE
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_overdue_payments()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-mark payments as overdue if past due date and still pending
  UPDATE public.deal_payments
  SET 
    status = 'Overdue',
    updated_at = NOW()
  WHERE 
    status = 'Pending'
    AND due_date < CURRENT_DATE
    AND id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This would ideally be a scheduled job, but for demo purposes we can check on reads
-- In production, use pg_cron or an external scheduler

-- =====================================================
-- 5. TRIGGER: UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deal_payments_updated_at
  BEFORE UPDATE ON public.deal_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deal_expenses_actual_updated_at
  BEFORE UPDATE ON public.deal_expenses_actual
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Summary:
-- 1. Created deal_payments table for payment schedules and LC tracking
-- 2. Created deal_expenses_actual table for actual cost tracking
-- 3. Added P&L calculation function
-- 4. Added LC alerts function
-- 5. Configured RLS policies for security
-- 6. Added indexes for performance
-- 7. Added automatic timestamp updates
