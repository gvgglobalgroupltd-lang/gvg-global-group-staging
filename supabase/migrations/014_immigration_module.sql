-- Migration: Immigration Module
-- Description: Sets up tables for visa applications, RLS policies, and secure storage.

-- 1. Create Enum for Visa Types
CREATE TYPE visa_type_enum AS ENUM (
    'OCI',
    'Canada_PR',
    'US_Tourist',
    'Schengen',
    'Dubai_Express',
    'Other'
);

-- 2. Create Visa Applications Table
CREATE TABLE IF NOT EXISTS visa_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    visa_type visa_type_enum NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending_Review', 'Action_Required', 'Payment_Pending', 'Submitted', 'Approved', 'Rejected')),
    application_data JSONB DEFAULT '{}'::JSONB, -- Stores dynamic form fields
    documents JSONB DEFAULT '[]'::JSONB,      -- Stores file paths and metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Users can view their own applications
CREATE POLICY "Users can view their own visa applications" 
ON visa_applications FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can create visa applications" 
ON visa_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own applications (only if not in final statuses, theoretically, but keeping flexible for MVP)
CREATE POLICY "Users can update their own visa applications" 
ON visa_applications FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Admins can view all (assuming admin role or specific email check, implementing generic for now, refine later based on existing admin logic)
-- Note: existing admin logic usually relies on app-level checks or a specific admin table/role. 
-- For now, we will add a policy for service_role/admin if applicable, or rely on dashboard using service key or admin user logic.
-- Adding a placeholder policy for potential admin users (if you have an admins table or claim). 
-- Based on previous context, we might rely on specific user IDs or just service role for admin dashboard. 
-- Let's stick to user RLS for now.

-- 5. Storage Bucket for Documents (Private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('immigration_docs', 'immigration_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Users can upload to their own folder (user_id/...)
CREATE POLICY "Users can upload immigration docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'immigration_docs' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policy: Users can view their own docs
CREATE POLICY "Users can view their own immigration docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'immigration_docs' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Indexes for performance
CREATE INDEX idx_visa_applications_user_id ON visa_applications(user_id);
CREATE INDEX idx_visa_applications_status ON visa_applications(status);
