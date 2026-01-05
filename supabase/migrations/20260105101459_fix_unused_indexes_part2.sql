/*
  # Remove Unused Indexes - Part 2
  
  1. Changes
    - Remove unused indexes (Part 2 of 6)
  
  2. Security
    - Reduces database bloat by removing unused indexes
*/

DROP INDEX IF EXISTS public.idx_lean_hypotheses_experiment_id;
DROP INDEX IF EXISTS public.idx_lean_pivot_decisions_created_by;
DROP INDEX IF EXISTS public.idx_margin_analysis_customer_id;
DROP INDEX IF EXISTS public.idx_margin_analysis_project_id;
DROP INDEX IF EXISTS public.idx_marketing_campaigns_assigned_partner_id;
DROP INDEX IF EXISTS public.idx_marketing_campaigns_created_by;
DROP INDEX IF EXISTS public.idx_mckinsey_7s_assessments_business_model_id;
DROP INDEX IF EXISTS public.idx_mckinsey_7s_elements_assessment_id;
DROP INDEX IF EXISTS public.idx_mckinsey_7s_improvements_assigned_to;
DROP INDEX IF EXISTS public.idx_notes_customer_id;
DROP INDEX IF EXISTS public.idx_notes_partner_id;
DROP INDEX IF EXISTS public.idx_notes_project_id;
DROP INDEX IF EXISTS public.idx_okr_key_results_objective_id;
DROP INDEX IF EXISTS public.idx_okr_key_results_owner_id;
DROP INDEX IF EXISTS public.idx_okr_objectives_owner_id;
DROP INDEX IF EXISTS public.idx_okr_progress_updates_key_result_id;
DROP INDEX IF EXISTS public.idx_okr_progress_updates_updated_by;
DROP INDEX IF EXISTS public.idx_partner_cost_rates_created_by;
DROP INDEX IF EXISTS public.idx_partner_performance_metrics_partner_id;
DROP INDEX IF EXISTS public.idx_partner_work_type_assignments_work_type_id;
DROP INDEX IF EXISTS public.idx_partner_workload_recommendations_partner_id;
DROP INDEX IF EXISTS public.idx_partners_role_id;
DROP INDEX IF EXISTS public.idx_payment_transactions_created_by;
DROP INDEX IF EXISTS public.idx_payment_transactions_invoice_id;
DROP INDEX IF EXISTS public.idx_plan_change_requests_approved_by;
DROP INDEX IF EXISTS public.idx_plan_change_requests_requested_by;
DROP INDEX IF EXISTS public.idx_porter_forces_porter_analysis_id;
DROP INDEX IF EXISTS public.idx_practice_categories_parent_category_id;
DROP INDEX IF EXISTS public.idx_recommendations_actioned_by;
DROP INDEX IF EXISTS public.idx_recommendations_customer_id;
DROP INDEX IF EXISTS public.idx_recommendations_project_id;
DROP INDEX IF EXISTS public.idx_sla_tracking_ticket_id;
DROP INDEX IF EXISTS public.idx_strategic_goals_growth_plan_id;
DROP INDEX IF EXISTS public.idx_support_responses_ticket_id;
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_partner_id;
DROP INDEX IF EXISTS public.idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS public.idx_support_tickets_customer_id;
DROP INDEX IF EXISTS public.idx_support_tickets_project_id;
DROP INDEX IF EXISTS public.idx_swot_items_swot_analysis_id;
DROP INDEX IF EXISTS public.idx_system_settings_updated_by;
DROP INDEX IF EXISTS public.idx_time_entries_customer_id;
DROP INDEX IF EXISTS public.idx_time_entries_partner_id;
DROP INDEX IF EXISTS public.idx_time_entries_project_id;
DROP INDEX IF EXISTS public.idx_time_entries_work_type_id;
DROP INDEX IF EXISTS public.idx_time_entry_invoice_mapping_invoice_line_item_id;
DROP INDEX IF EXISTS public.idx_time_entry_invoice_mapping_mapped_by;
DROP INDEX IF EXISTS public.idx_work_types_updated_by;
DROP INDEX IF EXISTS public.idx_strategic_initiatives_customer;
DROP INDEX IF EXISTS public.idx_strategic_initiatives_project;
