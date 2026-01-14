/*
  # Fix Auth RLS Initialization Performance - Corrected
  
  1. Purpose
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale
  
  2. Changes
    - Drop and recreate policies with optimized auth function calls
    - Affects: projects, time_entries, customers, notes, contracts, invoices, 
      partner_capacity_periods, recommendations, methodology_templates, 
      okr_objectives, swot_analyses, change_initiatives
  
  3. Performance Impact
    - Major performance improvement for queries with RLS enabled
    - Auth functions are evaluated once per query instead of per row
*/

-- Projects policies
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;

CREATE POLICY "projects_select_policy" ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "projects_insert_policy" ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "projects_update_policy" ON public.projects
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

CREATE POLICY "projects_delete_policy" ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Time entries admin select policy
DROP POLICY IF EXISTS "time_entries_admin_select_policy" ON public.time_entries;

CREATE POLICY "time_entries_admin_select_policy" ON public.time_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Customers select policy
DROP POLICY IF EXISTS "customers_select_policy" ON public.customers;

CREATE POLICY "customers_select_policy" ON public.customers
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all customers
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.role = 'admin'
    )
    OR
    -- Partners see assigned customers
    EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.user_id = (SELECT auth.uid())
      AND (
        p.id = customers.primary_partner_id
        OR EXISTS (
          SELECT 1 FROM public.customer_assignments ca
          WHERE ca.customer_id = customers.id
          AND ca.partner_id = p.id
        )
      )
    )
    OR
    -- Customers see themselves via user_profiles
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = customers.id
    )
  );

-- Notes select policy
DROP POLICY IF EXISTS "notes_select_policy" ON public.notes;

CREATE POLICY "notes_select_policy" ON public.notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Contracts policies
DROP POLICY IF EXISTS "contracts_select_policy" ON public.contracts;
DROP POLICY IF EXISTS "contracts_manage_policy" ON public.contracts;

CREATE POLICY "contracts_select_policy" ON public.contracts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = contracts.customer_id
    )
  );

CREATE POLICY "contracts_manage_policy" ON public.contracts
  FOR ALL
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

-- Invoices policies
DROP POLICY IF EXISTS "invoices_select_policy" ON public.invoices;
DROP POLICY IF EXISTS "invoices_manage_policy" ON public.invoices;

CREATE POLICY "invoices_select_policy" ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = invoices.customer_id
    )
  );

CREATE POLICY "invoices_manage_policy" ON public.invoices
  FOR ALL
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

-- Partner capacity periods policies
DROP POLICY IF EXISTS "partner_capacity_periods_select_policy" ON public.partner_capacity_periods;
DROP POLICY IF EXISTS "partner_capacity_periods_manage_policy" ON public.partner_capacity_periods;

CREATE POLICY "partner_capacity_periods_select_policy" ON public.partner_capacity_periods
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "partner_capacity_periods_manage_policy" ON public.partner_capacity_periods
  FOR ALL
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

-- Recommendations policies
DROP POLICY IF EXISTS "recommendations_select_policy" ON public.recommendations;
DROP POLICY IF EXISTS "recommendations_manage_policy" ON public.recommendations;

CREATE POLICY "recommendations_select_policy" ON public.recommendations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "recommendations_manage_policy" ON public.recommendations
  FOR ALL
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

-- Methodology templates policy
DROP POLICY IF EXISTS "Authenticated users can view methodology templates" ON public.methodology_templates;

CREATE POLICY "Authenticated users can view methodology templates" ON public.methodology_templates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- OKR objectives select policy
DROP POLICY IF EXISTS "okr_objectives_select_policy" ON public.okr_objectives;

CREATE POLICY "okr_objectives_select_policy" ON public.okr_objectives
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = okr_objectives.customer_id
    )
  );

-- SWOT analyses select policy
DROP POLICY IF EXISTS "swot_analyses_select_policy" ON public.swot_analyses;

CREATE POLICY "swot_analyses_select_policy" ON public.swot_analyses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = swot_analyses.customer_id
    )
  );

-- Change initiatives select policy
DROP POLICY IF EXISTS "change_initiatives_select_policy" ON public.change_initiatives;

CREATE POLICY "change_initiatives_select_policy" ON public.change_initiatives
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = change_initiatives.customer_id
    )
  );
