/*
  # Create Strategic Frameworks System
  
  This migration creates a comprehensive system for 10 strategic business models:
  1. OKR (Objectives and Key Results)
  2. SWOT Analysis
  3. Porter's Five Forces
  4. Business Model Canvas
  5. Balanced Scorecard
  6. Change Management (ADKAR)
  7. Agile Transformation
  8. McKinsey 7S Framework
  9. Lean Startup
  10. Design Thinking

  ## New Tables
  
  ### 1. OKR System
    - `okr_objectives` - Strategic objectives
    - `okr_key_results` - Measurable key results
    - `okr_progress_updates` - Progress tracking
  
  ### 2. SWOT Analysis
    - `swot_analyses` - SWOT analysis sessions
    - `swot_items` - Individual SWOT items (strengths, weaknesses, opportunities, threats)
  
  ### 3. Porter's Five Forces
    - `porter_analyses` - Porter's Five Forces analysis sessions
    - `porter_forces` - Individual force assessments
  
  ### 4. Business Model Canvas
    - `business_model_canvases` - Canvas sessions
    - `bmc_blocks` - Nine building blocks data
  
  ### 5. Balanced Scorecard
    - `balanced_scorecards` - Scorecard sessions
    - `bsc_perspectives` - Four perspectives with KPIs
    - `bsc_metrics` - Individual metrics tracking
  
  ### 6. Change Management (ADKAR)
    - `change_initiatives` - Change management projects
    - `adkar_assessments` - ADKAR stage assessments
    - `adkar_actions` - Action items for each stage
  
  ### 7. Agile Transformation
    - `agile_teams` - Agile teams
    - `agile_sprints` - Sprint planning
    - `agile_metrics` - Velocity, lead time, etc.
  
  ### 8. McKinsey 7S Framework
    - `mckinsey_7s_assessments` - 7S assessments
    - `mckinsey_7s_elements` - Seven elements evaluation
  
  ### 9. Lean Startup
    - `lean_experiments` - MVP experiments
    - `lean_hypotheses` - Testable hypotheses
    - `lean_feedback` - Customer feedback
  
  ### 10. Design Thinking
    - `design_thinking_projects` - Design thinking projects
    - `dt_phases` - Five phases tracking
    - `dt_insights` - Customer insights and ideas
  
  ## Security
    - Enable RLS on all tables
    - Admin users can manage all frameworks
    - Customers can view/edit their own data
*/

