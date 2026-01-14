/*
  # Fix Unindexed Foreign Keys - Part 2
  
  1. Purpose
    - Add missing indexes to foreign key columns for optimal query performance
    - This migration covers tables C-L (customers through lean_pivot_decisions)
  
  2. Changes
    - Add indexes for foreign key columns that were previously unindexed
    - All indexes use IF NOT EXISTS to ensure idempotency
  
  3. Performance Impact
    - Significantly improves JOIN performance
    - Reduces query execution time for foreign key lookups
*/

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_currency_code ON public.customers(currency_code);
CREATE INDEX IF NOT EXISTS idx_customers_dedicated_success_manager ON public.customers(dedicated_success_manager);
CREATE INDEX IF NOT EXISTS idx_customers_owner_admin_id ON public.customers(owner_admin_id);
CREATE INDEX IF NOT EXISTS idx_customers_primary_partner_id ON public.customers(primary_partner_id);

-- Decision Log
CREATE INDEX IF NOT EXISTS idx_decision_log_created_by ON public.decision_log(created_by);
CREATE INDEX IF NOT EXISTS idx_decision_log_customer_id ON public.decision_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_decision_log_project_id ON public.decision_log(project_id);

-- Design Thinking
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_business_model_id ON public.design_thinking_projects(business_model_id);
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_created_by ON public.design_thinking_projects(created_by);

-- Development
CREATE INDEX IF NOT EXISTS idx_development_actions_competency_id ON public.development_actions(competency_id);
CREATE INDEX IF NOT EXISTS idx_development_actions_development_plan_id ON public.development_actions(development_plan_id);
CREATE INDEX IF NOT EXISTS idx_development_plans_participant_id ON public.development_plans(participant_id);

-- DT (Design Thinking)
CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_persona_id ON public.dt_empathy_maps(persona_id);
CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_project_id ON public.dt_empathy_maps(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_ideas_created_by ON public.dt_ideas(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_ideas_project_id ON public.dt_ideas(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_insights_created_by ON public.dt_insights(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_insights_project_id ON public.dt_insights(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_persona_id ON public.dt_journey_maps(persona_id);
CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_project_id ON public.dt_journey_maps(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_personas_project_id ON public.dt_personas(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_phases_project_id ON public.dt_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_created_by ON public.dt_prototypes(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_idea_id ON public.dt_prototypes(idea_id);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_project_id ON public.dt_prototypes(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_created_by ON public.dt_user_tests(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_project_id ON public.dt_user_tests(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_prototype_id ON public.dt_user_tests(prototype_id);

-- Email
CREATE INDEX IF NOT EXISTS idx_email_delivery_log_sent_by ON public.email_delivery_log(sent_by);

-- Enterprise
CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_granted_by ON public.enterprise_benefits(granted_by);
CREATE INDEX IF NOT EXISTS idx_enterprise_plans_currency_code ON public.enterprise_plans(currency_code);

-- FX
CREATE INDEX IF NOT EXISTS idx_fx_rate_history_recorded_by ON public.fx_rate_history(recorded_by);

-- Goals
CREATE INDEX IF NOT EXISTS idx_goal_metrics_strategic_goal_id ON public.goal_metrics(strategic_goal_id);

-- Growth
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_assigned_to_partner_id ON public.growth_initiatives(assigned_to_partner_id);
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_growth_objective_id ON public.growth_initiatives(growth_objective_id);
CREATE INDEX IF NOT EXISTS idx_growth_milestones_growth_initiative_id ON public.growth_milestones(growth_initiative_id);
CREATE INDEX IF NOT EXISTS idx_growth_milestones_growth_objective_id ON public.growth_milestones(growth_objective_id);
CREATE INDEX IF NOT EXISTS idx_growth_objectives_growth_plan_id ON public.growth_objectives(growth_plan_id);
CREATE INDEX IF NOT EXISTS idx_growth_plans_created_by ON public.growth_plans(created_by);

-- Invoice
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_changed_by ON public.invoice_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_invoice_id ON public.invoice_audit_log(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON public.invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_project_id ON public.invoice_line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_time_entry_id ON public.invoice_line_items(time_entry_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_work_type_id ON public.invoice_line_items(work_type_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_currency_code ON public.invoices(currency_code);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_sent_by ON public.invoices(sent_by);

-- Lead
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_linked_by ON public.lead_customer_links(linked_by);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_by ON public.lead_notes(created_by);

-- Leadership
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_created_by ON public.leadership_assessments(created_by);

-- Lean
CREATE INDEX IF NOT EXISTS idx_lean_customer_segments_experiment_id ON public.lean_customer_segments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_business_model_id ON public.lean_experiments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_created_by ON public.lean_experiments(created_by);
CREATE INDEX IF NOT EXISTS idx_lean_feedback_experiment_id ON public.lean_feedback(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_experiment_id ON public.lean_hypotheses(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_metrics_experiment_id ON public.lean_metrics(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_mvp_features_experiment_id ON public.lean_mvp_features(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_created_by ON public.lean_pivot_decisions(created_by);
CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_experiment_id ON public.lean_pivot_decisions(experiment_id);
