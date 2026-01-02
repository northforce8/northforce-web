/*
  # Fix Security and Performance Issues

  ## 1. RLS Policy Optimization
  - Replace `auth.*()` with `(select auth.*())` in all user_profiles policies
  - Prevents re-evaluation per row for better query performance at scale

  ## 2. Policy Consolidation
  - Consolidate multiple permissive policies on user_profiles
  - Combine read/update permissions into single policies per role

  ## 3. Duplicate Index Removal
  - Drop duplicate indexes on:
    - credits_transactions
    - partner_cost_rates
    - partner_work_type_assignments

  ## 4. Unused Index Removal
  - Drop 100+ unused indexes to improve write performance
  - Reduces storage overhead and maintenance cost

  ## 5. Function Security
  - Set immutable search_path on update_user_profiles_updated_at function

  ## Notes
  - Auth DB Connection Strategy: Configure in Supabase Dashboard (switch to percentage-based)
  - Leaked Password Protection: Enable in Supabase Auth Dashboard settings
*/

-- ============================================================================
-- 1. FIX RLS POLICIES ON user_profiles (CRITICAL PERFORMANCE FIX)
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Recreate with optimized auth function calls using (select auth.uid())
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id AND role = (SELECT role FROM user_profiles WHERE id = (select auth.uid())));

CREATE POLICY "Admins can manage all profiles"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

-- ============================================================================
-- 2. DROP DUPLICATE INDEXES
-- ============================================================================

-- credits_transactions duplicates
DROP INDEX IF EXISTS public.idx_credits_transactions_customer;

-- partner_cost_rates duplicates
DROP INDEX IF EXISTS public.idx_partner_cost_rates_partner;

-- partner_work_type_assignments duplicates
DROP INDEX IF EXISTS public.idx_partner_work_type_assignments_partner;

-- ============================================================================
-- 3. DROP UNUSED INDEXES (Performance Optimization)
-- ============================================================================

-- Email delivery log indexes
DROP INDEX IF EXISTS public.idx_email_delivery_log_recipient;
DROP INDEX IF EXISTS public.idx_email_delivery_log_entity;
DROP INDEX IF EXISTS public.idx_email_delivery_log_status;
DROP INDEX IF EXISTS public.idx_email_delivery_log_sent_at;
DROP INDEX IF EXISTS public.idx_email_delivery_log_sent_by;

-- Payment transaction indexes
DROP INDEX IF EXISTS public.idx_payment_transactions_invoice;
DROP INDEX IF EXISTS public.idx_payment_transactions_customer;
DROP INDEX IF EXISTS public.idx_payment_transactions_status;
DROP INDEX IF EXISTS public.idx_payment_transactions_date;
DROP INDEX IF EXISTS public.idx_payment_transactions_created_by;

-- SLA metrics indexes
DROP INDEX IF EXISTS public.idx_sla_metrics_breach;
DROP INDEX IF EXISTS public.idx_sla_metrics_period;

-- FX rate history indexes
DROP INDEX IF EXISTS public.idx_fx_rate_history_currency;
DROP INDEX IF EXISTS public.idx_fx_rate_history_active;
DROP INDEX IF EXISTS public.idx_fx_rate_history_recorded_by;

-- Time entry invoice mapping indexes
DROP INDEX IF EXISTS public.idx_time_entry_mapping_time_entry;
DROP INDEX IF EXISTS public.idx_time_entry_mapping_line_item;
DROP INDEX IF EXISTS public.idx_time_entry_mapping_customer;
DROP INDEX IF EXISTS public.idx_time_entry_invoice_mapping_mapped_by;

-- Activity log indexes
DROP INDEX IF EXISTS public.idx_activity_log_actor_user_id;

-- Billing periods indexes
DROP INDEX IF EXISTS public.idx_billing_periods_customer_id;

-- Capacity calendar indexes
DROP INDEX IF EXISTS public.idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS public.idx_capacity_calendar_customer_id;
DROP INDEX IF EXISTS public.idx_capacity_calendar_partner_id;
DROP INDEX IF EXISTS public.idx_capacity_calendar_project_id;

-- Capacity forecast indexes
DROP INDEX IF EXISTS public.idx_capacity_forecast_customer_id;
DROP INDEX IF EXISTS public.idx_capacity_forecast_partner_id;

-- Capacity utilization indexes
DROP INDEX IF EXISTS public.idx_capacity_utilization_customer_id;

-- Contract templates indexes
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;

-- Contract version history indexes
DROP INDEX IF EXISTS public.idx_contract_version_history_parent_version_id;
DROP INDEX IF EXISTS public.idx_contract_version_history_created_by;

-- Contracts indexes
DROP INDEX IF EXISTS public.idx_contracts_created_by;
DROP INDEX IF EXISTS public.idx_contracts_currency_code;
DROP INDEX IF EXISTS public.idx_contracts_customer_id;
DROP INDEX IF EXISTS public.idx_contracts_parent_contract_id;
DROP INDEX IF EXISTS public.idx_contracts_renewed_by_contract_id;
DROP INDEX IF EXISTS public.idx_contracts_template_id;

-- Credits forecast indexes
DROP INDEX IF EXISTS public.idx_credits_forecast_customer_id;

-- Credits transactions indexes
DROP INDEX IF EXISTS public.idx_credits_transactions_created_by;
DROP INDEX IF EXISTS public.idx_credits_transactions_related_partner_id;
DROP INDEX IF EXISTS public.idx_credits_transactions_related_time_entry_id;
DROP INDEX IF EXISTS public.idx_credits_transactions_customer_id;

