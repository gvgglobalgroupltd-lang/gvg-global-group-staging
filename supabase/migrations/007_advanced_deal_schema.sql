-- Add comprehensive fields to deals table for "In-depth Flow"

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('LC', 'TT', 'CAD', 'DP', 'PDC')),
ADD COLUMN IF NOT EXISTS payment_terms_desc TEXT,
ADD COLUMN IF NOT EXISTS advance_percentage NUMERIC(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_percentage NUMERIC(5, 2) DEFAULT 100,

-- LC Specifics
ADD COLUMN IF NOT EXISTS lc_number TEXT,
ADD COLUMN IF NOT EXISTS lc_issue_date DATE,
ADD COLUMN IF NOT EXISTS lc_expiry_date DATE,
ADD COLUMN IF NOT EXISTS issuing_bank TEXT,
ADD COLUMN IF NOT EXISTS advising_bank TEXT,

-- Product Quality & Packaging
ADD COLUMN IF NOT EXISTS quality_specs JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS packaging_type TEXT CHECK (packaging_type IN ('Loose', 'Drums', 'Pallets', 'Bundles', 'Bags', 'Container')),
ADD COLUMN IF NOT EXISTS quantity_tolerance_percent NUMERIC(5, 2) DEFAULT 0,

-- Logistics Details
ADD COLUMN IF NOT EXISTS shipment_period_start DATE,
ADD COLUMN IF NOT EXISTS shipment_period_end DATE,
ADD COLUMN IF NOT EXISTS port_of_loading TEXT,
ADD COLUMN IF NOT EXISTS port_of_discharge TEXT,
ADD COLUMN IF NOT EXISTS partial_shipment_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS transshipment_allowed BOOLEAN DEFAULT false,

-- Documents
ADD COLUMN IF NOT EXISTS required_documents TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Validation constraint for percentages
ALTER TABLE public.deals 
ADD CONSTRAINT valid_payment_split CHECK (advance_percentage + balance_percentage = 100);

-- Trigger updated_at for schema changes
COMMENT ON COLUMN public.deals.quality_specs IS 'JSON field to store dynamic quality parameters like moisture, purity, etc.';
