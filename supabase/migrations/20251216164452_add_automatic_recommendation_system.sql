/*
  # Automatic Recommendation System for Executive Dashboard

  ## Overview
  This migration implements automatic recommendation generation based on business rules
  for the Executive Dashboard in the Partner Portal.

  ## Changes

  1. **New Columns**
     - Add `ai_priority_score` to recommendations table for AI-driven ranking
     - Add `impact_score` for business impact assessment

  2. **Automatic Triggers**
     - Credits below 20% → Generate "credits_topup" recommendation
     - Negative margin detected → Generate critical risk alert
     - Blocked collaboration → Generate immediate action alert
     - High time, low impact → Generate "scope_review" recommendation

  3. **Functions**
     - `calculate_ai_priority_score()` - Determines action priority
     - `check_credits_threshold()` - Monitors credit levels
     - `check_margin_health()` - Monitors profitability
     - `check_collaboration_status()` - Monitors blockers
     - `check_efficiency_ratio()` - Monitors time vs impact

  ## Security
  - All functions execute with SECURITY DEFINER for consistent behavior
  - RLS policies already in place for recommendations table
*/

-- Add AI priority scoring columns to recommendations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recommendations' AND column_name = 'ai_priority_score'
  ) THEN
    ALTER TABLE recommendations ADD COLUMN ai_priority_score integer DEFAULT 50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recommendations' AND column_name = 'impact_score'
  ) THEN
    ALTER TABLE recommendations ADD COLUMN impact_score integer DEFAULT 50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recommendations' AND column_name = 'business_criticality'
  ) THEN
    ALTER TABLE recommendations ADD COLUMN business_criticality text CHECK (business_criticality IN ('low', 'medium', 'high', 'critical'));
  END IF;
END $$;

