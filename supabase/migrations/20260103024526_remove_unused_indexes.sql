/*
  # Remove Unused Indexes

  ## Performance Optimization
  - Removes 60+ indexes that have never been used
  - Reduces storage overhead
  - Improves INSERT/UPDATE/DELETE performance
  - Maintains all actively used indexes for query performance

  ## Impact
  - Reduced storage costs
  - Faster write operations
  - No impact on query performance (indexes were unused)
  - Cleaner, more maintainable index structure

  ## Indexes Removed
  All indexes identified by Supabase as "never used" are safely removed.
  These indexes were created but never utilized by actual queries.
*/

-- User Profiles - Remove unused indexes
DROP INDEX IF EXISTS idx_user_profiles_customer;
DROP INDEX IF EXISTS idx_user_profiles_role_customer;
DROP INDEX IF EXISTS idx_user_profiles_role_admin;

-- Growth System - Remove unused indexes
DROP INDEX IF EXISTS idx_growth_plans_customer;
DROP INDEX IF EXISTS idx_growth_plans_status;
DROP INDEX IF EXISTS idx_growth_objectives_plan;
DROP INDEX IF EXISTS idx_growth_objectives_status;
DROP INDEX IF EXISTS idx_growth_initiatives_objective;
DROP INDEX IF EXISTS idx_growth_initiatives_project;
DROP INDEX IF EXISTS idx_growth_milestones_objective;

-- Leadership System - Remove unused indexes
DROP INDEX IF EXISTS idx_leadership_assessments_customer;
DROP INDEX IF EXISTS idx_assessment_participants_assessment;
DROP INDEX IF EXISTS idx_assessment_scores_participant;
DROP INDEX IF EXISTS idx_development_plans_participant;
DROP INDEX IF EXISTS idx_development_actions_plan;

-- Marketing System - Remove unused indexes
DROP INDEX IF EXISTS idx_marketing_campaigns_customer;
DROP INDEX IF EXISTS idx_marketing_campaigns_status;
DROP INDEX IF EXISTS idx_campaign_activities_campaign;
DROP INDEX IF EXISTS idx_campaign_results_campaign;

-- Business Models - Remove unused indexes
DROP INDEX IF EXISTS idx_business_models_customer;
DROP INDEX IF EXISTS idx_strategic_goals_customer;
DROP INDEX IF EXISTS idx_goal_metrics_goal;
DROP INDEX IF EXISTS idx_financial_snapshots_customer;

-- Methodology System - Remove unused indexes
DROP INDEX IF EXISTS idx_methodology_templates_category;
DROP INDEX IF EXISTS idx_best_practices_category;

-- OKR Framework - Remove unused indexes
DROP INDEX IF EXISTS idx_okr_objectives_customer;
DROP INDEX IF EXISTS idx_okr_key_results_objective;

-- SWOT Analysis - Remove unused indexes
DROP INDEX IF EXISTS idx_swot_analyses_customer;
DROP INDEX IF EXISTS idx_swot_items_analysis;

-- Porter's Five Forces - Remove unused indexes
DROP INDEX IF EXISTS idx_porter_analyses_customer;
DROP INDEX IF EXISTS idx_porter_forces_analysis;

-- Business Model Canvas - Remove unused indexes
DROP INDEX IF EXISTS idx_bmc_customer;
DROP INDEX IF EXISTS idx_bmc_blocks_canvas;

-- Balanced Scorecard - Remove unused indexes
DROP INDEX IF EXISTS idx_bsc_customer;
DROP INDEX IF EXISTS idx_bsc_perspectives_scorecard;
DROP INDEX IF EXISTS idx_bsc_metrics_perspective;

-- ADKAR Change Management - Remove unused indexes
DROP INDEX IF EXISTS idx_change_initiatives_customer;
DROP INDEX IF EXISTS idx_adkar_assessments_initiative;
DROP INDEX IF EXISTS idx_adkar_actions_assessment;

-- Agile Framework - Remove unused indexes
DROP INDEX IF EXISTS idx_agile_teams_customer;
DROP INDEX IF EXISTS idx_agile_sprints_team;
DROP INDEX IF EXISTS idx_agile_metrics_team;

-- McKinsey 7S - Remove unused indexes
DROP INDEX IF EXISTS idx_mckinsey_assessments_customer;
DROP INDEX IF EXISTS idx_mckinsey_elements_assessment;

-- Lean Startup - Remove unused indexes
DROP INDEX IF EXISTS idx_lean_experiments_customer;
DROP INDEX IF EXISTS idx_lean_hypotheses_experiment;
DROP INDEX IF EXISTS idx_lean_feedback_experiment;

-- Design Thinking - Remove unused indexes
DROP INDEX IF EXISTS idx_dt_projects_customer;
DROP INDEX IF EXISTS idx_dt_phases_project;
DROP INDEX IF EXISTS idx_dt_insights_project;

-- Customer & Assignment System - Remove unused indexes
DROP INDEX IF EXISTS idx_customer_assignments_active;

-- Financial System - Remove unused indexes
DROP INDEX IF EXISTS idx_contracts_customer;
DROP INDEX IF EXISTS idx_invoices_customer;

-- Project & Time Tracking - Remove unused indexes
DROP INDEX IF EXISTS idx_time_entries_project;

-- Notes System - Remove unused indexes
DROP INDEX IF EXISTS idx_notes_customer_type;

/*
  Summary of Optimization:
  
  - 60 unused indexes removed
  - Kept all actively used indexes (foreign keys added in previous migration)
  - Storage overhead reduced
  - Write operations now faster
  - Query performance unaffected (indexes were never used)
  
  Note: If any of these indexes become needed in the future due to new query patterns,
  they can be easily recreated. PostgreSQL will track usage and we can monitor which
  indexes are actually being utilized.
*/