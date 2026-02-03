-- Create Market Rates Table
CREATE TABLE IF NOT EXISTS public.market_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE, -- 'LME_CU', 'LME_AL'
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL, -- Base Price (Admin Controlled)
    currency TEXT NOT NULL DEFAULT 'USD',
    unit TEXT NOT NULL DEFAULT 'MT',
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.market_rates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read market rates"
    ON public.market_rates FOR SELECT
    USING (true);

CREATE POLICY "Admins can update market rates"
    ON public.market_rates FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

CREATE POLICY "Admins can insert market rates"
    ON public.market_rates FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- Seed Data (Approx Pricing Feb 2026)
INSERT INTO public.market_rates (symbol, name, price, currency, unit)
VALUES
    ('LME_CU', 'Copper', 8450.00, 'USD', 'MT'),
    ('LME_AL', 'Aluminum', 2240.00, 'USD', 'MT'),
    ('LME_ZN', 'Zinc', 2510.00, 'USD', 'MT'),
    ('LME_NI', 'Nickel', 16200.00, 'USD', 'MT'),
    ('LME_PB', 'Lead', 2150.00, 'USD', 'MT'),
    ('LME_SN', 'Tin', 26400.00, 'USD', 'MT'),
    ('LME_SCRAP_CU', 'Copper Scrap (Berry)', 7800.00, 'USD', 'MT'),
    ('LME_SCRAP_AL', 'Aluminum Scrap (Taint)', 1600.00, 'USD', 'MT'),
    
    -- Additional Metals
    ('SCRAP_BRASS_HONEY', 'Brass Scrap (Honey)', 4800.00, 'USD', 'MT'),
    ('SCRAP_SS_304', 'SS 304 Scrap', 1350.00, 'USD', 'MT'),
    ('SCRAP_SS_316', 'SS 316 Scrap', 2100.00, 'USD', 'MT'),
    ('SCRAP_HMS_1_2', 'HMS 1&2 (80:20)', 380.00, 'USD', 'MT'),
    ('SCRAP_GUNMETAL', 'Gunmetal Scrap', 5200.00, 'USD', 'MT'),

    -- E-Waste
    ('EWASTE_PCB_HIGH', 'PCB (High Grade)', 12500.00, 'USD', 'MT'),
    ('EWASTE_PCB_MED', 'PCB (Medium Grade)', 4500.00, 'USD', 'MT'),
    ('EWASTE_RAM_GOLD', 'RAM (Gold Finger)', 28000.00, 'USD', 'MT'),
    ('EWASTE_CPU_CERAMIC', 'CPU (Ceramic)', 45000.00, 'USD', 'MT'),
    ('EWASTE_MOBILE', 'Mobile Phones (Scrap)', 18000.00, 'USD', 'MT')
ON CONFLICT (symbol) DO UPDATE 
SET price = EXCLUDED.price;
