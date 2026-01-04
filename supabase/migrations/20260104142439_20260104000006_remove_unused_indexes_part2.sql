/*
  # Remove Unused Indexes - Part 2
  
  1. Summary
    - Remove unused indexes
    - Part 2 covers development_actions through growth_plans tables
  
  2. Performance Impact
    - Reduces index maintenance overhead
    - Faster write operations
*/

-- Development Actions & Plans
DROP INDEX IF EXISTS idx_development_actions_competency_id;
DROP INDEX IF EXISTS idx_development_actions_development_plan_id;
DROP INDEX IF EXISTS idx_development_plans_participant_id;

-- Email & Enterprise
DROP INDEX IF EXISTS idx_email_delivery_log_sent_by;
DROP INDEX IF EXISTS idx_enterprise_benefits_granted_by;
DROP INDEX IF EXISTS idx_enterprise_plans_currency_code;

-- FX Rates
DROP INDEX IF EXISTS idx_fx_rate_history_recorded_by;

-- Growth Plans
DROP INDEX IF EXISTS idx_goal_metrics_strategic_goal_id;
DROP INDEX IF EXISTS idx_growth_initiatives_assigned_to_partner_id;
DROP INDEX IF EXISTS idx_growth_initiatives_growth_objective_id;
DROP INDEX IF EXISTS idx_growth_initiatives_project_id;
DROP INDEX IF EXISTS idx_growth_milestones_growth_initiative_id;
DROP INDEX IF EXISTS idx_growth_milestones_growth_objective_id;
DROP INDEX IF EXISTS idx_growth_objectives_growth_plan_id;
DROP INDEX IF EXISTS idx_growth_plans_created_by;
DROP INDEX IF EXISTS idx_growth_plans_customer_id;
