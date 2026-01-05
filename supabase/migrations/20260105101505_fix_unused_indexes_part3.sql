/*
  # Remove Unused Indexes - Part 3
  
  1. Changes
    - Remove unused indexes (Part 3 of 6)
  
  2. Security
    - Reduces database bloat by removing unused indexes
*/

DROP INDEX IF EXISTS public.idx_strategic_initiatives_status;
DROP INDEX IF EXISTS public.idx_framework_links_framework;
DROP INDEX IF EXISTS public.idx_framework_links_entity;
DROP INDEX IF EXISTS public.idx_activity_log_actor_user_id;
DROP INDEX IF EXISTS public.idx_adkar_actions_owner_id;
DROP INDEX IF EXISTS public.idx_adkar_assessments_assessed_by;
DROP INDEX IF EXISTS public.idx_agile_ceremonies_transformation_id;
DROP INDEX IF EXISTS public.idx_agile_maturity_assessments_transformation_id;
DROP INDEX IF EXISTS public.idx_agile_metrics_transformation_id;
DROP INDEX IF EXISTS public.idx_agile_teams_team_lead_id;
DROP INDEX IF EXISTS public.idx_assessment_scores_competency_id;
DROP INDEX IF EXISTS public.idx_balanced_scorecards_created_by;
DROP INDEX IF EXISTS public.idx_best_practices_created_by;
DROP INDEX IF EXISTS public.idx_business_model_canvases_created_by;
DROP INDEX IF EXISTS public.idx_business_models_created_by;
DROP INDEX IF EXISTS public.idx_capacity_calendar_created_by;
DROP INDEX IF EXISTS public.idx_capacity_calendar_customer_id;
DROP INDEX IF EXISTS public.idx_capacity_calendar_partner_id;
DROP INDEX IF EXISTS public.idx_capacity_calendar_project_id;
DROP INDEX IF EXISTS public.idx_capacity_forecast_partner_id;
DROP INDEX IF EXISTS public.idx_change_initiatives_created_by;
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;
DROP INDEX IF EXISTS public.idx_contract_version_history_created_by;
DROP INDEX IF EXISTS public.idx_contract_version_history_parent_version_id;
DROP INDEX IF EXISTS public.idx_contracts_created_by;
DROP INDEX IF EXISTS public.idx_contracts_currency_code;
DROP INDEX IF EXISTS public.idx_contracts_parent_contract_id;
DROP INDEX IF EXISTS public.idx_contracts_renewed_by_contract_id;
DROP INDEX IF EXISTS public.idx_contracts_template_id;
DROP INDEX IF EXISTS public.idx_credits_transactions_created_by;
DROP INDEX IF EXISTS public.idx_credits_transactions_customer_id;
DROP INDEX IF EXISTS public.idx_credits_transactions_related_partner_id;
DROP INDEX IF EXISTS public.idx_credits_transactions_related_time_entry_id;
DROP INDEX IF EXISTS public.idx_customers_currency_code;
DROP INDEX IF EXISTS public.idx_customers_dedicated_success_manager;
DROP INDEX IF EXISTS public.idx_customers_owner_admin_id;
DROP INDEX IF EXISTS public.idx_customers_primary_partner_id;
DROP INDEX IF EXISTS public.idx_design_thinking_projects_created_by;
DROP INDEX IF EXISTS public.idx_dt_empathy_maps_persona_id;
DROP INDEX IF EXISTS public.idx_dt_empathy_maps_project_id;
DROP INDEX IF EXISTS public.idx_dt_ideas_project_id;
DROP INDEX IF EXISTS public.idx_dt_journey_maps_persona_id;
DROP INDEX IF EXISTS public.idx_dt_journey_maps_project_id;
DROP INDEX IF EXISTS public.idx_dt_personas_project_id;
DROP INDEX IF EXISTS public.idx_dt_prototypes_idea_id;
DROP INDEX IF EXISTS public.idx_dt_prototypes_project_id;
DROP INDEX IF EXISTS public.idx_dt_user_tests_project_id;
DROP INDEX IF EXISTS public.idx_dt_user_tests_prototype_id;
DROP INDEX IF EXISTS public.idx_leadership_assessments_created_by;
