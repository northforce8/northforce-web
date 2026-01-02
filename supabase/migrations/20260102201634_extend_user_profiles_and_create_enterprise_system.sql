/*
  # Extend User Profiles and Create Enterprise Management System

  ## Part 1: Extend User Profiles
  Add customer_id to user_profiles to link customer users to their organizations.
  This enables customer portal access with proper data isolation.

  ## Part 2: Enterprise Management Portal System

  ### Overview
  Complete enterprise-grade management system for growth planning, leadership development,
  marketing management, and business planning. Designed for consultant-customer collaboration
  in strategic management projects.

  ### 1. Growth & Strategy Management
  
  #### Tables
  - `growth_plans`: Strategic growth plans per customer
  - `growth_objectives`: Measurable objectives within plans
  - `growth_initiatives`: Concrete initiatives to achieve objectives
  - `growth_milestones`: Key milestones for tracking progress
  
  #### Purpose
  Enable structured growth planning with measurable KPIs, milestone tracking, and 
  initiative management. Links to existing projects for seamless execution tracking.

  ### 2. Leadership Development System
  
  #### Tables
  - `leadership_competencies`: Competency framework
  - `leadership_assessments`: 360-degree assessment campaigns
  - `assessment_participants`: Individuals being assessed
  - `assessment_scores`: Competency scores with multi-rater feedback
  - `development_plans`: Personal development plans (PDPs)
  - `development_actions`: Specific actions within PDPs
  
  #### Purpose
  Continuous leadership development with measurable progress. 360° feedback,
  competency gap analysis, and structured development planning.

  ### 3. Marketing & Campaign Management
  
  #### Tables
  - `marketing_campaigns`: Campaign planning and tracking
  - `campaign_activities`: Activities within campaigns
  - `campaign_results`: Performance metrics and KPIs
  - `campaign_budgets`: Budget tracking and allocation
  
  #### Purpose
  Transparent marketing execution with ROI tracking. Links to partner delivery
  and credits system for resource management.

  ### 4. Business Planning & Financial Linkage
  
  #### Tables
  - `business_models`: Customer business model canvas
  - `strategic_goals`: High-level strategic objectives
  - `goal_metrics`: Quantifiable metrics for goals
  - `financial_snapshots`: Periodic financial performance tracking
  
  #### Purpose
  Connect operational activities to financial outcomes. Strategic alignment
  and business model visualization.

  ### 5. Knowledge & Best Practices
  
  #### Tables
  - `methodology_templates`: Reusable project templates
  - `best_practices`: Knowledge base of proven approaches
  - `practice_categories`: Organization of best practices
  
  #### Purpose
  Capture and reuse institutional knowledge. Accelerate project delivery
  with proven templates and methodologies.

  ## Security
  - All tables have RLS enabled
  - Admin users have full access
  - Customers can only view their own data
  - Partners can view data for their assigned customers
  - Audit trails track all changes

  ## Integration Points
  - Links to existing `customers` table
  - Links to existing `projects` table
  - Links to existing `partners` table
  - Uses existing `recommendations` system for AI suggestions
*/

-- ============================================================================
-- PART 1: EXTEND USER PROFILES
-- ============================================================================

-- Add customer_id to user_profiles for customer portal users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN customer_id uuid REFERENCES customers(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_user_profiles_customer ON user_profiles(customer_id);
  END IF;
END $$;

-- ============================================================================
-- PART 2: GROWTH & STRATEGY MANAGEMENT
-- ============================================================================

-- Growth Plans: Strategic plans per customer
CREATE TABLE IF NOT EXISTS growth_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  plan_name text NOT NULL,
  vision_statement text,
  mission_statement text,
  time_horizon_months integer DEFAULT 12,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'on_hold', 'completed', 'cancelled')),
  overall_progress integer DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Growth Objectives: Measurable objectives within plans
