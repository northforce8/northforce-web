/*
  # Fix remaining RLS policies to use admin_users
  
  ## Problem
  Projects, contracts, and invoices may have similar RLS issues
  checking user_profiles instead of admin_users
  
  ## Solution
  Update all critical table RLS policies to check admin_users
*/

-- Fix projects RLS policies
DROP POLICY IF EXISTS "Customers can view own projects" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;

CREATE POLICY "projects_select_policy"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
    OR
    -- Customer users see their projects
    customer_id IN (SELECT customer_id FROM user_profiles WHERE id = auth.uid())
    OR
    -- Partners see projects they're assigned to
    id IN (SELECT project_id FROM project_assignments WHERE partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
  );

CREATE POLICY "projects_insert_policy"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
  );

CREATE POLICY "projects_update_policy"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
  );

CREATE POLICY "projects_delete_policy"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
  );

-- Fix contracts RLS policies
DROP POLICY IF EXISTS "Users can view relevant contracts" ON contracts;

CREATE POLICY "contracts_select_policy"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
    OR
    customer_id IN (SELECT customer_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "contracts_manage_policy"
  ON contracts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
  );

-- Fix invoices RLS policies
DROP POLICY IF EXISTS "Users can view relevant invoices" ON invoices;

CREATE POLICY "invoices_select_policy"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
    OR
    customer_id IN (SELECT customer_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "invoices_manage_policy"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin')
  );
