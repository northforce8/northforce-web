/*
  # Fix Security and Performance Issues

  ## Changes
  
  1. **Add Missing Indexes on Foreign Keys**
     - Creates indexes on all foreign key columns that are frequently queried
     - Improves JOIN performance and foreign key constraint checks
  
  2. **Remove Unused Indexes**
     - Drops indexes that are not being used
     - Reduces storage overhead and improves INSERT/UPDATE performance
  
  3. **Fix Multiple Permissive Policies**
     - Consolidates duplicate RLS policies
     - Maintains security while simplifying policy structure
  
  4. **Fix Function Security**
     - Sets SECURITY DEFINER and explicit search_path on functions
     - Prevents search_path manipulation attacks
*/

-- =====================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_actor_user_id 
  ON public.activity_log(actor_user_id);

-- Credits transactions indexes
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_by 
  ON public.credits_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_partner 
  ON public.credits_transactions(related_partner_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_time_entry 
  ON public.credits_transactions(related_time_entry_id);

-- Customer assignments indexes
CREATE INDEX IF NOT EXISTS idx_customer_assignments_partner 
  ON public.customer_assignments(partner_id);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_success_manager 
  ON public.customers(dedicated_success_manager);
CREATE INDEX IF NOT EXISTS idx_customers_owner 
  ON public.customers(owner_admin_id);
CREATE INDEX IF NOT EXISTS idx_customers_primary_partner 
  ON public.customers(primary_partner_id);

-- Decision log indexes
CREATE INDEX IF NOT EXISTS idx_decision_log_created_by 
  ON public.decision_log(created_by);

-- Enterprise benefits indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_granted_by 
  ON public.enterprise_benefits(granted_by);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_customer 
  ON public.notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_notes_partner 
  ON public.notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_notes_project 
  ON public.notes(project_id);

-- Partner cost rates indexes
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_created_by 
  ON public.partner_cost_rates(created_by);

-- Project assignments indexes
CREATE INDEX IF NOT EXISTS idx_project_assignments_partner 
  ON public.project_assignments(partner_id);

-- Recommendations indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_actioned_by 
  ON public.recommendations(actioned_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_project 
  ON public.recommendations(project_id);

-- SLA tracking indexes
CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket 
  ON public.sla_tracking(ticket_id);

-- Status change log indexes
CREATE INDEX IF NOT EXISTS idx_status_change_log_changed_by 
  ON public.status_change_log(changed_by);

-- Support tickets indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_partner 
  ON public.support_tickets(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to 
  ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_project 
  ON public.support_tickets(project_id);

-- Time entries indexes (critical for performance)
CREATE INDEX IF NOT EXISTS idx_time_entries_customer 
  ON public.time_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_partner 
  ON public.time_entries(partner_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project 
  ON public.time_entries(project_id);

-- Composite index for common time entry queries
CREATE INDEX IF NOT EXISTS idx_time_entries_date_customer 
  ON public.time_entries(date DESC, customer_id);

-- =====================================================
-- 2. DROP UNUSED INDEXES
-- =====================================================

-- Credits transactions
DROP INDEX IF EXISTS idx_credits_transactions_created;

-- Decision log
DROP INDEX IF EXISTS idx_decision_log_customer;
DROP INDEX IF EXISTS idx_decision_log_project;
DROP INDEX IF EXISTS idx_decision_log_date;

-- Capacity rules
DROP INDEX IF EXISTS idx_capacity_rules_plan;

-- Recommendations
DROP INDEX IF EXISTS idx_recommendations_customer;
DROP INDEX IF EXISTS idx_recommendations_priority;

-- Status change log
DROP INDEX IF EXISTS idx_status_change_log_entity;
DROP INDEX IF EXISTS idx_status_change_log_created;

-- Support tickets
DROP INDEX IF EXISTS idx_support_tickets_customer;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_priority;
DROP INDEX IF EXISTS idx_support_tickets_sla_deadlines;
DROP INDEX IF EXISTS idx_support_tickets_number;

-- Time entries
DROP INDEX IF EXISTS idx_time_entries_work_type;

-- Support responses
DROP INDEX IF EXISTS idx_support_responses_ticket;
DROP INDEX IF EXISTS idx_support_responses_created;

-- SLA tracking
DROP INDEX IF EXISTS idx_sla_tracking_customer;
DROP INDEX IF EXISTS idx_sla_tracking_breach;
DROP INDEX IF EXISTS idx_sla_tracking_period;

-- Enterprise benefits
DROP INDEX IF EXISTS idx_enterprise_benefits_customer;
DROP INDEX IF EXISTS idx_enterprise_benefits_active;

-- Partner cost rates
DROP INDEX IF EXISTS idx_partner_cost_rates_effective;

-- Credits forecast
DROP INDEX IF EXISTS idx_credits_forecast_customer;
DROP INDEX IF EXISTS idx_credits_forecast_period;
DROP INDEX IF EXISTS idx_credits_forecast_risk;

-- Margin analysis
DROP INDEX IF EXISTS idx_margin_analysis_customer;
DROP INDEX IF EXISTS idx_margin_analysis_project;
DROP INDEX IF EXISTS idx_margin_analysis_period;

-- Capacity utilization
DROP INDEX IF EXISTS idx_capacity_utilization_partner;
DROP INDEX IF EXISTS idx_capacity_utilization_customer;
DROP INDEX IF EXISTS idx_capacity_utilization_period;

-- Billing periods
DROP INDEX IF EXISTS idx_billing_periods_customer;
DROP INDEX IF EXISTS idx_billing_periods_period;
DROP INDEX IF EXISTS idx_billing_periods_status;

-- =====================================================
-- 3. FIX MULTIPLE PERMISSIVE POLICIES
-- =====================================================

-- Capacity rules: Keep only the manage policy
DROP POLICY IF EXISTS capacity_rules_select_policy ON public.capacity_rules;

-- Capacity utilization: Keep only the admin manage policy
DROP POLICY IF EXISTS capacity_utilization_select_policy ON public.capacity_utilization;

-- Credits forecast: Keep only the admin manage policy
DROP POLICY IF EXISTS credits_forecast_select_policy ON public.credits_forecast;

-- Enterprise benefits: Keep only the manage policy
DROP POLICY IF EXISTS enterprise_benefits_select_policy ON public.enterprise_benefits;

-- Enterprise plans: Keep only the manage policy
DROP POLICY IF EXISTS enterprise_plans_select_policy ON public.enterprise_plans;

-- Recommendations: Keep only the manage policy
DROP POLICY IF EXISTS recommendations_select_policy ON public.recommendations;

-- =====================================================
-- 4. FIX FUNCTION SECURITY (Search Path)
-- =====================================================

-- Fix calculate_time_entry_costs function
CREATE OR REPLACE FUNCTION public.calculate_time_entry_costs()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_work_type_credits_per_hour NUMERIC;
  v_work_type_cost_factor NUMERIC;
  v_partner_hourly_cost NUMERIC;
BEGIN
  -- Get work type multipliers
  SELECT credits_per_hour, internal_cost_factor
  INTO v_work_type_credits_per_hour, v_work_type_cost_factor
  FROM work_types
  WHERE id = NEW.work_type_id;

  -- Default to 1.0 if not found
  v_work_type_credits_per_hour := COALESCE(v_work_type_credits_per_hour, 1.0);
  v_work_type_cost_factor := COALESCE(v_work_type_cost_factor, 1.0);

  -- Get partner hourly cost
  SELECT COALESCE(
    (SELECT hourly_cost 
     FROM partner_cost_rates 
     WHERE partner_id = NEW.partner_id 
     AND effective_from <= NEW.date 
     AND (effective_until IS NULL OR effective_until >= NEW.date)
     ORDER BY effective_from DESC 
     LIMIT 1),
    (SELECT default_hourly_cost FROM partners WHERE id = NEW.partner_id),
    850.00
  ) INTO v_partner_hourly_cost;

  -- Calculate credits consumed and internal cost
  NEW.credits_consumed := NEW.hours * v_work_type_credits_per_hour;
  NEW.internal_cost := NEW.hours * v_partner_hourly_cost * v_work_type_cost_factor;

  RETURN NEW;
END;
$$;

-- Fix update_customer_credits function
CREATE OR REPLACE FUNCTION public.update_customer_credits()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_credits NUMERIC;
  v_credit_delta NUMERIC;
BEGIN
  -- Only process billable entries
  IF NOT NEW.billable THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Deduct credits from customer balance
    UPDATE customers 
    SET 
      credits_balance = credits_balance - NEW.credits_consumed,
      credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) + NEW.credits_consumed
    WHERE id = NEW.customer_id;

    -- Create credits transaction
    INSERT INTO credits_transactions (
      customer_id,
      transaction_type,
      amount,
      balance_after,
      related_time_entry_id,
      related_partner_id,
      reason,
      metadata
    )
    SELECT 
      NEW.customer_id,
      'deduction',
      -NEW.credits_consumed,
      c.credits_balance,
      NEW.id,
      NEW.partner_id,
      'Time entry: ' || NEW.description,
      jsonb_build_object(
        'hours', NEW.hours,
        'work_type_id', NEW.work_type_id,
        'date', NEW.date
      )
    FROM customers c
    WHERE c.id = NEW.customer_id;

  ELSIF TG_OP = 'UPDATE' THEN
    v_old_credits := COALESCE(OLD.credits_consumed, 0);
    v_credit_delta := NEW.credits_consumed - v_old_credits;
    
    IF v_credit_delta != 0 THEN
      -- Adjust customer balance
      UPDATE customers 
      SET 
        credits_balance = credits_balance - v_credit_delta,
        credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) + v_credit_delta
      WHERE id = NEW.customer_id;

      -- Create adjustment transaction
      INSERT INTO credits_transactions (
        customer_id,
        transaction_type,
        amount,
        balance_after,
        related_time_entry_id,
        related_partner_id,
        reason,
        metadata
      )
      SELECT 
        NEW.customer_id,
        'adjustment',
        -v_credit_delta,
        c.credits_balance,
        NEW.id,
        NEW.partner_id,
        'Time entry adjustment: ' || NEW.description,
        jsonb_build_object(
          'old_credits', v_old_credits,
          'new_credits', NEW.credits_consumed,
          'delta', v_credit_delta
        )
      FROM customers c
      WHERE c.id = NEW.customer_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Fix handle_time_entry_deletion function
CREATE OR REPLACE FUNCTION public.handle_time_entry_deletion()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only process if entry was billable
  IF OLD.billable THEN
    -- Refund credits to customer
    UPDATE customers 
    SET 
      credits_balance = credits_balance + COALESCE(OLD.credits_consumed, 0),
      credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) - COALESCE(OLD.credits_consumed, 0)
    WHERE id = OLD.customer_id;

    -- Create refund transaction
    INSERT INTO credits_transactions (
      customer_id,
      transaction_type,
      amount,
      balance_after,
      related_time_entry_id,
      related_partner_id,
      reason,
      metadata
    )
    SELECT 
      OLD.customer_id,
      'refund',
      COALESCE(OLD.credits_consumed, 0),
      c.credits_balance,
      OLD.id,
      OLD.partner_id,
      'Time entry deleted: ' || OLD.description,
      jsonb_build_object(
        'deleted_at', NOW(),
        'hours', OLD.hours,
        'date', OLD.date
      )
    FROM customers c
    WHERE c.id = OLD.customer_id;
  END IF;

  RETURN OLD;
END;
$$;

-- Fix update_customer_risk_level function
CREATE OR REPLACE FUNCTION public.update_customer_risk_level()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance_percentage NUMERIC;
  v_new_risk_level TEXT;
BEGIN
  -- Calculate remaining balance percentage
  IF NEW.credits_monthly_allocation > 0 THEN
    v_balance_percentage := (NEW.credits_balance / NEW.credits_monthly_allocation) * 100;
    
    -- Determine risk level
    IF v_balance_percentage < 10 THEN
      v_new_risk_level := 'critical';
    ELSIF v_balance_percentage < 20 THEN
      v_new_risk_level := 'high';
    ELSIF v_balance_percentage < 30 THEN
      v_new_risk_level := 'medium';
    ELSE
      v_new_risk_level := 'low';
    END IF;

    -- Update risk level if changed
    IF NEW.overdelivery_risk_level != v_new_risk_level THEN
      NEW.overdelivery_risk_level := v_new_risk_level;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- 5. ANALYZE TABLES FOR OPTIMAL QUERY PLANNING
-- =====================================================

ANALYZE public.time_entries;
ANALYZE public.credits_transactions;
ANALYZE public.customers;
ANALYZE public.projects;
ANALYZE public.partners;
ANALYZE public.notes;
ANALYZE public.recommendations;
ANALYZE public.support_tickets;