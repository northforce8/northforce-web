/*
  # Enhance Design Thinking Framework

  This migration enhances the existing Design Thinking framework with:
  - Enhanced project tracking with timeline and objectives
  - User personas and empathy maps
  - Journey mapping
  - Comprehensive ideation tracking
  - Prototype management and versioning
  - User testing and feedback collection
  - AI-powered insights and recommendations
  - Automated functions and calculations

  ## Changes
  1. Extend `design_thinking_projects` with comprehensive fields
  2. Extend `dt_phases` with detailed tracking
  3. Extend `dt_insights` with categorization
  4. Add `dt_personas` table for user persona management
  5. Add `dt_empathy_maps` table for empathy mapping
  6. Add `dt_journey_maps` table for user journey tracking
  7. Add `dt_ideas` table for ideation management
  8. Add `dt_prototypes` table for prototype versioning
  9. Add `dt_user_tests` table for user testing
  10. Add automated functions and triggers
*/

-- Extend design_thinking_projects table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'business_model_id') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN business_model_id uuid REFERENCES business_models(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'project_objective') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN project_objective text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'start_date') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN start_date date DEFAULT CURRENT_DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'target_completion_date') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN target_completion_date date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'actual_completion_date') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN actual_completion_date date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'budget') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN budget numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'spent') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN spent numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'success_metrics') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN success_metrics jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'stakeholders') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN stakeholders text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'constraints') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN constraints text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'ai_insights') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN ai_insights text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'ai_recommendations') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN ai_recommendations text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'ai_risk_assessment') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN ai_risk_assessment text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'ai_last_analyzed') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN ai_last_analyzed timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_thinking_projects' AND column_name = 'overall_progress') THEN
    ALTER TABLE design_thinking_projects ADD COLUMN overall_progress integer DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100);
  END IF;
END $$;

-- Extend dt_phases table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'phase_objective') THEN
    ALTER TABLE dt_phases ADD COLUMN phase_objective text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'methods_used') THEN
    ALTER TABLE dt_phases ADD COLUMN methods_used text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'participants_count') THEN
    ALTER TABLE dt_phases ADD COLUMN participants_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'duration_hours') THEN
    ALTER TABLE dt_phases ADD COLUMN duration_hours numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'learnings') THEN
    ALTER TABLE dt_phases ADD COLUMN learnings text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'challenges') THEN
    ALTER TABLE dt_phases ADD COLUMN challenges text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_phases' AND column_name = 'next_steps') THEN
    ALTER TABLE dt_phases ADD COLUMN next_steps text DEFAULT '';
  END IF;
END $$;

-- Extend dt_insights table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_insights' AND column_name = 'source') THEN
    ALTER TABLE dt_insights ADD COLUMN source text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_insights' AND column_name = 'related_persona_id') THEN
    ALTER TABLE dt_insights ADD COLUMN related_persona_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_insights' AND column_name = 'is_actionable') THEN
    ALTER TABLE dt_insights ADD COLUMN is_actionable boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_insights' AND column_name = 'action_taken') THEN
    ALTER TABLE dt_insights ADD COLUMN action_taken text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dt_insights' AND column_name = 'tags') THEN
    ALTER TABLE dt_insights ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create personas table
CREATE TABLE IF NOT EXISTS dt_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  persona_name text NOT NULL,
  persona_type text DEFAULT 'user' CHECK (persona_type IN ('user', 'customer', 'stakeholder', 'anti_persona')),
  age_range text,
  occupation text,
  background text DEFAULT '',
  goals text[] DEFAULT ARRAY[]::text[],
  frustrations text[] DEFAULT ARRAY[]::text[],
  motivations text[] DEFAULT ARRAY[]::text[],
  behaviors text[] DEFAULT ARRAY[]::text[],
  tech_savviness text CHECK (tech_savviness IN ('novice', 'intermediate', 'advanced', 'expert')),
  quote text,
  is_primary boolean DEFAULT false,
  avatar_url text,
  demographics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create empathy maps table
CREATE TABLE IF NOT EXISTS dt_empathy_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  persona_id uuid REFERENCES dt_personas(id) ON DELETE SET NULL,
  map_name text NOT NULL,
  says text[] DEFAULT ARRAY[]::text[],
  thinks text[] DEFAULT ARRAY[]::text[],
  does text[] DEFAULT ARRAY[]::text[],
  feels text[] DEFAULT ARRAY[]::text[],
  pains text[] DEFAULT ARRAY[]::text[],
  gains text[] DEFAULT ARRAY[]::text[],
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journey maps table
CREATE TABLE IF NOT EXISTS dt_journey_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  persona_id uuid REFERENCES dt_personas(id) ON DELETE SET NULL,
  journey_name text NOT NULL,
  scenario text NOT NULL,
  stages jsonb DEFAULT '[]',
  touchpoints jsonb DEFAULT '[]',
  pain_points jsonb DEFAULT '[]',
  opportunities jsonb DEFAULT '[]',
  emotions_chart jsonb DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ideas table
CREATE TABLE IF NOT EXISTS dt_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  idea_title text NOT NULL,
  idea_description text NOT NULL,
  category text CHECK (category IN ('feature', 'service', 'process', 'business_model', 'other')),
  source text,
  feasibility_score integer CHECK (feasibility_score >= 1 AND feasibility_score <= 5),
  desirability_score integer CHECK (desirability_score >= 1 AND desirability_score <= 5),
  viability_score integer CHECK (viability_score >= 1 AND viability_score <= 5),
  effort_estimate text CHECK (effort_estimate IN ('low', 'medium', 'high')),
  impact_estimate text CHECK (impact_estimate IN ('low', 'medium', 'high')),
  status text DEFAULT 'captured' CHECK (status IN ('captured', 'selected', 'prototyping', 'testing', 'implemented', 'rejected')),
  votes integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prototypes table
