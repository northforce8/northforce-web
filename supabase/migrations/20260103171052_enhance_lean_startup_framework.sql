/*
  # Enhance Lean Startup Methodology Framework

  This migration enhances the existing Lean Startup framework with:
  - Build-Measure-Learn cycle tracking
  - MVP feature management
  - Metrics and KPIs
  - Pivot decision tracking
  - Customer segment analysis
  - AI-powered insights and recommendations
  - Automated functions and calculations

  ## Changes
  1. Extend `lean_experiments` with comprehensive fields
  2. Extend `lean_hypotheses` with validation tracking
  3. Add `lean_mvp_features` table for feature management
  4. Add `lean_metrics` table for KPI tracking
  5. Add `lean_pivot_decisions` table for pivot tracking
  6. Add automated functions and triggers
*/

-- Add columns to existing experiments table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'business_model_id') THEN
    ALTER TABLE lean_experiments ADD COLUMN business_model_id uuid REFERENCES business_models(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'hypothesis_type') THEN
    ALTER TABLE lean_experiments ADD COLUMN hypothesis_type text DEFAULT 'problem' CHECK (hypothesis_type IN ('problem', 'solution', 'customer', 'channel', 'revenue'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'current_cycle') THEN
    ALTER TABLE lean_experiments ADD COLUMN current_cycle text DEFAULT 'build' CHECK (current_cycle IN ('build', 'measure', 'learn'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'cycle_count') THEN
    ALTER TABLE lean_experiments ADD COLUMN cycle_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'validated_learning') THEN
    ALTER TABLE lean_experiments ADD COLUMN validated_learning text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'pivot_or_persevere') THEN
    ALTER TABLE lean_experiments ADD COLUMN pivot_or_persevere text CHECK (pivot_or_persevere IN ('persevere', 'pivot', 'undecided'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'success_metrics') THEN
    ALTER TABLE lean_experiments ADD COLUMN success_metrics jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'actual_results') THEN
    ALTER TABLE lean_experiments ADD COLUMN actual_results jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'customer_segments') THEN
    ALTER TABLE lean_experiments ADD COLUMN customer_segments text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'ai_insights') THEN
    ALTER TABLE lean_experiments ADD COLUMN ai_insights text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'ai_recommendations') THEN
    ALTER TABLE lean_experiments ADD COLUMN ai_recommendations text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'ai_risk_assessment') THEN
    ALTER TABLE lean_experiments ADD COLUMN ai_risk_assessment text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'ai_last_analyzed') THEN
    ALTER TABLE lean_experiments ADD COLUMN ai_last_analyzed timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'budget_allocated') THEN
    ALTER TABLE lean_experiments ADD COLUMN budget_allocated numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_experiments' AND column_name = 'budget_spent') THEN
    ALTER TABLE lean_experiments ADD COLUMN budget_spent numeric DEFAULT 0;
  END IF;
END $$;

-- Add columns to existing hypotheses table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'hypothesis_category') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN hypothesis_category text DEFAULT 'assumption' CHECK (hypothesis_category IN ('assumption', 'riskiest', 'leap_of_faith', 'validated'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'priority') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'test_duration_days') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN test_duration_days integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'sample_size_target') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN sample_size_target integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'sample_size_actual') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN sample_size_actual integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'metric_name') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN metric_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'metric_target') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN metric_target numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_hypotheses' AND column_name = 'metric_actual') THEN
    ALTER TABLE lean_hypotheses ADD COLUMN metric_actual numeric;
  END IF;
END $$;

