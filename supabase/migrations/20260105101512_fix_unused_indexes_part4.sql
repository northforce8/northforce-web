/*
  # Remove Unused Indexes - Part 4
  
  1. Changes
    - Remove unused indexes (Part 4 of 6)
  
  2. Security
    - Reduces database bloat by removing unused indexes
*/

DROP INDEX IF EXISTS public.idx_lean_customer_segments_experiment_id;
DROP INDEX IF EXISTS public.idx_lean_experiments_created_by;
DROP INDEX IF EXISTS public.idx_lean_metrics_experiment_id;
DROP INDEX IF EXISTS public.idx_lean_mvp_features_experiment_id;
DROP INDEX IF EXISTS public.idx_lean_pivot_decisions_experiment_id;
DROP INDEX IF EXISTS public.idx_mckinsey_7s_assessments_created_by;
DROP INDEX IF EXISTS public.idx_mckinsey_7s_improvements_assessment_id;
DROP INDEX IF EXISTS public.idx_methodology_templates_created_by;
DROP INDEX IF EXISTS public.idx_porter_analyses_created_by;
DROP INDEX IF EXISTS public.idx_settings_audit_log_changed_by;
DROP INDEX IF EXISTS public.idx_status_change_log_changed_by;
DROP INDEX IF EXISTS public.idx_swot_analyses_created_by;
DROP INDEX IF EXISTS public.idx_swot_items_created_by;
