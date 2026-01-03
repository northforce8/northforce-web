/*
  # Enhance McKinsey 7S Framework System

  This migration enhances the existing McKinsey 7S Framework with:
  - Additional columns for assessments (AI analysis, scoring, metadata)
  - Additional columns for elements (AI insights, maturity levels, priorities)
  - New tables for improvements and element relationships
  - Automated functions for score calculation
  - Enhanced RLS policies

  ## Changes
  1. Extend `mckinsey_7s_assessments` with AI fields and scoring
  2. Extend `mckinsey_7s_elements` with comprehensive analysis fields
  3. Add `mckinsey_7s_improvements` table for action items
  4. Add `mckinsey_7s_element_relationships` table for dependency tracking
  5. Add automated functions and triggers
*/

-- Add columns to existing assessments table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'description') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'status') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'business_model_id') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN business_model_id uuid REFERENCES business_models(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'hard_elements_score') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN hard_elements_score integer DEFAULT 0 CHECK (hard_elements_score >= 0 AND hard_elements_score <= 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'soft_elements_score') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN soft_elements_score integer DEFAULT 0 CHECK (soft_elements_score >= 0 AND soft_elements_score <= 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'ai_overall_analysis') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN ai_overall_analysis text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'ai_recommendations') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN ai_recommendations text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'ai_risk_areas') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN ai_risk_areas text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_assessments' AND column_name = 'ai_last_analyzed') THEN
    ALTER TABLE mckinsey_7s_assessments ADD COLUMN ai_last_analyzed timestamptz;
  END IF;
END $$;

-- Update overall_alignment_score constraint to 0-100 scale
ALTER TABLE mckinsey_7s_assessments DROP CONSTRAINT IF EXISTS mckinsey_7s_assessments_overall_alignment_score_check;
ALTER TABLE mckinsey_7s_assessments ADD CONSTRAINT mckinsey_7s_assessments_overall_alignment_score_check 
  CHECK (overall_alignment_score IS NULL OR (overall_alignment_score >= 0 AND overall_alignment_score <= 100));

