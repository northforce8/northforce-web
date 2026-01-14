/*
  # Remove Unused Indexes - Part 1
  
  1. Purpose
    - Remove indexes that are not being used by queries
    - Reduces storage overhead and improves write performance
  
  2. Changes
    - Drop unused indexes from tables A-C
    - Indexes are not being utilized based on Postgres statistics
  
  3. Performance Impact
    - Reduces index maintenance overhead on INSERT/UPDATE/DELETE
    - Frees up storage space
    - No negative impact as these indexes are not being used
*/

-- Activity Log
DROP INDEX IF EXISTS idx_activity_log_actor_user_id;

-- ADKAR
DROP INDEX IF EXISTS idx_adkar_actions_assessment_id;
DROP INDEX IF EXISTS idx_adkar_actions_owner_id;
DROP INDEX IF EXISTS idx_adkar_assessments_assessed_by;
DROP INDEX IF EXISTS idx_adkar_assessments_initiative_id;

-- Agile
DROP INDEX IF EXISTS idx_agile_ceremonies_transformation_id;
DROP INDEX IF EXISTS idx_agile_maturity_assessments_transformation_id;
DROP INDEX IF EXISTS idx_agile_metrics_transformation_id;
DROP INDEX IF EXISTS idx_agile_sprints_team_id;
DROP INDEX IF EXISTS idx_agile_teams_team_lead_id;

-- Assessment
DROP INDEX IF EXISTS idx_assessment_scores_competency_id;

-- Balanced Scorecard
DROP INDEX IF EXISTS idx_balanced_scorecards_created_by;

-- Best Practices
DROP INDEX IF EXISTS idx_best_practices_created_by;

-- Business Model Canvas
DROP INDEX IF EXISTS idx_bmc_blocks_canvas_id;
DROP INDEX IF EXISTS idx_bsc_metrics_perspective_id;
DROP INDEX IF EXISTS idx_bsc_perspectives_scorecard_id;
DROP INDEX IF EXISTS idx_business_model_canvases_created_by;
DROP INDEX IF EXISTS idx_business_models_created_by;

-- Campaign
DROP INDEX IF EXISTS idx_campaign_activities_campaign_id;
DROP INDEX IF EXISTS idx_campaign_activities_partner_id;
DROP INDEX IF EXISTS idx_campaign_budgets_campaign_id;
DROP INDEX IF EXISTS idx_campaign_results_campaign_activity_id;
DROP INDEX IF EXISTS idx_campaign_results_campaign_id;

-- Capacity
DROP INDEX IF EXISTS idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS idx_capacity_calendar_customer_id;
DROP INDEX IF EXISTS idx_capacity_calendar_partner_id;
DROP INDEX IF EXISTS idx_capacity_calendar_project_id;
DROP INDEX IF EXISTS idx_capacity_forecast_partner_id;

-- Change
DROP INDEX IF EXISTS idx_change_initiatives_created_by;

-- Contract
DROP INDEX IF EXISTS idx_contract_templates_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_parent_version_id;
DROP INDEX IF EXISTS idx_contracts_created_by;
DROP INDEX IF EXISTS idx_contracts_currency_code;
DROP INDEX IF EXISTS idx_contracts_customer_id;
DROP INDEX IF EXISTS idx_contracts_parent_contract_id;
DROP INDEX IF EXISTS idx_contracts_renewed_by_contract_id;
DROP INDEX IF EXISTS idx_contracts_template_id;

-- Credits
DROP INDEX IF EXISTS idx_credits_transactions_created_by;
DROP INDEX IF EXISTS idx_credits_transactions_customer_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_partner_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_time_entry_id;

-- Customers
DROP INDEX IF EXISTS idx_customers_currency_code;
DROP INDEX IF EXISTS idx_customers_dedicated_success_manager;
DROP INDEX IF EXISTS idx_customers_owner_admin_id;
DROP INDEX IF EXISTS idx_customers_primary_partner_id;
