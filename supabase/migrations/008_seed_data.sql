-- 008_seed_data.sql
-- Insert sample data for testing

-- 1. Commodities
INSERT INTO public.commodities (name, hscode, description, is_precious) 
VALUES 
    ('Copper Millberry', '74040012', 'Copper Wire Scrap 99.9%', false),
    ('Aluminum 6063', '76020010', 'Aluminum Extrusion Scrap', false),
    ('Brass Honey', '74040022', 'Yellow Brass Scrap', false),
    ('HMS 1&2', '72044900', 'Heavy Melting Steel Scrap', false),
    ('Gold Bars', '71081200', 'Gold Bullion 99.99%', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Partners (Suppliers)
INSERT INTO public.partners (company_name, type, country, status, contact_person, email, phone)
VALUES 
    ('Global Metals Inc', 'Supplier', 'USA', 'Active', 'John Smith', 'john@globalmetals.com', '+1 555-0123'),
    ('Euro Scrap GmbH', 'Supplier', 'Germany', 'Active', 'Hans Mueller', 'hans@euroscrap.de', '+49 123 45678'),
    ('Dubai Recyclers LLC', 'Supplier', 'Dubai', 'Active', 'Ahmed Al-Sayed', 'ahmed@dubairecyclers.ae', '+971 50 1234567')
ON CONFLICT DO NOTHING;

-- 3. Partners (Customers)
INSERT INTO public.partners (company_name, type, country, status, contact_person, email, phone)
VALUES 
    ('Mumbai Manufacturing Ltd', 'Customer', 'India', 'Active', 'Rajesh Kumar', 'rajesh@mumbaimanufacturing.in', '+91 98765 43210'),
    ('Vietnam Steel Corp', 'Customer', 'Vietnam', 'Active', 'Nguyen Van A', 'nguyen@vietnamsteel.vn', '+84 90 123 4567')
ON CONFLICT DO NOTHING;

-- 4. Fix Cost Heads Constraint & Insert
-- Add 'Insurance' to the allowed categories if not present
DO $$
BEGIN
    ALTER TABLE public.cost_heads
    DROP CONSTRAINT IF EXISTS cost_heads_category_check;

    ALTER TABLE public.cost_heads
    ADD CONSTRAINT cost_heads_category_check 
    CHECK (category IN ('Freight', 'Duty', 'Bank', 'Handling', 'Insurance', 'Other'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

INSERT INTO public.cost_heads (name, category, default_value, is_fixed)
VALUES 
    ('Ocean Freight', 'Freight', 1200.00, false),
    ('Terminal Handling Charges', 'Handling', 300.00, true),
    ('Insurance Premium', 'Insurance', 150.00, false),
    ('Customs Clearance', 'Duty', 500.00, true),
    ('Trucking', 'Freight', 400.00, false)
ON CONFLICT (name) DO NOTHING;
