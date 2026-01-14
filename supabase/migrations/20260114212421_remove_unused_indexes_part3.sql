/*
  # Remove Unused Indexes - Part 3
  
  1. Purpose
    - Remove indexes that are not being used by queries
    - Reduces storage overhead and improves write performance
  
  2. Changes
    - Drop unused indexes from tables N-W
    - Indexes are not being utilized based on Postgres statistics
  
  3. Performance Impact
    - Reduces index maintenance overhead on INSERT/UPDATE/DELETE
    - Frees up storage space
*/

-- Notes
DROP INDEX IF EXISTS idx_notes_customer_id;
DROP INDEX IF EXISTS idx_notes_partner_id;
DROP INDEX IF EXISTS idx_notes_project_id;

-- OKR
DROP INDEX IF EXISTS idx_okr_key_results_objective_id;
DROP INDEX IF EXISTS idx_okr_key_results_owner_id;
DROP INDEX IF EXISTS idx_okr_objectives_owner_id;
DROP INDEX IF EXISTS idx_okr_progress_updates_key_result_id;
DROP INDEX IF EXISTS idx_okr_progress_updates_updated_by;

-- Partner
DROP INDEX IF EXISTS idx_partner_cost_rates_created_by;
DROP INDEX IF EXISTS idx_partner_performance_metrics_partner_id;
DROP INDEX IF EXISTS idx_partner_work_type_assignments_work_type_id;
DROP INDEX IF EXISTS idx_partner_workload_recommendations_partner_id;
DROP INDEX IF EXISTS idx_partners_role_id;

-- Payment
DROP INDEX IF EXISTS idx_payment_transactions_created_by;
DROP INDEX IF EXISTS idx_payment_transactions_invoice_id;

-- Plan
DROP INDEX IF EXISTS idx_plan_change_requests_approved_by;
DROP INDEX IF EXISTS idx_plan_change_requests_requested_by;

-- Porter
DROP INDEX IF EXISTS idx_porter_analyses_created_by;
DROP INDEX IF EXISTS idx_porter_forces_porter_analysis_id;

-- Practice
DROP INDEX IF EXISTS idx_practice_categories_parent_category_id;

-- Recommendations
DROP INDEX IF EXISTS idx_recommendations_actioned_by;
DROP INDEX IF EXISTS idx_recommendations_customer_id;
DROP INDEX IF EXISTS idx_recommendations_project_id;

-- Settings
DROP INDEX IF EXISTS idx_settings_audit_log_changed_by;

-- SLA
DROP INDEX IF EXISTS idx_sla_tracking_ticket_id;

-- Status
DROP INDEX IF EXISTS idx_status_change_log_changed_by;

-- Strategic
DROP INDEX IF EXISTS idx_strategic_goals_growth_plan_id;
DROP INDEX IF EXISTS idx_strategic_initiatives_customer_id;
DROP INDEX IF EXISTS idx_strategic_initiatives_project_id;

-- Support
DROP INDEX IF EXISTS idx_support_responses_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_partner_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_project_id;

-- SWOT
DROP INDEX IF EXISTS idx_swot_analyses_created_by;
DROP INDEX IF EXISTS idx_swot_items_created_by;
DROP INDEX IF EXISTS idx_swot_items_swot_analysis_id;

-- System
DROP INDEX IF EXISTS idx_system_settings_updated_by;

-- Time
DROP INDEX IF EXISTS idx_time_entries_customer_id;
DROP INDEX IF EXISTS idx_time_entries_partner_id;
DROP INDEX IF EXISTS idx_time_entries_project_id;
DROP INDEX IF EXISTS idx_time_entries_work_type_id;
DROP INDEX IF EXISTS idx_time_entry_invoice_mapping_invoice_line_item_id;
DROP INDEX IF EXISTS idx_time_entry_invoice_mapping_mapped_by;

-- Work
DROP INDEX IF EXISTS idx_work_types_updated_by;
