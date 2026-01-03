-- Agile Transformation System

-- Drop existing tables
DROP TABLE IF EXISTS agile_metrics CASCADE;
DROP TABLE IF EXISTS agile_ceremonies CASCADE;
DROP TABLE IF EXISTS agile_maturity_assessments CASCADE;
DROP TABLE IF EXISTS agile_transformation_stages CASCADE;
DROP TABLE IF EXISTS agile_transformations CASCADE;

-- Main transformation table
CREATE TABLE agile_transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  vision text,
  description text,
  framework_type text DEFAULT 'Scrum',
  scope text DEFAULT 'Team',
  status text DEFAULT 'planning',
  overall_progress integer DEFAULT 0,
  start_date date DEFAULT CURRENT_DATE,
  target_completion_date date,
  actual_completion_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stages table
CREATE TABLE agile_transformation_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transformation_id uuid NOT NULL REFERENCES agile_transformations(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_order integer NOT NULL,
  status text DEFAULT 'not_started',
  progress_percentage integer DEFAULT 0,
  description text,
  key_activities jsonb DEFAULT '[]'::jsonb,
  barriers jsonb DEFAULT '[]'::jsonb,
  success_criteria jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(transformation_id, stage_order)
);

-- Maturity assessments table
CREATE TABLE agile_maturity_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transformation_id uuid NOT NULL REFERENCES agile_transformations(id) ON DELETE CASCADE,
  assessment_date date DEFAULT CURRENT_DATE,
  team_name text,
  maturity_level integer DEFAULT 1,
  technical_practices_score integer DEFAULT 0,
  collaboration_score integer DEFAULT 0,
  delivery_speed_score integer DEFAULT 0,
  quality_score integer DEFAULT 0,
  customer_focus_score integer DEFAULT 0,
  continuous_improvement_score integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  strengths jsonb DEFAULT '[]'::jsonb,
  areas_for_improvement jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ceremonies table
CREATE TABLE agile_ceremonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transformation_id uuid NOT NULL REFERENCES agile_transformations(id) ON DELETE CASCADE,
  ceremony_type text NOT NULL,
  team_name text,
  frequency text DEFAULT 'weekly',
  duration_minutes integer DEFAULT 60,
  participants jsonb DEFAULT '[]'::jsonb,
  effectiveness_score integer DEFAULT 0,
  last_conducted_date date,
  next_scheduled_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Metrics table
CREATE TABLE agile_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transformation_id uuid NOT NULL REFERENCES agile_transformations(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_category text DEFAULT 'speed',
  current_value decimal(10,2),
  target_value decimal(10,2),
  unit text,
  measurement_date date DEFAULT CURRENT_DATE,
  trend text DEFAULT 'stable',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agile_transformations_customer ON agile_transformations(customer_id);
CREATE INDEX idx_agile_transformations_status ON agile_transformations(status);
CREATE INDEX idx_agile_transformation_stages_transformation ON agile_transformation_stages(transformation_id);
CREATE INDEX idx_agile_maturity_assessments_transformation ON agile_maturity_assessments(transformation_id);
CREATE INDEX idx_agile_ceremonies_transformation ON agile_ceremonies(transformation_id);
CREATE INDEX idx_agile_metrics_transformation ON agile_metrics(transformation_id);

-- Enable RLS
ALTER TABLE agile_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_transformation_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_maturity_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_ceremonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agile_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "auth_select_transformations" ON agile_transformations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_transformations" ON agile_transformations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_transformations" ON agile_transformations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_transformations" ON agile_transformations FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_stages" ON agile_transformation_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_stages" ON agile_transformation_stages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_stages" ON agile_transformation_stages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_stages" ON agile_transformation_stages FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_assessments" ON agile_maturity_assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_assessments" ON agile_maturity_assessments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_assessments" ON agile_maturity_assessments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_assessments" ON agile_maturity_assessments FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_ceremonies" ON agile_ceremonies FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_ceremonies" ON agile_ceremonies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_ceremonies" ON agile_ceremonies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_ceremonies" ON agile_ceremonies FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_metrics" ON agile_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_metrics" ON agile_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_metrics" ON agile_metrics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_metrics" ON agile_metrics FOR DELETE TO authenticated USING (true);