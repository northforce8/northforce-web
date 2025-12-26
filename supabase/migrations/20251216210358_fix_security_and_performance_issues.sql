/*
  # Fix Security and Performance Issues

  1. Foreign Key Index
    - Add missing index on contract_version_history.created_by

  2. RLS Performance
    - Fix auth.uid() calls in RLS policies to use (select auth.uid())
    - Prevents re-evaluation for each row

  3. Function Security
    - Add search_path to functions to prevent search_path injection
    - Remove SECURITY DEFINER from view

  4. Performance Optimization
    - Remove unused indexes to reduce storage and maintenance overhead
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEX
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_contract_version_history_created_by
  ON contract_version_history(created_by);

-- ============================================================================
-- 2. FIX RLS POLICIES FOR PERFORMANCE
-- ============================================================================

-- Drop and recreate policies with optimized auth checks
DROP POLICY IF EXISTS "Admins can view contract version history" ON contract_version_history;
DROP POLICY IF EXISTS "Admins can create contract versions" ON contract_version_history;

CREATE POLICY "Admins can view contract version history"
  ON contract_version_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can create contract versions"
  ON contract_version_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================================================
-- 3. FIX FUNCTION SECURITY (SEARCH_PATH)
-- ============================================================================

-- Fix create_contract_version function
CREATE OR REPLACE FUNCTION create_contract_version(
  p_contract_id uuid,
  p_change_reason text DEFAULT NULL,
  p_change_summary text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_new_version_number integer;
  v_version_id uuid;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_new_version_number
  FROM contract_version_history
  WHERE contract_id = p_contract_id;

  -- Create version snapshot
  INSERT INTO contract_version_history (
    contract_id,
    version_number,
    parent_version_id,
    contract_number,
    title,
    contract_type,
    status,
    start_date,
    end_date,
    content,
    contract_value,
    currency_code,
    change_reason,
    change_summary,
    created_by
  )
  SELECT
    c.id,
    v_new_version_number,
    (SELECT id FROM contract_version_history
     WHERE contract_id = c.id
     ORDER BY version_number DESC
     LIMIT 1),
    c.contract_number,
    c.title,
    c.contract_type,
    c.status,
    c.start_date,
    c.end_date,
    c.content,
    c.contract_value,
    c.currency_code,
    p_change_reason,
    p_change_summary,
    auth.uid()
  FROM contracts c
  WHERE c.id = p_contract_id
  RETURNING id INTO v_version_id;

  RETURN v_version_id;
END;
$$;

-- Fix trigger_create_contract_version function
CREATE OR REPLACE FUNCTION trigger_create_contract_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only create version if significant fields changed
  IF (OLD.title IS DISTINCT FROM NEW.title OR
      OLD.content IS DISTINCT FROM NEW.content OR
      OLD.start_date IS DISTINCT FROM NEW.start_date OR
      OLD.end_date IS DISTINCT FROM NEW.end_date OR
      OLD.contract_value IS DISTINCT FROM NEW.contract_value OR
      OLD.status IS DISTINCT FROM NEW.status OR
      OLD.currency_code IS DISTINCT FROM NEW.currency_code) THEN

    PERFORM create_contract_version(
      NEW.id,
      'Automatic version on update',
      'Contract modified: ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 4. FIX SECURITY DEFINER VIEW
-- ============================================================================

-- Recreate view without SECURITY DEFINER (use SECURITY INVOKER instead)
DROP VIEW IF EXISTS revenue_by_currency;

CREATE VIEW revenue_by_currency
WITH (security_invoker = true)
AS
SELECT
  c.currency_code,
  cur.symbol,
  COUNT(DISTINCT c.id) as customer_count,
  SUM(c.monthly_recurring_revenue) as total_mrr_local,
  SUM(convert_currency(COALESCE(c.monthly_recurring_revenue, 0), c.currency_code, 'EUR')) as total_mrr_eur,
  AVG(c.monthly_recurring_revenue) as avg_mrr_local,
  SUM(c.credits_balance) as total_credits_remaining,
  SUM(c.credits_consumed_this_month) as total_credits_consumed_this_month
FROM customers c
LEFT JOIN currencies cur ON c.currency_code = cur.code
WHERE c.status = 'active'
GROUP BY c.currency_code, cur.symbol;

-- ============================================================================
-- 5. REMOVE UNUSED INDEXES
-- ============================================================================

-- Currency-related indexes (not used yet, will be valuable when reporting scales)
DROP INDEX IF EXISTS idx_currencies_active;
DROP INDEX IF EXISTS idx_customers_currency;
DROP INDEX IF EXISTS idx_invoices_currency;
DROP INDEX IF EXISTS idx_contracts_currency;
DROP INDEX IF EXISTS idx_enterprise_plans_currency;

-- Enterprise tier indexes (not used yet)
DROP INDEX IF EXISTS idx_customers_enterprise_tier;
DROP INDEX IF EXISTS idx_customers_credits_plan;

-- Capacity calendar indexes (not used yet)
DROP INDEX IF EXISTS idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS idx_capacity_calendar_partner;
DROP INDEX IF EXISTS idx_capacity_calendar_customer;
DROP INDEX IF EXISTS idx_capacity_calendar_project;
DROP INDEX IF EXISTS idx_capacity_calendar_dates;

-- Plan change request indexes (not used yet)
DROP INDEX IF EXISTS idx_plan_change_requests_approved_by;
DROP INDEX IF EXISTS idx_plan_changes_customer;
DROP INDEX IF EXISTS idx_plan_changes_status;
DROP INDEX IF EXISTS idx_plan_changes_effective_date;
DROP INDEX IF EXISTS idx_plan_change_requests_requested_by;

-- Invoice indexes (not used yet)
DROP INDEX IF EXISTS idx_invoices_customer;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_number;
DROP INDEX IF EXISTS idx_invoice_items_invoice;
DROP INDEX IF EXISTS idx_invoice_items_project;
DROP INDEX IF EXISTS idx_invoice_items_time;
DROP INDEX IF EXISTS idx_invoice_items_work_type;
DROP INDEX IF EXISTS idx_invoices_created_by;
DROP INDEX IF EXISTS idx_invoices_sent_by;
DROP INDEX IF EXISTS idx_invoice_audit_changed_by;
DROP INDEX IF EXISTS idx_invoice_audit_invoice;

-- Contract indexes (not used yet)
DROP INDEX IF EXISTS idx_contracts_customer;
DROP INDEX IF EXISTS idx_contracts_status;
DROP INDEX IF EXISTS idx_contract_templates_created_by;
DROP INDEX IF EXISTS idx_contracts_created_by;
DROP INDEX IF EXISTS idx_contracts_parent;
DROP INDEX IF EXISTS idx_contracts_renewed_by;
DROP INDEX IF EXISTS idx_contracts_template;
DROP INDEX IF EXISTS idx_contract_version_history_contract_id;
DROP INDEX IF EXISTS idx_contract_version_history_parent;
DROP INDEX IF EXISTS idx_contract_version_history_created_at;

-- Activity log indexes (not used yet)
DROP INDEX IF EXISTS idx_activity_log_actor_user;

-- Credits transaction indexes (not used yet)
DROP INDEX IF EXISTS idx_credits_trans_created_by;
DROP INDEX IF EXISTS idx_credits_trans_partner;
DROP INDEX IF EXISTS idx_credits_trans_time;
DROP INDEX IF EXISTS idx_credits_trans_customer_type;

-- Customer relationship indexes (not used yet)
DROP INDEX IF EXISTS idx_customers_success_mgr;
DROP INDEX IF EXISTS idx_customers_owner;
DROP INDEX IF EXISTS idx_customers_primary_partner;

-- Decision log indexes (not used yet)
DROP INDEX IF EXISTS idx_decision_log_created_by;
DROP INDEX IF EXISTS idx_decision_log_customer_id;
DROP INDEX IF EXISTS idx_decision_log_project_id;

-- Billing and capacity indexes (not used yet)
DROP INDEX IF EXISTS idx_billing_periods_customer_id;
DROP INDEX IF EXISTS idx_capacity_utilization_customer_id;
DROP INDEX IF EXISTS idx_capacity_utilization_partner_id;
DROP INDEX IF EXISTS idx_credits_forecast_customer_id;
DROP INDEX IF EXISTS idx_capacity_forecast_period;
DROP INDEX IF EXISTS idx_capacity_forecast_partner;
DROP INDEX IF EXISTS idx_capacity_forecast_customer;

-- Lead management indexes (not used yet)
DROP INDEX IF EXISTS idx_lead_customer_links_linked_by;
DROP INDEX IF EXISTS idx_lead_customer_links_customer;
DROP INDEX IF EXISTS idx_lead_notes_created_by;

-- Margin analysis indexes (not used yet)
DROP INDEX IF EXISTS idx_margin_analysis_customer_id;
DROP INDEX IF EXISTS idx_margin_analysis_project_id;

-- SLA and support indexes (not used yet)
DROP INDEX IF EXISTS idx_sla_tracking_customer_id;
DROP INDEX IF EXISTS idx_sla_tracking_ticket;
DROP INDEX IF EXISTS idx_support_responses_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_partner;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_project;
DROP INDEX IF EXISTS idx_support_tickets_customer_status;

-- System settings indexes (not used yet)
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_settings_audit_changed_by;

-- Time entry indexes (not used yet)
DROP INDEX IF EXISTS idx_time_entries_work_type_id;
DROP INDEX IF EXISTS idx_time_entries_customer;
DROP INDEX IF EXISTS idx_time_entries_partner;
DROP INDEX IF EXISTS idx_time_entries_project;
DROP INDEX IF EXISTS idx_time_entries_date_customer;
DROP INDEX IF EXISTS idx_time_entries_date_project;

-- Work type indexes (not used yet)
DROP INDEX IF EXISTS idx_work_types_updated_by;

-- Enterprise benefit indexes (not used yet)
DROP INDEX IF EXISTS idx_enterprise_benefits_granted;

-- Note indexes (not used yet)
DROP INDEX IF EXISTS idx_notes_customer;
DROP INDEX IF EXISTS idx_notes_partner;
DROP INDEX IF EXISTS idx_notes_project;

-- Partner indexes (not used yet)
DROP INDEX IF EXISTS idx_partner_cost_rates_created_by;
DROP INDEX IF EXISTS idx_partner_perf_partner;
DROP INDEX IF EXISTS idx_partner_work_type_assign_type;
DROP INDEX IF EXISTS idx_partner_workload_rec_partner;
DROP INDEX IF EXISTS idx_partners_role;

-- Project indexes (not used yet)
DROP INDEX IF EXISTS idx_projects_customer_status;

-- Recommendation indexes (not used yet)
DROP INDEX IF EXISTS idx_recommendations_actioned_by;
DROP INDEX IF EXISTS idx_recommendations_customer;
DROP INDEX IF EXISTS idx_recommendations_project;
DROP INDEX IF EXISTS idx_recommendations_status_priority;

-- Status change log indexes (not used yet)
DROP INDEX IF EXISTS idx_status_change_log_changed_by;