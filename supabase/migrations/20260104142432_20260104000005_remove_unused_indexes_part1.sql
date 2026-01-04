/*
  # Remove Unused Indexes - Part 1
  
  1. Summary
    - Remove indexes that have not been used and are not essential
    - Improves write performance and reduces storage
    - Part 1 covers decision_log through dt_user_tests tables
  
  2. Performance Impact
    - Faster INSERT/UPDATE/DELETE operations
    - Reduced storage overhead
    - Lower index maintenance costs
*/

-- Decision Log
DROP INDEX IF EXISTS idx_decision_log_created_by;
DROP INDEX IF EXISTS idx_decision_log_customer_id;
DROP INDEX IF EXISTS idx_decision_log_project_id;

-- ADKAR
DROP INDEX IF EXISTS idx_adkar_actions_assessment_id;
DROP INDEX IF EXISTS idx_adkar_assessments_initiative_id;

-- Agile
DROP INDEX IF EXISTS idx_agile_sprints_team_id;
DROP INDEX IF EXISTS idx_agile_teams_customer_id;

-- Balanced Scorecard
DROP INDEX IF EXISTS idx_balanced_scorecards_customer_id;
DROP INDEX IF EXISTS idx_bmc_blocks_canvas_id;
DROP INDEX IF EXISTS idx_bsc_metrics_perspective_id;
DROP INDEX IF EXISTS idx_bsc_perspectives_scorecard_id;

-- Billing
DROP INDEX IF EXISTS idx_billing_periods_customer_id;

-- Business Model Canvas
DROP INDEX IF EXISTS idx_business_model_canvases_customer_id;

-- Business Models
DROP INDEX IF EXISTS idx_business_models_customer_id;

-- Campaign
DROP INDEX IF EXISTS idx_campaign_activities_campaign_id;
DROP INDEX IF EXISTS idx_campaign_activities_partner_id;
DROP INDEX IF EXISTS idx_campaign_budgets_campaign_id;
DROP INDEX IF EXISTS idx_campaign_results_campaign_activity_id;
DROP INDEX IF EXISTS idx_campaign_results_campaign_id;

-- Change Initiatives
DROP INDEX IF EXISTS idx_change_initiatives_customer_id;

-- Contracts
DROP INDEX IF EXISTS idx_contracts_customer_id;

-- Design Thinking
DROP INDEX IF EXISTS idx_design_thinking_projects_business_model_id;
DROP INDEX IF EXISTS idx_design_thinking_projects_customer_id;
DROP INDEX IF EXISTS idx_dt_ideas_created_by;
DROP INDEX IF EXISTS idx_dt_insights_created_by;
DROP INDEX IF EXISTS idx_dt_insights_project_id;
DROP INDEX IF EXISTS idx_dt_phases_project_id;
DROP INDEX IF EXISTS idx_dt_prototypes_created_by;
DROP INDEX IF EXISTS idx_dt_user_tests_created_by;
