/*
  # HOTFIX: Fix RLS policies to check admin_users instead of user_profiles
  
  ## Problem
  RLS policies for customers and recommendations check user_profiles.role='admin'
  but user_profiles table is empty, causing all queries to fail with "Failed to load"
  
  ## Solution
  Update RLS policies to check admin_users table which is actually populated
  
  ## Changes
  - Drop and recreate customers SELECT policy to check admin_users
  - Keep partner/project access paths intact
  - Ensures admins can always access customer data
*/

-- Fix customers table RLS policy
DROP POLICY IF EXISTS "Users can view relevant customers" ON customers;

CREATE POLICY "Users can view relevant customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    -- Admin users can see all customers
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users can see their own customer record
    id IN (
      SELECT customer_id FROM user_profiles
      WHERE id = auth.uid()
    )
    OR
    -- Partners can see customers they work with via projects
    id IN (
      SELECT customer_id FROM projects
      WHERE id IN (
        SELECT project_id FROM project_assignments
        WHERE partner_id IN (
          SELECT id FROM partners WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Fix recommendations table RLS policy
DROP POLICY IF EXISTS "recommendations_manage_policy" ON recommendations;

CREATE POLICY "recommendations_manage_policy"
  ON recommendations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
