/*
  # Fix time_entries SELECT policy for admin access
  
  ## Problem
  time_entries table only has SELECT policy checking user_profiles.customer_id
  Admins cannot query time_entries, causing Credits Dashboard to fail
  
  ## Solution
  Add admin SELECT policy that allows admins to see all time entries
*/

-- Add admin select policy for time_entries
CREATE POLICY "time_entries_admin_select_policy"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Fix partner_capacity_periods policy (was checking wrong condition)
DROP POLICY IF EXISTS "Manage capacity periods" ON partner_capacity_periods;

CREATE POLICY "partner_capacity_periods_select_policy"
  ON partner_capacity_periods
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
    OR
    -- Partners see their own
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "partner_capacity_periods_manage_policy"
  ON partner_capacity_periods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
