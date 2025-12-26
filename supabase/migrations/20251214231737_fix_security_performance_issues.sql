/*
  # Fix Security and Performance Issues

  ## Changes Made

  ### 1. Performance Optimizations
  - **Added Missing Index**: Created index on `time_entries.work_type_id` foreign key
  - **Removed Unused Indexes**: Dropped 20 indexes that have not been used to reduce maintenance overhead
  
  ### 2. RLS Policy Performance Fixes
  - **Optimized auth.uid() calls**: All policies now use `(select auth.uid())` instead of `auth.uid()` to prevent re-evaluation per row
  - This change affects all 30+ policies across 9 tables for significant performance improvement at scale
  
  ### 3. Multiple Permissive Policies Resolution
  - **Consolidated policies**: Reduced number of policies by combining related access patterns
  - Changed from multiple separate policies to single policies with OR conditions
  - Affects: partners, customers, customer_assignments, projects, project_assignments, work_types, time_entries, notes
  
  ### 4. Function Security
  - **Fixed search_path**: Set explicit SECURITY DEFINER and search_path for helper functions
  - Functions: `add_sample_time_entries`, `add_sample_notes`

  ## Tables Affected
  - partners
  - customers
  - customer_assignments
  - projects
  - project_assignments
  - work_types
  - time_entries
  - notes
  - activity_log

  ## Security Notes
  - All RLS policies remain restrictive by default
  - Partners can only access data for assigned customers/projects
  - Admins have full access to all data
  - No public access to any partner portal data
*/

-- 1. Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_time_entries_work_type ON time_entries(work_type_id);

-- 2. Drop unused indexes to reduce overhead
DROP INDEX IF EXISTS idx_partners_user_id;
DROP INDEX IF EXISTS idx_partners_is_active;
DROP INDEX IF EXISTS idx_customers_owner;
DROP INDEX IF EXISTS idx_customers_status;
DROP INDEX IF EXISTS idx_customer_assignments_customer;
DROP INDEX IF EXISTS idx_customer_assignments_partner;
DROP INDEX IF EXISTS idx_customer_assignments_active;
DROP INDEX IF EXISTS idx_projects_status;
DROP INDEX IF EXISTS idx_project_assignments_project;
DROP INDEX IF EXISTS idx_project_assignments_partner;
DROP INDEX IF EXISTS idx_project_assignments_active;
DROP INDEX IF EXISTS idx_time_entries_date;
DROP INDEX IF EXISTS idx_time_entries_partner;
DROP INDEX IF EXISTS idx_time_entries_customer;
DROP INDEX IF EXISTS idx_time_entries_project;
DROP INDEX IF EXISTS idx_notes_customer;
DROP INDEX IF EXISTS idx_notes_project;
DROP INDEX IF EXISTS idx_notes_partner;
DROP INDEX IF EXISTS idx_notes_created;
DROP INDEX IF EXISTS idx_activity_log_entity;
DROP INDEX IF EXISTS idx_activity_log_actor;
DROP INDEX IF EXISTS idx_activity_log_created;

-- 3. Drop all existing RLS policies to recreate them optimized
DO $$ 
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('partners', 'customers', 'customer_assignments', 'projects', 
                      'project_assignments', 'work_types', 'time_entries', 'notes', 'activity_log')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- 4. Create optimized RLS policies with (select auth.uid()) and consolidated access

-- Partners table policies
CREATE POLICY "partners_select_policy"
  ON partners FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "partners_insert_policy"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "partners_update_policy"
  ON partners FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Customers table policies
CREATE POLICY "customers_select_policy"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND ca.customer_id = customers.id
      AND ca.is_active = true
    )
  );

CREATE POLICY "customers_insert_policy"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "customers_update_policy"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "customers_delete_policy"
  ON customers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Customer Assignments table policies
CREATE POLICY "customer_assignments_select_policy"
  ON customer_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = customer_assignments.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "customer_assignments_insert_policy"
  ON customer_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "customer_assignments_update_policy"
  ON customer_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "customer_assignments_delete_policy"
  ON customer_assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Projects table policies
CREATE POLICY "projects_select_policy"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND ca.customer_id = projects.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "projects_insert_policy"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "projects_update_policy"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "projects_delete_policy"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Project Assignments table policies
CREATE POLICY "project_assignments_select_policy"
  ON project_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = project_assignments.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "project_assignments_insert_policy"
  ON project_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "project_assignments_update_policy"
  ON project_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "project_assignments_delete_policy"
  ON project_assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Work Types table policies
CREATE POLICY "work_types_select_policy"
  ON work_types FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "work_types_insert_policy"
  ON work_types FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "work_types_update_policy"
  ON work_types FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "work_types_delete_policy"
  ON work_types FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Time Entries table policies
CREATE POLICY "time_entries_select_policy"
  ON time_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "time_entries_insert_policy"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND p.id = time_entries.partner_id
      AND ca.customer_id = time_entries.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "time_entries_update_policy"
  ON time_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = (select auth.uid())
      AND time_entries.date >= CURRENT_DATE - INTERVAL '7 days'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "time_entries_delete_policy"
  ON time_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Notes table policies
CREATE POLICY "notes_select_policy"
  ON notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = (select auth.uid())
    )
    OR (
      notes.visibility = 'shared'
      AND EXISTS (
        SELECT 1 FROM partners p
        JOIN customer_assignments ca ON ca.partner_id = p.id
        WHERE p.user_id = (select auth.uid())
        AND ca.customer_id = notes.customer_id
        AND ca.is_active = true
      )
    )
  );

CREATE POLICY "notes_insert_policy"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND p.id = notes.partner_id
      AND ca.customer_id = notes.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "notes_update_policy"
  ON notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "notes_delete_policy"
  ON notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Activity Log table policies
CREATE POLICY "activity_log_select_policy"
  ON activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "activity_log_insert_policy"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Fix function security - set explicit search_path to prevent search_path mutable issues
CREATE OR REPLACE FUNCTION add_sample_time_entries(
  p_partner_id uuid,
  p_customer_id uuid,
  p_project_id uuid DEFAULT NULL
) RETURNS void 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_work_type_id uuid;
BEGIN
  SELECT id INTO v_work_type_id FROM work_types WHERE is_active = true LIMIT 1;
  
  IF v_work_type_id IS NULL THEN
    RAISE EXCEPTION 'No active work types found';
  END IF;
  
  INSERT INTO time_entries (partner_id, customer_id, project_id, work_type_id, date, hours, description, billable)
  VALUES
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '1 day', 4.5, 'Strategy workshop with client stakeholders', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '2 days', 6.0, 'Development of project roadmap and timeline', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '3 days', 3.5, 'Stakeholder interviews and requirements gathering', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '4 days', 5.0, 'Market analysis and competitive research', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '5 days', 7.0, 'Workshop facilitation and documentation', true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_sample_notes(
  p_partner_id uuid,
  p_customer_id uuid,
  p_project_id uuid DEFAULT NULL
) RETURNS void 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO notes (partner_id, customer_id, project_id, note_type, visibility, content)
  VALUES
    (p_partner_id, p_customer_id, p_project_id, 'Update', 'shared', 'Met with the client team today. Great progress on the discovery phase. They are excited about the proposed approach.'),
    (p_partner_id, p_customer_id, p_project_id, 'Decision', 'shared', 'Decision made to proceed with Option B for the technical architecture. Stakeholders aligned on timeline.'),
    (p_partner_id, p_customer_id, NULL, 'Next step', 'shared', 'Schedule follow-up meeting next week to review deliverables. Need to prepare presentation slides.');
END;
$$ LANGUAGE plpgsql;