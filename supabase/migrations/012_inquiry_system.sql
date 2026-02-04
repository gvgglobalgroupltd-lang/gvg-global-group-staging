-- Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    inquiry_type TEXT NOT NULL DEFAULT 'General', -- 'Quote', 'General', 'Partnership'
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'In Progress', 'Resolved', 'Archived'
    metadata JSONB DEFAULT '{}'::jsonb, -- Store extra fields like commodity_interest
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Anyone (Anon) can INSERT (Submit Inquiry)
CREATE POLICY "Anyone can submit inquiry"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

-- 2. Only Admins can VIEW inquiries
CREATE POLICY "Admins can view inquiries"
    ON public.inquiries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- 3. Only Admins can UPDATE inquiries (Change status)
CREATE POLICY "Admins can update inquiries"
    ON public.inquiries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );
