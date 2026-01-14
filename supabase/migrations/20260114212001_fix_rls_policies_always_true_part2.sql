/*
  # Fix RLS Policies Always True - Part 2
  
  1. Purpose
    - Replace remaining overly permissive RLS policies
    - Implement proper security for system and framework tables
  
  2. Changes
    - Fix email_delivery_log, framework_links, invoice_audit_log
    - Fix partner roles, performance metrics, and recommendations
    - Fix strategic initiatives
  
  3. Security Impact
    - Critical security fix - prevents unauthorized data access
    - Ensures proper role-based access control
*/

-- Email Delivery Log: restrict to admins
DROP POLICY IF EXISTS "System can insert email delivery log" ON public.email_delivery_log;

CREATE POLICY "email_delivery_log_insert_policy" ON public.email_delivery_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Framework Links: restrict to admins
DROP POLICY IF EXISTS "Authenticated users can manage framework links" ON public.framework_links;

CREATE POLICY "framework_links_select_policy" ON public.framework_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "framework_links_insert_policy" ON public.framework_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "framework_links_update_policy" ON public.framework_links
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

CREATE POLICY "framework_links_delete_policy" ON public.framework_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Invoice Audit Log: restrict to admins
DROP POLICY IF EXISTS "System creates audit" ON public.invoice_audit_log;

CREATE POLICY "invoice_audit_log_insert_policy" ON public.invoice_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Partner Performance Metrics: restrict to admins
DROP POLICY IF EXISTS "System can insert performance metrics" ON public.partner_performance_metrics;

CREATE POLICY "partner_performance_metrics_insert_policy" ON public.partner_performance_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Partner Roles: restrict to admins
DROP POLICY IF EXISTS "Manage partner roles" ON public.partner_roles;

CREATE POLICY "partner_roles_select_policy" ON public.partner_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "partner_roles_insert_policy" ON public.partner_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "partner_roles_update_policy" ON public.partner_roles
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

CREATE POLICY "partner_roles_delete_policy" ON public.partner_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Partner Workload Recommendations: restrict to admins
DROP POLICY IF EXISTS "System can create recommendations" ON public.partner_workload_recommendations;

CREATE POLICY "partner_workload_recommendations_insert_policy" ON public.partner_workload_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Strategic Initiatives: restrict to admins
DROP POLICY IF EXISTS "Authenticated users can manage strategic initiatives" ON public.strategic_initiatives;

CREATE POLICY "strategic_initiatives_select_policy" ON public.strategic_initiatives
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "strategic_initiatives_insert_policy" ON public.strategic_initiatives
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "strategic_initiatives_update_policy" ON public.strategic_initiatives
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

CREATE POLICY "strategic_initiatives_delete_policy" ON public.strategic_initiatives
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );
