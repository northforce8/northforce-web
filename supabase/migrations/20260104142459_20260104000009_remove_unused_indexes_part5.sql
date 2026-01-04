/*
  # Remove Unused Indexes - Part 5
  
  1. Summary
    - Remove unused indexes
    - Part 5 covers partner through porter_forces tables
  
  2. Performance Impact
    - Optimizes partner and payment operations
    - Reduces storage overhead
*/

-- Partners
DROP INDEX IF EXISTS idx_partner_cost_rates_created_by;
DROP INDEX IF EXISTS idx_partner_cost_rates_partner_id;
DROP INDEX IF EXISTS idx_partner_performance_metrics_partner_id;
DROP INDEX IF EXISTS idx_partner_work_type_assignments_work_type_id;
DROP INDEX IF EXISTS idx_partner_workload_recommendations_partner_id;
DROP INDEX IF EXISTS idx_partners_role_id;

-- Payments
DROP INDEX IF EXISTS idx_payment_transactions_created_by;
DROP INDEX IF EXISTS idx_payment_transactions_customer_id;
DROP INDEX IF EXISTS idx_payment_transactions_invoice_id;

-- Plan Changes
DROP INDEX IF EXISTS idx_plan_change_requests_approved_by;
DROP INDEX IF EXISTS idx_plan_change_requests_customer_id;
DROP INDEX IF EXISTS idx_plan_change_requests_requested_by;

-- Porter Analysis
DROP INDEX IF EXISTS idx_porter_analyses_customer_id;
DROP INDEX IF EXISTS idx_porter_forces_porter_analysis_id;

-- Practice Categories
DROP INDEX IF EXISTS idx_practice_categories_parent_category_id;
