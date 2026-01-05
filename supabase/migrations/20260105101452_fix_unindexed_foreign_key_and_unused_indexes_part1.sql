/*
  # Fix Unindexed Foreign Key and Remove Unused Indexes - Part 1
  
  1. Changes
    - Add index for unindexed foreign key: framework_links_created_by_fkey
    - Remove unused indexes (Part 1 of 6 - first 50 indexes)
  
  2. Security
    - Improves query performance by indexing foreign key
    - Reduces database bloat by removing unused indexes
*/

-- Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_framework_links_created_by ON public.framework_links(created_by);

-- Remove unused indexes (Part 1)
DROP INDEX IF EXISTS public.idx_adkar_actions_assessment_id;
DROP INDEX IF EXISTS public.idx_adkar_assessments_initiative_id;
DROP INDEX IF EXISTS public.idx_agile_sprints_team_id;
DROP INDEX IF EXISTS public.idx_bmc_blocks_canvas_id;
DROP INDEX IF EXISTS public.idx_bsc_metrics_perspective_id;
DROP INDEX IF EXISTS public.idx_bsc_perspectives_scorecard_id;
DROP INDEX IF EXISTS public.idx_campaign_activities_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_activities_partner_id;
DROP INDEX IF EXISTS public.idx_campaign_budgets_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_results_campaign_activity_id;
DROP INDEX IF EXISTS public.idx_campaign_results_campaign_id;
DROP INDEX IF EXISTS public.idx_contracts_customer_id;
DROP INDEX IF EXISTS public.idx_decision_log_created_by;
DROP INDEX IF EXISTS public.idx_decision_log_customer_id;
DROP INDEX IF EXISTS public.idx_decision_log_project_id;
DROP INDEX IF EXISTS public.idx_design_thinking_projects_business_model_id;
DROP INDEX IF EXISTS public.idx_development_actions_competency_id;
DROP INDEX IF EXISTS public.idx_development_actions_development_plan_id;
DROP INDEX IF EXISTS public.idx_development_plans_participant_id;
DROP INDEX IF EXISTS public.idx_dt_ideas_created_by;
DROP INDEX IF EXISTS public.idx_dt_insights_created_by;
DROP INDEX IF EXISTS public.idx_dt_insights_project_id;
DROP INDEX IF EXISTS public.idx_dt_phases_project_id;
DROP INDEX IF EXISTS public.idx_dt_prototypes_created_by;
DROP INDEX IF EXISTS public.idx_dt_user_tests_created_by;
DROP INDEX IF EXISTS public.idx_email_delivery_log_sent_by;
DROP INDEX IF EXISTS public.idx_enterprise_benefits_granted_by;
DROP INDEX IF EXISTS public.idx_enterprise_plans_currency_code;
DROP INDEX IF EXISTS public.idx_fx_rate_history_recorded_by;
DROP INDEX IF EXISTS public.idx_goal_metrics_strategic_goal_id;
DROP INDEX IF EXISTS public.idx_growth_initiatives_assigned_to_partner_id;
DROP INDEX IF EXISTS public.idx_growth_initiatives_growth_objective_id;
DROP INDEX IF EXISTS public.idx_growth_milestones_growth_initiative_id;
DROP INDEX IF EXISTS public.idx_growth_milestones_growth_objective_id;
DROP INDEX IF EXISTS public.idx_growth_objectives_growth_plan_id;
DROP INDEX IF EXISTS public.idx_growth_plans_created_by;
DROP INDEX IF EXISTS public.idx_invoice_audit_log_changed_by;
DROP INDEX IF EXISTS public.idx_invoice_audit_log_invoice_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_invoice_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_project_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_time_entry_id;
DROP INDEX IF EXISTS public.idx_invoice_line_items_work_type_id;
DROP INDEX IF EXISTS public.idx_invoices_created_by;
DROP INDEX IF EXISTS public.idx_invoices_currency_code;
DROP INDEX IF EXISTS public.idx_invoices_customer_id;
DROP INDEX IF EXISTS public.idx_invoices_sent_by;
DROP INDEX IF EXISTS public.idx_lead_customer_links_linked_by;
DROP INDEX IF EXISTS public.idx_lead_notes_created_by;
DROP INDEX IF EXISTS public.idx_lean_experiments_business_model_id;
DROP INDEX IF EXISTS public.idx_lean_feedback_experiment_id;
