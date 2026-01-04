/*
  # Add Remaining Unindexed Foreign Keys - Part 4
  
  1. Summary
    - Add indexes for foreign keys that still lack covering indexes
    - Part 4 covers margin through time_entry tables (final part)
  
  2. Performance Impact
    - Completes comprehensive foreign key indexing
*/

-- Margin
CREATE INDEX IF NOT EXISTS idx_margin_analysis_customer_id 
ON margin_analysis(customer_id);

CREATE INDEX IF NOT EXISTS idx_margin_analysis_project_id 
ON margin_analysis(project_id);

-- Marketing
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_assigned_partner_id 
ON marketing_campaigns(assigned_partner_id);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_by 
ON marketing_campaigns(created_by);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_customer_id 
ON marketing_campaigns(customer_id);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_project_id 
ON marketing_campaigns(project_id);

-- McKinsey
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_business_model_id 
ON mckinsey_7s_assessments(business_model_id);

CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_customer_id 
ON mckinsey_7s_assessments(customer_id);

CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_elements_assessment_id 
ON mckinsey_7s_elements(assessment_id);

CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assigned_to 
ON mckinsey_7s_improvements(assigned_to);

-- Notes
CREATE INDEX IF NOT EXISTS idx_notes_customer_id 
ON notes(customer_id);

CREATE INDEX IF NOT EXISTS idx_notes_partner_id 
ON notes(partner_id);

CREATE INDEX IF NOT EXISTS idx_notes_project_id 
ON notes(project_id);

-- OKR
CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective_id 
ON okr_key_results(objective_id);

CREATE INDEX IF NOT EXISTS idx_okr_key_results_owner_id 
ON okr_key_results(owner_id);

CREATE INDEX IF NOT EXISTS idx_okr_objectives_customer_id 
ON okr_objectives(customer_id);

CREATE INDEX IF NOT EXISTS idx_okr_objectives_owner_id 
ON okr_objectives(owner_id);

CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_key_result_id 
ON okr_progress_updates(key_result_id);

CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_updated_by 
ON okr_progress_updates(updated_by);

-- Partners
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_created_by 
ON partner_cost_rates(created_by);

CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_partner_id 
ON partner_cost_rates(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_partner_id 
ON partner_performance_metrics(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_work_type_assignments_work_type_id 
ON partner_work_type_assignments(work_type_id);

CREATE INDEX IF NOT EXISTS idx_partner_workload_recommendations_partner_id 
ON partner_workload_recommendations(partner_id);

CREATE INDEX IF NOT EXISTS idx_partners_role_id 
ON partners(role_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_by 
ON payment_transactions(created_by);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer_id 
ON payment_transactions(customer_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice_id 
ON payment_transactions(invoice_id);

-- Plans
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_approved_by 
ON plan_change_requests(approved_by);

CREATE INDEX IF NOT EXISTS idx_plan_change_requests_customer_id 
ON plan_change_requests(customer_id);

CREATE INDEX IF NOT EXISTS idx_plan_change_requests_requested_by 
ON plan_change_requests(requested_by);

-- Porter
CREATE INDEX IF NOT EXISTS idx_porter_analyses_customer_id 
ON porter_analyses(customer_id);

CREATE INDEX IF NOT EXISTS idx_porter_forces_porter_analysis_id 
ON porter_forces(porter_analysis_id);

-- Practice
CREATE INDEX IF NOT EXISTS idx_practice_categories_parent_category_id 
ON practice_categories(parent_category_id);

-- Recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_actioned_by 
ON recommendations(actioned_by);

CREATE INDEX IF NOT EXISTS idx_recommendations_customer_id 
ON recommendations(customer_id);

CREATE INDEX IF NOT EXISTS idx_recommendations_project_id 
ON recommendations(project_id);

-- SLA
CREATE INDEX IF NOT EXISTS idx_sla_tracking_customer_id 
ON sla_tracking(customer_id);

CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket_id 
ON sla_tracking(ticket_id);

-- Strategic
CREATE INDEX IF NOT EXISTS idx_strategic_goals_customer_id 
ON strategic_goals(customer_id);

CREATE INDEX IF NOT EXISTS idx_strategic_goals_growth_plan_id 
ON strategic_goals(growth_plan_id);

-- Support
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id 
ON support_responses(ticket_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_partner_id 
ON support_tickets(assigned_partner_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to 
ON support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id 
ON support_tickets(customer_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_project_id 
ON support_tickets(project_id);

-- SWOT
CREATE INDEX IF NOT EXISTS idx_swot_analyses_customer_id 
ON swot_analyses(customer_id);

CREATE INDEX IF NOT EXISTS idx_swot_items_swot_analysis_id 
ON swot_items(swot_analysis_id);

-- System
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
ON system_settings(updated_by);

-- Time
CREATE INDEX IF NOT EXISTS idx_time_entries_customer_id 
ON time_entries(customer_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_partner_id 
ON time_entries(partner_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_project_id 
ON time_entries(project_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_work_type_id 
ON time_entries(work_type_id);

CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_customer_id 
ON time_entry_invoice_mapping(customer_id);

CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_invoice_line_item_id 
ON time_entry_invoice_mapping(invoice_line_item_id);

CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_mapped_by 
ON time_entry_invoice_mapping(mapped_by);

-- User
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id 
ON user_profiles(customer_id);

-- Work Types
CREATE INDEX IF NOT EXISTS idx_work_types_updated_by 
ON work_types(updated_by);
