/*
  # Add Remaining Unindexed Foreign Keys - Part 3
  
  1. Summary
    - Add indexes for foreign keys that still lack covering indexes
    - Part 3 covers invoice through lean tables
  
  2. Performance Impact
    - Optimizes financial and framework queries
*/

-- Invoice
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_changed_by 
ON invoice_audit_log(changed_by);

CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_invoice_id 
ON invoice_audit_log(invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id 
ON invoice_line_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_project_id 
ON invoice_line_items(project_id);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_time_entry_id 
ON invoice_line_items(time_entry_id);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_work_type_id 
ON invoice_line_items(work_type_id);

CREATE INDEX IF NOT EXISTS idx_invoices_created_by 
ON invoices(created_by);

CREATE INDEX IF NOT EXISTS idx_invoices_currency_code 
ON invoices(currency_code);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
ON invoices(customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_sent_by 
ON invoices(sent_by);

-- Leads
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_customer_id 
ON lead_customer_links(customer_id);

CREATE INDEX IF NOT EXISTS idx_lead_customer_links_linked_by 
ON lead_customer_links(linked_by);

CREATE INDEX IF NOT EXISTS idx_lead_notes_created_by 
ON lead_notes(created_by);

-- Leadership
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_customer_id 
ON leadership_assessments(customer_id);

-- Lean
CREATE INDEX IF NOT EXISTS idx_lean_experiments_business_model_id 
ON lean_experiments(business_model_id);

CREATE INDEX IF NOT EXISTS idx_lean_experiments_customer_id 
ON lean_experiments(customer_id);

CREATE INDEX IF NOT EXISTS idx_lean_feedback_experiment_id 
ON lean_feedback(experiment_id);

CREATE INDEX IF NOT EXISTS idx_lean_hypotheses_experiment_id 
ON lean_hypotheses(experiment_id);

CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_created_by 
ON lean_pivot_decisions(created_by);