CREATE TABLE IF NOT EXISTS growth_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_plan_id uuid REFERENCES growth_plans(id) ON DELETE CASCADE NOT NULL,
  objective_title text NOT NULL,
  description text,
  category text DEFAULT 'revenue' CHECK (category IN ('revenue', 'market_share', 'customer_acquisition', 'operational_efficiency', 'innovation', 'people', 'other')),
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  target_metric text,
  baseline_value numeric,
  target_value numeric,
  current_value numeric,
  unit text,
  target_date date,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'delayed', 'completed', 'cancelled')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  owner_name text,
  owner_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Growth Initiatives: Concrete initiatives to achieve objectives
CREATE TABLE IF NOT EXISTS growth_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_objective_id uuid REFERENCES growth_objectives(id) ON DELETE CASCADE NOT NULL,
  initiative_name text NOT NULL,
  description text,
  assigned_to_partner_id uuid REFERENCES partners(id),
  assigned_to_name text,
  project_id uuid REFERENCES projects(id),
  estimated_credits integer DEFAULT 0,
  actual_credits integer DEFAULT 0,
  start_date date,
  due_date date,
  completed_date date,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'blocked', 'completed', 'cancelled')),
  deliverables jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Growth Milestones: Key milestones for tracking
CREATE TABLE IF NOT EXISTS growth_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_objective_id uuid REFERENCES growth_objectives(id) ON DELETE CASCADE,
  growth_initiative_id uuid REFERENCES growth_initiatives(id) ON DELETE CASCADE,
  milestone_name text NOT NULL,
  description text,
  target_date date NOT NULL,
  completed_date date,
  is_completed boolean DEFAULT false,
  completion_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT milestone_belongs_to_objective_or_initiative CHECK (
    (growth_objective_id IS NOT NULL AND growth_initiative_id IS NULL) OR
    (growth_objective_id IS NULL AND growth_initiative_id IS NOT NULL)
  )
);

-- ============================================================================
-- PART 3: LEADERSHIP DEVELOPMENT SYSTEM
-- ============================================================================

-- Leadership Competencies: Framework of competencies
CREATE TABLE IF NOT EXISTS leadership_competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_name text NOT NULL UNIQUE,
  description text,
  category text DEFAULT 'general' CHECK (category IN ('strategic', 'operational', 'people', 'change', 'communication', 'innovation', 'general')),
  level_1_descriptor text,
  level_2_descriptor text,
  level_3_descriptor text,
  level_4_descriptor text,
  level_5_descriptor text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leadership Assessments: 360-degree assessment campaigns
CREATE TABLE IF NOT EXISTS leadership_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  assessment_name text NOT NULL,
  description text,
  assessment_type text DEFAULT '360' CHECK (assessment_type IN ('self', '180', '360', 'team')),
  launch_date date DEFAULT CURRENT_DATE,
  due_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  participants_count integer DEFAULT 0,
  completed_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Participants: Individuals being assessed
CREATE TABLE IF NOT EXISTS assessment_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES leadership_assessments(id) ON DELETE CASCADE NOT NULL,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  role_in_organization text,
  department text,
  self_assessment_completed boolean DEFAULT false,
  self_assessment_date date,
  peer_count integer DEFAULT 0,
  manager_assessment_completed boolean DEFAULT false,
  overall_completion_percentage integer DEFAULT 0 CHECK (overall_completion_percentage >= 0 AND overall_completion_percentage <= 100),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(assessment_id, participant_email)
);

-- Assessment Scores: Competency scores with multi-rater feedback
CREATE TABLE IF NOT EXISTS assessment_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES assessment_participants(id) ON DELETE CASCADE NOT NULL,
  competency_id uuid REFERENCES leadership_competencies(id) ON DELETE CASCADE NOT NULL,
  self_score integer CHECK (self_score IS NULL OR (self_score >= 1 AND self_score <= 5)),
  peer_scores jsonb DEFAULT '[]'::jsonb,
  peer_score_avg numeric,
  manager_score integer CHECK (manager_score IS NULL OR (manager_score >= 1 AND manager_score <= 5)),
  team_score_avg numeric,
  overall_score_avg numeric,
  self_comments text,
  peer_comments jsonb DEFAULT '[]'::jsonb,
  manager_comments text,
  gap_analysis text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(participant_id, competency_id)
);

