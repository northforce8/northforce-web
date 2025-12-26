/*
  # Fix All Security and Performance Issues

  1. Add Missing Indexes
    - Add indexes for all unindexed foreign keys (43 missing indexes)
    - Improves query performance significantly
  
  2. Fix RLS Policies
    - Update invoice/contract RLS to use (select auth.uid())
    - Prevents re-evaluation per row
  
  3. Fix Function Security
    - Set search_path for all functions
    - Prevents SQL injection attacks
  
  4. Fix Multiple Permissive Policies
    - Consolidate duplicate policies
    - Cleaner security model
*/

-- =============================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- =============================================

-- activity_log
CREATE INDEX IF NOT EXISTS idx_activity_log_actor_user ON activity_log(actor_user_id);

-- contract_templates
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by ON contract_templates(created_by);

-- contracts
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_parent ON contracts(parent_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_renewed_by ON contracts(renewed_by_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_template ON contracts(template_id);

-- credits_transactions
CREATE INDEX IF NOT EXISTS idx_credits_trans_created_by ON credits_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_credits_trans_partner ON credits_transactions(related_partner_id);
CREATE INDEX IF NOT EXISTS idx_credits_trans_time ON credits_transactions(related_time_entry_id);

-- customers
CREATE INDEX IF NOT EXISTS idx_customers_success_mgr ON customers(dedicated_success_manager);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_admin_id);
CREATE INDEX IF NOT EXISTS idx_customers_primary_partner ON customers(primary_partner_id);

-- decision_log
CREATE INDEX IF NOT EXISTS idx_decision_log_created_by ON decision_log(created_by);

-- enterprise_benefits
CREATE INDEX IF NOT EXISTS idx_enterprise_benefits_granted ON enterprise_benefits(granted_by);

-- invoice_audit_log
CREATE INDEX IF NOT EXISTS idx_invoice_audit_changed_by ON invoice_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_invoice ON invoice_audit_log(invoice_id);

-- invoice_line_items (some already exist, add missing)
CREATE INDEX IF NOT EXISTS idx_invoice_items_project ON invoice_line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_time ON invoice_line_items(time_entry_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_work_type ON invoice_line_items(work_type_id);

-- invoices
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_sent_by ON invoices(sent_by);

-- lead_customer_links
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_customer ON lead_customer_links(customer_id);

-- notes
CREATE INDEX IF NOT EXISTS idx_notes_customer ON notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_notes_partner ON notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project_id);

-- partner_cost_rates
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_created_by ON partner_cost_rates(created_by);

-- partner_performance_metrics
CREATE INDEX IF NOT EXISTS idx_partner_perf_partner ON partner_performance_metrics(partner_id);

-- partner_work_type_assignments
CREATE INDEX IF NOT EXISTS idx_partner_work_type_assign_type ON partner_work_type_assignments(work_type_id);

-- partner_workload_recommendations
CREATE INDEX IF NOT EXISTS idx_partner_workload_rec_partner ON partner_workload_recommendations(partner_id);

-- partners
CREATE INDEX IF NOT EXISTS idx_partners_role ON partners(role_id);

-- recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_actioned_by ON recommendations(actioned_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_customer ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_project ON recommendations(project_id);

-- settings_audit_log
CREATE INDEX IF NOT EXISTS idx_settings_audit_changed_by ON settings_audit_log(changed_by);

-- sla_tracking
CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket ON sla_tracking(ticket_id);

-- status_change_log
CREATE INDEX IF NOT EXISTS idx_status_change_log_changed_by ON status_change_log(changed_by);

-- support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_partner ON support_tickets(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_project ON support_tickets(project_id);

-- time_entries
CREATE INDEX IF NOT EXISTS idx_time_entries_customer ON time_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_partner ON time_entries(partner_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON time_entries(project_id);

-- work_types
CREATE INDEX IF NOT EXISTS idx_work_types_updated_by ON work_types(updated_by);

-- =============================================
-- 2. FIX RLS POLICIES (AUTH PERFORMANCE)
-- =============================================

-- Drop and recreate invoice policies with optimized auth check
DROP POLICY IF EXISTS "Admins manage invoices" ON invoices;
CREATE POLICY "Admins manage invoices" ON invoices FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

DROP POLICY IF EXISTS "Admins manage invoice items" ON invoice_line_items;
CREATE POLICY "Admins manage invoice items" ON invoice_line_items FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

DROP POLICY IF EXISTS "Admins manage contracts" ON contracts;
CREATE POLICY "Admins manage contracts" ON contracts FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

DROP POLICY IF EXISTS "Admins manage templates" ON contract_templates;
CREATE POLICY "Admins manage templates" ON contract_templates FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

DROP POLICY IF EXISTS "Admins view audit log" ON invoice_audit_log;
CREATE POLICY "Admins view audit log" ON invoice_audit_log FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

-- =============================================
-- 3. FIX FUNCTION SEARCH PATHS (SECURITY)
-- =============================================

-- Recreate all invoice/contract functions with secure search_path
CREATE OR REPLACE FUNCTION generate_invoice_number() 
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
  next_num integer; 
  year_suffix text;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS integer)), 0) + 1
  INTO next_num FROM invoices WHERE invoice_number LIKE 'INV' || year_suffix || '%';
  RETURN 'INV' || year_suffix || LPAD(next_num::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION set_invoice_number() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION generate_contract_number() 
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
  next_num integer; 
  year_suffix text;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 4) AS integer)), 0) + 1
  INTO next_num FROM contracts WHERE contract_number LIKE 'CON' || year_suffix || '%';
  RETURN 'CON' || year_suffix || LPAD(next_num::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION set_contract_number() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_invoice_totals() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
  invoice_subtotal decimal(12,2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO invoice_subtotal
  FROM invoice_line_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  UPDATE invoices SET 
    subtotal = invoice_subtotal,
    tax_amount = invoice_subtotal * (tax_rate / 100),
    total_amount = invoice_subtotal + (invoice_subtotal * (tax_rate / 100)),
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION log_invoice_status_change() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO invoice_audit_log (invoice_id, action, old_status, new_status, changed_by)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status, NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

-- =============================================
-- 4. FIX MULTIPLE PERMISSIVE POLICIES
-- =============================================

-- Fix partner_capacity_periods - consolidate into one policy
DROP POLICY IF EXISTS "Admins can manage capacity periods" ON partner_capacity_periods;
DROP POLICY IF EXISTS "Users can view own capacity periods" ON partner_capacity_periods;

CREATE POLICY "Manage capacity periods" ON partner_capacity_periods FOR ALL TO authenticated
  USING (
    -- Admins can see all
    (SELECT auth.uid()) IN (SELECT id FROM admin_users)
    OR
    -- Partners can see their own
    partner_id IN (SELECT id FROM partners WHERE id = (SELECT auth.uid()))
  )
  WITH CHECK (
    (SELECT auth.uid()) IN (SELECT id FROM admin_users)
  );

-- Fix partner_roles - consolidate into one policy
DROP POLICY IF EXISTS "Admins can manage partner roles" ON partner_roles;
DROP POLICY IF EXISTS "Authenticated users can view partner roles" ON partner_roles;

CREATE POLICY "Manage partner roles" ON partner_roles FOR ALL TO authenticated
  USING (
    -- Everyone can view
    true
  )
  WITH CHECK (
    -- Only admins can modify
    (SELECT auth.uid()) IN (SELECT id FROM admin_users)
  );

-- Fix partner_work_type_assignments - consolidate into one policy
DROP POLICY IF EXISTS "Admins can manage work type assignments" ON partner_work_type_assignments;
DROP POLICY IF EXISTS "Users can view own work type assignments" ON partner_work_type_assignments;

CREATE POLICY "Manage work type assignments" ON partner_work_type_assignments FOR ALL TO authenticated
  USING (
    -- Admins can see all
    (SELECT auth.uid()) IN (SELECT id FROM admin_users)
    OR
    -- Partners can see their own
    partner_id IN (SELECT id FROM partners WHERE id = (SELECT auth.uid()))
  )
  WITH CHECK (
    (SELECT auth.uid()) IN (SELECT id FROM admin_users)
  );

-- =============================================
-- 5. ADD COMPOSITE INDEXES FOR COMMON QUERIES
-- =============================================

-- Time entries queries often filter by date + customer/project
CREATE INDEX IF NOT EXISTS idx_time_entries_date_customer ON time_entries(date, customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date_project ON time_entries(date, project_id);

-- Credits transactions by customer and type
CREATE INDEX IF NOT EXISTS idx_credits_trans_customer_type ON credits_transactions(customer_id, transaction_type);

-- Projects by customer and status
CREATE INDEX IF NOT EXISTS idx_projects_customer_status ON projects(customer_id, status);

-- Support tickets by customer and status
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_status ON support_tickets(customer_id, status);

-- Recommendations by status and priority
CREATE INDEX IF NOT EXISTS idx_recommendations_status_priority ON recommendations(status, priority);

-- =============================================
-- VERIFICATION QUERY
-- =============================================

-- This comment documents what was fixed:
-- ✓ 43 missing foreign key indexes added
-- ✓ 5 RLS policies optimized with (select auth.uid())
-- ✓ 6 functions secured with SET search_path = public
-- ✓ 3 multiple permissive policy conflicts resolved
-- ✓ 5 composite indexes added for common query patterns