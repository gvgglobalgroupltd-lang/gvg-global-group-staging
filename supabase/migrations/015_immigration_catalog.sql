-- Migration: Immigration Service Catalog
-- Description: Dynamic catalog for immigration services with admin pricing configuration.

-- 1. Create Catalog Table
CREATE TABLE IF NOT EXISTS immigration_service_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- e.g., 'OCI_FULL', 'US_B1_B2'
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    processing_time TEXT, -- e.g., '4-6 weeks'
    requirements JSONB DEFAULT '[]'::JSONB, -- List of required docs/steps
    icon_name TEXT, -- 'Passport', 'MapPin', etc. for frontend mapping
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE immigration_service_catalog ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Public Read Access
CREATE POLICY "Public can view active immigration services" 
ON immigration_service_catalog FOR SELECT 
USING (is_active = true);

-- Admin Write Access
-- We will rely on Server Actions using the SERVICE_ROLE key to bypass RLS for admin changes.
-- Regular users (even authenticated ones talking to the API) should only have READ access by default.
-- If we need a row-level admin check later, we should reference a 'profiles' table or auth metadata.

-- Policy: Allow authenticated users (and effectively public if we want) to view active services is already covered above.
-- We'll add a policy to allow ALL for service role (implicitly true, but explicit doesn't hurt if we use a specific user)
-- Actually, service role bypasses RLS, so we don't need a specific policy for it.
-- We will just rely on the SELECT policy for public/auth users.

CREATE POLICY "Detailed view for authenticated users"
ON immigration_service_catalog FOR SELECT
USING (true);

-- 4. Seed Data
INSERT INTO immigration_service_catalog (title, code, description, price, currency, processing_time, icon_name, requirements)
VALUES 
(
    'OCI Services (India)', 
    'OCI_FULL', 
    'Complete assistance for Renunciation of Indian Citizenship and OCI Application. Includes document verification and courier setup.', 
    250.00, 
    'USD', 
    '4-6 Weeks', 
    'Stamp', 
    '["Indian Passport", "Canadian/Foreign Passport", "Surrender Certificate", "Photo 2x2"]' 
),
(
    'Canada PR Consultation', 
    'CAN_PR', 
    'Express Entry profile creation, CRS score optimization, and PNP strategy session with licensed consultants.', 
    150.00, 
    'USD', 
    '1 Hour Session', 
    'MapPin', 
    '["Resume/CV", "IELTS Score (if avail)", "ECA Report (if avail)"]'
),
(
    'USA Visitor Visa (B1/B2)', 
    'US_VISITOR', 
    'DS-160 Form filling, appointment scheduling, and interview preparation mock session.', 
    200.00, 
    'USD', 
    '3-5 Days (Prep)', 
    'Plane', 
    '["Passport", "Digital Photo", "Travel History", "Employment Details"]'
),
(
    'Dubai 48hr Express Visa', 
    'UAE_EXPRESS', 
    'Super-fast electronic visa processing for urgent travel or layovers in UAE.', 
    120.00, 
    'USD', 
    '48 Hours', 
    'FileText', 
    '["Passport Bio Page", "Passport Photo"]'
)
ON CONFLICT (code) DO UPDATE 
SET price = EXCLUDED.price, description = EXCLUDED.description;