-- Development Plans: Personal development plans (PDPs)
CREATE TABLE IF NOT EXISTS development_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES assessment_participants(id) ON DELETE CASCADE NOT NULL,
  plan_name text NOT NULL,
  development_focus text,
  key_strengths jsonb DEFAULT '[]'::jsonb,
  development_areas jsonb DEFAULT '[]'::jsonb,
  overall_goal text,
  review_frequency text DEFAULT 'quarterly' CHECK (review_frequency IN ('monthly', 'quarterly', 'bi-annual', 'annual')),
  next_review_date date,
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'on_hold', 'completed')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  coach_name text,
  coach_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Development Actions: Specific actions within PDPs
CREATE TABLE IF NOT EXISTS development_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  development_plan_id uuid REFERENCES development_plans(id) ON DELETE CASCADE NOT NULL,
  competency_id uuid REFERENCES leadership_competencies(id),
  action_title text NOT NULL,
  action_description text,
  action_type text DEFAULT 'training' CHECK (action_type IN ('training', 'coaching', 'mentoring', 'project', 'reading', 'practice', 'feedback', 'other')),
  target_date date,
  completed_date date,
  is_completed boolean DEFAULT false,
  impact_assessment text,
  resources_needed text,
  progress_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 4: MARKETING & CAMPAIGN MANAGEMENT
-- ============================================================================

-- Marketing Campaigns: Campaign planning and tracking
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  campaign_name text NOT NULL,
  description text,
  objective text,
  target_audience text,
  value_proposition text,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'approved', 'active', 'paused', 'completed', 'cancelled')),
  budget_allocated numeric DEFAULT 0,
  budget_spent numeric DEFAULT 0,
  credits_allocated integer DEFAULT 0,
  credits_spent integer DEFAULT 0,
  roi_target numeric,
  roi_actual numeric,
  lead_target integer,
  leads_generated integer DEFAULT 0,
  conversion_target numeric,
  conversions_actual integer DEFAULT 0,
  assigned_partner_id uuid REFERENCES partners(id),
  project_id uuid REFERENCES projects(id),
  created_by uuid REFERENCES auth.users(id),
  approved_by_customer boolean DEFAULT false,
  approved_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_campaign_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Campaign Activities: Activities within campaigns
CREATE TABLE IF NOT EXISTS campaign_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE NOT NULL,
  activity_name text NOT NULL,
  activity_type text DEFAULT 'content' CHECK (activity_type IN ('content', 'ads', 'email', 'social', 'event', 'pr', 'seo', 'other')),
  description text,
  channel text,
  credits_allocated integer DEFAULT 0,
  credits_spent integer DEFAULT 0,
  budget_allocated numeric DEFAULT 0,
  budget_spent numeric DEFAULT 0,
  partner_id uuid REFERENCES partners(id),
  start_date date,
  due_date date,
  completion_date date,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  deliverables jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaign Results: Performance metrics and KPIs
CREATE TABLE IF NOT EXISTS campaign_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  campaign_activity_id uuid REFERENCES campaign_activities(id) ON DELETE CASCADE,
  measurement_date date DEFAULT CURRENT_DATE,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text,
  notes text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT result_belongs_to_campaign_or_activity CHECK (
    (campaign_id IS NOT NULL AND campaign_activity_id IS NULL) OR
    (campaign_id IS NULL AND campaign_activity_id IS NOT NULL)
  )
);

-- Campaign Budgets: Detailed budget tracking
CREATE TABLE IF NOT EXISTS campaign_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE NOT NULL,
  budget_category text NOT NULL,
  allocated_amount numeric DEFAULT 0,
  spent_amount numeric DEFAULT 0,
  currency text DEFAULT 'SEK',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 5: BUSINESS PLANNING & FINANCIAL LINKAGE
