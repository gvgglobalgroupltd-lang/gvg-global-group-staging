
-- =====================================================
-- CMS Core Architecture & Service Expansion
-- Phase 2: Core Module & RBAC
-- Phase 3: Hardware Bookings
-- =====================================================

-- =====================================================
-- 1. SERVICE CATALOG
-- =====================================================

CREATE TABLE IF NOT EXISTS public.service_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Software', 'Hardware', 'Consulting')),
    is_remote BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    price_range TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access to active services"
    ON public.service_catalog FOR SELECT
    USING (active = true);

CREATE POLICY "Admins can manage services"
    ON public.service_catalog FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- Seed Data
INSERT INTO public.service_catalog (name, category, is_remote, description, price_range)
VALUES 
    ('Web/Mobile Dev', 'Software', true, 'Full-stack development for web and mobile applications.', 'Project-based'),
    ('Testing Automation', 'Software', true, 'End-to-end automated testing frameworks (Playwright/Selenium).', 'Hourly / Fixed'),
    ('Agentic AI Consulting', 'Consulting', true, 'Implementation of autonomous AI agents and workflows.', 'Premium'),
    ('Hardware Repair', 'Hardware', false, 'Laptop/Desktop repair, component replacement. Halifax On-site only.', 'Starts at $80'),
    ('OS Optimization', 'Hardware', false, 'Debloating Windows/Linux, performance tuning. Halifax On-site only.', '$100 flat fee');


-- =====================================================
-- 2. BOOKINGS (Hardware & On-site)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.service_catalog(id),
    user_id UUID REFERENCES auth.users(id), -- Optional, can be guest booking
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    
    -- Schedule
    booking_date DATE NOT NULL,
    slot TEXT NOT NULL CHECK (slot IN ('Morning', 'Afternoon')),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    
    -- Tech Fields
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can create bookings (Public/Anon allowed for now, or auth users)
CREATE POLICY "Anyone can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

-- Admins and Hardware Leads can view bookings
CREATE POLICY "Staff can view bookings"
    ON public.bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role IN ('Admin', 'Hardware_Lead')
        )
    );

-- Staff can update bookings
CREATE POLICY "Staff can update bookings"
    ON public.bookings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role IN ('Admin', 'Hardware_Lead')
        )
    );

-- =====================================================
-- 3. RBAC UPDATES (Optional - verifying roles exist)
-- =====================================================
-- Note: 'role' column already exists in profiles.
-- We implicitly rely on string checks: 'Admin', 'Tech', 'Hardware_Lead'

-- =====================================================
-- CONFIRMATION
-- =====================================================
-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
