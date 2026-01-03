/*
  # Remove Secondary Unused Indexes
  
  1. Summary
    - Remove the 63 secondary foreign key indexes created earlier
    - These are now reported as unused
    - Keep only the primary foreign key indexes that are actually used
  
  2. Performance Impact
    - Reduces storage overhead
    - Faster write operations
    - Cleaner index structure
*/

-- Remove Activity and Audit secondary indexes
DROP INDEX IF EXISTS idx_activity_log_actor_user_id;
DROP INDEX IF EXISTS idx_settings_audit_log_changed_by;
DROP INDEX IF EXISTS idx_status_change_log_changed_by;

-- Remove ADKAR secondary indexes
DROP INDEX IF EXISTS idx_adkar_actions_owner_id;
DROP INDEX IF EXISTS idx_adkar_assessments_assessed_by;

-- Remove Agile secondary indexes
DROP INDEX IF EXISTS idx_agile_ceremonies_transformation_id;
DROP INDEX IF EXISTS idx_agile_maturity_assessments_transformation_id;
DROP INDEX IF EXISTS idx_agile_metrics_transformation_id;
DROP INDEX IF EXISTS idx_agile_teams_team_lead_id;
DROP INDEX IF EXISTS idx_agile_transformations_customer_id;

-- Remove Assessment secondary indexes
DROP INDEX IF EXISTS idx_assessment_scores_competency_id;
DROP INDEX IF EXISTS idx_leadership_assessments_created_by;

-- Remove Business Model secondary indexes
DROP INDEX IF EXISTS idx_balanced_scorecards_created_by;
DROP INDEX IF EXISTS idx_best_practices_created_by;
DROP INDEX IF EXISTS idx_business_model_canvases_created_by;
DROP INDEX IF EXISTS idx_business_models_created_by;

-- Remove Capacity secondary indexes
DROP INDEX IF EXISTS idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS idx_capacity_calendar_customer_id;
DROP INDEX IF EXISTS idx_capacity_calendar_partner_id;
DROP INDEX IF EXISTS idx_capacity_calendar_project_id;
DROP INDEX IF EXISTS idx_capacity_forecast_customer_id;
DROP INDEX IF EXISTS idx_capacity_forecast_partner_id;
DROP INDEX IF EXISTS idx_capacity_utilization_customer_id;

-- Remove Change Management secondary indexes
DROP INDEX IF EXISTS idx_change_initiatives_created_by;

-- Remove Contract secondary indexes
DROP INDEX IF EXISTS idx_contract_templates_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_parent_version_id;
DROP INDEX IF EXISTS idx_contracts_created_by;
DROP INDEX IF EXISTS idx_contracts_currency_code;
DROP INDEX IF EXISTS idx_contracts_parent_contract_id;
DROP INDEX IF EXISTS idx_contracts_renewed_by_contract_id;
DROP INDEX IF EXISTS idx_contracts_template_id;

-- Remove Credits secondary indexes
DROP INDEX IF EXISTS idx_credits_forecast_customer_id;
DROP INDEX IF EXISTS idx_credits_transactions_created_by;
DROP INDEX IF EXISTS idx_credits_transactions_customer_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_partner_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_time_entry_id;

-- Remove Customer secondary indexes
DROP INDEX IF EXISTS idx_customers_currency_code;
DROP INDEX IF EXISTS idx_customers_dedicated_success_manager;
DROP INDEX IF EXISTS idx_customers_owner_admin_id;
DROP INDEX IF EXISTS idx_customers_primary_partner_id;

-- Remove Design Thinking secondary indexes
DROP INDEX IF EXISTS idx_design_thinking_projects_created_by;
DROP INDEX IF EXISTS idx_dt_empathy_maps_persona_id;
DROP INDEX IF EXISTS idx_dt_empathy_maps_project_id;
DROP INDEX IF EXISTS idx_dt_ideas_project_id;
DROP INDEX IF EXISTS idx_dt_journey_maps_persona_id;
DROP INDEX IF EXISTS idx_dt_journey_maps_project_id;
DROP INDEX IF EXISTS idx_dt_personas_project_id;
DROP INDEX IF EXISTS idx_dt_prototypes_idea_id;
DROP INDEX IF EXISTS idx_dt_prototypes_project_id;
DROP INDEX IF EXISTS idx_dt_user_tests_project_id;
DROP INDEX IF EXISTS idx_dt_user_tests_prototype_id;

-- Remove Lean secondary indexes
DROP INDEX IF EXISTS idx_lean_customer_segments_experiment_id;
DROP INDEX IF EXISTS idx_lean_experiments_created_by;
DROP INDEX IF EXISTS idx_lean_metrics_experiment_id;
DROP INDEX IF EXISTS idx_lean_mvp_features_experiment_id;
DROP INDEX IF EXISTS idx_lean_pivot_decisions_experiment_id;

-- Remove McKinsey secondary indexes
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_created_by;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_assessment_id;

-- Remove Methodology secondary indexes
DROP INDEX IF EXISTS idx_methodology_templates_created_by;

-- Remove Porter secondary indexes
DROP INDEX IF EXISTS idx_porter_analyses_created_by;

-- Remove SWOT secondary indexes
DROP INDEX IF EXISTS idx_swot_analyses_created_by;
DROP INDEX IF EXISTS idx_swot_items_created_by;
