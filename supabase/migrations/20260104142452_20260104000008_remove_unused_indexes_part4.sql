/*
  # Remove Unused Indexes - Part 4
  
  1. Summary
    - Remove unused indexes
    - Part 4 covers margin_analysis through okr_progress_updates tables
  
  2. Performance Impact
    - Optimizes OKR and marketing operations
    - Reduces index overhead
*/

-- Margin Analysis
DROP INDEX IF EXISTS idx_margin_analysis_customer_id;
DROP INDEX IF EXISTS idx_margin_analysis_project_id;

-- Marketing Campaigns
DROP INDEX IF EXISTS idx_marketing_campaigns_assigned_partner_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_campaigns_customer_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_project_id;

-- McKinsey 7S
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_business_model_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_assessments_customer_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_elements_assessment_id;
DROP INDEX IF EXISTS idx_mckinsey_7s_improvements_assigned_to;

-- Notes
DROP INDEX IF EXISTS idx_notes_customer_id;
DROP INDEX IF EXISTS idx_notes_partner_id;
DROP INDEX IF EXISTS idx_notes_project_id;

-- OKR
DROP INDEX IF EXISTS idx_okr_key_results_objective_id;
DROP INDEX IF EXISTS idx_okr_key_results_owner_id;
DROP INDEX IF EXISTS idx_okr_objectives_customer_id;
DROP INDEX IF EXISTS idx_okr_objectives_owner_id;
DROP INDEX IF EXISTS idx_okr_progress_updates_key_result_id;
DROP INDEX IF EXISTS idx_okr_progress_updates_updated_by;
