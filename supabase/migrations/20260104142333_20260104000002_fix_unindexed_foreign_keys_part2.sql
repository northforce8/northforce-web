/*
  # Fix Unindexed Foreign Keys - Part 2
  
  1. Summary
    - Add indexes for foreign keys that lack covering indexes
    - Part 2 covers change_initiatives through customers tables
  
  2. Performance Impact
    - Optimizes multi-table JOINs
    - Improves foreign key constraint validation speed
*/

-- Change Initiatives
CREATE INDEX IF NOT EXISTS idx_change_initiatives_created_by 
ON change_initiatives(created_by);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by 
ON contract_templates(created_by);

CREATE INDEX IF NOT EXISTS idx_contract_version_history_created_by 
ON contract_version_history(created_by);

CREATE INDEX IF NOT EXISTS idx_contract_version_history_parent_version_id 
ON contract_version_history(parent_version_id);

CREATE INDEX IF NOT EXISTS idx_contracts_created_by 
ON contracts(created_by);

CREATE INDEX IF NOT EXISTS idx_contracts_currency_code 
ON contracts(currency_code);

CREATE INDEX IF NOT EXISTS idx_contracts_parent_contract_id 
ON contracts(parent_contract_id);

CREATE INDEX IF NOT EXISTS idx_contracts_renewed_by_contract_id 
ON contracts(renewed_by_contract_id);

CREATE INDEX IF NOT EXISTS idx_contracts_template_id 
ON contracts(template_id);

-- Credits
CREATE INDEX IF NOT EXISTS idx_credits_forecast_customer_id 
ON credits_forecast(customer_id);

CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_by 
ON credits_transactions(created_by);

CREATE INDEX IF NOT EXISTS idx_credits_transactions_customer_id 
ON credits_transactions(customer_id);

CREATE INDEX IF NOT EXISTS idx_credits_transactions_related_partner_id 
ON credits_transactions(related_partner_id);

CREATE INDEX IF NOT EXISTS idx_credits_transactions_related_time_entry_id 
ON credits_transactions(related_time_entry_id);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_currency_code 
ON customers(currency_code);

CREATE INDEX IF NOT EXISTS idx_customers_dedicated_success_manager 
ON customers(dedicated_success_manager);

CREATE INDEX IF NOT EXISTS idx_customers_owner_admin_id 
ON customers(owner_admin_id);

CREATE INDEX IF NOT EXISTS idx_customers_primary_partner_id 
ON customers(primary_partner_id);
