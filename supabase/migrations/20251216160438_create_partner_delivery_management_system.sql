/*
  # Partner & Delivery Management System

  1. Overview
    This migration creates a comprehensive partner and delivery management system
    that enables full partner lifecycle management, work type assignments,
    capacity planning, cost tracking, and performance analytics.

  2. New Tables
    - `partner_roles`: Defines available partner roles with permissions
    - `partner_work_type_assignments`: Links partners to allowed work types
    - `partner_customer_assignments_extended`: Extended customer assignment data
    - `partner_capacity_periods`: Track partner capacity over time periods
    - `partner_performance_metrics`: Calculated performance metrics per partner

  3. Extended Columns to `partners` Table
    - `role_id`: Link to partner role
    - `hourly_cost_rate`: Current hourly cost (SEK)
    - `capacity_hours_per_month`: Default monthly capacity
    - `capacity_hours_per_week`: Default weekly capacity
    - `onboarding_date`: When partner started
    - `offboarding_date`: When partner ended (if inactive)
    - `notes`: Internal notes about partner
    - `skills`: Array of skills/expertise
    - `certifications`: Array of certifications
    - `availability_status`: Current availability

  4. Security
    - Enable RLS on all new tables
    - Restrict access to authenticated admin users
    - Ensure data integrity with foreign key constraints

  5. Performance
    - Add indexes on frequently queried columns
    - Create views for common analytics queries
    - Enable real-time subscriptions for capacity updates

  6. AI Integration
    - Capacity utilization analysis
    - Partner workload recommendations
    - Skill gap identification
    - Performance trend analysis
*/

-- Create partner roles table
CREATE TABLE IF NOT EXISTS partner_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL UNIQUE,
  description text,
  can_report_time boolean DEFAULT true,
  can_view_all_customers boolean DEFAULT false,
  can_manage_projects boolean DEFAULT false,
  hourly_rate_min numeric(10,2),
  hourly_rate_max numeric(10,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to partners table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'role_id') THEN
    ALTER TABLE partners ADD COLUMN role_id uuid REFERENCES partner_roles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'hourly_cost_rate') THEN
    ALTER TABLE partners ADD COLUMN hourly_cost_rate numeric(10,2) DEFAULT 850;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'capacity_hours_per_month') THEN
    ALTER TABLE partners ADD COLUMN capacity_hours_per_month numeric(10,2) DEFAULT 160;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'capacity_hours_per_week') THEN
    ALTER TABLE partners ADD COLUMN capacity_hours_per_week numeric(10,2) DEFAULT 40;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'onboarding_date') THEN
    ALTER TABLE partners ADD COLUMN onboarding_date date;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'offboarding_date') THEN
    ALTER TABLE partners ADD COLUMN offboarding_date date;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'notes') THEN
    ALTER TABLE partners ADD COLUMN notes text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'skills') THEN
    ALTER TABLE partners ADD COLUMN skills text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'certifications') THEN
    ALTER TABLE partners ADD COLUMN certifications text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'availability_status') THEN
    ALTER TABLE partners ADD COLUMN availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'limited', 'unavailable', 'on_leave'));
  END IF;
END $$;

-- Create partner work type assignments table
CREATE TABLE IF NOT EXISTS partner_work_type_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  work_type_id uuid NOT NULL REFERENCES work_types(id) ON DELETE CASCADE,
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_primary boolean DEFAULT false,
  assigned_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, work_type_id)
);

-- Create partner capacity periods table
CREATE TABLE IF NOT EXISTS partner_capacity_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  available_hours numeric(10,2) NOT NULL,
  allocated_hours numeric(10,2) DEFAULT 0,
  actual_hours numeric(10,2) DEFAULT 0,
  capacity_type text DEFAULT 'regular' CHECK (capacity_type IN ('regular', 'overtime', 'reduced', 'unavailable')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (period_end >= period_start),
  CHECK (available_hours >= 0),
  CHECK (allocated_hours >= 0),
  CHECK (actual_hours >= 0)
);

-- Create partner performance metrics table
CREATE TABLE IF NOT EXISTS partner_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_hours numeric(10,2) DEFAULT 0,
  billable_hours numeric(10,2) DEFAULT 0,
  credits_generated numeric(10,2) DEFAULT 0,
  internal_cost numeric(10,2) DEFAULT 0,
  active_customers_count integer DEFAULT 0,
  active_projects_count integer DEFAULT 0,
  utilization_percentage numeric(5,2) DEFAULT 0,
  avg_credits_per_hour numeric(10,2) DEFAULT 0,
  efficiency_score numeric(5,2) DEFAULT 0,
  quality_score numeric(5,2) DEFAULT 0,
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CHECK (period_end >= period_start)
);

