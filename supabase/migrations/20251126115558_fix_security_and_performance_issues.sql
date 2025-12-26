/*
  # Fix Security and Performance Issues

  ## Overview
  This migration addresses multiple security and performance issues identified in the database audit:
  
  ## Changes Made

  ### 1. RLS Policy Performance Optimization
  **Problem**: Policies using `auth.uid()` re-evaluate for each row, causing poor performance at scale
  **Solution**: Replace with `(select auth.uid())` to evaluate once per query
  - Fixed `admin_users` table policies
  
  ### 2. Duplicate Permissive Policies
  **Problem**: Multiple permissive policies for the same role/action create unnecessary overhead
  **Solution**: Drop duplicate policies, keeping only one per role/action combination
  - Removed duplicates from `contact_submissions` table
  - Removed duplicates from `booking_submissions` table
  
  ### 3. Unused Indexes
  **Problem**: Indexes that are never used waste storage and slow down write operations
  **Solution**: Drop unused indexes on `created_at` and `email` columns
  - These indexes were created but never utilized by queries
  
  ### 4. Function Search Path Security
  **Problem**: Function has role-mutable search_path, potential security risk
  **Solution**: Set explicit search_path for the function
  
  ## Security Impact
  All changes maintain or improve security while significantly enhancing performance.
  No data access patterns are changed, only optimized.
*/

-- ============================================================================
-- 1. FIX RLS POLICY PERFORMANCE ON admin_users TABLE
-- ============================================================================

-- Drop existing policies with suboptimal performance
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;

-- Recreate with optimized auth function calls
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- 2. REMOVE DUPLICATE PERMISSIVE POLICIES
-- ============================================================================

-- contact_submissions: Remove duplicate INSERT policy for anon
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
-- Keep: "Anyone can submit contact forms"

-- contact_submissions: Remove duplicate SELECT policy for authenticated
DROP POLICY IF EXISTS "Admin can read contact submissions" ON contact_submissions;
-- Keep: "Admins can view contact submissions"

-- booking_submissions: Remove duplicate INSERT policy for anon
DROP POLICY IF EXISTS "Anyone can insert booking submissions" ON booking_submissions;
-- Keep: "Anyone can submit booking forms"

-- booking_submissions: Remove duplicate SELECT policy for authenticated
DROP POLICY IF EXISTS "Admin can read booking submissions" ON booking_submissions;
-- Keep: "Admins can view booking submissions"

-- ============================================================================
-- 3. DROP UNUSED INDEXES
-- ============================================================================

-- These indexes have not been used and are not needed for current query patterns
DROP INDEX IF EXISTS idx_contact_submissions_created_at;
DROP INDEX IF EXISTS idx_booking_submissions_created_at;
DROP INDEX IF EXISTS idx_newsletter_submissions_created_at;
DROP INDEX IF EXISTS idx_contact_submissions_email;
DROP INDEX IF EXISTS idx_booking_submissions_email;
DROP INDEX IF EXISTS idx_newsletter_submissions_email;

-- ============================================================================
-- 4. FIX FUNCTION SEARCH PATH SECURITY
-- ============================================================================

-- Recreate function with explicit search_path to prevent security issues
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- VERIFICATION NOTES
-- ============================================================================
-- After applying this migration:
-- 1. RLS policies will execute more efficiently with subquery pattern
-- 2. No duplicate policies exist, reducing policy evaluation overhead
-- 3. Unused indexes removed, improving write performance
-- 4. Function has secure, explicit search_path
-- 5. All existing functionality remains intact
