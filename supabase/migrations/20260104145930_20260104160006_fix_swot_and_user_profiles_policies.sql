/*
  # Fix SWOT and User Profiles Policies - Corrected
  
  1. Summary
    - Fix SWOT analyses policy (had syntax error)
    - Fix user_profiles policies
  
  2. Tables Fixed
    - swot_analyses
    - user_profiles (SELECT and UPDATE)
*/

-- swot_analyses
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all SWOT analyses" ON swot_analyses;
  DROP POLICY IF EXISTS "Customers can view their SWOT analyses" ON swot_analyses;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'swot_analyses' 
    AND policyname = 'Users can view relevant SWOT analyses'
  ) THEN
    CREATE POLICY "Users can view relevant SWOT analyses"
      ON swot_analyses FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR customer_id IN (
          SELECT customer_id FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- user_profiles - Handle both SELECT and UPDATE
DO $$ 
BEGIN
  -- SELECT policies
  DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
  DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND policyname = 'Users can view relevant profiles'
  ) THEN
    CREATE POLICY "Users can view relevant profiles"
      ON user_profiles FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.id = (SELECT auth.uid())
          AND up.role = 'admin'
        )
        OR id = (SELECT auth.uid())
      );
  END IF;
  
  -- UPDATE policy (was separate before)
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND policyname = 'Users can update relevant profiles'
    AND cmd = 'UPDATE'
  ) THEN
    CREATE POLICY "Users can update relevant profiles"
      ON user_profiles FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.id = (SELECT auth.uid())
          AND up.role = 'admin'
        )
        OR id = (SELECT auth.uid())
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.id = (SELECT auth.uid())
          AND up.role = 'admin'
        )
        OR id = (SELECT auth.uid())
      );
  END IF;
END $$;
