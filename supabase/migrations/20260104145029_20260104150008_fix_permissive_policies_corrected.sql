/*
  # Fix Remaining Multiple Permissive Policies - Corrected
  
  1. Summary
    - Fix tables that still have multiple permissive SELECT policies
    - Consolidate into single policies with OR conditions
    - Corrected syntax for policy creation
  
  2. Security Impact
    - Clearer access control logic
    - Eliminates policy confusion
*/

-- agile_teams
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agile_teams' 
    AND policyname = 'Admins can manage all Agile teams'
  ) THEN
    DROP POLICY "Admins can manage all Agile teams" ON agile_teams;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agile_teams' 
    AND policyname = 'Customers can view their Agile teams'
  ) THEN
    DROP POLICY "Customers can view their Agile teams" ON agile_teams;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agile_teams' 
    AND policyname = 'Users can view relevant Agile teams'
  ) THEN
    CREATE POLICY "Users can view relevant Agile teams"
      ON agile_teams FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR
        customer_id IN (
          SELECT customer_id FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- balanced_scorecards
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'balanced_scorecards' 
    AND policyname = 'Admins can manage all Balanced Scorecards'
  ) THEN
    DROP POLICY "Admins can manage all Balanced Scorecards" ON balanced_scorecards;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'balanced_scorecards' 
    AND policyname = 'Customers can view their Balanced Scorecards'
  ) THEN
    DROP POLICY "Customers can view their Balanced Scorecards" ON balanced_scorecards;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'balanced_scorecards' 
    AND policyname = 'Users can view relevant Balanced Scorecards'
  ) THEN
    CREATE POLICY "Users can view relevant Balanced Scorecards"
      ON balanced_scorecards FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR
        customer_id IN (
          SELECT customer_id FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- practice_categories
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'practice_categories' 
    AND policyname = 'Admins can manage practice_categories'
  ) THEN
    DROP POLICY "Admins can manage practice_categories" ON practice_categories;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'practice_categories' 
    AND policyname = 'Everyone can view practice_categories'
  ) THEN
    DROP POLICY "Everyone can view practice_categories" ON practice_categories;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'practice_categories' 
    AND policyname = 'Everyone can view practice categories'
  ) THEN
    CREATE POLICY "Everyone can view practice categories"
      ON practice_categories FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
