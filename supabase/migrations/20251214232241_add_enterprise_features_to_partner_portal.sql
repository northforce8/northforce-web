/*
  # Enterprise Partner Portal - Advanced Features

  ## Overview
  Extends the Partner Portal with enterprise-grade features for operations management,
  credits-based billing, intelligent recommendations, and structured process control.

  ## New Tables

  ### 1. credits_transactions
  - Tracks all credits movements (additions, deductions, adjustments)
  - Links to customers and partners
  - Provides full audit trail for billing

  ### 2. decision_log
  - Separate from notes - tracks strategic decisions
  - Links to customers and optionally projects
  - Includes decision maker, impact assessment

  ### 3. capacity_rules
  - Defines what capabilities unlock at different credits levels
  - Used to control access to features, work types, partner count

  ### 4. recommendations
  - System-generated recommendations based on data analysis
  - Types: scope-review, credits-topup, strategy-meeting, risk-alert
  - Can be dismissed or actioned

  ### 5. status_change_log
  - Audit trail for all status changes
  - Tracks who changed what, when, and why

  ## Enhanced Tables

  ### customers
  - Added 5 status dimensions for comprehensive tracking
  - Credits balance and plan management
  - Primary partner assignment
  - Goals and rhythm tracking

  ### projects
  - Scope definition (included/excluded)
  - Next action tracking
  - Expected credits consumption
  - Blocking items management

  ### partners
  - Lifecycle status (Invited → Verified → Active → Paused → Offboarded)
  - Role and competency areas
  - Verification tracking

  ## Security
  - All new tables have RLS enabled
  - Admins have full access
  - Partners have restricted access based on assignments
  - All using optimized (select auth.uid()) pattern
*/

-- ============================================================================
-- EXTEND EXISTING TABLES
-- ============================================================================

-- Extend customers table with status dimensions and credits
DO $$
BEGIN
  -- Status dimensions
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'delivery_status') THEN
    ALTER TABLE customers ADD COLUMN delivery_status text DEFAULT 'on_track' CHECK (delivery_status IN ('on_track', 'at_risk', 'delayed'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'strategic_status') THEN
    ALTER TABLE customers ADD COLUMN strategic_status text DEFAULT 'initiering' CHECK (strategic_status IN ('initiering', 'aktiv', 'skalning', 'optimering', 'pausad'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'commercial_status') THEN
    ALTER TABLE customers ADD COLUMN commercial_status text DEFAULT 'under_scope' CHECK (commercial_status IN ('under_scope', 'near_limit', 'over_scope'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'collaboration_status') THEN
    ALTER TABLE customers ADD COLUMN collaboration_status text DEFAULT 'fungerar_bra' CHECK (collaboration_status IN ('fungerar_bra', 'kraver_beslut', 'blockerad'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'impact_status') THEN
    ALTER TABLE customers ADD COLUMN impact_status text DEFAULT 'neutral' CHECK (impact_status IN ('positiv_trend', 'neutral', 'negativ_trend'));
  END IF;
  
  -- Credits and capacity management
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_balance') THEN
    ALTER TABLE customers ADD COLUMN credits_balance numeric(10,2) DEFAULT 0 CHECK (credits_balance >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_plan_level') THEN
    ALTER TABLE customers ADD COLUMN credits_plan_level text DEFAULT 'starter' CHECK (credits_plan_level IN ('starter', 'growth', 'scale', 'custom'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_monthly_allocation') THEN
    ALTER TABLE customers ADD COLUMN credits_monthly_allocation numeric(10,2) DEFAULT 50;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_auto_refill') THEN
    ALTER TABLE customers ADD COLUMN credits_auto_refill boolean DEFAULT false;
  END IF;
  
  -- Operational fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'primary_partner_id') THEN
    ALTER TABLE customers ADD COLUMN primary_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'weekly_rhythm_active') THEN
    ALTER TABLE customers ADD COLUMN weekly_rhythm_active boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'goals_current_period') THEN
    ALTER TABLE customers ADD COLUMN goals_current_period text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'last_review_date') THEN
    ALTER TABLE customers ADD COLUMN last_review_date date;
  END IF;
END $$;

-- Extend projects table with scope and action tracking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'scope_definition') THEN
    ALTER TABLE projects ADD COLUMN scope_definition text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'scope_included') THEN
    ALTER TABLE projects ADD COLUMN scope_included text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'scope_excluded') THEN
    ALTER TABLE projects ADD COLUMN scope_excluded text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'expected_credits_per_period') THEN
    ALTER TABLE projects ADD COLUMN expected_credits_per_period numeric(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'next_action_required') THEN
    ALTER TABLE projects ADD COLUMN next_action_required text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'next_action_owner') THEN
    ALTER TABLE projects ADD COLUMN next_action_owner text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'blocking_items') THEN
    ALTER TABLE projects ADD COLUMN blocking_items text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'requires_customer_decision') THEN
    ALTER TABLE projects ADD COLUMN requires_customer_decision boolean DEFAULT false;
  END IF;
