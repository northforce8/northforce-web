/*
  # Fix Multiple Permissive Policies - Corrected Part 1
  
  1. Summary
    - Consolidate policies with correct table references
    - Part 1: best_practices through invoices
  
  2. Corrections
    - Use correct column names (is_published vs is_public)
    - Use correct table names (project_assignments)
*/

-- best_practices (has is_published)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins have full access to best_practices" ON best_practices;
  DROP POLICY IF EXISTS "Everyone can view published best_practices" ON best_practices;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'best_practices' 
    AND policyname = 'Users can view relevant best practices'
  ) THEN
    CREATE POLICY "Users can view relevant best practices"
      ON best_practices FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR is_published = true
      );
  END IF;
END $$;

-- business_model_canvases
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all BMC" ON business_model_canvases;
  DROP POLICY IF EXISTS "Customers can view their BMC" ON business_model_canvases;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'business_model_canvases' 
    AND policyname = 'Users can view relevant BMC'
  ) THEN
    CREATE POLICY "Users can view relevant BMC"
      ON business_model_canvases FOR SELECT
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

-- business_models
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins have full access to business_models" ON business_models;
  DROP POLICY IF EXISTS "Customers can view their business_models" ON business_models;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'business_models' 
    AND policyname = 'Users can view relevant business models'
  ) THEN
    CREATE POLICY "Users can view relevant business models"
      ON business_models FOR SELECT
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

-- campaign_activities
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins have full access to campaign_activities" ON campaign_activities;
  DROP POLICY IF EXISTS "Customers can view their campaign_activities" ON campaign_activities;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'campaign_activities' 
    AND policyname = 'Users can view relevant campaign activities'
  ) THEN
    CREATE POLICY "Users can view relevant campaign activities"
      ON campaign_activities FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR campaign_id IN (
          SELECT id FROM marketing_campaigns
          WHERE customer_id IN (
            SELECT customer_id FROM user_profiles
            WHERE user_profiles.id = (SELECT auth.uid())
          )
        )
      );
  END IF;
END $$;

-- change_initiatives
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all change initiatives" ON change_initiatives;
  DROP POLICY IF EXISTS "Customers can view their change initiatives" ON change_initiatives;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'change_initiatives' 
    AND policyname = 'Users can view relevant change initiatives'
  ) THEN
    CREATE POLICY "Users can view relevant change initiatives"
      ON change_initiatives FOR SELECT
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

-- contracts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all contracts" ON contracts;
  DROP POLICY IF EXISTS "Customers can view own contracts" ON contracts;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'contracts' 
    AND policyname = 'Users can view relevant contracts'
  ) THEN
    CREATE POLICY "Users can view relevant contracts"
      ON contracts FOR SELECT
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

-- customers (using project_assignments)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;
  DROP POLICY IF EXISTS "Customers can view own customer record" ON customers;
  DROP POLICY IF EXISTS "Partners can view assigned customers" ON customers;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'customers' 
    AND policyname = 'Users can view relevant customers'
  ) THEN
    CREATE POLICY "Users can view relevant customers"
      ON customers FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR id IN (
          SELECT customer_id FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
        )
        OR id IN (
          SELECT customer_id FROM projects
          WHERE id IN (
            SELECT project_id FROM project_assignments
            WHERE partner_id IN (
              SELECT id FROM partners
              WHERE user_id = (SELECT auth.uid())
            )
          )
        )
      );
  END IF;
END $$;

-- invoice_line_items
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all invoice line items" ON invoice_line_items;
  DROP POLICY IF EXISTS "Customers can view own invoice line items" ON invoice_line_items;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'invoice_line_items' 
    AND policyname = 'Users can view relevant invoice line items'
  ) THEN
    CREATE POLICY "Users can view relevant invoice line items"
      ON invoice_line_items FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = (SELECT auth.uid())
          AND user_profiles.role = 'admin'
        )
        OR invoice_id IN (
          SELECT id FROM invoices
          WHERE customer_id IN (
            SELECT customer_id FROM user_profiles
            WHERE user_profiles.id = (SELECT auth.uid())
          )
        )
      );
  END IF;
END $$;

-- invoices
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;
  DROP POLICY IF EXISTS "Customers can view own invoices" ON invoices;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'invoices' 
    AND policyname = 'Users can view relevant invoices'
  ) THEN
    CREATE POLICY "Users can view relevant invoices"
      ON invoices FOR SELECT
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
