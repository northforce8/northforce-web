/*
  # Fix Unindexed Foreign Keys - Part 1
  
  1. Purpose
    - Add missing indexes to foreign key columns for optimal query performance
    - This migration covers tables A-C (activity_log through credits_transactions)
  
  2. Changes
    - Add indexes for foreign key columns that were previously unindexed
    - All indexes use IF NOT EXISTS to ensure idempotency
  
  3. Performance Impact
    - Significantly improves JOIN performance
    - Reduces query execution time for foreign key lookups
    - Essential for maintaining referential integrity checks
*/

-- Activity Log
CREATE INDEX IF NOT EXISTS idx_activity_log_actor_user_id ON public.activity_log(actor_user_id);

-- ADKAR
CREATE INDEX IF NOT EXISTS idx_adkar_actions_assessment_id ON public.adkar_actions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_adkar_actions_owner_id ON public.adkar_actions(owner_id);
CREATE INDEX IF NOT EXISTS idx_adkar_assessments_assessed_by ON public.adkar_assessments(assessed_by);
CREATE INDEX IF NOT EXISTS idx_adkar_assessments_initiative_id ON public.adkar_assessments(initiative_id);

-- Agile
CREATE INDEX IF NOT EXISTS idx_agile_ceremonies_transformation_id ON public.agile_ceremonies(transformation_id);
CREATE INDEX IF NOT EXISTS idx_agile_maturity_assessments_transformation_id ON public.agile_maturity_assessments(transformation_id);
CREATE INDEX IF NOT EXISTS idx_agile_metrics_transformation_id ON public.agile_metrics(transformation_id);
CREATE INDEX IF NOT EXISTS idx_agile_sprints_team_id ON public.agile_sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_agile_teams_team_lead_id ON public.agile_teams(team_lead_id);

-- Assessment
CREATE INDEX IF NOT EXISTS idx_assessment_scores_competency_id ON public.assessment_scores(competency_id);

-- Balanced Scorecard
CREATE INDEX IF NOT EXISTS idx_balanced_scorecards_created_by ON public.balanced_scorecards(created_by);

-- Best Practices
CREATE INDEX IF NOT EXISTS idx_best_practices_created_by ON public.best_practices(created_by);

-- Business Model Canvas
CREATE INDEX IF NOT EXISTS idx_bmc_blocks_canvas_id ON public.bmc_blocks(canvas_id);
CREATE INDEX IF NOT EXISTS idx_bsc_metrics_perspective_id ON public.bsc_metrics(perspective_id);
CREATE INDEX IF NOT EXISTS idx_bsc_perspectives_scorecard_id ON public.bsc_perspectives(scorecard_id);
CREATE INDEX IF NOT EXISTS idx_business_model_canvases_created_by ON public.business_model_canvases(created_by);
CREATE INDEX IF NOT EXISTS idx_business_models_created_by ON public.business_models(created_by);

-- Campaign
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign_id ON public.campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_partner_id ON public.campaign_activities(partner_id);
CREATE INDEX IF NOT EXISTS idx_campaign_budgets_campaign_id ON public.campaign_budgets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign_activity_id ON public.campaign_results(campaign_activity_id);
CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign_id ON public.campaign_results(campaign_id);

-- Capacity
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_created_by ON public.capacity_calendar(created_by);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_customer_id ON public.capacity_calendar(customer_id);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_partner_id ON public.capacity_calendar(partner_id);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_project_id ON public.capacity_calendar(project_id);
CREATE INDEX IF NOT EXISTS idx_capacity_forecast_partner_id ON public.capacity_forecast(partner_id);

-- Change
CREATE INDEX IF NOT EXISTS idx_change_initiatives_created_by ON public.change_initiatives(created_by);

-- Contract
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by ON public.contract_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_contract_version_history_created_by ON public.contract_version_history(created_by);
CREATE INDEX IF NOT EXISTS idx_contract_version_history_parent_version_id ON public.contract_version_history(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON public.contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_currency_code ON public.contracts(currency_code);
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON public.contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_parent_contract_id ON public.contracts(parent_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_renewed_by_contract_id ON public.contracts(renewed_by_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_template_id ON public.contracts(template_id);

-- Credits
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_by ON public.credits_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_customer_id ON public.credits_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_related_partner_id ON public.credits_transactions(related_partner_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_related_time_entry_id ON public.credits_transactions(related_time_entry_id);