END $$;

-- Extend partners table with lifecycle and competencies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'status') THEN
    ALTER TABLE partners ADD COLUMN status text DEFAULT 'invited' CHECK (status IN ('invited', 'verified', 'active', 'paused', 'offboarded'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'role') THEN
    ALTER TABLE partners ADD COLUMN role text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'competency_areas') THEN
    ALTER TABLE partners ADD COLUMN competency_areas text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'verified_at') THEN
    ALTER TABLE partners ADD COLUMN verified_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'agreement_accepted_at') THEN
    ALTER TABLE partners ADD COLUMN agreement_accepted_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'allowed_work_types') THEN
    ALTER TABLE partners ADD COLUMN allowed_work_types uuid[];
  END IF;
END $$;

-- Extend work_types with credits weight
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'work_types' AND column_name = 'credits_per_hour') THEN
    ALTER TABLE work_types ADD COLUMN credits_per_hour numeric(5,2) DEFAULT 1.0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'work_types' AND column_name = 'requires_plan_level') THEN
    ALTER TABLE work_types ADD COLUMN requires_plan_level text DEFAULT 'starter' CHECK (requires_plan_level IN ('starter', 'growth', 'scale', 'custom'));
  END IF;
END $$;

-- ============================================================================
-- NEW TABLES
-- ============================================================================

-- Credits Transactions table
CREATE TABLE IF NOT EXISTS credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('allocation', 'deduction', 'adjustment', 'refund', 'bonus')),
  amount numeric(10,2) NOT NULL,
  balance_after numeric(10,2) NOT NULL,
  related_time_entry_id uuid REFERENCES time_entries(id) ON DELETE SET NULL,
  related_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  reason text,
  metadata jsonb,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Decision Log table
CREATE TABLE IF NOT EXISTS decision_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  decision_title text NOT NULL,
  decision_description text NOT NULL,
  decision_maker text NOT NULL,
  decision_date date DEFAULT CURRENT_DATE,
  impact_assessment text,
  options_considered text,
  rationale text,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Capacity Rules table
CREATE TABLE IF NOT EXISTS capacity_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_level text NOT NULL CHECK (plan_level IN ('starter', 'growth', 'scale', 'custom')),
  rule_type text NOT NULL CHECK (rule_type IN ('work_type_access', 'max_parallel_projects', 'max_partners', 'feature_access')),
  rule_key text NOT NULL,
  rule_value jsonb NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan_level, rule_type, rule_key)
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('scope_review', 'credits_topup', 'strategy_meeting', 'risk_alert', 'partner_change', 'capacity_upgrade')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  reasoning text,
  suggested_action text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'actioned')),
  actioned_at timestamptz,
  actioned_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Status Change Log table
CREATE TABLE IF NOT EXISTS status_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('customer', 'project', 'partner')),
  entity_id uuid NOT NULL,
  status_field text NOT NULL,
  old_value text,
  new_value text NOT NULL,
  change_reason text,
  changed_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_credits_transactions_customer ON credits_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created ON credits_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_decision_log_customer ON decision_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_decision_log_project ON decision_log(project_id);
CREATE INDEX IF NOT EXISTS idx_decision_log_date ON decision_log(decision_date DESC);

CREATE INDEX IF NOT EXISTS idx_capacity_rules_plan ON capacity_rules(plan_level);

CREATE INDEX IF NOT EXISTS idx_recommendations_customer ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);

CREATE INDEX IF NOT EXISTS idx_status_change_log_entity ON status_change_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_status_change_log_created ON status_change_log(created_at DESC);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_change_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Credits Transactions policies
CREATE POLICY "credits_transactions_select_policy"
  ON credits_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "credits_transactions_insert_policy"
  ON credits_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Decision Log policies
