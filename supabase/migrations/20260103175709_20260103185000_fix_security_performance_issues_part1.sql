/*
  # Fix Security and Performance Issues - Part 1: Foreign Key Indexes
  
  1. Summary
    - Add covering indexes for all unindexed foreign keys
    - Improves query performance for JOIN operations
    - Reduces table scan overhead
  
  2. Performance Impact
    - Faster JOIN queries
    - Better query planning
    - Reduced I/O operations
*/

-- ADKAR Framework
CREATE INDEX IF NOT EXISTS idx_adkar_actions_assessment_id ON adkar_actions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_adkar_assessments_initiative_id ON adkar_assessments(initiative_id);

-- Agile Framework
CREATE INDEX IF NOT EXISTS idx_agile_sprints_team_id ON agile_sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_agile_teams_customer_id ON agile_teams(customer_id);

-- Balanced Scorecard
CREATE INDEX IF NOT EXISTS idx_balanced_scorecards_customer_id ON balanced_scorecards(customer_id);
CREATE INDEX IF NOT EXISTS idx_bsc_metrics_perspective_id ON bsc_metrics(perspective_id);
CREATE INDEX IF NOT EXISTS idx_bsc_perspectives_scorecard_id ON bsc_perspectives(scorecard_id);

-- Business Model Canvas
CREATE INDEX IF NOT EXISTS idx_bmc_blocks_canvas_id ON bmc_blocks(canvas_id);
CREATE INDEX IF NOT EXISTS idx_business_model_canvases_customer_id ON business_model_canvases(customer_id);
CREATE INDEX IF NOT EXISTS idx_business_models_customer_id ON business_models(customer_id);

-- Campaigns
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign_id ON campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_results_campaign_id ON campaign_results(campaign_id);

-- Change Management
CREATE INDEX IF NOT EXISTS idx_change_initiatives_customer_id ON change_initiatives(customer_id);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON contracts(customer_id);

-- Design Thinking
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_business_model_id ON design_thinking_projects(business_model_id);
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_customer_id ON design_thinking_projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_dt_ideas_created_by ON dt_ideas(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_insights_project_id ON dt_insights(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_phases_project_id ON dt_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_dt_prototypes_created_by ON dt_prototypes(created_by);
CREATE INDEX IF NOT EXISTS idx_dt_user_tests_created_by ON dt_user_tests(created_by);

-- Development Plans
CREATE INDEX IF NOT EXISTS idx_development_actions_development_plan_id ON development_actions(development_plan_id);
CREATE INDEX IF NOT EXISTS idx_development_plans_participant_id ON development_plans(participant_id);

-- Goals and Metrics
CREATE INDEX IF NOT EXISTS idx_goal_metrics_strategic_goal_id ON goal_metrics(strategic_goal_id);

-- Growth Plans
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_growth_objective_id ON growth_initiatives(growth_objective_id);
CREATE INDEX IF NOT EXISTS idx_growth_initiatives_project_id ON growth_initiatives(project_id);
CREATE INDEX IF NOT EXISTS idx_growth_milestones_growth_objective_id ON growth_milestones(growth_objective_id);
CREATE INDEX IF NOT EXISTS idx_growth_objectives_growth_plan_id ON growth_objectives(growth_plan_id);
CREATE INDEX IF NOT EXISTS idx_growth_plans_customer_id ON growth_plans(customer_id);

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);

-- Leadership
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_customer_id ON leadership_assessments(customer_id);

-- Lean Startup
CREATE INDEX IF NOT EXISTS idx_lean_experiments_business_model_id ON lean_experiments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_lean_experiments_customer_id ON lean_experiments(customer_id);
CREATE INDEX IF NOT EXISTS idx_lean_feedback_experiment_id ON lean_feedback(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_experiment_id ON lean_hypotheses(experiment_id);
CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_created_by ON lean_pivot_decisions(created_by);

-- Marketing
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_customer_id ON marketing_campaigns(customer_id);

-- McKinsey 7S
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_business_model_id ON mckinsey_7s_assessments(business_model_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_customer_id ON mckinsey_7s_assessments(customer_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_elements_assessment_id ON mckinsey_7s_elements(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assigned_to ON mckinsey_7s_improvements(assigned_to);

-- Notes
CREATE INDEX IF NOT EXISTS idx_notes_customer_id ON notes(customer_id);

-- OKR
CREATE INDEX IF NOT EXISTS idx_okr_key_results_objective_id ON okr_key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_okr_objectives_customer_id ON okr_objectives(customer_id);

-- Porter Five Forces
CREATE INDEX IF NOT EXISTS idx_porter_analyses_customer_id ON porter_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_porter_forces_porter_analysis_id ON porter_forces(porter_analysis_id);

-- Strategic Goals
CREATE INDEX IF NOT EXISTS idx_strategic_goals_customer_id ON strategic_goals(customer_id);

-- SWOT
CREATE INDEX IF NOT EXISTS idx_swot_analyses_customer_id ON swot_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_swot_items_swot_analysis_id ON swot_items(swot_analysis_id);

-- Time Tracking
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON user_profiles(customer_id);
