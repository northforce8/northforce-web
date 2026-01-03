/*
  # Fix RLS Policy Performance - Part 2: Strategic Frameworks

  ## Performance Optimization
  - Replaces `auth.uid()` with `(select auth.uid())` in RLS policies
  - Covers all 10 strategic frameworks (OKR, SWOT, Porter, BMC, BSC, ADKAR, Agile, McKinsey, Lean, Design Thinking)
  - Maintains security while improving performance

  ## Tables Updated
  - OKR tables (objectives, key_results, progress_updates)
  - SWOT tables (analyses, items)
  - Porter's Five Forces (analyses, forces)
  - Business Model Canvas (canvases, blocks)
  - Balanced Scorecard (scorecards, perspectives, metrics)
  - ADKAR (change_initiatives, assessments, actions)
  - Agile (teams, sprints, metrics)
  - McKinsey 7S (assessments, elements)
  - Lean Startup (experiments, hypotheses, feedback)
  - Design Thinking (projects, phases, insights)
*/

-- OKR Objectives
DROP POLICY IF EXISTS "Admins can manage all OKR objectives" ON public.okr_objectives;
CREATE POLICY "Admins can manage all OKR objectives" ON public.okr_objectives
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their OKR objectives" ON public.okr_objectives;
CREATE POLICY "Customers can view their OKR objectives" ON public.okr_objectives
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- OKR Key Results
DROP POLICY IF EXISTS "Admins can manage all OKR key results" ON public.okr_key_results;
CREATE POLICY "Admins can manage all OKR key results" ON public.okr_key_results
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- OKR Progress Updates
DROP POLICY IF EXISTS "Admins can manage all OKR progress updates" ON public.okr_progress_updates;
CREATE POLICY "Admins can manage all OKR progress updates" ON public.okr_progress_updates
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- SWOT Analyses
DROP POLICY IF EXISTS "Admins can manage all SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Admins can manage all SWOT analyses" ON public.swot_analyses
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Customers can view their SWOT analyses" ON public.swot_analyses
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- SWOT Items
DROP POLICY IF EXISTS "Admins can manage all SWOT items" ON public.swot_items;
CREATE POLICY "Admins can manage all SWOT items" ON public.swot_items
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Porter Analyses
DROP POLICY IF EXISTS "Admins can manage all Porter analyses" ON public.porter_analyses;
CREATE POLICY "Admins can manage all Porter analyses" ON public.porter_analyses
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their Porter analyses" ON public.porter_analyses;
CREATE POLICY "Customers can view their Porter analyses" ON public.porter_analyses
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Porter Forces
DROP POLICY IF EXISTS "Admins can manage all Porter forces" ON public.porter_forces;
CREATE POLICY "Admins can manage all Porter forces" ON public.porter_forces
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Business Model Canvases
DROP POLICY IF EXISTS "Admins can manage all BMC" ON public.business_model_canvases;
CREATE POLICY "Admins can manage all BMC" ON public.business_model_canvases
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their BMC" ON public.business_model_canvases;
CREATE POLICY "Customers can view their BMC" ON public.business_model_canvases
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- BMC Blocks
DROP POLICY IF EXISTS "Admins can manage all BMC blocks" ON public.bmc_blocks;
CREATE POLICY "Admins can manage all BMC blocks" ON public.bmc_blocks
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Balanced Scorecards
DROP POLICY IF EXISTS "Admins can manage all Balanced Scorecards" ON public.balanced_scorecards;
CREATE POLICY "Admins can manage all Balanced Scorecards" ON public.balanced_scorecards
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their Balanced Scorecards" ON public.balanced_scorecards;
CREATE POLICY "Customers can view their Balanced Scorecards" ON public.balanced_scorecards
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- BSC Perspectives
DROP POLICY IF EXISTS "Admins can manage all BSC perspectives" ON public.bsc_perspectives;
CREATE POLICY "Admins can manage all BSC perspectives" ON public.bsc_perspectives
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- BSC Metrics
DROP POLICY IF EXISTS "Admins can manage all BSC metrics" ON public.bsc_metrics;
CREATE POLICY "Admins can manage all BSC metrics" ON public.bsc_metrics
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Change Initiatives
DROP POLICY IF EXISTS "Admins can manage all change initiatives" ON public.change_initiatives;
CREATE POLICY "Admins can manage all change initiatives" ON public.change_initiatives
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their change initiatives" ON public.change_initiatives;
CREATE POLICY "Customers can view their change initiatives" ON public.change_initiatives
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- ADKAR Assessments
DROP POLICY IF EXISTS "Admins can manage all ADKAR assessments" ON public.adkar_assessments;
CREATE POLICY "Admins can manage all ADKAR assessments" ON public.adkar_assessments
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- ADKAR Actions
DROP POLICY IF EXISTS "Admins can manage all ADKAR actions" ON public.adkar_actions;
CREATE POLICY "Admins can manage all ADKAR actions" ON public.adkar_actions
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Agile Teams
DROP POLICY IF EXISTS "Admins can manage all Agile teams" ON public.agile_teams;
CREATE POLICY "Admins can manage all Agile teams" ON public.agile_teams
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their Agile teams" ON public.agile_teams;
CREATE POLICY "Customers can view their Agile teams" ON public.agile_teams
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Agile Sprints
DROP POLICY IF EXISTS "Admins can manage all Agile sprints" ON public.agile_sprints;
CREATE POLICY "Admins can manage all Agile sprints" ON public.agile_sprints
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Agile Metrics
DROP POLICY IF EXISTS "Admins can manage all Agile metrics" ON public.agile_metrics;
CREATE POLICY "Admins can manage all Agile metrics" ON public.agile_metrics
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- McKinsey 7S Assessments
DROP POLICY IF EXISTS "Admins can manage all McKinsey 7S assessments" ON public.mckinsey_7s_assessments;
CREATE POLICY "Admins can manage all McKinsey 7S assessments" ON public.mckinsey_7s_assessments
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their McKinsey 7S assessments" ON public.mckinsey_7s_assessments;
CREATE POLICY "Customers can view their McKinsey 7S assessments" ON public.mckinsey_7s_assessments
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- McKinsey 7S Elements
DROP POLICY IF EXISTS "Admins can manage all McKinsey 7S elements" ON public.mckinsey_7s_elements;
CREATE POLICY "Admins can manage all McKinsey 7S elements" ON public.mckinsey_7s_elements
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Lean Experiments
DROP POLICY IF EXISTS "Admins can manage all Lean experiments" ON public.lean_experiments;
CREATE POLICY "Admins can manage all Lean experiments" ON public.lean_experiments
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their Lean experiments" ON public.lean_experiments;
CREATE POLICY "Customers can view their Lean experiments" ON public.lean_experiments
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Lean Hypotheses
DROP POLICY IF EXISTS "Admins can manage all Lean hypotheses" ON public.lean_hypotheses;
CREATE POLICY "Admins can manage all Lean hypotheses" ON public.lean_hypotheses
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Lean Feedback
DROP POLICY IF EXISTS "Admins can manage all Lean feedback" ON public.lean_feedback;
CREATE POLICY "Admins can manage all Lean feedback" ON public.lean_feedback
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Design Thinking Projects
DROP POLICY IF EXISTS "Admins can manage all Design Thinking projects" ON public.design_thinking_projects;
CREATE POLICY "Admins can manage all Design Thinking projects" ON public.design_thinking_projects
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view their Design Thinking projects" ON public.design_thinking_projects;
CREATE POLICY "Customers can view their Design Thinking projects" ON public.design_thinking_projects
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Design Thinking Phases
DROP POLICY IF EXISTS "Admins can manage all DT phases" ON public.dt_phases;
CREATE POLICY "Admins can manage all DT phases" ON public.dt_phases
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

-- Design Thinking Insights
DROP POLICY IF EXISTS "Admins can manage all DT insights" ON public.dt_insights;
CREATE POLICY "Admins can manage all DT insights" ON public.dt_insights
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));