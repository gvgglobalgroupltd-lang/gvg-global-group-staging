-- 010_expand_deal_schema.sql
-- Expansion of Deals table to support comprehensive trading workflow

-- 1. Update Partners Status Check to include 'Trial'
ALTER TABLE public.partners DROP CONSTRAINT IF EXISTS partners_status_check;
ALTER TABLE public.partners ADD CONSTRAINT partners_status_check 
  CHECK (status IN ('Active', 'Blacklist', 'Inactive', 'Trial'));

-- 2. Add New Columns to Deals Table

-- Basics
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS validity_date DATE;

-- Material Specs
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS isri_code TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS packing_type TEXT; -- Loose, Bundles, Pallets, etc.
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS guaranteed_recovery_rate NUMERIC(5, 2); -- Percentage
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS moisture_tolerance NUMERIC(5, 2);
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS dust_tolerance NUMERIC(5, 2);
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS quality_specs TEXT;

-- Financials
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('LC', 'TT', 'CAD', 'DP', 'PDC', 'Other'));
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS payment_terms TEXT; -- Descriptive text e.g. "20% Advance"
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS advance_percent NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS balance_percent NUMERIC(5, 2) DEFAULT 100;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS lc_number TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS lc_expiry_date DATE;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS issuing_bank TEXT;

-- Logistics
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS transshipment_allowed BOOLEAN DEFAULT false;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS free_days_detention INTEGER DEFAULT 14;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS freight_forwarder TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS shipping_line TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS pol TEXT; -- Port of Loading (can differ from Origin Country)
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS pod TEXT; -- Port of Discharge

-- Agreement Checks
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS claims_days INTEGER DEFAULT 7;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS weight_franchise NUMERIC(5, 2) DEFAULT 1.0;

-- Costing Headlines (Estimated at Deal Creation)
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_ocean_freight NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_insurance NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_customs_rate NUMERIC(10, 4);
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_bcd_percent NUMERIC(5, 2);
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_sws_percent NUMERIC(5, 2);
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS cost_finance NUMERIC(12, 2);