CREATE POLICY "decision_log_select_policy"
  ON decision_log FOR SELECT
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
      AND ca.customer_id = decision_log.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "decision_log_insert_policy"
  ON decision_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "decision_log_update_policy"
  ON decision_log FOR UPDATE
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

-- Capacity Rules policies
CREATE POLICY "capacity_rules_select_policy"
  ON capacity_rules FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "capacity_rules_manage_policy"
  ON capacity_rules FOR ALL
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

-- Recommendations policies
CREATE POLICY "recommendations_select_policy"
  ON recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "recommendations_manage_policy"
  ON recommendations FOR ALL
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

-- Status Change Log policies
CREATE POLICY "status_change_log_select_policy"
  ON status_change_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "status_change_log_insert_policy"
  ON status_change_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- ============================================================================
-- SEED DEFAULT CAPACITY RULES
-- ============================================================================

INSERT INTO capacity_rules (plan_level, rule_type, rule_key, rule_value, description) VALUES
  ('starter', 'max_parallel_projects', 'limit', '{"value": 1}', 'Starter plan allows 1 parallel project'),
  ('growth', 'max_parallel_projects', 'limit', '{"value": 3}', 'Growth plan allows 3 parallel projects'),
  ('scale', 'max_parallel_projects', 'limit', '{"value": 10}', 'Scale plan allows 10 parallel projects'),
  
  ('starter', 'max_partners', 'limit', '{"value": 1}', 'Starter plan allows 1 partner at a time'),
  ('growth', 'max_partners', 'limit', '{"value": 3}', 'Growth plan allows up to 3 partners'),
  ('scale', 'max_partners', 'limit', '{"value": 10}', 'Scale plan allows up to 10 partners'),
  
  ('starter', 'feature_access', 'advanced_reporting', '{"enabled": false}', 'Advanced reporting not available on Starter'),
  ('growth', 'feature_access', 'advanced_reporting', '{"enabled": true}', 'Advanced reporting available on Growth'),
  ('scale', 'feature_access', 'advanced_reporting', '{"enabled": true}', 'Advanced reporting available on Scale'),
  
  ('starter', 'feature_access', 'strategic_consulting', '{"enabled": false}', 'Strategic consulting not included in Starter'),
  ('growth', 'feature_access', 'strategic_consulting', '{"enabled": true}', 'Strategic consulting available on Growth'),
  ('scale', 'feature_access', 'strategic_consulting', '{"enabled": true}', 'Strategic consulting available on Scale')
ON CONFLICT (plan_level, rule_type, rule_key) DO NOTHING;

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to automatically deduct credits when time is logged
CREATE OR REPLACE FUNCTION deduct_credits_for_time_entry()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_credits_per_hour numeric(5,2);
  v_credits_amount numeric(10,2);
  v_new_balance numeric(10,2);
BEGIN
  -- Get credits per hour for this work type
  SELECT credits_per_hour INTO v_credits_per_hour
  FROM work_types
  WHERE id = NEW.work_type_id;
  
  -- Calculate credits to deduct
  v_credits_amount := NEW.hours * COALESCE(v_credits_per_hour, 1.0);
  
  -- Update customer balance
  UPDATE customers
  SET credits_balance = credits_balance - v_credits_amount
  WHERE id = NEW.customer_id
  RETURNING credits_balance INTO v_new_balance;
  
  -- Log the transaction
  INSERT INTO credits_transactions (
    customer_id,
    transaction_type,
    amount,
    balance_after,
    related_time_entry_id,
    related_partner_id,
    reason
  ) VALUES (
    NEW.customer_id,
    'deduction',
    -v_credits_amount,
    v_new_balance,
    NEW.id,
    NEW.partner_id,
    'Time entry: ' || NEW.hours || ' hours of ' || (SELECT name FROM work_types WHERE id = NEW.work_type_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to deduct credits on time entry insert
DROP TRIGGER IF EXISTS trigger_deduct_credits ON time_entries;
CREATE TRIGGER trigger_deduct_credits
  AFTER INSERT ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION deduct_credits_for_time_entry();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- This function can be enhanced to track specific status field changes
  -- For now, it's a placeholder for future enhancement
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;