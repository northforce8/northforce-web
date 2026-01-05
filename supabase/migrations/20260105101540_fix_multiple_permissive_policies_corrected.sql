/*
  # Fix Multiple Permissive Policies - Corrected
  
  1. Changes
    - Consolidate multiple permissive policies into single restrictive policies
    - Fix methodology_templates to use correct column name (is_public)
  
  2. Security
    - Prevents policy bypass by consolidating permissive policies
    - Maintains proper access control
*/

-- methodology_templates (fixed to use is_public instead of is_published)
DROP POLICY IF EXISTS "Admins have full access to methodology_templates" ON public.methodology_templates;
DROP POLICY IF EXISTS "Everyone can view published methodology_templates" ON public.methodology_templates;
CREATE POLICY "Authenticated users can view methodology templates"
  ON public.methodology_templates
  FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'partner')
    )
  );
