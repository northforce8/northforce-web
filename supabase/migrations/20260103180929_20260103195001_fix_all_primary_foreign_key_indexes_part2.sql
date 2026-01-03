/*
  # Fix All Primary Foreign Key Indexes - Part 2
  
  1. Summary
    - Add covering indexes for next 50 primary foreign keys
    - Invoices, leads, lean, marketing systems
*/

-- Invoice System
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_changed_by ON invoice_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_invoice_id ON invoice_audit_log(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_project_id ON invoice_line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_time_entry_id ON invoice_line_items(time_entry_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_work_type_id ON invoice_line_items(work_type_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_currency_code ON invoices(currency_code);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_sent_by ON invoices(sent_by);

-- Lead Management
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_customer_id ON lead_customer_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_linked_by ON lead_customer_links(linked_by);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_by ON lead_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_customer_id ON leadership_assessments(customer_id);

-- Lean Startup
CREATE INDEX IF NOT EXISTS idx_lean_experiments_business_model_id ON lean_experiments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_customer_id ON lean_experiments(customer_id);
CREATE INDEX IF NOT EXISTS idx_lean_feedback_experiment_id ON lean_feedback(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_experiment_id ON lean_hypotheses(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_created_by ON lean_pivot_decisions(created_by);

-- Margin Analysis
CREATE INDEX IF NOT EXISTS idx_margin_analysis_customer_id ON margin_analysis(customer_id);
CREATE INDEX IF NOT EXISTS idx_margin_analysis_project_id ON margin_analysis(project_id);

-- Marketing Campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_assigned_partner_id ON marketing_campaigns(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_by ON marketing_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_customer_id ON marketing_campaigns(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_project_id ON marketing_campaigns(project_id);

-- McKinsey 7S
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_business_model_id ON mckinsey_7s_assessments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_customer_id ON mckinsey_7s_assessments(customer_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_elements_assessment_id ON mckinsey_7s_elements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assigned_to ON mckinsey_7s_improvements(assigned_to);

-- Notes
CREATE INDEX IF NOT EXISTS idx_notes_customer_id ON notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_notes_partner_id ON notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);

-- OKR System
CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective_id ON okr_key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_okr_key_results_owner_id ON okr_key_results(owner_id);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_customer_id ON okr_objectives(customer_id);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_owner_id ON okr_objectives(owner_id);
CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_key_result_id ON okr_progress_updates(key_result_id);
CREATE INDEX IF NOT EXISTS idx_okr_progress_updates_updated_by ON okr_progress_updates(updated_by);

-- Partner Management
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_created_by ON partner_cost_rates(created_by);
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_partner_id ON partner_cost_rates(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_partner_id ON partner_performance_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_work_type_assignments_work_type_id ON partner_work_type_assignments(work_type_id);
CREATE INDEX IF NOT EXISTS idx_partner_workload_recommendations_partner_id ON partner_workload_recommendations(partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_role_id ON partners(role_id);