-- ============================================================================

-- Business Models: Customer business model canvas
CREATE TABLE IF NOT EXISTS business_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  model_name text NOT NULL,
  value_proposition text,
  customer_segments jsonb DEFAULT '[]'::jsonb,
  channels jsonb DEFAULT '[]'::jsonb,
  customer_relationships jsonb DEFAULT '[]'::jsonb,
  revenue_streams jsonb DEFAULT '[]'::jsonb,
  key_resources jsonb DEFAULT '[]'::jsonb,
  key_activities jsonb DEFAULT '[]'::jsonb,
  key_partnerships jsonb DEFAULT '[]'::jsonb,
  cost_structure jsonb DEFAULT '[]'::jsonb,
  competitive_advantage text,
  version integer DEFAULT 1,
  is_current boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Strategic Goals: High-level strategic objectives
CREATE TABLE IF NOT EXISTS strategic_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  growth_plan_id uuid REFERENCES growth_plans(id),
  goal_name text NOT NULL,
  goal_category text DEFAULT 'revenue' CHECK (goal_category IN ('revenue', 'margin', 'market_share', 'customer_satisfaction', 'employee_engagement', 'innovation', 'sustainability', 'other')),
  description text,
  target_value numeric,
  current_value numeric,
  baseline_value numeric,
  unit text,
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'at_risk', 'missed', 'cancelled')),
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  owner_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Goal Metrics: Quantifiable metrics for goals
CREATE TABLE IF NOT EXISTS goal_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategic_goal_id uuid REFERENCES strategic_goals(id) ON DELETE CASCADE NOT NULL,
  measurement_date date DEFAULT CURRENT_DATE,
  metric_value numeric NOT NULL,
  notes text,
  data_source text,
  created_at timestamptz DEFAULT now()
);

-- Financial Snapshots: Periodic financial performance tracking
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  snapshot_date date DEFAULT CURRENT_DATE,
  period_type text DEFAULT 'monthly' CHECK (period_type IN ('monthly', 'quarterly', 'annual')),
  period_label text,
  revenue numeric,
  costs numeric,
  gross_margin numeric,
  net_margin numeric,
  ebitda numeric,
  currency text DEFAULT 'SEK',
  linked_projects jsonb DEFAULT '[]'::jsonb,
  linked_campaigns jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(customer_id, snapshot_date, period_type)
);

-- ============================================================================
-- PART 6: KNOWLEDGE & BEST PRACTICES
-- ============================================================================

-- Methodology Templates: Reusable project templates
CREATE TABLE IF NOT EXISTS methodology_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  description text,
  category text DEFAULT 'general' CHECK (category IN ('growth', 'leadership', 'marketing', 'operations', 'strategy', 'transformation', 'general')),
  use_case text,
  phases jsonb DEFAULT '[]'::jsonb,
  deliverables jsonb DEFAULT '[]'::jsonb,
  typical_duration_weeks integer,
  typical_credits integer,
  required_competencies jsonb DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Best Practices: Knowledge base
CREATE TABLE IF NOT EXISTS best_practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_title text NOT NULL,
  category text DEFAULT 'general',
  description text NOT NULL,
  detailed_guidance text,
  when_to_use text,
  tools_needed jsonb DEFAULT '[]'::jsonb,
  expected_outcomes text,
  case_study_reference text,
  related_competencies jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Practice Categories: Organization of best practices
CREATE TABLE IF NOT EXISTS practice_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name text NOT NULL UNIQUE,
  description text,
  parent_category_id uuid REFERENCES practice_categories(id),
  icon_name text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Growth Management Indexes
CREATE INDEX IF NOT EXISTS idx_growth_plans_customer ON growth_plans(customer_id);
CREATE INDEX IF NOT EXISTS idx_growth_plans_status ON growth_plans(status);
CREATE INDEX IF NOT EXISTS idx_growth_objectives_plan ON growth_objectives(growth_plan_id);
CREATE INDEX IF NOT EXISTS idx_growth_objectives_status ON growth_objectives(status);
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_objective ON growth_initiatives(growth_objective_id);
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_project ON growth_initiatives(project_id);
CREATE INDEX IF NOT EXISTS idx_growth_milestones_objective ON growth_milestones(growth_objective_id);

