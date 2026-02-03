-- =====================================================
-- Logistics Routing & Document Vault Schema
-- =====================================================

-- =====================================================
-- 1. UPDATE DEALS TABLE FOR LOGISTICS ROUTING
-- =====================================================

-- Add logistics routing fields to deals table
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS
  customer_delivery_address TEXT;

ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS
  port_to_warehouse_transport_inr NUMERIC(12, 2) DEFAULT 0;

ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS
  warehouse_destination TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.deals.customer_delivery_address IS 
  'Customer delivery address for Direct_Customer destination type';

COMMENT ON COLUMN public.deals.port_to_warehouse_transport_inr IS 
  'Transport cost from port to warehouse in INR';

COMMENT ON COLUMN public.deals.warehouse_destination IS 
  'Target warehouse location for Warehouse destination type';

-- =====================================================
-- 2. DEAL DOCUMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.deal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- File Information
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  
  -- Document Classification
  document_tag TEXT NOT NULL CHECK (
    document_tag IN (
      'Bill of Lading',
      'Commercial Invoice',
      'PSIC',
      'Weight Slip',
      'Bill of Entry',
      'Packing List',
      'Certificate of Origin',
      'Insurance Certificate',
      'Quality Certificate',
      'Other'
    )
  ),
  
  -- Metadata
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  -- Version Control
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT true,
  replaces_document_id UUID REFERENCES public.deal_documents(id)
);

-- Enable RLS
ALTER TABLE public.deal_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_documents
CREATE POLICY "Users can view documents for deals they can access"
  ON public.deal_documents FOR SELECT
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

CREATE POLICY "Traders and Admins can upload documents"
  ON public.deal_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Users can update documents they uploaded"
  ON public.deal_documents FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

CREATE POLICY "Only Admins can delete documents"
  ON public.deal_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_deal_documents_deal_id 
  ON public.deal_documents(deal_id);

CREATE INDEX IF NOT EXISTS idx_deal_documents_tag 
  ON public.deal_documents(document_tag);

CREATE INDEX IF NOT EXISTS idx_deal_documents_uploaded_by 
  ON public.deal_documents(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_deal_documents_uploaded_at 
  ON public.deal_documents(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_deals_destination_type 
  ON public.deals(destination_type);

-- =====================================================
-- FUNCTIONS FOR DOCUMENT VALIDATION
-- =====================================================

-- Function to check if Bill of Entry exists for a deal
CREATE OR REPLACE FUNCTION public.has_bill_of_entry(p_deal_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.deal_documents
    WHERE deal_id = p_deal_id
    AND document_tag = 'Bill of Entry'
    AND is_current = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get required documents for a deal
CREATE OR REPLACE FUNCTION public.get_required_documents(p_deal_id UUID)
RETURNS TABLE (
  document_tag TEXT,
  is_uploaded BOOLEAN,
  required_for_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    req.tag::TEXT,
    EXISTS (
      SELECT 1 FROM public.deal_documents dd
      WHERE dd.deal_id = p_deal_id
      AND dd.document_tag = req.tag
      AND dd.is_current = true
    ) as is_uploaded,
    req.required_status::TEXT
  FROM (
    VALUES 
      ('Bill of Lading', 'Shipped'),
      ('Commercial Invoice', 'Approved'),
      ('Bill of Entry', 'Customs'),
      ('Weight Slip', 'Shipped')
  ) AS req(tag, required_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: AUTO-CREATE INVENTORY FOR WAREHOUSE DEALS
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_create_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create inventory when deal reaches 'Stock' status
  -- AND destination type is 'Warehouse'
  IF NEW.status = 'Stock' 
     AND OLD.status != 'Stock' 
     AND NEW.destination_type = 'Warehouse' 
  THEN
    -- Check if inventory entry already exists
    IF NOT EXISTS (
      SELECT 1 FROM public.inventory
      WHERE deal_id = NEW.id
    ) THEN
      INSERT INTO public.inventory (
        deal_id,
        warehouse_location,
        current_weight,
        reserved_weight,
        status,
        notes
      ) VALUES (
        NEW.id,
        COALESCE(NEW.warehouse_destination, 'Default Warehouse'),
        NEW.weight_mt,
        0,
        'Available',
        'Auto-created from deal ' || NEW.deal_ref
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto inventory creation
DROP TRIGGER IF EXISTS trigger_auto_create_inventory ON public.deals;
CREATE TRIGGER trigger_auto_create_inventory
  AFTER UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_inventory();

-- =====================================================
-- VALIDATION: CUSTOMS CLEARANCE REQUIRES BILL OF ENTRY
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_customs_clearance()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status is being changed to 'Customs' or 'Stock'
  IF (NEW.status IN ('Customs', 'Stock') AND OLD.status NOT IN ('Customs', 'Stock'))
  THEN
    -- Verify Bill of Entry exists
    IF NOT public.has_bill_of_entry(NEW.id) THEN
      RAISE EXCEPTION 'Cannot proceed to % status: Bill of Entry document is required', NEW.status
        USING HINT = 'Upload a Bill of Entry document before customs clearance';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customs validation
DROP TRIGGER IF EXISTS trigger_validate_customs_clearance ON public.deals;
CREATE TRIGGER trigger_validate_customs_clearance
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_customs_clearance();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Summary of changes:
-- 1. Added logistics routing columns to deals table
-- 2. Created deal_documents table with RLS
-- 3. Added helper functions for document validation
-- 4. Created trigger for auto inventory creation (warehouse deals)
-- 5. Created trigger for customs clearance validation
