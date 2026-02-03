-- =====================================================
-- GVG Global Group - Sample Data Seed
-- =====================================================

-- Insert sample commodities
INSERT INTO public.commodities (name, hscode, default_customs_duty, is_precious, description) VALUES
  ('Copper Millberry', '740311', 5.00, false, 'High-grade copper wire scrap'),
  ('Aluminum Ingots', '760110', 3.50, false, 'Pure aluminum ingots 99.7%'),
  ('Steel HMS 1&2', '720410', 7.50, false, 'Heavy melting steel scrap'),
  ('Gold Bars', '710812', 10.00, true, '24K gold bars, 999.9 purity'),
  ('Silver Bars', '710611', 8.00, true, 'Silver bars, 999 purity'),
  ('Zinc Ingots', '790111', 4.00, false, 'Zinc ingots 99.5% purity')
ON CONFLICT (name) DO NOTHING;

-- Insert sample cost heads
INSERT INTO public.cost_heads (name, default_value, is_fixed, category, description) VALUES
  ('Ocean Freight', 2500.00, false, 'Freight', 'Container shipping cost'),
  ('CHA Charges', 500.00, true, 'Handling', 'Customs clearing agent fees'),
  ('SWS Fee', 150.00, true, 'Other', 'Single window system processing'),
  ('Port Handling', 300.00, false, 'Handling', 'Port terminal handling charges'),
  ('Inland Transport', 800.00, false, 'Freight', 'Truck/rail transport to warehouse'),
  ('Bank Charges', 100.00, true, 'Bank', 'LC, SWIFT, transfer fees'),
  ('Insurance', 0.50, false, 'Other', 'Marine insurance (% of cargo value)'),
  ('Customs Duty', 0.00, false, 'Duty', 'Import duty (calculated per commodity)')
ON CONFLICT (name) DO NOTHING;

-- Insert sample partners
INSERT INTO public.partners (company_name, type, country, tax_id, status, contact_person, email, phone) VALUES
  ('Global Metals Inc', 'Supplier', 'USA', 'US-12345678', 'Active', 'John Smith', 'john@globalmetals.com', '+1-555-0101'),
  ('Asian Steel Trading', 'Supplier', 'China', 'CN-9876543', 'Active', 'Li Wei', 'li.wei@asiansteel.cn', '+86-21-5555-0102'),
  ('European Copper Co', 'Both', 'Germany', 'DE-456789', 'Active', 'Hans Mueller', 'hans@eurocopper.de', '+49-30-5555-0103'),
  ('Middle East Alloys', 'Customer', 'UAE', 'AE-789012', 'Active', 'Ahmed Al-Rashid', 'ahmed@mealloys.ae', '+971-4-555-0104'),
  ('Indian Manufacturing Ltd', 'Customer', 'India', 'IN-345678', 'Active', 'Rajesh Kumar', 'rajesh@indmfg.in', '+91-22-5555-0105'),
  ('Canadian Resources', 'Supplier', 'Canada', 'CA-567890', 'Active', 'Sarah Johnson', 'sarah@canresources.ca', '+1-416-555-0106')
ON CONFLICT DO NOTHING;

-- Note: Actual deals, leads, and projects will be created through the UI
-- This seed provides the master data needed to get started

-- =====================================================
-- SEED COMPLETE
-- =====================================================
