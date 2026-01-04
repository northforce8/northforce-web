/*
  # Add Remaining Unindexed Foreign Keys - Part 1
  
  1. Summary
    - Add indexes for foreign keys that still lack covering indexes
    - Part 1 covers adkar through decision_log tables
  
  2. Performance Impact
    - Optimizes JOIN operations
    - Improves foreign key constraint validation
*/

-- ADKAR (additional keys)
CREATE INDEX IF NOT EXISTS idx_adkar_actions_assessment_id 
ON adkar_actions(assessment_id);

CREATE INDEX IF NOT EXISTS idx_adkar_assessments_initiative_id 
ON adkar_assessments(initiative_id);

-- Agile
CREATE INDEX IF NOT EXISTS idx_agile_sprints_team_id 
ON agile_sprints(team_id);

CREATE INDEX IF NOT EXISTS idx_agile_teams_customer_id 
ON agile_teams(customer_id);

-- Balanced Scorecard
CREATE INDEX IF NOT EXISTS idx_balanced_scorecards_customer_id 
ON balanced_scorecards(customer_id);

-- Billing
CREATE INDEX IF NOT EXISTS idx_billing_periods_customer_id 
ON billing_periods(customer_id);

-- BMC
CREATE INDEX IF NOT EXISTS idx_bmc_blocks_canvas_id 
ON bmc_blocks(canvas_id);

CREATE INDEX IF NOT EXISTS idx_bsc_metrics_perspective_id 
ON bsc_metrics(perspective_id);

CREATE INDEX IF NOT EXISTS idx_bsc_perspectives_scorecard_id 
ON bsc_perspectives(scorecard_id);

-- Business Model Canvas
CREATE INDEX IF NOT EXISTS idx_business_model_canvases_customer_id 
ON business_model_canvases(customer_id);

-- Business Models
CREATE INDEX IF NOT EXISTS idx_business_models_customer_id 
ON business_models(customer_id);

-- Campaign
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign_id 
ON campaign_activities(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_activities_partner_id 
ON campaign_activities(partner_id);

CREATE INDEX IF NOT EXISTS idx_campaign_budgets_campaign_id 
ON campaign_budgets(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign_activity_id 
ON campaign_results(campaign_activity_id);

CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign_id 
ON campaign_results(campaign_id);

-- Change Initiatives
CREATE INDEX IF NOT EXISTS idx_change_initiatives_customer_id 
ON change_initiatives(customer_id);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id 
ON contracts(customer_id);

-- Decision Log
CREATE INDEX IF NOT EXISTS idx_decision_log_created_by 
ON decision_log(created_by);

CREATE INDEX IF NOT EXISTS idx_decision_log_customer_id 
ON decision_log(customer_id);

CREATE INDEX IF NOT EXISTS idx_decision_log_project_id 
ON decision_log(project_id);