-- =====================================================
-- 1. OKR (OBJECTIVES AND KEY RESULTS) SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS okr_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id),
  time_period text NOT NULL DEFAULT 'Q1 2024', -- e.g., "Q1 2024", "2024"
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  alignment_to text, -- Links to parent objective or company goal
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS okr_key_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id uuid REFERENCES okr_objectives(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  metric_type text NOT NULL DEFAULT 'number' CHECK (metric_type IN ('number', 'percentage', 'currency', 'boolean')),
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0,
  unit text, -- e.g., "users", "SEK", "%"
  status text NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'behind', 'completed')),
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS okr_progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_result_id uuid REFERENCES okr_key_results(id) ON DELETE CASCADE,
  previous_value numeric NOT NULL,
  new_value numeric NOT NULL,
  note text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. SWOT ANALYSIS SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS swot_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  context text, -- Market context or specific focus area
  created_by uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS swot_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swot_analysis_id uuid REFERENCES swot_analyses(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('strength', 'weakness', 'opportunity', 'threat')),
  title text NOT NULL,
  description text,
  impact_level text DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high')),
  actionable boolean DEFAULT false,
  action_plan text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. PORTER'S FIVE FORCES SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS porter_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  industry text NOT NULL,
  market_description text,
  overall_attractiveness integer CHECK (overall_attractiveness >= 1 AND overall_attractiveness <= 10),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS porter_forces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  porter_analysis_id uuid REFERENCES porter_analyses(id) ON DELETE CASCADE,
  force_type text NOT NULL CHECK (force_type IN (
    'competitive_rivalry',
    'threat_of_new_entrants',
    'threat_of_substitutes',
    'bargaining_power_suppliers',
    'bargaining_power_customers'
  )),
  intensity_rating integer NOT NULL CHECK (intensity_rating >= 1 AND intensity_rating <= 5),
  description text,
  key_factors jsonb DEFAULT '[]', -- Array of key factors
  strategic_implications text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. BUSINESS MODEL CANVAS SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS business_model_canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  version integer DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bmc_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id uuid REFERENCES business_model_canvases(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (block_type IN (
    'customer_segments',
    'value_propositions',
    'channels',
    'customer_relationships',
    'revenue_streams',
    'key_resources',
    'key_activities',
    'key_partnerships',
    'cost_structure'
  )),
  content jsonb DEFAULT '[]', -- Array of items for this block
  notes text,
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. BALANCED SCORECARD SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS balanced_scorecards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  time_period text NOT NULL,
  vision text,
  strategy text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bsc_perspectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scorecard_id uuid REFERENCES balanced_scorecards(id) ON DELETE CASCADE,
  perspective_type text NOT NULL CHECK (perspective_type IN (
    'financial',
    'customer',
    'internal_processes',
    'learning_growth'
  )),
  objective text NOT NULL,
  description text,
  target text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bsc_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perspective_id uuid REFERENCES bsc_perspectives(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  description text,
  target_value numeric,
  current_value numeric DEFAULT 0,
  unit text,
  measurement_frequency text DEFAULT 'monthly' CHECK (measurement_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  status text DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'off_track')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 6. CHANGE MANAGEMENT (ADKAR) SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS change_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  change_type text, -- e.g., "Digital Transformation", "Process Improvement"
  scope text,
  start_date date DEFAULT CURRENT_DATE,
  target_completion_date date,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  overall_progress integer DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS adkar_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid REFERENCES change_initiatives(id) ON DELETE CASCADE,
  stage text NOT NULL CHECK (stage IN ('awareness', 'desire', 'knowledge', 'ability', 'reinforcement')),
  score integer CHECK (score >= 1 AND score <= 5),
  assessment_notes text,
  barriers jsonb DEFAULT '[]', -- Array of identified barriers
  actions_required jsonb DEFAULT '[]', -- Array of required actions
  completion_status text DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
  assessed_by uuid REFERENCES auth.users(id),
  assessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS adkar_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES adkar_assessments(id) ON DELETE CASCADE,
  action_title text NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id),
  due_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  impact_level text DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 7. AGILE TRANSFORMATION SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS agile_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  framework text NOT NULL DEFAULT 'scrum' CHECK (framework IN ('scrum', 'kanban', 'scrumban', 'safe')),
  team_size integer,
  velocity_target numeric,
  current_velocity numeric DEFAULT 0,
  team_lead_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'active' CHECK (status IN ('forming', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agile_sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES agile_teams(id) ON DELETE CASCADE,
  sprint_number integer NOT NULL,
  sprint_goal text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  planned_story_points numeric,
  completed_story_points numeric DEFAULT 0,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  retrospective_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agile_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES agile_teams(id) ON DELETE CASCADE,
  metric_date date DEFAULT CURRENT_DATE,
  velocity numeric,
  lead_time_days numeric,
  cycle_time_days numeric,
  throughput integer,
  team_satisfaction_score integer CHECK (team_satisfaction_score >= 1 AND team_satisfaction_score <= 10),
  quality_metrics jsonb DEFAULT '{}', -- defect rate, code coverage, etc.
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 8. MCKINSEY 7S FRAMEWORK SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS mckinsey_7s_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  assessment_date date DEFAULT CURRENT_DATE,
  overall_alignment_score integer CHECK (overall_alignment_score >= 1 AND overall_alignment_score <= 10),
  key_findings text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mckinsey_7s_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES mckinsey_7s_assessments(id) ON DELETE CASCADE,
  element_type text NOT NULL CHECK (element_type IN (
    'strategy',
    'structure',
    'systems',
    'shared_values',
    'skills',
    'style',
    'staff'
  )),
  current_state text NOT NULL,
  desired_state text,
  alignment_score integer CHECK (alignment_score >= 1 AND alignment_score <= 5),
  gaps_identified text,
  recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 9. LEAN STARTUP METHODOLOGY SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS lean_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  experiment_name text NOT NULL,
  mvp_description text,
  problem_statement text NOT NULL,
  target_segment text,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'running', 'completed', 'pivoted', 'abandoned')),
  learning_outcome text,
  next_steps text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lean_hypotheses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES lean_experiments(id) ON DELETE CASCADE,
  hypothesis_statement text NOT NULL,
  success_criteria text NOT NULL,
  validation_method text, -- e.g., "Customer interviews", "A/B test", "Landing page"
  is_validated boolean,
  validation_result text,
  confidence_level integer CHECK (confidence_level >= 1 AND confidence_level <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lean_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES lean_experiments(id) ON DELETE CASCADE,
  feedback_source text NOT NULL, -- e.g., "Customer interview", "Survey", "Usage data"
  feedback_type text CHECK (feedback_type IN ('positive', 'negative', 'neutral', 'insight')),
  feedback_text text NOT NULL,
  customer_segment text,
  actionable boolean DEFAULT false,
  action_taken text,
  collected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 10. DESIGN THINKING SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS design_thinking_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  challenge_statement text NOT NULL,
  target_users text,
  current_phase text NOT NULL DEFAULT 'empathize' CHECK (current_phase IN (
    'empathize',
    'define',
    'ideate',
    'prototype',
    'test'
  )),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  team_members jsonb DEFAULT '[]',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dt_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  phase_name text NOT NULL CHECK (phase_name IN ('empathize', 'define', 'ideate', 'prototype', 'test')),
  activities jsonb DEFAULT '[]', -- Activities conducted in this phase
  key_findings text,
  artifacts jsonb DEFAULT '[]', -- Documents, images, links to prototypes
  completion_status text DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dt_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  phase_name text NOT NULL,
  insight_type text CHECK (insight_type IN ('user_need', 'pain_point', 'idea', 'prototype_feedback', 'validation')),
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_okr_objectives_customer ON okr_objectives(customer_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective ON okr_key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_swot_analyses_customer ON swot_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_swot_items_analysis ON swot_items(swot_analysis_id);
CREATE INDEX IF NOT EXISTS idx_porter_analyses_customer ON porter_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_porter_forces_analysis ON porter_forces(porter_analysis_id);
CREATE INDEX IF NOT EXISTS idx_bmc_customer ON business_model_canvases(customer_id);
CREATE INDEX IF NOT EXISTS idx_bmc_blocks_canvas ON bmc_blocks(canvas_id);
CREATE INDEX IF NOT EXISTS idx_bsc_customer ON balanced_scorecards(customer_id);
CREATE INDEX IF NOT EXISTS idx_bsc_perspectives_scorecard ON bsc_perspectives(scorecard_id);
CREATE INDEX IF NOT EXISTS idx_bsc_metrics_perspective ON bsc_metrics(perspective_id);
CREATE INDEX IF NOT EXISTS idx_change_initiatives_customer ON change_initiatives(customer_id);
CREATE INDEX IF NOT EXISTS idx_adkar_assessments_initiative ON adkar_assessments(initiative_id);
CREATE INDEX IF NOT EXISTS idx_adkar_actions_assessment ON adkar_actions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_agile_teams_customer ON agile_teams(customer_id);
CREATE INDEX IF NOT EXISTS idx_agile_sprints_team ON agile_sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_agile_metrics_team ON agile_metrics(team_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_assessments_customer ON mckinsey_7s_assessments(customer_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_elements_assessment ON mckinsey_7s_elements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_customer ON lean_experiments(customer_id);
CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_experiment ON lean_hypotheses(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_feedback_experiment ON lean_feedback(experiment_id);
CREATE INDEX IF NOT EXISTS idx_dt_projects_customer ON design_thinking_projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_dt_phases_project ON dt_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_insights_project ON dt_insights(project_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE okr_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE okr_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE okr_progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE porter_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE porter_forces ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_model_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmc_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE balanced_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bsc_perspectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE bsc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE adkar_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adkar_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mckinsey_7s_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mckinsey_7s_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_thinking_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_insights ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access for authenticated admin users)
CREATE POLICY "Admins can manage all OKR objectives"
  ON okr_objectives FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all OKR key results"
  ON okr_key_results FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all OKR progress updates"
  ON okr_progress_updates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all SWOT analyses"
  ON swot_analyses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all SWOT items"
  ON swot_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Porter analyses"
  ON porter_analyses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Porter forces"
  ON porter_forces FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all BMC"
  ON business_model_canvases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all BMC blocks"
  ON bmc_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Balanced Scorecards"
  ON balanced_scorecards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all BSC perspectives"
  ON bsc_perspectives FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all BSC metrics"
  ON bsc_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all change initiatives"
  ON change_initiatives FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all ADKAR assessments"
  ON adkar_assessments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all ADKAR actions"
  ON adkar_actions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Agile teams"
  ON agile_teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Agile sprints"
  ON agile_sprints FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Agile metrics"
  ON agile_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all McKinsey 7S assessments"
  ON mckinsey_7s_assessments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all McKinsey 7S elements"
  ON mckinsey_7s_elements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Lean experiments"
  ON lean_experiments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Lean hypotheses"
  ON lean_hypotheses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Lean feedback"
  ON lean_feedback FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all Design Thinking projects"
  ON design_thinking_projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all DT phases"
  ON dt_phases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

CREATE POLICY "Admins can manage all DT insights"
  ON dt_insights FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('superadmin', 'admin', 'consultant')
    )
  );

-- Customer policies (view their own data)
CREATE POLICY "Customers can view their OKR objectives"
  ON okr_objectives FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their SWOT analyses"
  ON swot_analyses FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their Porter analyses"
  ON porter_analyses FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their BMC"
  ON business_model_canvases FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their Balanced Scorecards"
  ON balanced_scorecards FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their change initiatives"
  ON change_initiatives FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their Agile teams"
  ON agile_teams FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their McKinsey 7S assessments"
  ON mckinsey_7s_assessments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their Lean experiments"
  ON lean_experiments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );

CREATE POLICY "Customers can view their Design Thinking projects"
  ON design_thinking_projects FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'customer'
    )
  );
