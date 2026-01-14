/*
  # Remove Unused Indexes - Part 2
  
  1. Purpose
    - Remove indexes that are not being used by queries
    - Reduces storage overhead and improves write performance
  
  2. Changes
    - Drop unused indexes from tables D-M
    - Indexes are not being utilized based on Postgres statistics
  
  3. Performance Impact
    - Reduces index maintenance overhead on INSERT/UPDATE/DELETE
    - Frees up storage space
*/

-- Decision Log
DROP INDEX IF EXISTS idx_decision_log_created_by;
DROP INDEX IF EXISTS idx_decision_log_customer_id;
DROP INDEX IF EXISTS idx_decision_log_project_id;

-- Design Thinking
DROP INDEX IF EXISTS idx_design_thinking_projects_business_model_id;
DROP INDEX IF EXISTS idx_design_thinking_projects_created_by;

-- Development
DROP INDEX IF EXISTS idx_development_actions_competency_id;
DROP INDEX IF EXISTS idx_development_actions_development_plan_id;
DROP INDEX IF EXISTS idx_development_plans_participant_id;

-- DT (Design Thinking)
DROP INDEX IF EXISTS idx_dt_empathy_maps_persona_id;
DROP INDEX IF EXISTS idx_dt_empathy_maps_project_id;
DROP INDEX IF EXISTS idx_dt_ideas_created_by;
DROP INDEX IF EXISTS idx_dt_ideas_project_id;
DROP INDEX IF EXISTS idx_dt_insights_created_by;
DROP INDEX IF EXISTS idx_dt_insights_project_id;
DROP INDEX IF EXISTS idx_dt_journey_maps_persona_id;
DROP INDEX IF EXISTS idx_dt_journey_maps_project_id;
DROP INDEX IF EXISTS idx_dt_personas_project_id;
DROP INDEX IF EXISTS idx_dt_phases_project_id;
DROP INDEX IF EXISTS idx_dt_prototypes_created_by;
DROP INDEX IF EXISTS idx_dt_prototypes_idea_id;
DROP INDEX IF EXISTS idx_dt_prototypes_project_id;
DROP INDEX IF EXISTS idx_dt_user_tests_created_by;
DROP INDEX IF EXISTS idx_dt_user_tests_project_id;
DROP INDEX IF EXISTS idx_dt_user_tests_prototype_id;

-- Email
DROP INDEX IF EXISTS idx_email_delivery_log_sent_by;

-- Enterprise
DROP INDEX IF EXISTS idx_enterprise_benefits_granted_by;
DROP INDEX IF EXISTS idx_enterprise_plans_currency_code;

-- FX
DROP INDEX IF EXISTS idx_fx_rate_history_recorded_by;

-- Goals
DROP INDEX IF EXISTS idx_goal_metrics_strategic_goal_id;

-- Growth
DROP INDEX IF EXISTS idx_growth_initiatives_assigned_to_partner_id;
DROP INDEX IF EXISTS idx_growth_initiatives_growth_objective_id;
DROP INDEX IF EXISTS idx_growth_milestones_growth_initiative_id;
DROP INDEX IF EXISTS idx_growth_milestones_growth_objective_id;
DROP INDEX IF EXISTS idx_growth_objectives_growth_plan_id;
DROP INDEX IF EXISTS idx_growth_plans_created_by;

-- Invoice
DROP INDEX IF EXISTS idx_invoice_audit_log_changed_by;
DROP INDEX IF EXISTS idx_invoice_audit_log_invoice_id;
DROP INDEX IF EXISTS idx_invoice_line_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_line_items_project_id;
DROP INDEX IF EXISTS idx_invoice_line_items_time_entry_id;
DROP INDEX IF EXISTS idx_invoice_line_items_work_type_id;
DROP INDEX IF EXISTS idx_invoices_created_by;
DROP INDEX IF EXISTS idx_invoices_currency_code;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_sent_by;

-- Lead
DROP INDEX IF EXISTS idx_lead_customer_links_linked_by;
DROP INDEX IF EXISTS idx_lead_notes_created_by;

-- Leadership
DROP INDEX IF EXISTS idx_leadership_assessments_created_by;

-- Lean
DROP INDEX IF EXISTS idx_lean_customer_segments_experiment_id;
DROP INDEX IF EXISTS idx_lean_experiments_business_model_id;
DROP INDEX IF EXISTS idx_lean_experiments_created_by;
DROP INDEX IF EXISTS idx_lean_feedback_experiment_id;
DROP INDEX IF EXISTS idx_lean_hypotheses_experiment_id;
DROP INDEX IF EXISTS idx_lean_metrics_experiment_id;
DROP INDEX IF EXISTS idx_lean_mvp_features_experiment_id;
DROP INDEX IF EXISTS idx_lean_pivot_decisions_created_by;
DROP INDEX IF EXISTS idx_lean_pivot_decisions_experiment_id;

-- Margin
DROP INDEX IF EXISTS idx_margin_analysis_customer_id;
DROP INDEX IF EXISTS idx_margin_analysis_project_id;

-- Marketing
DROP INDEX IF EXISTS idx_marketing_campaigns_assigned_partner_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_created_by;

-- McKinsey
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_business_model_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_created_by;
DROP INDEX IF EXISTS idx_mckinsey_7s_elements_assessment_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_assessment_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_assigned_to;

-- Methodology
DROP INDEX IF EXISTS idx_methodology_templates_created_by;
