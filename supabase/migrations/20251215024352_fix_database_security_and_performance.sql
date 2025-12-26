/*
  # Database Security and Performance Fixes

  ## Overview
  This migration addresses critical security and performance issues identified by Supabase:
  - Adds missing indexes on foreign keys
  - Optimizes RLS policies with auth function calls
  - Removes unused indexes
  - Fixes function search paths

  ## Changes

  ### 1. Foreign Key Indexes
  Adds covering indexes for all foreign keys to improve query performance:
  - billing_periods.customer_id
  - capacity_utilization.customer_id, partner_id
  - credits_forecast.customer_id
  - decision_log.customer_id, project_id
  - lead_customer_links.linked_by
  - lead_notes.created_by
  - margin_analysis.customer_id, project_id
  - recommendations.customer_id
  - sla_tracking.customer_id
  - support_responses.ticket_id
  - support_tickets.customer_id
  - system_settings.updated_by
  - time_entries.work_type_id

  ### 2. RLS Policy Optimization
  Replaces `auth.<function>()` with `(select auth.<function>())` to avoid re-evaluation per row:
  - system_settings policies
  - settings_audit_log policies
  - lead_notes policies
  - lead_customer_links policies
  - lead_classifications policies

  ### 3. Unused Index Cleanup
  Removes indexes that are not being used by queries

  ### 4. Function Security
  Sets explicit search_path for functions to prevent search_path manipulation attacks

  ## Security Impact
  - HIGH: Foreign key indexes prevent slow queries and potential DoS
  - HIGH: RLS policy optimization prevents performance degradation at scale
  - MEDIUM: Function search_path fixes prevent injection attacks
  - LOW: Unused index removal improves write performance
*/

-- =====================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

-- billing_periods
CREATE INDEX IF NOT EXISTS idx_billing_periods_customer_id
  ON public.billing_periods(customer_id);

-- capacity_utilization
CREATE INDEX IF NOT EXISTS idx_capacity_utilization_customer_id
  ON public.capacity_utilization(customer_id);

CREATE INDEX IF NOT EXISTS idx_capacity_utilization_partner_id
  ON public.capacity_utilization(partner_id);

-- credits_forecast
CREATE INDEX IF NOT EXISTS idx_credits_forecast_customer_id
  ON public.credits_forecast(customer_id);

-- decision_log
CREATE INDEX IF NOT EXISTS idx_decision_log_customer_id
  ON public.decision_log(customer_id);

CREATE INDEX IF NOT EXISTS idx_decision_log_project_id
  ON public.decision_log(project_id);

-- lead_customer_links
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_linked_by
  ON public.lead_customer_links(linked_by);

-- lead_notes
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_by
  ON public.lead_notes(created_by);

-- margin_analysis
CREATE INDEX IF NOT EXISTS idx_margin_analysis_customer_id
  ON public.margin_analysis(customer_id);

CREATE INDEX IF NOT EXISTS idx_margin_analysis_project_id
  ON public.margin_analysis(project_id);

-- recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_customer_id
  ON public.recommendations(customer_id);

-- sla_tracking
CREATE INDEX IF NOT EXISTS idx_sla_tracking_customer_id
  ON public.sla_tracking(customer_id);

-- support_responses
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id
  ON public.support_responses(ticket_id);

