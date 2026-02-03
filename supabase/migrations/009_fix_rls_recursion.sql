-- 009_fix_rls_recursion.sql
-- Fix infinite recursion in profiles RLS policy

-- 1. Drop the problematic policy (which uses FOR ALL and causes recursion on SELECT)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 2. Recreate it for INSERT, UPDATE, DELETE only (excluding SELECT)
-- We don't need it for SELECT because "Users can view all profiles" already allows SELECT for everyone.
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );
