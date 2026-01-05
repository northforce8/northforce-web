/*
  # Fix Admin RLS Policies for Dashboard Access
  
  1. Problem
    - Dashboard visar "Kunde inte ladda instrumentpanel" för admins
    - RLS policies på customers, notes, swot_analyses, change_initiatives blockerar admin-åtkomst
    - Policies kollar user_profiles istället av admin_users
    
  2. Solution
    - Uppdatera alla kritiska SELECT policies att inkludera admin_users check
    - Admins ska kunna läsa ALL data från dessa tabeller
    
  3. Affected Tables
    - customers
    - notes  
    - swot_analyses
    - change_initiatives
    - recommendations
*/

-- Fix customers SELECT policy
DROP POLICY IF EXISTS "Users can view relevant customers" ON customers;

CREATE POLICY "customers_select_policy"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all customers
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see their own customer record
    id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
    OR
    -- Partners see customers they work with
    id IN (
      SELECT DISTINCT customer_id FROM projects
      WHERE id IN (
        SELECT project_id FROM project_assignments
        WHERE partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
      )
    )
  );

-- Fix notes SELECT policy  
DROP POLICY IF EXISTS "Customers can view shared notes" ON notes;

CREATE POLICY "notes_select_policy"
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all notes
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see notes for their customer
    customer_id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
    OR
    -- Partners see notes for customers they work with
    customer_id IN (
      SELECT DISTINCT customer_id FROM projects
      WHERE id IN (
        SELECT project_id FROM project_assignments
        WHERE partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
      )
    )
  );

-- Fix swot_analyses SELECT policy
DROP POLICY IF EXISTS "Users can view relevant SWOT analyses" ON swot_analyses;

CREATE POLICY "swot_analyses_select_policy"
  ON swot_analyses
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all SWOT analyses
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see their SWOT analyses
    customer_id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Fix change_initiatives SELECT policy
DROP POLICY IF EXISTS "Users can view relevant change initiatives" ON change_initiatives;

CREATE POLICY "change_initiatives_select_policy"
  ON change_initiatives
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all change initiatives
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see their change initiatives
    customer_id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Fix recommendations - ensure there's a proper SELECT policy
DROP POLICY IF EXISTS "recommendations_select_policy" ON recommendations;

CREATE POLICY "recommendations_select_policy"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all recommendations
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see recommendations for their customer
    customer_id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Verify okr_objectives has proper admin access
-- The existing "Admins can manage all OKR objectives" with ALL should cover SELECT
-- But let's add explicit SELECT policy for clarity
DROP POLICY IF EXISTS "Customers can view their OKR objectives" ON okr_objectives;

CREATE POLICY "okr_objectives_select_policy"
  ON okr_objectives
  FOR SELECT
  TO authenticated
  USING (
    -- Admins see all OKR objectives
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
    OR
    -- Customer users see their OKR objectives
    customer_id IN (
      SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
  );