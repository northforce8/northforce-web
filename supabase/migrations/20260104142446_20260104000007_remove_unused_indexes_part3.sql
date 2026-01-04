/*
  # Remove Unused Indexes - Part 3
  
  1. Summary
    - Remove unused indexes
    - Part 3 covers invoices through lean_pivot_decisions tables
  
  2. Performance Impact
    - Optimizes invoice and financial operations
    - Reduces storage for invoice-related tables
*/

-- Invoices
DROP INDEX IF EXISTS idx_invoice_audit_log_changed_by;
DROP INDEX IF EXISTS idx_invoice_audit_log_invoice_id;
DROP INDEX IF EXISTS idx_invoice_line_items_invoice_id;
DROP INDEX IF EXISTS idx_invoice_line_items_project_id;
DROP INDEX IF EXISTS idx_invoice_line_items_time_entry_id;
DROP INDEX IF EXISTS idx_invoice_line_items_work_type_id;
DROP INDEX IF EXISTS idx_invoices_created_by;
DROP INDEX IF EXISTS idx_invoices_currency_code;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_sent_by;

-- Leads
DROP INDEX IF EXISTS idx_lead_customer_links_customer_id;
DROP INDEX IF EXISTS idx_lead_customer_links_linked_by;
DROP INDEX IF EXISTS idx_lead_notes_created_by;

-- Leadership
DROP INDEX IF EXISTS idx_leadership_assessments_customer_id;

-- Lean Startup
DROP INDEX IF EXISTS idx_lean_experiments_business_model_id;
DROP INDEX IF EXISTS idx_lean_experiments_customer_id;
DROP INDEX IF EXISTS idx_lean_feedback_experiment_id;
DROP INDEX IF EXISTS idx_lean_hypotheses_experiment_id;
DROP INDEX IF EXISTS idx_lean_pivot_decisions_created_by;