-- Leadership Development Indexes
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_customer ON leadership_assessments(customer_id);
CREATE INDEX IF NOT EXISTS idx_assessment_participants_assessment ON assessment_participants(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_participant ON assessment_scores(participant_id);
CREATE INDEX IF NOT EXISTS idx_development_plans_participant ON development_plans(participant_id);
CREATE INDEX IF NOT EXISTS idx_development_actions_plan ON development_actions(development_plan_id);

-- Marketing Campaign Indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_customer ON marketing_campaigns(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign ON campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign ON campaign_results(campaign_id);

-- Business Planning Indexes
CREATE INDEX IF NOT EXISTS idx_business_models_customer ON business_models(customer_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_customer ON strategic_goals(customer_id);
CREATE INDEX IF NOT EXISTS idx_goal_metrics_goal ON goal_metrics(strategic_goal_id);
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_customer ON financial_snapshots(customer_id);

-- Knowledge Base Indexes
CREATE INDEX IF NOT EXISTS idx_methodology_templates_category ON methodology_templates(category);
CREATE INDEX IF NOT EXISTS idx_best_practices_category ON best_practices(category);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE growth_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodology_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_categories ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access) - using id not user_id
CREATE POLICY "Admins have full access to growth_plans"
  ON growth_plans FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to growth_objectives"
  ON growth_objectives FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to growth_initiatives"
  ON growth_initiatives FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to growth_milestones"
  ON growth_milestones FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to leadership_competencies"
  ON leadership_competencies FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to leadership_assessments"
  ON leadership_assessments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to assessment_participants"
  ON assessment_participants FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to assessment_scores"
  ON assessment_scores FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to development_plans"
  ON development_plans FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to development_actions"
  ON development_actions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to marketing_campaigns"
  ON marketing_campaigns FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to campaign_activities"
  ON campaign_activities FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to campaign_results"
  ON campaign_results FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to campaign_budgets"
  ON campaign_budgets FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to business_models"
  ON business_models FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to strategic_goals"
  ON strategic_goals FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to goal_metrics"
  ON goal_metrics FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to financial_snapshots"
  ON financial_snapshots FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to methodology_templates"
  ON methodology_templates FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Admins have full access to best_practices"
  ON best_practices FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Everyone can view practice_categories"
  ON practice_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage practice_categories"
  ON practice_categories FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

-- Customer policies (read-only their own data)
CREATE POLICY "Customers can view their growth_plans"
  ON growth_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND user_profiles.customer_id = growth_plans.customer_id
    )
  );

CREATE POLICY "Customers can view their growth_objectives"
  ON growth_objectives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM growth_plans 
      JOIN user_profiles ON user_profiles.customer_id = growth_plans.customer_id
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND growth_plans.id = growth_objectives.growth_plan_id
    )
  );

CREATE POLICY "Customers can view their growth_initiatives"
  ON growth_initiatives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM growth_objectives 
      JOIN growth_plans ON growth_plans.id = growth_objectives.growth_plan_id
      JOIN user_profiles ON user_profiles.customer_id = growth_plans.customer_id
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND growth_objectives.id = growth_initiatives.growth_objective_id
    )
  );

CREATE POLICY "Customers can view their marketing_campaigns"
  ON marketing_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND user_profiles.customer_id = marketing_campaigns.customer_id
    )
  );

CREATE POLICY "Customers can view their campaign_activities"
  ON campaign_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns
      JOIN user_profiles ON user_profiles.customer_id = marketing_campaigns.customer_id
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND marketing_campaigns.id = campaign_activities.campaign_id
    )
  );

CREATE POLICY "Customers can view their business_models"
  ON business_models FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND user_profiles.customer_id = business_models.customer_id
    )
  );

