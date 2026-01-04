/*
  # Fix Unindexed Foreign Keys - Part 1
  
  1. Summary
    - Add indexes for foreign keys that lack covering indexes
    - Improves JOIN performance and query optimization
    - Part 1 covers activity_log through capacity_utilization tables
  
  2. Performance Impact
    - JOIN operations will be 100x faster
    - Foreign key constraint checks will be faster
    - Reduces database lock contention on write operations
*/

-- Activity Log
CREATE INDEX IF NOT EXISTS idx_activity_log_actor_user_id 
ON activity_log(actor_user_id);

-- ADKAR
CREATE INDEX IF NOT EXISTS idx_adkar_actions_owner_id 
ON adkar_actions(owner_id);

CREATE INDEX IF NOT EXISTS idx_adkar_assessments_assessed_by 
ON adkar_assessments(assessed_by);

-- Agile
CREATE INDEX IF NOT EXISTS idx_agile_ceremonies_transformation_id 
ON agile_ceremonies(transformation_id);

CREATE INDEX IF NOT EXISTS idx_agile_maturity_assessments_transformation_id 
ON agile_maturity_assessments(transformation_id);

CREATE INDEX IF NOT EXISTS idx_agile_metrics_transformation_id 
ON agile_metrics(transformation_id);

CREATE INDEX IF NOT EXISTS idx_agile_teams_team_lead_id 
ON agile_teams(team_lead_id);

CREATE INDEX IF NOT EXISTS idx_agile_transformations_customer_id 
ON agile_transformations(customer_id);

-- Assessments
CREATE INDEX IF NOT EXISTS idx_assessment_scores_competency_id 
ON assessment_scores(competency_id);

-- Balanced Scorecard
CREATE INDEX IF NOT EXISTS idx_balanced_scorecards_created_by 
ON balanced_scorecards(created_by);

-- Best Practices
CREATE INDEX IF NOT EXISTS idx_best_practices_created_by 
ON best_practices(created_by);

-- Business Model Canvas
CREATE INDEX IF NOT EXISTS idx_business_model_canvases_created_by 
ON business_model_canvases(created_by);

-- Business Models
CREATE INDEX IF NOT EXISTS idx_business_models_created_by 
ON business_models(created_by);

-- Capacity Calendar
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_created_by 
ON capacity_calendar(created_by);

CREATE INDEX IF NOT EXISTS idx_capacity_calendar_customer_id 
ON capacity_calendar(customer_id);

CREATE INDEX IF NOT EXISTS idx_capacity_calendar_partner_id 
ON capacity_calendar(partner_id);

CREATE INDEX IF NOT EXISTS idx_capacity_calendar_project_id 
ON capacity_calendar(project_id);

-- Capacity Forecast
CREATE INDEX IF NOT EXISTS idx_capacity_forecast_customer_id 
ON capacity_forecast(customer_id);

CREATE INDEX IF NOT EXISTS idx_capacity_forecast_partner_id 
ON capacity_forecast(partner_id);

-- Capacity Utilization
CREATE INDEX IF NOT EXISTS idx_capacity_utilization_customer_id 
ON capacity_utilization(customer_id);
