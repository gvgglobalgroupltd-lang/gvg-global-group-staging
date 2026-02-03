-- Create commodities table
CREATE TABLE IF NOT EXISTS public.commodities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    hscode TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users"
    ON public.commodities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON public.commodities FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
    ON public.commodities FOR UPDATE
    TO authenticated
    USING (true);

-- Insert initial seed data
INSERT INTO public.commodities (name, hscode, description) VALUES
    ('Copper Millberry', '7404.00', 'Copper Wire Scrap'),
    ('Aluminum Ingots', '7601.10', 'Unwrought Aluminum'),
    ('Lithium Carbonate', '2836.91', 'Battery Grade'),
    ('Brass Honey', '7404.00', 'Yellow Brass Scrap'),
    ('Zinc Dross', '7902.00', 'Zinc Waste and Scrap')
ON CONFLICT DO NOTHING;