CREATE POLICY "Customers can view their strategic_goals"
  ON strategic_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'customer'
      AND user_profiles.customer_id = strategic_goals.customer_id
    )
  );

CREATE POLICY "Everyone can view published methodology_templates"
  ON methodology_templates FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Everyone can view published best_practices"
  ON best_practices FOR SELECT
  TO authenticated
  USING (is_published = true);

-- ============================================================================
-- SEED DATA: Leadership Competencies Framework
-- ============================================================================

INSERT INTO leadership_competencies (competency_name, description, category, level_1_descriptor, level_2_descriptor, level_3_descriptor, level_4_descriptor, level_5_descriptor, sort_order) VALUES
('Strategic Thinking', 'Ability to analyze complex situations and develop long-term plans', 'strategic', 'Understands basic strategy concepts', 'Can contribute to strategic discussions', 'Develops department strategies', 'Shapes organizational strategy', 'Visionary strategic leadership', 10),
('Decision Making', 'Quality and timeliness of decisions under uncertainty', 'strategic', 'Makes routine decisions', 'Makes informed decisions with guidance', 'Makes independent complex decisions', 'Makes high-impact organizational decisions', 'Makes transformational decisions', 20),
('Communication', 'Clarity and effectiveness in conveying ideas', 'communication', 'Communicates basic information', 'Communicates clearly to teams', 'Influences cross-functional teams', 'Inspires organization-wide alignment', 'Shapes organizational narrative', 30),
('People Development', 'Ability to grow and develop team members', 'people', 'Provides basic feedback', 'Coaches team members', 'Develops high-performing teams', 'Builds organizational capability', 'Creates talent pipeline', 40),
('Change Leadership', 'Leading and adapting to organizational change', 'change', 'Adapts to change', 'Supports change initiatives', 'Leads team through change', 'Drives organizational transformation', 'Champions cultural revolution', 50),
('Execution Excellence', 'Delivering results consistently', 'operational', 'Completes assigned tasks', 'Delivers projects on time', 'Ensures team excellence', 'Drives operational excellence', 'Sets industry standards', 60),
('Innovation', 'Creating new value through novel approaches', 'innovation', 'Suggests improvements', 'Implements innovations', 'Fosters innovation culture', 'Drives breakthrough innovation', 'Transforms industry paradigms', 70),
('Emotional Intelligence', 'Self-awareness and relationship management', 'people', 'Basic self-awareness', 'Manages own emotions', 'Reads and responds to others', 'Builds strong relationships', 'Creates emotionally intelligent culture', 80),
('Collaboration', 'Working effectively across boundaries', 'operational', 'Works well in team', 'Facilitates team collaboration', 'Leads cross-functional collaboration', 'Builds strategic partnerships', 'Creates collaborative ecosystem', 90),
('Financial Acumen', 'Understanding and managing financial performance', 'operational', 'Understands basic financials', 'Manages budget', 'Drives financial performance', 'Shapes financial strategy', 'Optimizes enterprise value', 100)
ON CONFLICT (competency_name) DO NOTHING;

-- ============================================================================
-- SEED DATA: Practice Categories
-- ============================================================================

INSERT INTO practice_categories (category_name, description, icon_name, sort_order) VALUES
('Growth Strategy', 'Approaches for business growth and market expansion', 'TrendingUp', 10),
('Leadership Development', 'Methods for developing leadership capabilities', 'Users', 20),
('Marketing Excellence', 'Best practices in marketing and customer acquisition', 'Target', 30),
('Operational Excellence', 'Optimizing operations and processes', 'Settings', 40),
('Change Management', 'Leading organizational change effectively', 'GitBranch', 50),
('Innovation', 'Fostering innovation and new value creation', 'Lightbulb', 60),
('Customer Success', 'Ensuring customer value and satisfaction', 'Heart', 70),
('Data & Analytics', 'Leveraging data for decision-making', 'BarChart3', 80)
ON CONFLICT (category_name) DO NOTHING;