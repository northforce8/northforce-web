/*
  # Fix Unindexed Foreign Keys - Part 3
  
  1. Purpose
    - Add missing indexes to foreign key columns for optimal query performance
    - This migration covers tables M-W (margin_analysis through work_types)
  
  2. Changes
    - Add indexes for foreign key columns that were previously unindexed
    - All indexes use IF NOT EXISTS to ensure idempotency
  
  3. Performance Impact
    - Significantly improves JOIN performance
    - Reduces query execution time for foreign key lookups
*/

-- Margin
CREATE INDEX IF NOT EXISTS idx_margin_analysis_customer_id ON public.margin_analysis(customer_id);
CREATE INDEX IF NOT EXISTS idx_margin_analysis_project_id ON public.margin_analysis(project_id);

-- Marketing
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_assigned_partner_id ON public.marketing_campaigns(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_by ON public.marketing_campaigns(created_by);

-- McKinsey
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_business_model_id ON public.mckinsey_7s_assessments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_created_by ON public.mckinsey_7s_assessments(created_by);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_elements_assessment_id ON public.mckinsey_7s_elements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assessment_id ON public.mckinsey_7s_improvements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assigned_to ON public.mckinsey_7s_improvements(assigned_to);

-- Methodology
CREATE INDEX IF NOT EXISTS idx_methodology_templates_created_by ON public.methodology_templates(created_by);

-- Notes
CREATE INDEX IF NOT EXISTS idx_notes_customer_id ON public.notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_notes_partner_id ON public.notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON public.notes(project_id);

-- OKR
CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective_id ON public.okr_key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_owner_id ON public.okr_key_results(owner_id);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_owner_id ON public.okr_objectives(owner_id);
CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_key_result_id ON public.okr_progress_updates(key_result_id);
CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_updated_by ON public.okr_progress_updates(updated_by);

-- Partner
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_created_by ON public.partner_cost_rates(created_by);
CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_partner_id ON public.partner_performance_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_work_type_assignments_work_type_id ON public.partner_work_type_assignments(work_type_id);
CREATE INDEX IF NOT EXISTS idx_partner_workload_recommendations_partner_id ON public.partner_workload_recommendations(partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_role_id ON public.partners(role_id);

-- Payment
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_by ON public.payment_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice_id ON public.payment_transactions(invoice_id);

-- Plan
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_approved_by ON public.plan_change_requests(approved_by);
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_requested_by ON public.plan_change_requests(requested_by);

-- Porter
CREATE INDEX IF NOT EXISTS idx_porter_analyses_created_by ON public.porter_analyses(created_by);
CREATE INDEX IF NOT EXISTS idx_porter_forces_porter_analysis_id ON public.porter_forces(porter_analysis_id);

-- Practice
CREATE INDEX IF NOT EXISTS idx_practice_categories_parent_category_id ON public.practice_categories(parent_category_id);

-- Recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_actioned_by ON public.recommendations(actioned_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_customer_id ON public.recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_project_id ON public.recommendations(project_id);

-- Settings
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_changed_by ON public.settings_audit_log(changed_by);

-- SLA
CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket_id ON public.sla_tracking(ticket_id);

-- Status
CREATE INDEX IF NOT EXISTS idx_status_change_log_changed_by ON public.status_change_log(changed_by);

-- Strategic
CREATE INDEX IF NOT EXISTS idx_strategic_goals_growth_plan_id ON public.strategic_goals(growth_plan_id);
CREATE INDEX IF NOT EXISTS idx_strategic_initiatives_customer_id ON public.strategic_initiatives(customer_id);
CREATE INDEX IF NOT EXISTS idx_strategic_initiatives_project_id ON public.strategic_initiatives(project_id);

-- Support
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON public.support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_partner_id ON public.support_tickets(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_project_id ON public.support_tickets(project_id);

-- SWOT
CREATE INDEX IF NOT EXISTS idx_swot_analyses_created_by ON public.swot_analyses(created_by);
CREATE INDEX IF NOT EXISTS idx_swot_items_created_by ON public.swot_items(created_by);
CREATE INDEX IF NOT EXISTS idx_swot_items_swot_analysis_id ON public.swot_items(swot_analysis_id);

-- System
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON public.system_settings(updated_by);

-- Time
CREATE INDEX IF NOT EXISTS idx_time_entries_customer_id ON public.time_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_partner_id ON public.time_entries(partner_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_work_type_id ON public.time_entries(work_type_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_invoice_line_item_id ON public.time_entry_invoice_mapping(invoice_line_item_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_mapped_by ON public.time_entry_invoice_mapping(mapped_by);

-- Work
CREATE INDEX IF NOT EXISTS idx_work_types_updated_by ON public.work_types(updated_by);