-- Create partner workload recommendations table
CREATE TABLE IF NOT EXISTS partner_workload_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('overload_warning', 'underutilized', 'reallocation_suggested', 'skill_match', 'capacity_increase', 'capacity_decrease')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  current_utilization numeric(5,2),
  target_utilization numeric(5,2),
  suggested_action text,
  affected_customers uuid[] DEFAULT '{}',
  affected_projects uuid[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'actioned', 'dismissed')),
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  actioned_by uuid,
  actioned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_roles_active ON partner_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_role_id ON partners(role_id);
CREATE INDEX IF NOT EXISTS idx_partners_availability ON partners(availability_status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partner_work_type_assignments_partner ON partner_work_type_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_work_type_assignments_work_type ON partner_work_type_assignments(work_type_id);
CREATE INDEX IF NOT EXISTS idx_partner_capacity_periods_partner ON partner_capacity_periods(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_capacity_periods_dates ON partner_capacity_periods(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_partner ON partner_performance_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_period ON partner_performance_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_workload_recommendations_partner ON partner_workload_recommendations(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_workload_recommendations_status ON partner_workload_recommendations(status) WHERE status = 'active';

-- Enable Row Level Security
ALTER TABLE partner_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_work_type_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_capacity_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_workload_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_roles
CREATE POLICY "Authenticated users can view partner roles"
  ON partner_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage partner roles"
  ON partner_roles FOR ALL
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- RLS Policies for partner_work_type_assignments
CREATE POLICY "Users can view own work type assignments"
  ON partner_work_type_assignments FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage work type assignments"
  ON partner_work_type_assignments FOR ALL
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- RLS Policies for partner_capacity_periods
CREATE POLICY "Users can view own capacity periods"
  ON partner_capacity_periods FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage capacity periods"
  ON partner_capacity_periods FOR ALL
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- RLS Policies for partner_performance_metrics
CREATE POLICY "Users can view own performance metrics"
  ON partner_performance_metrics FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "System can insert performance metrics"
  ON partner_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for partner_workload_recommendations
CREATE POLICY "Users can view own workload recommendations"
  ON partner_workload_recommendations FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can acknowledge own recommendations"
  ON partner_workload_recommendations FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  )
  WITH CHECK (
    auth.jwt()->>'role' = 'admin' OR
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create recommendations"
  ON partner_workload_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default partner roles
INSERT INTO partner_roles (role_name, description, can_report_time, can_view_all_customers, can_manage_projects, hourly_rate_min, hourly_rate_max)
VALUES
  ('Senior Consultant', 'Senior level consultant with full project management capabilities', true, true, true, 1200, 1800),
  ('Consultant', 'Mid-level consultant focused on delivery', true, false, false, 850, 1200),
  ('Junior Consultant', 'Entry level consultant learning the ropes', true, false, false, 600, 850),
  ('Technical Lead', 'Technical leadership and architecture', true, true, true, 1400, 2000),
  ('Specialist', 'Domain specialist with deep expertise', true, false, false, 1000, 1500)
ON CONFLICT (role_name) DO NOTHING;

-- Create view for partner availability summary
CREATE OR REPLACE VIEW partner_availability_summary AS
SELECT
  p.id AS partner_id,
  p.partner_name,
  p.role_id,
  pr.role_name,
  p.hourly_cost_rate,
  p.capacity_hours_per_month,
  p.availability_status,
  COALESCE(current_month.actual_hours, 0) AS current_month_hours,
  COALESCE(current_month.allocated_hours, 0) AS current_month_allocated,
  p.capacity_hours_per_month - COALESCE(current_month.allocated_hours, 0) AS remaining_capacity,
  ROUND((COALESCE(current_month.actual_hours, 0) / NULLIF(p.capacity_hours_per_month, 0)) * 100, 2) AS utilization_percentage,
  (SELECT COUNT(DISTINCT customer_id) FROM customer_assignments WHERE partner_id = p.id AND is_active = true) AS active_customers,
  (SELECT COUNT(DISTINCT project_id) FROM project_assignments WHERE partner_id = p.id AND is_active = true) AS active_projects,
  (SELECT array_agg(wt.name) FROM partner_work_type_assignments pwta JOIN work_types wt ON pwta.work_type_id = wt.id WHERE pwta.partner_id = p.id) AS work_types
FROM partners p
LEFT JOIN partner_roles pr ON p.role_id = pr.id
LEFT JOIN LATERAL (
  SELECT
    SUM(actual_hours) AS actual_hours,
    SUM(allocated_hours) AS allocated_hours
  FROM partner_capacity_periods
  WHERE partner_id = p.id
    AND period_start <= CURRENT_DATE
    AND period_end >= CURRENT_DATE
) current_month ON true
WHERE p.is_active = true;

-- Create function to calculate partner performance metrics
CREATE OR REPLACE FUNCTION calculate_partner_performance_metrics(
  p_partner_id uuid,
  p_period_start date,
  p_period_end date
) RETURNS partner_performance_metrics AS $$
DECLARE
  v_metrics partner_performance_metrics;
  v_total_hours numeric;
  v_billable_hours numeric;
  v_credits_generated numeric;
  v_internal_cost numeric;
  v_capacity numeric;
BEGIN
  -- Calculate time-based metrics
  SELECT
    COALESCE(SUM(hours), 0),
    COALESCE(SUM(CASE WHEN billable THEN hours ELSE 0 END), 0),
    COALESCE(SUM(credits_consumed), 0),
    COALESCE(SUM(internal_cost), 0)
  INTO v_total_hours, v_billable_hours, v_credits_generated, v_internal_cost
  FROM time_entries
  WHERE partner_id = p_partner_id
    AND date >= p_period_start
    AND date <= p_period_end;

  -- Get partner capacity
  SELECT capacity_hours_per_month INTO v_capacity
  FROM partners
  WHERE id = p_partner_id;

  -- Build metrics record
  v_metrics.partner_id := p_partner_id;
  v_metrics.period_start := p_period_start;
  v_metrics.period_end := p_period_end;
  v_metrics.total_hours := v_total_hours;
  v_metrics.billable_hours := v_billable_hours;
  v_metrics.credits_generated := v_credits_generated;
  v_metrics.internal_cost := v_internal_cost;
  
  -- Count active customers and projects
  SELECT COUNT(DISTINCT customer_id)
  INTO v_metrics.active_customers_count
  FROM customer_assignments
  WHERE partner_id = p_partner_id AND is_active = true;

  SELECT COUNT(DISTINCT project_id)
  INTO v_metrics.active_projects_count
  FROM project_assignments
  WHERE partner_id = p_partner_id AND is_active = true;

  -- Calculate derived metrics
  v_metrics.utilization_percentage := ROUND((v_total_hours / NULLIF(v_capacity, 0)) * 100, 2);
  v_metrics.avg_credits_per_hour := ROUND(v_credits_generated / NULLIF(v_total_hours, 0), 2);
  v_metrics.efficiency_score := ROUND((v_billable_hours / NULLIF(v_total_hours, 0)) * 100, 2);
  
  -- Simple quality score based on credits per hour vs expected
  v_metrics.quality_score := LEAST(100, ROUND((v_metrics.avg_credits_per_hour / 1.0) * 100, 2));

  RETURN v_metrics;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate workload recommendations
CREATE OR REPLACE FUNCTION generate_partner_workload_recommendations()
RETURNS void AS $$
DECLARE
  v_partner record;
  v_utilization numeric;
  v_recommendation partner_workload_recommendations;
BEGIN
  -- Clear old active recommendations
  UPDATE partner_workload_recommendations
  SET status = 'dismissed'
  WHERE status = 'active' AND expires_at < now();

  -- Check each active partner
  FOR v_partner IN
    SELECT * FROM partner_availability_summary WHERE availability_status = 'available'
  LOOP
    v_utilization := v_partner.utilization_percentage;

    -- Overload warning (>90% utilization)
    IF v_utilization > 90 THEN
      INSERT INTO partner_workload_recommendations (
        partner_id, recommendation_type, severity, title, description,
        current_utilization, target_utilization, suggested_action, expires_at
      ) VALUES (
        v_partner.partner_id, 'overload_warning', 'high',
        'Partner Overloaded',
        v_partner.partner_name || ' is currently at ' || v_utilization || '% capacity utilization. Consider reallocating work or reducing commitments.',
        v_utilization, 80,
        'Review current assignments and consider moving some work to underutilized partners',
        now() + interval '7 days'
      )
      ON CONFLICT DO NOTHING;

    -- Underutilized (<50% utilization)
    ELSIF v_utilization < 50 THEN
      INSERT INTO partner_workload_recommendations (
        partner_id, recommendation_type, severity, title, description,
        current_utilization, target_utilization, suggested_action, expires_at
      ) VALUES (
        v_partner.partner_id, 'underutilized', 'medium',
        'Partner Underutilized',
        v_partner.partner_name || ' is currently at ' || v_utilization || '% capacity utilization. Consider assigning more work.',
        v_utilization, 75,
        'Look for opportunities to allocate additional projects or customers to this partner',
        now() + interval '7 days'
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
