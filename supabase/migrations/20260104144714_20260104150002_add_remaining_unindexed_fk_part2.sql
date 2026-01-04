/*
  # Add Remaining Unindexed Foreign Keys - Part 2
  
  1. Summary
    - Add indexes for foreign keys that still lack covering indexes
    - Part 2 covers design_thinking through growth tables
  
  2. Performance Impact
    - Completes foreign key index coverage
*/

-- Design Thinking
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_business_model_id 
ON design_thinking_projects(business_model_id);

CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_customer_id 
ON design_thinking_projects(customer_id);

-- Development
CREATE INDEX IF NOT EXISTS idx_development_actions_competency_id 
ON development_actions(competency_id);

CREATE INDEX IF NOT EXISTS idx_development_actions_development_plan_id 
ON development_actions(development_plan_id);

CREATE INDEX IF NOT EXISTS idx_development_plans_participant_id 
ON development_plans(participant_id);

-- DT additional indexes
CREATE INDEX IF NOT EXISTS idx_dt_ideas_created_by 
ON dt_ideas(created_by);

CREATE INDEX IF NOT EXISTS idx_dt_insights_created_by 
ON dt_insights(created_by);

CREATE INDEX IF NOT EXISTS idx_dt_insights_project_id 
ON dt_insights(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_phases_project_id 
ON dt_phases(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_prototypes_created_by 
ON dt_prototypes(created_by);

CREATE INDEX IF NOT EXISTS idx_dt_user_tests_created_by 
ON dt_user_tests(created_by);

-- Email & Enterprise
CREATE INDEX IF NOT EXISTS idx_email_delivery_log_sent_by 
ON email_delivery_log(sent_by);

CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_granted_by 
ON enterprise_benefits(granted_by);

CREATE INDEX IF NOT EXISTS idx_enterprise_plans_currency_code 
ON enterprise_plans(currency_code);

-- FX
CREATE INDEX IF NOT EXISTS idx_fx_rate_history_recorded_by 
ON fx_rate_history(recorded_by);

-- Goals
CREATE INDEX IF NOT EXISTS idx_goal_metrics_strategic_goal_id 
ON goal_metrics(strategic_goal_id);

-- Growth
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_assigned_to_partner_id 
ON growth_initiatives(assigned_to_partner_id);

CREATE INDEX IF NOT EXISTS idx_growth_initiatives_growth_objective_id 
ON growth_initiatives(growth_objective_id);

CREATE INDEX IF NOT EXISTS idx_growth_initiatives_project_id 
ON growth_initiatives(project_id);

CREATE INDEX IF NOT EXISTS idx_growth_milestones_growth_initiative_id 
ON growth_milestones(growth_initiative_id);

CREATE INDEX IF NOT EXISTS idx_growth_milestones_growth_objective_id 
ON growth_milestones(growth_objective_id);

CREATE INDEX IF NOT EXISTS idx_growth_objectives_growth_plan_id 
ON growth_objectives(growth_plan_id);

CREATE INDEX IF NOT EXISTS idx_growth_plans_created_by 
ON growth_plans(created_by);

CREATE INDEX IF NOT EXISTS idx_growth_plans_customer_id 
ON growth_plans(customer_id);