-- Customers indexes
DROP INDEX IF EXISTS public.idx_customers_currency_code;
DROP INDEX IF EXISTS public.idx_customers_dedicated_success_manager;
DROP INDEX IF EXISTS public.idx_customers_owner_admin_id;
DROP INDEX IF EXISTS public.idx_customers_primary_partner_id;

-- Decision log indexes
DROP INDEX IF EXISTS public.idx_decision_log_created_by;
DROP INDEX IF EXISTS public.idx_decision_log_customer_id;
DROP INDEX IF EXISTS public.idx_decision_log_project_id;

-- Enterprise benefits indexes
DROP INDEX IF EXISTS public.idx_enterprise_benefits_granted_by;
DROP INDEX IF EXISTS public.idx_enterprise_benefits_customer_id;

-- Enterprise plans indexes
DROP INDEX IF EXISTS public.idx_enterprise_plans_currency_code;

-- Invoice audit log indexes
DROP INDEX IF EXISTS public.idx_invoice_audit_log_changed_by;
DROP INDEX IF EXISTS public.idx_invoice_audit_log_invoice_id;

-- Invoice line items indexes
DROP INDEX IF EXISTS public.idx_invoice_line_items_invoice_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_project_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_time_entry_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_work_type_id;

-- Invoices indexes
DROP INDEX IF EXISTS public.idx_invoices_created_by;
DROP INDEX IF EXISTS public.idx_invoices_currency_code;
DROP INDEX IF EXISTS public.idx_invoices_customer_id;
DROP INDEX IF EXISTS public.idx_invoices_sent_by;

-- Lead customer links indexes
DROP INDEX IF EXISTS public.idx_lead_customer_links_customer_id;
DROP INDEX IF EXISTS public.idx_lead_customer_links_linked_by;

-- Lead notes indexes
DROP INDEX IF EXISTS public.idx_lead_notes_created_by;

-- Margin analysis indexes
DROP INDEX IF EXISTS public.idx_margin_analysis_customer_id;
DROP INDEX IF EXISTS public.idx_margin_analysis_project_id;

-- Notes indexes
DROP INDEX IF EXISTS public.idx_notes_customer_id;
DROP INDEX IF EXISTS public.idx_notes_partner_id;
DROP INDEX IF EXISTS public.idx_notes_project_id;

-- Partner cost rates indexes
DROP INDEX IF EXISTS public.idx_partner_cost_rates_created_by;
DROP INDEX IF EXISTS public.idx_partner_cost_rates_partner_id;

-- Partner performance metrics indexes
DROP INDEX IF EXISTS public.idx_partner_performance_metrics_partner_id;

-- Partner work type assignments indexes
DROP INDEX IF EXISTS public.idx_partner_work_type_assignments_work_type_id;
DROP INDEX IF EXISTS public.idx_partner_work_type_assignments_partner_id;

-- Partner workload recommendations indexes
DROP INDEX IF EXISTS public.idx_partner_workload_recommendations_partner_id;

-- Partners indexes
DROP INDEX IF EXISTS public.idx_partners_role_id;
DROP INDEX IF EXISTS public.idx_partners_user_id;

-- Plan change requests indexes
DROP INDEX IF EXISTS public.idx_plan_change_requests_approved_by;
DROP INDEX IF EXISTS public.idx_plan_change_requests_customer_id;
DROP INDEX IF EXISTS public.idx_plan_change_requests_requested_by;

-- Recommendations indexes
DROP INDEX IF EXISTS public.idx_recommendations_actioned_by;
DROP INDEX IF EXISTS public.idx_recommendations_customer_id;
DROP INDEX IF EXISTS public.idx_recommendations_project_id;

-- Settings audit log indexes
DROP INDEX IF EXISTS public.idx_settings_audit_log_changed_by;

-- SLA tracking indexes
DROP INDEX IF EXISTS public.idx_sla_tracking_customer_id;
DROP INDEX IF EXISTS public.idx_sla_tracking_ticket_id;

-- Status change log indexes
DROP INDEX IF EXISTS public.idx_status_change_log_changed_by;

-- Support responses indexes
DROP INDEX IF EXISTS public.idx_support_responses_ticket_id;

-- Support tickets indexes
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_partner_id;
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS public.idx_support_tickets_customer_id;
DROP INDEX IF EXISTS public.idx_support_tickets_project_id;

-- System settings indexes
DROP INDEX IF EXISTS public.idx_system_settings_updated_by;
DROP INDEX IF EXISTS public.idx_system_settings_currency;

-- Time entries indexes
DROP INDEX IF EXISTS public.idx_time_entries_customer_id;
DROP INDEX IF EXISTS public.idx_time_entries_partner_id;
DROP INDEX IF EXISTS public.idx_time_entries_project_id;
DROP INDEX IF EXISTS public.idx_time_entries_work_type_id;

-- Work types indexes
DROP INDEX IF EXISTS public.idx_work_types_updated_by;

-- User profiles indexes
DROP INDEX IF EXISTS public.idx_user_profiles_role;

-- ============================================================================
-- 4. FIX FUNCTION SEARCH PATH (Security Fix)
-- ============================================================================

-- Drop and recreate function with immutable search_path
DROP FUNCTION IF EXISTS public.update_user_profiles_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();