CREATE TABLE IF NOT EXISTS dt_prototypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES dt_ideas(id) ON DELETE SET NULL,
  prototype_name text NOT NULL,
  prototype_type text NOT NULL CHECK (prototype_type IN ('paper', 'wireframe', 'mockup', 'clickable', 'functional', 'mvp')),
  version text DEFAULT '1.0',
  fidelity text NOT NULL CHECK (fidelity IN ('low', 'medium', 'high')),
  description text DEFAULT '',
  prototype_url text,
  features_included text[] DEFAULT ARRAY[]::text[],
  testing_goals text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'ready_for_testing', 'testing', 'validated', 'rejected', 'archived')),
  feedback_summary text DEFAULT '',
  iteration_count integer DEFAULT 1,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user tests table
CREATE TABLE IF NOT EXISTS dt_user_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES design_thinking_projects(id) ON DELETE CASCADE,
  prototype_id uuid REFERENCES dt_prototypes(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  test_type text NOT NULL CHECK (test_type IN ('usability', 'concept', 'a_b', 'preference', 'card_sorting', 'tree_testing')),
  test_date date DEFAULT CURRENT_DATE,
  participants_count integer DEFAULT 0,
  target_participants integer,
  test_objectives text[] DEFAULT ARRAY[]::text[],
  methodology text,
  key_findings text[] DEFAULT ARRAY[]::text[],
  success_rate numeric CHECK (success_rate >= 0 AND success_rate <= 100),
  satisfaction_score numeric CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  recommendations text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'recruiting', 'in_progress', 'analyzing', 'completed')),
  notes text DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dt_personas_project ON dt_personas(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_personas_primary ON dt_personas(is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_project ON dt_empathy_maps(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_persona ON dt_empathy_maps(persona_id);
CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_project ON dt_journey_maps(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_persona ON dt_journey_maps(persona_id);
CREATE INDEX IF NOT EXISTS idx_dt_ideas_project ON dt_ideas(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_ideas_status ON dt_ideas(status) WHERE status IN ('selected', 'prototyping', 'testing');
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_project ON dt_prototypes(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_idea ON dt_prototypes(idea_id);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_status ON dt_prototypes(status) WHERE status IN ('ready_for_testing', 'testing');
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_project ON dt_user_tests(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_prototype ON dt_user_tests(prototype_id);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_status ON dt_user_tests(status) WHERE status IN ('planning', 'recruiting', 'in_progress');

-- Function to calculate overall project progress
CREATE OR REPLACE FUNCTION calculate_dt_project_progress(p_project_id uuid)
RETURNS integer AS $$
DECLARE
  v_phases_total integer := 5;
  v_phases_completed integer;
  v_progress integer;
BEGIN
  SELECT COUNT(*)
  INTO v_phases_completed
  FROM dt_phases
  WHERE project_id = p_project_id AND completion_status = 'completed';

  v_progress := ROUND((v_phases_completed::numeric / v_phases_total::numeric) * 100);
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_dt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_dt_personas_updated_at ON dt_personas;
CREATE TRIGGER update_dt_personas_updated_at BEFORE UPDATE ON dt_personas FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

DROP TRIGGER IF EXISTS update_dt_empathy_maps_updated_at ON dt_empathy_maps;
CREATE TRIGGER update_dt_empathy_maps_updated_at BEFORE UPDATE ON dt_empathy_maps FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

DROP TRIGGER IF EXISTS update_dt_journey_maps_updated_at ON dt_journey_maps;
CREATE TRIGGER update_dt_journey_maps_updated_at BEFORE UPDATE ON dt_journey_maps FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

DROP TRIGGER IF EXISTS update_dt_ideas_updated_at ON dt_ideas;
CREATE TRIGGER update_dt_ideas_updated_at BEFORE UPDATE ON dt_ideas FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

DROP TRIGGER IF EXISTS update_dt_prototypes_updated_at ON dt_prototypes;
CREATE TRIGGER update_dt_prototypes_updated_at BEFORE UPDATE ON dt_prototypes FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

DROP TRIGGER IF EXISTS update_dt_user_tests_updated_at ON dt_user_tests;
CREATE TRIGGER update_dt_user_tests_updated_at BEFORE UPDATE ON dt_user_tests FOR EACH ROW EXECUTE FUNCTION update_dt_updated_at();

-- RLS Policies
ALTER TABLE dt_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_empathy_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_journey_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dt_user_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view personas" ON dt_personas FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_personas.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify personas" ON dt_personas FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view empathy maps" ON dt_empathy_maps FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_empathy_maps.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify empathy maps" ON dt_empathy_maps FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view journey maps" ON dt_journey_maps FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_journey_maps.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify journey maps" ON dt_journey_maps FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view ideas" ON dt_ideas FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_ideas.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify ideas" ON dt_ideas FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view prototypes" ON dt_prototypes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_prototypes.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify prototypes" ON dt_prototypes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view user tests" ON dt_user_tests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM design_thinking_projects WHERE design_thinking_projects.id = dt_user_tests.project_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = design_thinking_projects.customer_id)
  )));

CREATE POLICY "Admin users can modify user tests" ON dt_user_tests FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));