-- Function: Calculate AI priority score based on multiple factors
CREATE OR REPLACE FUNCTION calculate_ai_priority_score(
  p_customer_id uuid,
  p_recommendation_type text,
  p_severity text
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_score integer := 50;
  v_customer customers%ROWTYPE;
  v_mrr numeric;
  v_credits_pct numeric;
  v_delivery_risk integer := 0;
BEGIN
  -- Get customer data
  SELECT * INTO v_customer FROM customers WHERE id = p_customer_id;

  IF NOT FOUND THEN
    RETURN 50;
  END IF;

  v_mrr := COALESCE(v_customer.monthly_recurring_revenue, 0);

  -- Calculate credits percentage
  IF v_customer.credits_monthly_allocation > 0 THEN
    v_credits_pct := (v_customer.credits_balance::numeric / v_customer.credits_monthly_allocation::numeric) * 100;
  ELSE
    v_credits_pct := 100;
  END IF;

  -- Base score on severity
  v_score := CASE p_severity
    WHEN 'critical' THEN 90
    WHEN 'high' THEN 70
    WHEN 'medium' THEN 50
    WHEN 'low' THEN 30
    ELSE 50
  END;

  -- Adjust for customer revenue (higher MRR = higher priority)
  IF v_mrr > 100000 THEN
    v_score := v_score + 15;
  ELSIF v_mrr > 50000 THEN
    v_score := v_score + 10;
  ELSIF v_mrr > 25000 THEN
    v_score := v_score + 5;
  END IF;

  -- Adjust for credits urgency
  IF v_credits_pct < 10 THEN
    v_score := v_score + 20;
  ELSIF v_credits_pct < 20 THEN
    v_score := v_score + 10;
  END IF;

  -- Adjust for delivery risk
  IF v_customer.delivery_status IN ('at_risk', 'delayed') THEN
    v_score := v_score + 15;
  END IF;

  -- Adjust for collaboration blockers
  IF v_customer.collaboration_status = 'blockerad' THEN
    v_score := v_score + 25;
  END IF;

  -- Cap at 100
  IF v_score > 100 THEN
    v_score := 100;
  END IF;

  RETURN v_score;
END;
$$;

-- Function: Check credits threshold and create recommendation
CREATE OR REPLACE FUNCTION check_credits_threshold()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits_pct numeric;
  v_existing_rec uuid;
  v_priority_score integer;
  v_priority text;
  v_criticality text;
BEGIN
  -- Calculate credits percentage
  IF NEW.credits_monthly_allocation > 0 THEN
    v_credits_pct := (NEW.credits_balance::numeric / NEW.credits_monthly_allocation::numeric) * 100;
  ELSE
    RETURN NEW;
  END IF;

  -- Only trigger if below 20%
  IF v_credits_pct >= 20 THEN
    RETURN NEW;
  END IF;

  -- Check if active recommendation already exists
  SELECT id INTO v_existing_rec
  FROM recommendations
  WHERE customer_id = NEW.id
    AND recommendation_type = 'credits_topup'
    AND status = 'active'
  LIMIT 1;

  -- Don't create duplicate
  IF v_existing_rec IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Determine priority and criticality
  IF v_credits_pct < 10 THEN
    v_priority := 'critical';
    v_criticality := 'critical';
  ELSIF v_credits_pct < 15 THEN
    v_priority := 'high';
    v_criticality := 'high';
  ELSE
    v_priority := 'medium';
    v_criticality := 'medium';
  END IF;

  -- Calculate AI priority score
  v_priority_score := calculate_ai_priority_score(NEW.id, 'credits_topup', v_priority);

  -- Create recommendation
  INSERT INTO recommendations (
    customer_id,
    recommendation_type,
    priority,
    title,
    description,
    reasoning,
    suggested_action,
    status,
    ai_priority_score,
    impact_score,
    business_criticality
  ) VALUES (
    NEW.id,
    'credits_topup',
    v_priority,
    'Credits Running Low - Topup Required',
    format('Customer %s has only %.1f%% credits remaining (%.1f of %.1f credits). Immediate action required to prevent delivery disruption.',
      NEW.company_name, v_credits_pct, NEW.credits_balance, NEW.credits_monthly_allocation),
    format('Credits dropped below 20%% threshold. Current balance: %.1f credits (%.1f%%). Daily burn rate indicates %.0f days remaining.',
      NEW.credits_balance, v_credits_pct,
      CASE WHEN NEW.credits_consumed_this_month > 0
        THEN (NEW.credits_balance / (NEW.credits_consumed_this_month / EXTRACT(DAY FROM NOW())::numeric))
        ELSE 999
      END),
    format('Recommend immediate credits topup of %.1f credits to restore healthy balance. Schedule commercial discussion with customer.',
      NEW.credits_monthly_allocation * 0.5),
    'active',
    v_priority_score,
    CASE WHEN v_credits_pct < 10 THEN 95 ELSE 75 END,
    v_criticality
  );

  RETURN NEW;
END;
$$;

-- Function: Check margin health and create recommendation for negative margins
CREATE OR REPLACE FUNCTION check_margin_health()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_margin_pct numeric;
  v_existing_rec uuid;
  v_priority_score integer;
  v_internal_cost numeric;
  v_credits_value numeric;
BEGIN
  -- Calculate internal cost for this month
  SELECT COALESCE(SUM(te.hours_worked * wt.internal_cost_per_hour * wt.cost_multiplier), 0)
  INTO v_internal_cost
  FROM time_entries te
  JOIN work_types wt ON te.work_type_id = wt.id
  WHERE te.customer_id = NEW.id
    AND te.date >= date_trunc('month', CURRENT_DATE)
    AND te.date < date_trunc('month', CURRENT_DATE) + interval '1 month';

  -- Calculate credits value consumed (credits * price per credit)
  v_credits_value := NEW.credits_consumed_this_month * COALESCE(NEW.credits_price_per_credit, 1500);

  -- Calculate margin percentage
  IF v_credits_value > 0 THEN
    v_margin_pct := ((v_credits_value - v_internal_cost) / v_credits_value) * 100;
  ELSE
    RETURN NEW;
  END IF;

  -- Only trigger if margin is negative
  IF v_margin_pct >= 0 THEN
    RETURN NEW;
  END IF;

  -- Check if active recommendation already exists
  SELECT id INTO v_existing_rec
  FROM recommendations
  WHERE customer_id = NEW.id
    AND recommendation_type = 'risk_alert'
    AND status = 'active'
    AND title LIKE '%Negative Margin%'
  LIMIT 1;

  -- Don't create duplicate
  IF v_existing_rec IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Calculate AI priority score
  v_priority_score := calculate_ai_priority_score(NEW.id, 'risk_alert', 'critical');

  -- Create critical recommendation
  INSERT INTO recommendations (
    customer_id,
    recommendation_type,
    priority,
    title,
    description,
    reasoning,
    suggested_action,
    status,
    ai_priority_score,
    impact_score,
    business_criticality
  ) VALUES (
    NEW.id,
    'risk_alert',
    'critical',
    'CRITICAL: Negative Margin Detected',
    format('Customer %s is operating at %.1f%% margin (NEGATIVE). Internal cost (%.0f SEK) exceeds credits value (%.0f SEK) by %.0f SEK.',
      NEW.company_name, v_margin_pct, v_internal_cost, v_credits_value, v_internal_cost - v_credits_value),
    format('Margin analysis shows negative profitability. Internal delivery cost: %.0f SEK. Credits consumed value: %.0f SEK. Loss: %.0f SEK this month.',
      v_internal_cost, v_credits_value, v_internal_cost - v_credits_value),
    'IMMEDIATE ACTION REQUIRED: 1) Review scope and deliverables 2) Assess work type distribution 3) Consider price adjustment or scope reduction 4) Schedule executive review',
    'active',
    v_priority_score,
    100,
    'critical'
  );

  RETURN NEW;
END;
$$;

-- Function: Check collaboration status and create recommendation for blocked projects
CREATE OR REPLACE FUNCTION check_collaboration_blockers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_rec uuid;
  v_priority_score integer;
  v_blocked_count integer;
BEGIN
  -- Only trigger if status changed TO blocked
  IF NEW.collaboration_status != 'blockerad' OR OLD.collaboration_status = 'blockerad' THEN
    RETURN NEW;
  END IF;

  -- Check if active recommendation already exists
  SELECT id INTO v_existing_rec
  FROM recommendations
  WHERE customer_id = NEW.id
    AND recommendation_type = 'risk_alert'
    AND status = 'active'
    AND title LIKE '%Blocked%'
  LIMIT 1;

  -- Don't create duplicate
  IF v_existing_rec IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Count blocked projects
  SELECT COUNT(*)
  INTO v_blocked_count
  FROM projects
  WHERE customer_id = NEW.id
    AND status IN ('blocked', 'on_hold');

  -- Calculate AI priority score
  v_priority_score := calculate_ai_priority_score(NEW.id, 'risk_alert', 'high');

  -- Create recommendation
  INSERT INTO recommendations (
    customer_id,
    recommendation_type,
    priority,
    title,
    description,
    reasoning,
    suggested_action,
    status,
    ai_priority_score,
    impact_score,
    business_criticality
  ) VALUES (
    NEW.id,
    'risk_alert',
    'high',
    'Collaboration Blocked - Immediate Action Required',
    format('Customer %s collaboration status changed to BLOCKED. %s projects affected. Delivery at risk.',
      NEW.company_name,
      CASE WHEN v_blocked_count > 0 THEN v_blocked_count::text ELSE 'Multiple' END),
    format('Collaboration blockers prevent progress. Current status: %s. This impacts delivery timeline and customer satisfaction.',
      NEW.collaboration_status),
    'IMMEDIATE: 1) Identify blocker root cause 2) Schedule unblock meeting with customer 3) Escalate to account owner 4) Document resolution plan',
    'active',
    v_priority_score,
    90,
    'high'
  );

  RETURN NEW;
END;
$$;

-- Function: Check efficiency ratio (high time, low impact)
CREATE OR REPLACE FUNCTION check_efficiency_ratio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_hours numeric;
  v_credits_consumed numeric;
  v_efficiency_ratio numeric;
  v_existing_rec uuid;
  v_priority_score integer;
  v_avg_hours_per_credit numeric;
BEGIN
  -- Calculate total hours worked this month
  SELECT COALESCE(SUM(hours_worked), 0)
  INTO v_total_hours
  FROM time_entries
  WHERE customer_id = NEW.id
    AND date >= date_trunc('month', CURRENT_DATE)
    AND date < date_trunc('month', CURRENT_DATE) + interval '1 month';

  v_credits_consumed := NEW.credits_consumed_this_month;

  -- Need meaningful data
  IF v_total_hours < 10 OR v_credits_consumed < 1 THEN
    RETURN NEW;
  END IF;

  -- Calculate efficiency: hours per credit consumed
  v_avg_hours_per_credit := v_total_hours / v_credits_consumed;

  -- Expected baseline: ~0.67 hours per credit (1.5 credits per hour)
  -- Flag if > 1.5 hours per credit (low efficiency)
  IF v_avg_hours_per_credit <= 1.5 THEN
    RETURN NEW;
  END IF;

  -- Check if active recommendation already exists
  SELECT id INTO v_existing_rec
  FROM recommendations
  WHERE customer_id = NEW.id
    AND recommendation_type = 'scope_review'
    AND status = 'active'
  LIMIT 1;

  -- Don't create duplicate
  IF v_existing_rec IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Calculate AI priority score
  v_priority_score := calculate_ai_priority_score(NEW.id, 'scope_review', 'medium');

  -- Create recommendation
  INSERT INTO recommendations (
    customer_id,
    recommendation_type,
    priority,
    title,
    description,
    reasoning,
    suggested_action,
    status,
    ai_priority_score,
    impact_score,
    business_criticality
  ) VALUES (
    NEW.id,
    'scope_review',
    'medium',
    'Low Efficiency Detected - Scope Review Recommended',
    format('Customer %s shows low delivery efficiency. %.1f hours worked but only %.1f credits consumed (%.2f hours/credit).',
      NEW.company_name, v_total_hours, v_credits_consumed, v_avg_hours_per_credit),
    format('Efficiency analysis indicates high time investment with low credit impact. Baseline: 0.67 hrs/credit. Current: %.2f hrs/credit (%.0f%% above baseline).',
      v_avg_hours_per_credit, ((v_avg_hours_per_credit / 0.67) - 1) * 100),
    'Recommend scope review to: 1) Assess work type distribution 2) Identify low-value activities 3) Optimize delivery approach 4) Review credit allocation model',
    'active',
    v_priority_score,
    65,
    'medium'
  );

  RETURN NEW;
END;
$$;

-- Create triggers for automatic recommendation generation

-- Trigger: Credits threshold monitoring
DROP TRIGGER IF EXISTS trg_check_credits_threshold ON customers;
CREATE TRIGGER trg_check_credits_threshold
  AFTER UPDATE OF credits_balance, credits_monthly_allocation ON customers
  FOR EACH ROW
  EXECUTE FUNCTION check_credits_threshold();

-- Trigger: Margin health monitoring
DROP TRIGGER IF EXISTS trg_check_margin_health ON customers;
CREATE TRIGGER trg_check_margin_health
  AFTER UPDATE OF credits_consumed_this_month, credits_price_per_credit ON customers
  FOR EACH ROW
  EXECUTE FUNCTION check_margin_health();

-- Trigger: Collaboration blocker monitoring
DROP TRIGGER IF EXISTS trg_check_collaboration_blockers ON customers;
CREATE TRIGGER trg_check_collaboration_blockers
  AFTER UPDATE OF collaboration_status ON customers
  FOR EACH ROW
  EXECUTE FUNCTION check_collaboration_blockers();

-- Trigger: Efficiency ratio monitoring
DROP TRIGGER IF EXISTS trg_check_efficiency_ratio ON customers;
CREATE TRIGGER trg_check_efficiency_ratio
  AFTER UPDATE OF credits_consumed_this_month ON customers
  FOR EACH ROW
  EXECUTE FUNCTION check_efficiency_ratio();

-- Create index for faster recommendation queries sorted by AI priority
CREATE INDEX IF NOT EXISTS idx_recommendations_ai_priority
  ON recommendations(status, ai_priority_score DESC, created_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_recommendations_business_criticality
  ON recommendations(customer_id, business_criticality, status)
  WHERE status = 'active';

-- Comment documentation
COMMENT ON COLUMN recommendations.ai_priority_score IS 'AI-calculated priority score (0-100) based on multiple business factors including MRR, urgency, risk level, and customer status';
COMMENT ON COLUMN recommendations.impact_score IS 'Business impact score (0-100) indicating potential effect on revenue and delivery';
COMMENT ON COLUMN recommendations.business_criticality IS 'Overall business criticality level derived from multiple factors';
COMMENT ON FUNCTION calculate_ai_priority_score IS 'Calculates AI-driven priority score considering customer value, urgency, and risk factors';
COMMENT ON FUNCTION check_credits_threshold IS 'Automatically generates credits topup recommendation when balance drops below 20%';
COMMENT ON FUNCTION check_margin_health IS 'Automatically generates critical alert when customer margin becomes negative';
COMMENT ON FUNCTION check_collaboration_blockers IS 'Automatically generates alert when collaboration status becomes blocked';
COMMENT ON FUNCTION check_efficiency_ratio IS 'Automatically generates scope review recommendation when time vs credit efficiency is low';
