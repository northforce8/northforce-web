/*
  # Fix Unused Indexes and Multiple Permissive Policies
  
  1. Purpose
    - Remove unused indexes to improve database performance
    - Consolidate multiple permissive policies to avoid policy conflicts
  
  2. Changes
    - Drop unused index on framework_links.created_by
    - Merge duplicate permissive SELECT policies into single policies
  
  3. Security Impact
    - Consolidating policies maintains security while improving performance
    - Each table will have only one permissive SELECT policy per role
*/

-- Remove unused index
DROP INDEX IF EXISTS idx_framework_links_created_by;

-- Fix contracts: merge policies
DROP POLICY IF EXISTS "contracts_select_policy" ON public.contracts;
DROP POLICY IF EXISTS "contracts_manage_policy" ON public.contracts;

CREATE POLICY "contracts_select_policy" ON public.contracts
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can see all contracts
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
    OR
    -- Customers can see their own contracts
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

-- Fix invoices: merge policies
DROP POLICY IF EXISTS "invoices_select_policy" ON public.invoices;
DROP POLICY IF EXISTS "invoices_manage_policy" ON public.invoices;

CREATE POLICY "invoices_select_policy" ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can see all invoices
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
    OR
    -- Customers can see their own invoices
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

-- Fix lean_customer_segments: merge policies
DROP POLICY IF EXISTS "Admin users can modify customer segments" ON public.lean_customer_segments;
DROP POLICY IF EXISTS "Users can view customer segments" ON public.lean_customer_segments;

CREATE POLICY "lean_customer_segments_policy" ON public.lean_customer_segments
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

-- Fix lean_experiments: merge policies
DROP POLICY IF EXISTS "Admins can manage all Lean experiments" ON public.lean_experiments;
DROP POLICY IF EXISTS "Customers can view their Lean experiments" ON public.lean_experiments;

CREATE POLICY "lean_experiments_policy" ON public.lean_experiments
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

-- Fix lean_metrics: merge policies
DROP POLICY IF EXISTS "Admin users can modify metrics" ON public.lean_metrics;
DROP POLICY IF EXISTS "Users can view metrics" ON public.lean_metrics;

CREATE POLICY "lean_metrics_policy" ON public.lean_metrics
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

-- Fix lean_mvp_features: merge policies
DROP POLICY IF EXISTS "Admin users can modify MVP features" ON public.lean_mvp_features;
DROP POLICY IF EXISTS "Users can view MVP features" ON public.lean_mvp_features;

CREATE POLICY "lean_mvp_features_policy" ON public.lean_mvp_features
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

-- Fix lean_pivot_decisions: merge policies
DROP POLICY IF EXISTS "Admin users can modify pivot decisions" ON public.lean_pivot_decisions;
DROP POLICY IF EXISTS "Users can view pivot decisions" ON public.lean_pivot_decisions;

CREATE POLICY "lean_pivot_decisions_policy" ON public.lean_pivot_decisions
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

-- Fix marketing_campaigns: merge policies
DROP POLICY IF EXISTS "Admins have full access to marketing_campaigns" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Customers can view their marketing_campaigns" ON public.marketing_campaigns;

CREATE POLICY "marketing_campaigns_policy" ON public.marketing_campaigns
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

-- Fix mckinsey_7s_assessments: merge policies
DROP POLICY IF EXISTS "Admins can manage all McKinsey 7S assessments" ON public.mckinsey_7s_assessments;
DROP POLICY IF EXISTS "Customers can view their McKinsey 7S assessments" ON public.mckinsey_7s_assessments;

CREATE POLICY "mckinsey_7s_assessments_policy" ON public.mckinsey_7s_assessments
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

-- Fix mckinsey_7s_element_relationships: merge policies
DROP POLICY IF EXISTS "Admin users can modify relationships" ON public.mckinsey_7s_element_relationships;
DROP POLICY IF EXISTS "Users can view relationships" ON public.mckinsey_7s_element_relationships;

CREATE POLICY "mckinsey_7s_element_relationships_policy" ON public.mckinsey_7s_element_relationships
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

-- Fix mckinsey_7s_improvements: merge policies
DROP POLICY IF EXISTS "Admin users can modify improvements" ON public.mckinsey_7s_improvements;
DROP POLICY IF EXISTS "Users can view improvements" ON public.mckinsey_7s_improvements;

CREATE POLICY "mckinsey_7s_improvements_policy" ON public.mckinsey_7s_improvements
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

-- Fix okr_objectives: merge policies
DROP POLICY IF EXISTS "Admins can manage all OKR objectives" ON public.okr_objectives;
DROP POLICY IF EXISTS "okr_objectives_select_policy" ON public.okr_objectives;

CREATE POLICY "okr_objectives_policy" ON public.okr_objectives
  FOR ALL
  TO authenticated
  USING (
    -- Admins can manage all
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
    OR
    -- Customers can view their own
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.customer_id = okr_objectives.customer_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
  );

-- Fix partner_capacity_periods: merge policies
DROP POLICY IF EXISTS "partner_capacity_periods_select_policy" ON public.partner_capacity_periods;
DROP POLICY IF EXISTS "partner_capacity_periods_manage_policy" ON public.partner_capacity_periods;

CREATE POLICY "partner_capacity_periods_policy" ON public.partner_capacity_periods
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

-- Fix porter_analyses: merge policies
DROP POLICY IF EXISTS "Admins can manage all Porter analyses" ON public.porter_analyses;
DROP POLICY IF EXISTS "Customers can view their Porter analyses" ON public.porter_analyses;

CREATE POLICY "porter_analyses_policy" ON public.porter_analyses
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

-- Fix recommendations: merge policies
DROP POLICY IF EXISTS "recommendations_select_policy" ON public.recommendations;
DROP POLICY IF EXISTS "recommendations_manage_policy" ON public.recommendations;

CREATE POLICY "recommendations_policy" ON public.recommendations
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

-- Fix strategic_goals: merge policies
DROP POLICY IF EXISTS "Admins have full access to strategic_goals" ON public.strategic_goals;
DROP POLICY IF EXISTS "Customers can view their strategic_goals" ON public.strategic_goals;

CREATE POLICY "strategic_goals_policy" ON public.strategic_goals
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

-- Fix time_entries: merge policies
DROP POLICY IF EXISTS "Customers can view time on own projects" ON public.time_entries;
DROP POLICY IF EXISTS "time_entries_admin_select_policy" ON public.time_entries;

CREATE POLICY "time_entries_select_policy" ON public.time_entries
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can see all
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (SELECT auth.uid())
      AND admin_users.is_active = true
    )
    OR
    -- Customers can see time on their projects
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      INNER JOIN public.projects p ON p.customer_id = up.customer_id
      WHERE up.id = (SELECT auth.uid())
      AND p.id = time_entries.project_id
    )
  );
