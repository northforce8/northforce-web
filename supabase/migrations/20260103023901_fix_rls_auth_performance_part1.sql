/*
  # Fix RLS Policy Performance - Part 1: Core & Growth Tables

  ## Performance Optimization
  - Replaces `auth.uid()` with `(select auth.uid())` in RLS policies
  - Prevents re-evaluation of auth functions for each row  
  - Materializes authentication context once per query
  - Improves query performance at scale

  ## Security
  - Maintains existing security model
  - No changes to access control logic
  - Removes duplicate policies for clarity

  ## Tables Updated
  - user_profiles, customers, projects
  - growth_plans, growth_objectives, growth_initiatives, growth_milestones
  - leadership tables, marketing campaign tables
  - business_models, strategic_goals, financial_snapshots
*/

-- User Profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Customers - remove duplicates and optimize
DROP POLICY IF EXISTS "customers_delete_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_insert_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_select_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_update_policy" ON public.customers;
DROP POLICY IF EXISTS "Admins manage contracts" ON public.contracts;

DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;
CREATE POLICY "Admins can manage all customers" ON public.customers
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Partners can view assigned customers" ON public.customers;
CREATE POLICY "Partners can view assigned customers" ON public.customers
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'partner'));

DROP POLICY IF EXISTS "Customers can view own customer record" ON public.customers;
CREATE POLICY "Customers can view own customer record" ON public.customers
  FOR SELECT TO authenticated
  USING (id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Projects - remove duplicate and optimize
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;

DROP POLICY IF EXISTS "Customers can view own projects" ON public.projects;
CREATE POLICY "Customers can view own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Growth Plans
DROP POLICY IF EXISTS "Admins have full access to growth_plans" ON public.growth_plans;
CREATE POLICY "Admins have full access to growth_plans" ON public.growth_plans
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their growth_plans" ON public.growth_plans;
CREATE POLICY "Customers can view their growth_plans" ON public.growth_plans
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Growth Objectives
DROP POLICY IF EXISTS "Admins have full access to growth_objectives" ON public.growth_objectives;
CREATE POLICY "Admins have full access to growth_objectives" ON public.growth_objectives
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their growth_objectives" ON public.growth_objectives;
CREATE POLICY "Customers can view their growth_objectives" ON public.growth_objectives
  FOR SELECT TO authenticated
  USING (growth_plan_id IN (SELECT id FROM public.growth_plans WHERE customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid()))));

-- Growth Initiatives
DROP POLICY IF EXISTS "Admins have full access to growth_initiatives" ON public.growth_initiatives;
CREATE POLICY "Admins have full access to growth_initiatives" ON public.growth_initiatives
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their growth_initiatives" ON public.growth_initiatives;
CREATE POLICY "Customers can view their growth_initiatives" ON public.growth_initiatives
  FOR SELECT TO authenticated
  USING (growth_objective_id IN (SELECT id FROM public.growth_objectives WHERE growth_plan_id IN (SELECT id FROM public.growth_plans WHERE customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())))));

-- Growth Milestones
DROP POLICY IF EXISTS "Admins have full access to growth_milestones" ON public.growth_milestones;
CREATE POLICY "Admins have full access to growth_milestones" ON public.growth_milestones
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Leadership Competencies
DROP POLICY IF EXISTS "Admins have full access to leadership_competencies" ON public.leadership_competencies;
CREATE POLICY "Admins have full access to leadership_competencies" ON public.leadership_competencies
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Leadership Assessments
DROP POLICY IF EXISTS "Admins have full access to leadership_assessments" ON public.leadership_assessments;
CREATE POLICY "Admins have full access to leadership_assessments" ON public.leadership_assessments
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Assessment Participants
DROP POLICY IF EXISTS "Admins have full access to assessment_participants" ON public.assessment_participants;
CREATE POLICY "Admins have full access to assessment_participants" ON public.assessment_participants
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Assessment Scores
DROP POLICY IF EXISTS "Admins have full access to assessment_scores" ON public.assessment_scores;
CREATE POLICY "Admins have full access to assessment_scores" ON public.assessment_scores
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Development Plans
DROP POLICY IF EXISTS "Admins have full access to development_plans" ON public.development_plans;
CREATE POLICY "Admins have full access to development_plans" ON public.development_plans
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Development Actions
DROP POLICY IF EXISTS "Admins have full access to development_actions" ON public.development_actions;
CREATE POLICY "Admins have full access to development_actions" ON public.development_actions
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Marketing Campaigns
DROP POLICY IF EXISTS "Admins have full access to marketing_campaigns" ON public.marketing_campaigns;
CREATE POLICY "Admins have full access to marketing_campaigns" ON public.marketing_campaigns
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their marketing_campaigns" ON public.marketing_campaigns;
CREATE POLICY "Customers can view their marketing_campaigns" ON public.marketing_campaigns
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Campaign Activities
DROP POLICY IF EXISTS "Admins have full access to campaign_activities" ON public.campaign_activities;
CREATE POLICY "Admins have full access to campaign_activities" ON public.campaign_activities
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their campaign_activities" ON public.campaign_activities;
CREATE POLICY "Customers can view their campaign_activities" ON public.campaign_activities
  FOR SELECT TO authenticated
  USING (campaign_id IN (SELECT id FROM public.marketing_campaigns WHERE customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid()))));

-- Campaign Results
DROP POLICY IF EXISTS "Admins have full access to campaign_results" ON public.campaign_results;
CREATE POLICY "Admins have full access to campaign_results" ON public.campaign_results
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Campaign Budgets
DROP POLICY IF EXISTS "Admins have full access to campaign_budgets" ON public.campaign_budgets;
CREATE POLICY "Admins have full access to campaign_budgets" ON public.campaign_budgets
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Business Models
DROP POLICY IF EXISTS "Admins have full access to business_models" ON public.business_models;
CREATE POLICY "Admins have full access to business_models" ON public.business_models
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their business_models" ON public.business_models;
CREATE POLICY "Customers can view their business_models" ON public.business_models
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Strategic Goals
DROP POLICY IF EXISTS "Admins have full access to strategic_goals" ON public.strategic_goals;
CREATE POLICY "Admins have full access to strategic_goals" ON public.strategic_goals
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their strategic_goals" ON public.strategic_goals;
CREATE POLICY "Customers can view their strategic_goals" ON public.strategic_goals
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Goal Metrics
DROP POLICY IF EXISTS "Admins have full access to goal_metrics" ON public.goal_metrics;
CREATE POLICY "Admins have full access to goal_metrics" ON public.goal_metrics
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Financial Snapshots
DROP POLICY IF EXISTS "Admins have full access to financial_snapshots" ON public.financial_snapshots;
CREATE POLICY "Admins have full access to financial_snapshots" ON public.financial_snapshots
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Methodology Templates
DROP POLICY IF EXISTS "Admins have full access to methodology_templates" ON public.methodology_templates;
CREATE POLICY "Admins have full access to methodology_templates" ON public.methodology_templates
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Best Practices
DROP POLICY IF EXISTS "Admins have full access to best_practices" ON public.best_practices;
CREATE POLICY "Admins have full access to best_practices" ON public.best_practices
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Practice Categories
DROP POLICY IF EXISTS "Admins can manage practice_categories" ON public.practice_categories;
CREATE POLICY "Admins can manage practice_categories" ON public.practice_categories
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));