-- support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id
  ON public.support_tickets(customer_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by
  ON public.system_settings(updated_by);

-- time_entries
CREATE INDEX IF NOT EXISTS idx_time_entries_work_type_id
  ON public.time_entries(work_type_id);

-- =====================================================
-- PART 2: OPTIMIZE RLS POLICIES
-- =====================================================

-- Drop and recreate system_settings policies with optimized auth calls
DROP POLICY IF EXISTS "Admins can read system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;

CREATE POLICY "Admins can read system settings"
  ON public.system_settings
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can update system settings"
  ON public.system_settings
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

-- Drop and recreate settings_audit_log policies
DROP POLICY IF EXISTS "Admins can read settings audit log" ON public.settings_audit_log;
DROP POLICY IF EXISTS "Admins can insert settings audit log" ON public.settings_audit_log;

CREATE POLICY "Admins can read settings audit log"
  ON public.settings_audit_log
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can insert settings audit log"
  ON public.settings_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

-- Drop and recreate lead_notes policies
DROP POLICY IF EXISTS "Admins can view all lead notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Admins can create lead notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Admins can update their own lead notes" ON public.lead_notes;

CREATE POLICY "Admins can view all lead notes"
  ON public.lead_notes
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can create lead notes"
  ON public.lead_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can update their own lead notes"
  ON public.lead_notes
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
    AND created_by = (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
    AND created_by = (SELECT auth.uid())
  );

-- Drop and recreate lead_customer_links policies
DROP POLICY IF EXISTS "Admins can view all lead-customer links" ON public.lead_customer_links;
DROP POLICY IF EXISTS "Admins can create lead-customer links" ON public.lead_customer_links;
DROP POLICY IF EXISTS "Admins can update lead-customer links" ON public.lead_customer_links;

CREATE POLICY "Admins can view all lead-customer links"
  ON public.lead_customer_links
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can create lead-customer links"
  ON public.lead_customer_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can update lead-customer links"
  ON public.lead_customer_links
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

-- Drop and recreate lead_classifications policies
DROP POLICY IF EXISTS "Admins can view all lead classifications" ON public.lead_classifications;
DROP POLICY IF EXISTS "Admins can create lead classifications" ON public.lead_classifications;
DROP POLICY IF EXISTS "Admins can update lead classifications" ON public.lead_classifications;

CREATE POLICY "Admins can view all lead classifications"
  ON public.lead_classifications
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can create lead classifications"
  ON public.lead_classifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Admins can update lead classifications"
  ON public.lead_classifications
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

-- =====================================================
-- PART 3: REMOVE UNUSED INDEXES
-- =====================================================

-- Activity log
DROP INDEX IF EXISTS public.idx_activity_log_actor_user_id;

-- Credits transactions
DROP INDEX IF EXISTS public.idx_credits_transactions_created_by;
DROP INDEX IF EXISTS public.idx_credits_transactions_partner;
DROP INDEX IF EXISTS public.idx_credits_transactions_time_entry;

-- Customer assignments
DROP INDEX IF EXISTS public.idx_customer_assignments_partner;

-- Customers
DROP INDEX IF EXISTS public.idx_customers_success_manager;
DROP INDEX IF EXISTS public.idx_customers_owner;
DROP INDEX IF EXISTS public.idx_customers_primary_partner;

-- Decision log
DROP INDEX IF EXISTS public.idx_decision_log_created_by;

-- Enterprise benefits
DROP INDEX IF EXISTS public.idx_enterprise_benefits_granted_by;

-- Notes
DROP INDEX IF EXISTS public.idx_notes_customer;
DROP INDEX IF EXISTS public.idx_notes_partner;
DROP INDEX IF EXISTS public.idx_notes_project;

-- Partner cost rates
DROP INDEX IF EXISTS public.idx_partner_cost_rates_created_by;

-- Project assignments
DROP INDEX IF EXISTS public.idx_project_assignments_partner;

-- Recommendations
DROP INDEX IF EXISTS public.idx_recommendations_actioned_by;
DROP INDEX IF EXISTS public.idx_recommendations_project;

-- SLA tracking
DROP INDEX IF EXISTS public.idx_sla_tracking_ticket;

-- Status change log
DROP INDEX IF EXISTS public.idx_status_change_log_changed_by;

-- Support tickets
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_partner;
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS public.idx_support_tickets_project;

-- Time entries
DROP INDEX IF EXISTS public.idx_time_entries_customer;
DROP INDEX IF EXISTS public.idx_time_entries_partner;
DROP INDEX IF EXISTS public.idx_time_entries_project;
DROP INDEX IF EXISTS public.idx_time_entries_date_customer;

-- Lead customer links
DROP INDEX IF EXISTS public.idx_lead_customer_links_customer;

-- Lead classifications
DROP INDEX IF EXISTS public.idx_lead_classifications_lead;

-- Submissions
DROP INDEX IF EXISTS public.idx_contact_submissions_status;
DROP INDEX IF EXISTS public.idx_booking_submissions_status;
DROP INDEX IF EXISTS public.idx_newsletter_submissions_status;

-- Work types
DROP INDEX IF EXISTS public.idx_work_types_updated_by;

-- Settings audit log
DROP INDEX IF EXISTS public.idx_settings_audit_log_entity;
DROP INDEX IF EXISTS public.idx_settings_audit_log_changed_by;
DROP INDEX IF EXISTS public.idx_settings_audit_log_changed_at;
DROP INDEX IF EXISTS public.idx_settings_audit_log_field_name;

-- Lead notes
DROP INDEX IF EXISTS public.idx_lead_notes_lead;
DROP INDEX IF EXISTS public.idx_lead_notes_created_at;

-- Lead customer links (duplicate)
DROP INDEX IF EXISTS public.idx_lead_customer_links_lead;

-- =====================================================
-- PART 4: FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Fix check_work_type_usage function
CREATE OR REPLACE FUNCTION public.check_work_type_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.time_entries
    WHERE work_type_id = OLD.id
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Cannot delete work type that has time entries';
  END IF;
  RETURN OLD;
END;
$$;

-- Fix log_work_type_changes function
CREATE OR REPLACE FUNCTION public.log_work_type_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'name',
        OLD.name,
        NEW.name,
        NEW.updated_by,
        NOW()
      );
    END IF;

    IF NEW.rate IS DISTINCT FROM OLD.rate THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'rate',
        OLD.rate::text,
        NEW.rate::text,
        NEW.updated_by,
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Fix log_system_settings_changes function
CREATE OR REPLACE FUNCTION public.log_system_settings_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.value IS DISTINCT FROM OLD.value THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'system_setting',
        NEW.id,
        NEW.setting_key,
        OLD.value,
        NEW.value,
        NEW.updated_by,
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;