-- Add columns to existing elements table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'element_category') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN element_category text NOT NULL DEFAULT 'soft' CHECK (element_category IN ('hard', 'soft'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'gap_analysis') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN gap_analysis text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'maturity_level') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN maturity_level text DEFAULT 'initial' CHECK (maturity_level IN ('initial', 'developing', 'defined', 'managed', 'optimizing'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'status') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN status text NOT NULL DEFAULT 'needs_attention' CHECK (status IN ('aligned', 'partially_aligned', 'needs_attention', 'critical'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'ai_insights') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN ai_insights text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'ai_strengths') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN ai_strengths text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'ai_weaknesses') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN ai_weaknesses text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'ai_improvement_suggestions') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN ai_improvement_suggestions text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'ai_impact_on_other_elements') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN ai_impact_on_other_elements text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'improvement_priority') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN improvement_priority text DEFAULT 'medium' CHECK (improvement_priority IN ('low', 'medium', 'high', 'critical'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'estimated_effort') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN estimated_effort text DEFAULT 'medium' CHECK (estimated_effort IN ('low', 'medium', 'high'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mckinsey_7s_elements' AND column_name = 'notes') THEN
    ALTER TABLE mckinsey_7s_elements ADD COLUMN notes text DEFAULT '';
  END IF;
END $$;

-- Update alignment_score constraint to 0-100 scale
ALTER TABLE mckinsey_7s_elements DROP CONSTRAINT IF EXISTS mckinsey_7s_elements_alignment_score_check;
ALTER TABLE mckinsey_7s_elements ADD CONSTRAINT mckinsey_7s_elements_alignment_score_check 
  CHECK (alignment_score IS NULL OR (alignment_score >= 0 AND alignment_score <= 100));

-- Update element_category for hard elements
UPDATE mckinsey_7s_elements 
SET element_category = 'hard' 
WHERE element_type IN ('strategy', 'structure', 'systems');

-- Create improvements table
CREATE TABLE IF NOT EXISTS mckinsey_7s_improvements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES mckinsey_7s_assessments(id) ON DELETE CASCADE,
  element_type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'improvement' CHECK (category IN ('quick_win', 'improvement', 'strategic', 'risk_mitigation')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  effort_level text DEFAULT 'medium' CHECK (effort_level IN ('low', 'medium', 'high')),
  expected_impact text DEFAULT 'medium' CHECK (expected_impact IN ('low', 'medium', 'high')),
  start_date date,
  target_completion_date date,
  actual_completion_date date,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'blocked', 'completed', 'cancelled')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_name text DEFAULT '',
  elements_affected text[] DEFAULT ARRAY[]::text[],
  success_metrics text DEFAULT '',
  actual_outcomes text DEFAULT '',
  ai_suggested boolean DEFAULT false,
  ai_rationale text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create element relationships table
CREATE TABLE IF NOT EXISTS mckinsey_7s_element_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES mckinsey_7s_assessments(id) ON DELETE CASCADE,
  source_element_type text NOT NULL,
  target_element_type text NOT NULL,
  influence_strength text NOT NULL DEFAULT 'moderate' CHECK (influence_strength IN ('weak', 'moderate', 'strong')),
  relationship_type text NOT NULL DEFAULT 'supportive' CHECK (relationship_type IN ('supportive', 'conflicting', 'dependent', 'neutral')),
  description text DEFAULT '',
  impact_analysis text DEFAULT '',
  ai_relationship_analysis text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(assessment_id, source_element_type, target_element_type)
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assessment ON mckinsey_7s_improvements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_element ON mckinsey_7s_improvements(element_type);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_status ON mckinsey_7s_improvements(status) WHERE status IN ('planned', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_priority ON mckinsey_7s_improvements(priority) WHERE priority IN ('high', 'critical');
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_relationships_assessment ON mckinsey_7s_element_relationships(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_elements_status ON mckinsey_7s_elements(status) WHERE status IN ('needs_attention', 'critical');
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_status ON mckinsey_7s_assessments(status) WHERE status = 'active';

-- Function to calculate alignment scores
CREATE OR REPLACE FUNCTION calculate_mckinsey_7s_alignment_score(p_assessment_id uuid)
RETURNS void AS $$
DECLARE
  v_avg_score numeric;
  v_hard_score numeric;
  v_soft_score numeric;
BEGIN
  SELECT
    AVG(alignment_score),
    AVG(CASE WHEN element_category = 'hard' THEN alignment_score END),
    AVG(CASE WHEN element_category = 'soft' THEN alignment_score END)
  INTO v_avg_score, v_hard_score, v_soft_score
  FROM mckinsey_7s_elements
  WHERE assessment_id = p_assessment_id;

  UPDATE mckinsey_7s_assessments
  SET
    overall_alignment_score = ROUND(COALESCE(v_avg_score, 0)),
    hard_elements_score = ROUND(COALESCE(v_hard_score, 0)),
    soft_elements_score = ROUND(COALESCE(v_soft_score, 0)),
    updated_at = now()
  WHERE id = p_assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update scores
CREATE OR REPLACE FUNCTION trigger_update_mckinsey_7s_scores()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_mckinsey_7s_alignment_score(NEW.assessment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_mckinsey_7s_scores ON mckinsey_7s_elements;
CREATE TRIGGER update_mckinsey_7s_scores
  AFTER INSERT OR UPDATE OF alignment_score ON mckinsey_7s_elements
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_mckinsey_7s_scores();

-- Function to initialize all 7 elements
CREATE OR REPLACE FUNCTION initialize_mckinsey_7s_elements(p_assessment_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO mckinsey_7s_elements (assessment_id, element_type, element_category, current_state)
  VALUES
    (p_assessment_id, 'strategy', 'hard', ''),
    (p_assessment_id, 'structure', 'hard', ''),
    (p_assessment_id, 'systems', 'hard', ''),
    (p_assessment_id, 'shared_values', 'soft', ''),
    (p_assessment_id, 'skills', 'soft', ''),
    (p_assessment_id, 'style', 'soft', ''),
    (p_assessment_id, 'staff', 'soft', '')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize elements
CREATE OR REPLACE FUNCTION trigger_initialize_mckinsey_7s_elements()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM initialize_mckinsey_7s_elements(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS initialize_mckinsey_7s_elements_trigger ON mckinsey_7s_assessments;
CREATE TRIGGER initialize_mckinsey_7s_elements_trigger
  AFTER INSERT ON mckinsey_7s_assessments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_initialize_mckinsey_7s_elements();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_mckinsey_7s_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_mckinsey_7s_improvements_updated_at ON mckinsey_7s_improvements;
CREATE TRIGGER update_mckinsey_7s_improvements_updated_at BEFORE UPDATE ON mckinsey_7s_improvements FOR EACH ROW EXECUTE FUNCTION update_mckinsey_7s_updated_at();

-- RLS for new tables
ALTER TABLE mckinsey_7s_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mckinsey_7s_element_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view improvements" ON mckinsey_7s_improvements FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM mckinsey_7s_assessments WHERE mckinsey_7s_assessments.id = mckinsey_7s_improvements.assessment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = mckinsey_7s_assessments.customer_id)
  )));

CREATE POLICY "Admin users can modify improvements" ON mckinsey_7s_improvements FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view relationships" ON mckinsey_7s_element_relationships FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM mckinsey_7s_assessments WHERE mckinsey_7s_assessments.id = mckinsey_7s_element_relationships.assessment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = mckinsey_7s_assessments.customer_id)
  )));

CREATE POLICY "Admin users can modify relationships" ON mckinsey_7s_element_relationships FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));
