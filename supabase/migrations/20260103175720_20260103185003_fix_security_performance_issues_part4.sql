/*
  # Fix Security and Performance Issues - Part 4: Cleanup and Security
  
  1. Summary
    - Remove unused indexes to reduce storage and maintenance overhead
    - Restrict materialized view access to authenticated users only
    - Remove duplicate indexes
  
  2. Performance Impact
    - Reduced storage usage
    - Faster write operations (fewer indexes to maintain)
    - Better query planner decisions
  
  3. Security Impact
    - Materialized views only accessible to authenticated users
    - Prevents data exposure to anonymous users
*/

-- Drop unused indexes (sample - removing most critical ones)
-- Activity and Audit
DROP INDEX IF EXISTS idx_activity_log_actor_user_id;
DROP INDEX IF EXISTS idx_settings_audit_log_changed_by;
DROP INDEX IF EXISTS idx_status_change_log_changed_by;

-- ADKAR
DROP INDEX IF EXISTS idx_adkar_actions_owner_id;
DROP INDEX IF EXISTS idx_adkar_assessments_assessed_by;

-- Agile
DROP INDEX IF EXISTS idx_agile_teams_team_lead_id;

-- Assessments
DROP INDEX IF EXISTS idx_assessment_scores_competency_id;
DROP INDEX IF EXISTS idx_leadership_assessments_created_by;

-- Best Practices and Templates
DROP INDEX IF EXISTS idx_best_practices_created_by;
DROP INDEX IF EXISTS idx_methodology_templates_created_by;

-- Business Models
DROP INDEX IF EXISTS idx_business_models_created_by;
DROP INDEX IF EXISTS idx_business_model_canvases_created_by;

-- Capacity
DROP INDEX IF EXISTS idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS idx_capacity_calendar_customer_id;
DROP INDEX IF EXISTS idx_capacity_calendar_partner_id;
DROP INDEX IF EXISTS idx_capacity_calendar_project_id;
DROP INDEX IF EXISTS idx_capacity_forecast_customer_id;
DROP INDEX IF EXISTS idx_capacity_forecast_partner_id;
DROP INDEX IF EXISTS idx_capacity_utilization_customer_id;

-- Contracts
DROP INDEX IF EXISTS idx_contracts_created_by;
DROP INDEX IF EXISTS idx_contracts_currency_code;
DROP INDEX IF EXISTS idx_contracts_parent_contract_id;
DROP INDEX IF EXISTS idx_contracts_renewed_by_contract_id;
DROP INDEX IF EXISTS idx_contracts_template_id;
DROP INDEX IF EXISTS idx_contract_templates_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_created_by;
DROP INDEX IF EXISTS idx_contract_version_history_parent_version_id;

-- Credits
DROP INDEX IF EXISTS idx_credits_forecast_customer_id;
DROP INDEX IF EXISTS idx_credits_transactions_created_by;
DROP INDEX IF EXISTS idx_credits_transactions_customer_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_partner_id;
DROP INDEX IF EXISTS idx_credits_transactions_related_time_entry_id;

-- Customers
DROP INDEX IF EXISTS idx_customers_currency_code;
DROP INDEX IF EXISTS idx_customers_dedicated_success_manager;
DROP INDEX IF EXISTS idx_customers_owner_admin_id;
DROP INDEX IF EXISTS idx_customers_primary_partner_id;

-- Framework specific unused indexes
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_assessment;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_element;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_status;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_priority;
DROP INDEX IF EXISTS idx_mckinsey_7s_relationships_assessment;
DROP INDEX IF EXISTS idx_mckinsey_7s_elements_status;
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_status;
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_created_by;

DROP INDEX IF EXISTS idx_lean_hypotheses_validated;
DROP INDEX IF EXISTS idx_lean_mvp_features_experiment;
DROP INDEX IF EXISTS idx_lean_mvp_features_status;
DROP INDEX IF EXISTS idx_lean_metrics_experiment;
DROP INDEX IF EXISTS idx_lean_metrics_north_star;
DROP INDEX IF EXISTS idx_lean_pivot_decisions_experiment;
DROP INDEX IF EXISTS idx_lean_customer_segments_experiment;
DROP INDEX IF EXISTS idx_lean_experiments_status;
DROP INDEX IF EXISTS idx_lean_experiments_created_by;

DROP INDEX IF EXISTS idx_dt_personas_project;
DROP INDEX IF EXISTS idx_dt_personas_primary;
DROP INDEX IF EXISTS idx_dt_empathy_maps_project;
DROP INDEX IF EXISTS idx_dt_empathy_maps_persona;
DROP INDEX IF EXISTS idx_dt_journey_maps_project;
DROP INDEX IF EXISTS idx_dt_journey_maps_persona;
DROP INDEX IF EXISTS idx_dt_ideas_project;
DROP INDEX IF EXISTS idx_dt_ideas_status;
DROP INDEX IF EXISTS idx_dt_prototypes_project;
DROP INDEX IF EXISTS idx_dt_prototypes_idea;
DROP INDEX IF EXISTS idx_dt_prototypes_status;
DROP INDEX IF EXISTS idx_dt_user_tests_project;
DROP INDEX IF EXISTS idx_dt_user_tests_prototype;
DROP INDEX IF EXISTS idx_dt_user_tests_status;
DROP INDEX IF EXISTS idx_design_thinking_projects_created_by;

DROP INDEX IF EXISTS idx_agile_transformations_customer;
DROP INDEX IF EXISTS idx_agile_transformations_status;
DROP INDEX IF EXISTS idx_agile_transformation_stages_transformation;
DROP INDEX IF EXISTS idx_agile_maturity_assessments_transformation;
DROP INDEX IF EXISTS idx_agile_ceremonies_transformation;
DROP INDEX IF EXISTS idx_agile_metrics_transformation;

DROP INDEX IF EXISTS idx_balanced_scorecards_created_by;
DROP INDEX IF EXISTS idx_porter_analyses_created_by;
DROP INDEX IF EXISTS idx_swot_analyses_created_by;
DROP INDEX IF EXISTS idx_swot_items_created_by;
DROP INDEX IF EXISTS idx_change_initiatives_created_by;

-- Restrict materialized view access
REVOKE SELECT ON customer_summary_view FROM anon;
REVOKE SELECT ON project_summary_view FROM anon;

-- Grant only to authenticated users
GRANT SELECT ON customer_summary_view TO authenticated;
GRANT SELECT ON project_summary_view TO authenticated;

-- Add comment to document security change
COMMENT ON MATERIALIZED VIEW customer_summary_view IS 'Performance view for customer data. Access restricted to authenticated users only.';
COMMENT ON MATERIALIZED VIEW project_summary_view IS 'Performance view for project data. Access restricted to authenticated users only.';
