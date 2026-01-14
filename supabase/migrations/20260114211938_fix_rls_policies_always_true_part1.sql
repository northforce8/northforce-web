/*
  # Fix RLS Policies Always True - Part 1
  
  1. Purpose
    - Replace overly permissive RLS policies that always evaluate to true
    - Implement proper security by restricting access to authenticated admins
  
  2. Changes
    - Fix activity_log, agile framework tables, and booking/contact submissions
    - Replace unrestricted policies with admin-only or proper role-based access
  
  3. Security Impact
    - Critical security fix - prevents unauthorized data access
    - Ensures only admins can manage system data
    - Public forms (contact/booking) remain accessible to anon users
*/

-- Activity Log: restrict to admins only
DROP POLICY IF EXISTS "activity_log_insert_policy" ON public.activity_log;

CREATE POLICY "activity_log_insert_policy" ON public.activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Agile Ceremonies
DROP POLICY IF EXISTS "auth_delete_ceremonies" ON public.agile_ceremonies;
DROP POLICY IF EXISTS "auth_insert_ceremonies" ON public.agile_ceremonies;
DROP POLICY IF EXISTS "auth_update_ceremonies" ON public.agile_ceremonies;

CREATE POLICY "agile_ceremonies_select_policy" ON public.agile_ceremonies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_ceremonies_insert_policy" ON public.agile_ceremonies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_ceremonies_update_policy" ON public.agile_ceremonies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_ceremonies_delete_policy" ON public.agile_ceremonies
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Agile Maturity Assessments
DROP POLICY IF EXISTS "auth_delete_assessments" ON public.agile_maturity_assessments;
DROP POLICY IF EXISTS "auth_insert_assessments" ON public.agile_maturity_assessments;
DROP POLICY IF EXISTS "auth_update_assessments" ON public.agile_maturity_assessments;

CREATE POLICY "agile_maturity_assessments_select_policy" ON public.agile_maturity_assessments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_maturity_assessments_insert_policy" ON public.agile_maturity_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_maturity_assessments_update_policy" ON public.agile_maturity_assessments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_maturity_assessments_delete_policy" ON public.agile_maturity_assessments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Agile Metrics
DROP POLICY IF EXISTS "auth_delete_metrics" ON public.agile_metrics;
DROP POLICY IF EXISTS "auth_insert_metrics" ON public.agile_metrics;
DROP POLICY IF EXISTS "auth_update_metrics" ON public.agile_metrics;

CREATE POLICY "agile_metrics_select_policy" ON public.agile_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_metrics_insert_policy" ON public.agile_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_metrics_update_policy" ON public.agile_metrics
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_metrics_delete_policy" ON public.agile_metrics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Agile Transformation Stages
DROP POLICY IF EXISTS "auth_delete_stages" ON public.agile_transformation_stages;
DROP POLICY IF EXISTS "auth_insert_stages" ON public.agile_transformation_stages;
DROP POLICY IF EXISTS "auth_update_stages" ON public.agile_transformation_stages;

CREATE POLICY "agile_transformation_stages_select_policy" ON public.agile_transformation_stages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformation_stages_insert_policy" ON public.agile_transformation_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformation_stages_update_policy" ON public.agile_transformation_stages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformation_stages_delete_policy" ON public.agile_transformation_stages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Agile Transformations
DROP POLICY IF EXISTS "auth_delete_transformations" ON public.agile_transformations;
DROP POLICY IF EXISTS "auth_insert_transformations" ON public.agile_transformations;
DROP POLICY IF EXISTS "auth_update_transformations" ON public.agile_transformations;

CREATE POLICY "agile_transformations_select_policy" ON public.agile_transformations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformations_insert_policy" ON public.agile_transformations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformations_update_policy" ON public.agile_transformations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "agile_transformations_delete_policy" ON public.agile_transformations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Booking submissions: restrict update to admins only (keep insert open for public)
DROP POLICY IF EXISTS "Admins can update booking submissions" ON public.booking_submissions;

CREATE POLICY "booking_submissions_update_policy" ON public.booking_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Contact submissions: restrict update to admins only (keep insert open for public)
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

CREATE POLICY "contact_submissions_update_policy" ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );
