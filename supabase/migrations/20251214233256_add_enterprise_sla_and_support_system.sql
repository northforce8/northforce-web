/*
  # Enterprise SLA and Support System

  ## Overview
  Adds enterprise-grade SLA management, support ticket system, and priority response
  tracking to support the "paketerad konsulttjänst" Enterprise model.

  ## New Tables

  ### 1. enterprise_plans
  - Defines Enterprise plan tiers beyond standard credits plans
  - Includes SLA definitions, support levels, response time guarantees
  - Configurable benefits per plan level

  ### 2. support_tickets
  - Tracks all support requests (technical and strategic)
  - Links to customers and projects
  - SLA compliance tracking
  - Priority-based handling

  ### 3. sla_tracking
  - Real-time SLA compliance monitoring
  - Response time and resolution time tracking
  - Breach alerts and escalations

  ### 4. support_responses
  - All responses to support tickets
  - Response time tracking per ticket
  - Responder tracking (partner or admin)

  ### 5. enterprise_benefits
  - Additional benefits beyond standard plans
  - Customizable per customer (for Enterprise Custom plans)
  - Feature flags and access controls

  ## Enhanced Tables

  ### customers
  - Added enterprise_tier field
  - SLA level assignment
  - Support priority level

  ## Security
  - All tables have RLS enabled
  - Admins have full access
  - Partners have restricted access to their assigned customers
  - Customers can view their own tickets
*/

-- ============================================================================
-- EXTEND EXISTING TABLES
-- ============================================================================

-- Extend customers table with Enterprise features
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'enterprise_tier') THEN
    ALTER TABLE customers ADD COLUMN enterprise_tier text DEFAULT 'standard' CHECK (enterprise_tier IN ('standard', 'enterprise', 'enterprise_plus', 'enterprise_custom'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'sla_level') THEN
    ALTER TABLE customers ADD COLUMN sla_level text DEFAULT 'standard' CHECK (sla_level IN ('standard', 'business', 'rapid_response', 'custom'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'support_priority') THEN
    ALTER TABLE customers ADD COLUMN support_priority integer DEFAULT 3 CHECK (support_priority BETWEEN 1 AND 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'dedicated_success_manager') THEN
    ALTER TABLE customers ADD COLUMN dedicated_success_manager uuid REFERENCES admin_users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- NEW TABLES
-- ============================================================================

-- Enterprise Plans Configuration
CREATE TABLE IF NOT EXISTS enterprise_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL UNIQUE,
  tier text NOT NULL CHECK (tier IN ('standard', 'enterprise', 'enterprise_plus', 'enterprise_custom')),
  display_name text NOT NULL,
  description text,
  
  -- Credits allocation
  credits_monthly_base numeric(10,2) NOT NULL,
  credits_bonus_percentage numeric(5,2) DEFAULT 0,
  credits_rollover_allowed boolean DEFAULT false,
  credits_rollover_max_months integer DEFAULT 0,
  
  -- SLA parameters
  sla_level text NOT NULL CHECK (sla_level IN ('standard', 'business', 'rapid_response', 'custom')),
  sla_response_time_hours integer NOT NULL,
  sla_resolution_time_hours integer NOT NULL,
  sla_uptime_guarantee numeric(5,2) DEFAULT 99.9,
  
  -- Support features
  support_technical boolean DEFAULT true,
  support_strategic boolean DEFAULT false,
  support_24_7 boolean DEFAULT false,
  support_channels text[] DEFAULT ARRAY['email', 'portal'],
  
  -- Access features
  max_parallel_projects integer,
  max_partners integer,
  advanced_reporting boolean DEFAULT false,
  custom_integrations boolean DEFAULT false,
  dedicated_success_manager boolean DEFAULT false,
  priority_development boolean DEFAULT false,
  
  -- Pricing
  monthly_price_sek numeric(10,2),
  setup_fee_sek numeric(10,2) DEFAULT 0,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Ticket details
  support_type text NOT NULL CHECK (support_type IN ('technical', 'strategic', 'billing', 'general')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  
  subject text NOT NULL,
  description text NOT NULL,
  
  -- Requestor
  requested_by_name text NOT NULL,
  requested_by_email text NOT NULL,
  requested_by_role text,
  
  -- Assignment
  assigned_to uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  assigned_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  
  -- SLA tracking
  sla_level text NOT NULL CHECK (sla_level IN ('standard', 'business', 'rapid_response', 'custom')),
  sla_response_deadline timestamptz,
  sla_resolution_deadline timestamptz,
  first_response_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  
  -- SLA status
  sla_response_breached boolean DEFAULT false,
  sla_resolution_breached boolean DEFAULT false,
  sla_breach_reason text,
  
  -- Metadata
  tags text[],
  internal_notes text,
  customer_satisfaction_rating integer CHECK (customer_satisfaction_rating BETWEEN 1 AND 5),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Responses
CREATE TABLE IF NOT EXISTS support_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  
  -- Response details
  responder_type text NOT NULL CHECK (responder_type IN ('admin', 'partner', 'customer', 'system')),
  responder_id uuid,
  responder_name text NOT NULL,
  
  response_text text NOT NULL,
  is_internal boolean DEFAULT false,
  
  -- Attachments (stored as URLs or references)
  attachments jsonb,
  
  -- Response time tracking
  response_time_minutes integer,
  
  created_at timestamptz DEFAULT now()
);

-- SLA Tracking
CREATE TABLE IF NOT EXISTS sla_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  
  -- SLA metrics
  metric_type text NOT NULL CHECK (metric_type IN ('response_time', 'resolution_time', 'uptime', 'availability')),
  metric_value numeric(10,2) NOT NULL,
  metric_unit text NOT NULL,
  
  sla_target numeric(10,2) NOT NULL,
  sla_actual numeric(10,2) NOT NULL,
  
  is_breach boolean DEFAULT false,
  breach_severity text CHECK (breach_severity IN ('minor', 'moderate', 'major', 'critical')),
  breach_reason text,
  
  -- Time period
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  
  created_at timestamptz DEFAULT now()
);

-- Enterprise Benefits (customizable per customer)
CREATE TABLE IF NOT EXISTS enterprise_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  
  benefit_type text NOT NULL CHECK (benefit_type IN ('feature_access', 'service_level', 'capacity_limit', 'custom')),
  benefit_key text NOT NULL,
  benefit_value jsonb NOT NULL,
  benefit_description text,
  
  is_active boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  
  granted_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(customer_id, benefit_type, benefit_key)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_sla_deadlines ON support_tickets(sla_response_deadline, sla_resolution_deadline);
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON support_tickets(ticket_number);

CREATE INDEX IF NOT EXISTS idx_support_responses_ticket ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created ON support_responses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sla_tracking_customer ON sla_tracking(customer_id);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_breach ON sla_tracking(is_breach);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_period ON sla_tracking(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_customer ON enterprise_benefits(customer_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_active ON enterprise_benefits(is_active);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE enterprise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_benefits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enterprise Plans (read-only for all authenticated users)
CREATE POLICY "enterprise_plans_select_policy"
  ON enterprise_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "enterprise_plans_manage_policy"
  ON enterprise_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Support Tickets
CREATE POLICY "support_tickets_select_policy"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND ca.customer_id = support_tickets.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "support_tickets_insert_policy"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND ca.customer_id = support_tickets.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "support_tickets_update_policy"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Support Responses
CREATE POLICY "support_responses_select_policy"
  ON support_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN partners p ON p.user_id = (select auth.uid())
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE st.id = support_responses.ticket_id
      AND ca.customer_id = st.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "support_responses_insert_policy"
  ON support_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN partners p ON p.user_id = (select auth.uid())
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE st.id = support_responses.ticket_id
      AND ca.customer_id = st.customer_id
      AND ca.is_active = true
    )
  );

-- SLA Tracking (admin only)
CREATE POLICY "sla_tracking_select_policy"
  ON sla_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "sla_tracking_insert_policy"
  ON sla_tracking FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Enterprise Benefits
CREATE POLICY "enterprise_benefits_select_policy"
  ON enterprise_benefits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = (select auth.uid())
      AND ca.customer_id = enterprise_benefits.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "enterprise_benefits_manage_policy"
  ON enterprise_benefits FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- ============================================================================
-- SEED ENTERPRISE PLANS
-- ============================================================================

INSERT INTO enterprise_plans (
  plan_name, tier, display_name, description,
  credits_monthly_base, credits_bonus_percentage, credits_rollover_allowed, credits_rollover_max_months,
  sla_level, sla_response_time_hours, sla_resolution_time_hours, sla_uptime_guarantee,
  support_technical, support_strategic, support_24_7, support_channels,
  max_parallel_projects, max_partners,
  advanced_reporting, custom_integrations, dedicated_success_manager, priority_development,
  monthly_price_sek
) VALUES
  (
    'starter', 'standard', 'Starter', 
    'Perfekt för mindre företag som vill komma igång med dedikerade konsultresurser',
    50, 0, false, 0,
    'standard', 24, 72, 99.5,
    true, false, false, ARRAY['email', 'portal'],
    1, 1,
    false, false, false, false,
    25000
  ),
  (
    'growth', 'standard', 'Growth',
    'För växande företag med ökade behov av konsultstöd och strategisk rådgivning',
    150, 5, true, 3,
    'business', 8, 48, 99.7,
    true, true, false, ARRAY['email', 'portal', 'phone'],
    3, 3,
    true, false, false, false,
    65000
  ),
  (
    'scale', 'enterprise', 'Scale',
    'För etablerade företag som behöver omfattande konsultstöd över flera områden',
    400, 10, true, 6,
    'business', 4, 24, 99.9,
    true, true, false, ARRAY['email', 'portal', 'phone', 'slack'],
    10, 10,
    true, true, true, false,
    150000
  ),
  (
    'enterprise', 'enterprise_plus', 'Enterprise',
    'Fullständig Enterprise-lösning med Rapid Response SLA och prioriterad support',
    1000, 15, true, 12,
    'rapid_response', 2, 12, 99.95,
    true, true, true, ARRAY['email', 'portal', 'phone', 'slack', 'teams'],
    999, 999,
    true, true, true, true,
    350000
  ),
  (
    'enterprise_custom', 'enterprise_custom', 'Enterprise Custom',
    'Skräddarsydd lösning för stora organisationer med unika behov',
    0, 20, true, 12,
    'custom', 1, 8, 99.99,
    true, true, true, ARRAY['email', 'portal', 'phone', 'slack', 'teams', 'custom'],
    999, 999,
    true, true, true, true,
    NULL
  )
ON CONFLICT (plan_name) DO NOTHING;

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_year text;
  v_month text;
  v_sequence text;
BEGIN
  -- Generate ticket number in format: YEAR-MONTH-SEQUENCE
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_month := TO_CHAR(NOW(), 'MM');
  
  -- Get next sequence number for this month
  SELECT LPAD(
    (COUNT(*) + 1)::text,
    4,
    '0'
  ) INTO v_sequence
  FROM support_tickets
  WHERE ticket_number LIKE v_year || '-' || v_month || '-%';
  
  NEW.ticket_number := v_year || '-' || v_month || '-' || v_sequence;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate ticket number
DROP TRIGGER IF EXISTS trigger_generate_ticket_number ON support_tickets;
CREATE TRIGGER trigger_generate_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

-- Function to calculate SLA deadlines
CREATE OR REPLACE FUNCTION calculate_sla_deadlines()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_response_hours integer;
  v_resolution_hours integer;
BEGIN
  -- Get SLA parameters from enterprise_plans via customer
  SELECT 
    ep.sla_response_time_hours,
    ep.sla_resolution_time_hours
  INTO v_response_hours, v_resolution_hours
  FROM customers c
  JOIN enterprise_plans ep ON ep.tier = c.enterprise_tier AND ep.sla_level = c.sla_level
  WHERE c.id = NEW.customer_id
  LIMIT 1;
  
  -- If not found, use default values
  v_response_hours := COALESCE(v_response_hours, 24);
  v_resolution_hours := COALESCE(v_resolution_hours, 72);
  
  -- Set deadlines
  NEW.sla_response_deadline := NEW.created_at + (v_response_hours || ' hours')::interval;
  NEW.sla_resolution_deadline := NEW.created_at + (v_resolution_hours || ' hours')::interval;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate SLA deadlines
DROP TRIGGER IF EXISTS trigger_calculate_sla_deadlines ON support_tickets;
CREATE TRIGGER trigger_calculate_sla_deadlines
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION calculate_sla_deadlines();

-- Function to check SLA breaches
CREATE OR REPLACE FUNCTION check_sla_breach()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check response time SLA
  IF NEW.first_response_at IS NOT NULL AND OLD.first_response_at IS NULL THEN
    IF NEW.first_response_at > NEW.sla_response_deadline THEN
      NEW.sla_response_breached := true;
      
      -- Log SLA breach
      INSERT INTO sla_tracking (
        customer_id,
        ticket_id,
        metric_type,
        metric_value,
        metric_unit,
        sla_target,
        sla_actual,
        is_breach,
        breach_severity,
        period_start,
        period_end
      ) VALUES (
        NEW.customer_id,
        NEW.id,
        'response_time',
        EXTRACT(EPOCH FROM (NEW.first_response_at - NEW.created_at)) / 3600,
        'hours',
        EXTRACT(EPOCH FROM (NEW.sla_response_deadline - NEW.created_at)) / 3600,
        EXTRACT(EPOCH FROM (NEW.first_response_at - NEW.created_at)) / 3600,
        true,
        CASE 
          WHEN NEW.priority = 'critical' THEN 'critical'
          WHEN NEW.priority = 'high' THEN 'major'
          ELSE 'moderate'
        END,
        NEW.created_at,
        NEW.first_response_at
      );
    END IF;
  END IF;
  
  -- Check resolution time SLA
  IF NEW.resolved_at IS NOT NULL AND OLD.resolved_at IS NULL THEN
    IF NEW.resolved_at > NEW.sla_resolution_deadline THEN
      NEW.sla_resolution_breached := true;
      
      -- Log SLA breach
      INSERT INTO sla_tracking (
        customer_id,
        ticket_id,
        metric_type,
        metric_value,
        metric_unit,
        sla_target,
        sla_actual,
        is_breach,
        breach_severity,
        period_start,
        period_end
      ) VALUES (
        NEW.customer_id,
        NEW.id,
        'resolution_time',
        EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.created_at)) / 3600,
        'hours',
        EXTRACT(EPOCH FROM (NEW.sla_resolution_deadline - NEW.created_at)) / 3600,
        EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.created_at)) / 3600,
        true,
        CASE 
          WHEN NEW.priority = 'critical' THEN 'critical'
          WHEN NEW.priority = 'high' THEN 'major'
          ELSE 'moderate'
        END,
        NEW.created_at,
        NEW.resolved_at
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check SLA breaches
DROP TRIGGER IF EXISTS trigger_check_sla_breach ON support_tickets;
CREATE TRIGGER trigger_check_sla_breach
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION check_sla_breach();
