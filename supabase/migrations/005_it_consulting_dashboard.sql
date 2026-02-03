-- =====================================================
-- IT Consulting & Admin Dashboard Migration
-- IT Leads Table and Dashboard Helper Functions
-- =====================================================

-- =====================================================
-- 1. IT LEADS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.it_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company & Contact Information
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Project Details
  service_interest TEXT NOT NULL CHECK (
    service_interest IN (
      'Custom ERP Development',
      'Mobile App Development',
      'QA & Testing Services',
      'Cloud Solutions',
      'IT Consulting',
      'Other'
    )
  ),
  project_description TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  
  -- Lead Management
  status TEXT NOT NULL DEFAULT 'New' CHECK (
    status IN ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost')
  ),
  assigned_to UUID REFERENCES public.profiles(id),
  priority TEXT DEFAULT 'Medium' CHECK (
    priority IN ('Low', 'Medium', 'High', 'Urgent')
  ),
  
  -- Metadata
  notes TEXT,
  source TEXT DEFAULT 'Website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.it_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create leads (for public form)"
  ON public.it_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and Tech team can view all leads"
  ON public.it_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('Admin', 'Tech')
    )
  );

CREATE POLICY "Admins and Tech team can update leads"
  ON public.it_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('Admin', 'Tech')
    )
  );

CREATE POLICY "Only Admins can delete leads"
  ON public.it_leads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_it_leads_status 
  ON public.it_leads(status);

CREATE INDEX IF NOT EXISTS idx_it_leads_created_at 
  ON public.it_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_it_leads_assigned_to 
  ON public.it_leads(assigned_to);

-- =====================================================
-- 2. DASHBOARD HELPER FUNCTIONS
-- =====================================================

-- Get action center items (urgent deals and tasks)
CREATE OR REPLACE FUNCTION public.get_action_center_items()
RETURNS TABLE (
  item_type TEXT,
  item_id UUID,
  deal_ref TEXT,
  title TEXT,
  description TEXT,
  priority TEXT,
  due_date DATE,
  days_remaining INT
) AS $$
BEGIN
  RETURN QUERY
  
  -- LC Expiring Soon
  SELECT 
    'lc_expiring'::TEXT as item_type,
    dp.id as item_id,
    d.deal_ref,
    'LC Expiring Soon'::TEXT as title,
    CONCAT('LC ', dp.lc_number, ' expires in ', 
           (dp.lc_latest_shipment_date - CURRENT_DATE), ' days') as description,
    CASE 
      WHEN (dp.lc_latest_shipment_date - CURRENT_DATE) <= 0 THEN 'Urgent'
      WHEN (dp.lc_latest_shipment_date - CURRENT_DATE) <= 2 THEN 'High'
      ELSE 'Medium'
    END as priority,
    dp.lc_latest_shipment_date as due_date,
    (dp.lc_latest_shipment_date - CURRENT_DATE) as days_remaining
  FROM public.deal_payments dp
  JOIN public.deals d ON d.id = dp.deal_id
  WHERE dp.payment_method = 'Letter of Credit'
    AND dp.lc_latest_shipment_date IS NOT NULL
    AND dp.status != 'Cancelled'
    AND (dp.lc_latest_shipment_date - CURRENT_DATE) <= 5
  
  UNION ALL
  
  -- Overdue Payments
  SELECT 
    'payment_overdue'::TEXT,
    dp.id,
    d.deal_ref,
    'Payment Overdue'::TEXT,
    CONCAT('Payment of ', dp.amount_inr::TEXT, ' INR overdue by ',
           ABS(CURRENT_DATE - dp.due_date), ' days') as description,
    'High'::TEXT,
    dp.due_date,
    (dp.due_date - CURRENT_DATE) as days_remaining
  FROM public.deal_payments dp
  JOIN public.deals d ON d.id = dp.deal_id
  WHERE dp.status = 'Overdue'
  
  UNION ALL
  
  -- Customs Clearance Pending (missing Bill of Entry)
  SELECT 
    'customs_pending'::TEXT,
    d.id,
    d.deal_ref,
    'Customs Clearance Pending'::TEXT,
    'Bill of Entry required for customs clearance'::TEXT,
    'Medium'::TEXT,
    NULL::DATE,
    NULL::INT
  FROM public.deals d
  WHERE d.status = 'Shipped'
    AND NOT EXISTS (
      SELECT 1 FROM public.deal_documents dd
      WHERE dd.deal_id = d.id
      AND dd.document_tag = 'Bill of Entry'
      AND dd.is_current = true
    )
  
  ORDER BY 
    CASE priority
      WHEN 'Urgent' THEN 1
      WHEN 'High' THEN 2
      WHEN 'Medium' THEN 3
      ELSE 4
    END,
    days_remaining NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get new IT leads (last 7 days)
CREATE OR REPLACE FUNCTION public.get_recent_it_leads(p_days INT DEFAULT 7)
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  contact_person TEXT,
  email TEXT,
  service_interest TEXT,
  status TEXT,
  priority TEXT,
  created_at TIMESTAMPTZ,
  days_old INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.company_name,
    l.contact_person,
    l.email,
    l.service_interest,
    l.status,
    l.priority,
    l.created_at,
    EXTRACT(DAY FROM NOW() - l.created_at)::INT as days_old
  FROM public.it_leads l
  WHERE l.created_at >= NOW() - INTERVAL '1 day' * p_days
  ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. TRIGGER: UPDATE TIMESTAMPS
-- =====================================================

CREATE TRIGGER update_it_leads_updated_at
  BEFORE UPDATE ON public.it_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Summary:
-- 1. Created it_leads table for IT consultation requests
-- 2. Added RLS policies (public insert, admin/tech read/update)
-- 3. Created get_action_center_items() function
-- 4. Created get_recent_it_leads() function
-- 5. Added indexes for performance
-- 6. Added automatic timestamp updates