-- Create MVP features table
CREATE TABLE IF NOT EXISTS lean_mvp_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES lean_experiments(id) ON DELETE CASCADE,
  feature_name text NOT NULL,
  feature_description text DEFAULT '',
  feature_type text NOT NULL DEFAULT 'core' CHECK (feature_type IN ('core', 'nice_to_have', 'differentiator', 'must_have')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  effort_estimate text DEFAULT 'medium' CHECK (effort_estimate IN ('low', 'medium', 'high')),
  expected_impact text DEFAULT 'medium' CHECK (expected_impact IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_development', 'testing', 'released', 'removed')),
  user_feedback_score numeric CHECK (user_feedback_score >= 1 AND user_feedback_score <= 5),
  usage_percentage numeric DEFAULT 0 CHECK (usage_percentage >= 0 AND usage_percentage <= 100),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create metrics table
CREATE TABLE IF NOT EXISTS lean_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES lean_experiments(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_description text DEFAULT '',
  metric_type text NOT NULL CHECK (metric_type IN ('actionable', 'vanity', 'pirate')),
  pirate_stage text CHECK (pirate_stage IN ('acquisition', 'activation', 'retention', 'revenue', 'referral')),
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0,
  unit text,
  measurement_frequency text DEFAULT 'daily' CHECK (measurement_frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
  is_north_star boolean DEFAULT false,
  trend text DEFAULT 'stable' CHECK (trend IN ('improving', 'stable', 'declining')),
  last_measured_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pivot decisions table
CREATE TABLE IF NOT EXISTS lean_pivot_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES lean_experiments(id) ON DELETE CASCADE,
  decision_date date NOT NULL DEFAULT CURRENT_DATE,
  pivot_type text NOT NULL CHECK (pivot_type IN (
    'zoom_in',           -- Focus on one feature that was previously just a feature
    'zoom_out',          -- Single feature becomes one of many
    'customer_segment',  -- Change target customer
    'customer_need',     -- Change the problem being solved
    'platform',          -- Change from app to platform or vice versa
    'business_architecture', -- High margin/low volume to low margin/high volume
    'value_capture',     -- Change how you monetize
    'engine_of_growth',  -- Change growth strategy
    'channel',           -- Change distribution channel
    'technology'         -- Different technology to achieve same solution
  )),
  rationale text NOT NULL,
  data_supporting jsonb DEFAULT '{}',
  expected_outcome text,
  actual_outcome text,
  success boolean,
  lessons_learned text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer segment analysis table
CREATE TABLE IF NOT EXISTS lean_customer_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES lean_experiments(id) ON DELETE CASCADE,
  segment_name text NOT NULL,
  segment_description text DEFAULT '',
  segment_size_estimate integer,
  is_early_adopter boolean DEFAULT false,
  pain_level text CHECK (pain_level IN ('low', 'medium', 'high', 'critical')),
  willingness_to_pay text CHECK (willingness_to_pay IN ('low', 'medium', 'high')),
  acquisition_cost numeric,
  lifetime_value numeric,
  engagement_score numeric CHECK (engagement_score >= 0 AND engagement_score <= 100),
  retention_rate numeric CHECK (retention_rate >= 0 AND retention_rate <= 100),
  key_characteristics jsonb DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lean_mvp_features_experiment ON lean_mvp_features(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_mvp_features_status ON lean_mvp_features(status) WHERE status IN ('in_development', 'testing');
CREATE INDEX IF NOT EXISTS idx_lean_metrics_experiment ON lean_metrics(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_metrics_north_star ON lean_metrics(is_north_star) WHERE is_north_star = true;
CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_experiment ON lean_pivot_decisions(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_customer_segments_experiment ON lean_customer_segments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_status ON lean_experiments(status) WHERE status IN ('planning', 'running');
CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_validated ON lean_hypotheses(is_validated) WHERE is_validated IS NOT NULL;

-- Function to calculate experiment progress
CREATE OR REPLACE FUNCTION calculate_lean_experiment_progress(p_experiment_id uuid)
RETURNS integer AS $$
DECLARE
  v_total_hypotheses integer;
  v_tested_hypotheses integer;
  v_progress integer;
BEGIN
  SELECT COUNT(*), COUNT(CASE WHEN is_validated IS NOT NULL THEN 1 END)
  INTO v_total_hypotheses, v_tested_hypotheses
  FROM lean_hypotheses
  WHERE experiment_id = p_experiment_id;

  IF v_total_hypotheses = 0 THEN
    RETURN 0;
  END IF;

  v_progress := ROUND((v_tested_hypotheses::numeric / v_total_hypotheses::numeric) * 100);
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_lean_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lean_mvp_features_updated_at ON lean_mvp_features;
CREATE TRIGGER update_lean_mvp_features_updated_at BEFORE UPDATE ON lean_mvp_features FOR EACH ROW EXECUTE FUNCTION update_lean_updated_at();

DROP TRIGGER IF EXISTS update_lean_metrics_updated_at ON lean_metrics;
CREATE TRIGGER update_lean_metrics_updated_at BEFORE UPDATE ON lean_metrics FOR EACH ROW EXECUTE FUNCTION update_lean_updated_at();

DROP TRIGGER IF EXISTS update_lean_pivot_decisions_updated_at ON lean_pivot_decisions;
CREATE TRIGGER update_lean_pivot_decisions_updated_at BEFORE UPDATE ON lean_pivot_decisions FOR EACH ROW EXECUTE FUNCTION update_lean_updated_at();

DROP TRIGGER IF EXISTS update_lean_customer_segments_updated_at ON lean_customer_segments;
CREATE TRIGGER update_lean_customer_segments_updated_at BEFORE UPDATE ON lean_customer_segments FOR EACH ROW EXECUTE FUNCTION update_lean_updated_at();

-- RLS
ALTER TABLE lean_mvp_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_pivot_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lean_customer_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view MVP features" ON lean_mvp_features FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM lean_experiments WHERE lean_experiments.id = lean_mvp_features.experiment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = lean_experiments.customer_id)
  )));

CREATE POLICY "Admin users can modify MVP features" ON lean_mvp_features FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view metrics" ON lean_metrics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM lean_experiments WHERE lean_experiments.id = lean_metrics.experiment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = lean_experiments.customer_id)
  )));

CREATE POLICY "Admin users can modify metrics" ON lean_metrics FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view pivot decisions" ON lean_pivot_decisions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM lean_experiments WHERE lean_experiments.id = lean_pivot_decisions.experiment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = lean_experiments.customer_id)
  )));

CREATE POLICY "Admin users can modify pivot decisions" ON lean_pivot_decisions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view customer segments" ON lean_customer_segments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM lean_experiments WHERE lean_experiments.id = lean_customer_segments.experiment_id AND (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'customer' AND user_profiles.customer_id = lean_experiments.customer_id)
  )));

CREATE POLICY "Admin users can modify customer segments" ON lean_customer_segments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));
