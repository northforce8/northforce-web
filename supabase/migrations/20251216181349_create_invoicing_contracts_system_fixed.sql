/*
  # Invoicing and Contract Management System

  1. New Tables
    - `contract_templates` - Reusable contract templates
    - `contracts` - Customer agreements and MSAs
    - `invoices` - Invoice data
    - `invoice_line_items` - Invoice line items
    - `invoice_audit_log` - Audit trail

  2. Business Logic
    - Automatic invoice number generation (INV + year + sequence)
    - Automatic contract number generation (CON + year + sequence)
    - Automatic invoice totals calculation from line items
    - Audit logging for invoice status changes
    - Credits-based invoicing support

  3. Security
    - RLS enabled on all tables
    - Admin-only access
*/

-- Contract templates
CREATE TABLE IF NOT EXISTS contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contract_type text NOT NULL CHECK (contract_type IN ('msa', 'sow', 'nda', 'amendment', 'other')),
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  version integer DEFAULT 1,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  template_id uuid REFERENCES contract_templates(id),
  title text NOT NULL,
  contract_type text NOT NULL CHECK (contract_type IN ('msa', 'sow', 'nda', 'amendment', 'other')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'sent', 'signed', 'active', 'expired', 'terminated')),
  start_date date NOT NULL,
  end_date date,
  signature_date date,
  content text NOT NULL,
  variables jsonb DEFAULT '{}',
  contract_value decimal(12,2),
  currency text DEFAULT 'SEK',
  payment_terms text,
  customer_signed boolean DEFAULT false,
  customer_signature_date date,
  customer_signatory_name text,
  customer_signatory_title text,
  northforce_signed boolean DEFAULT false,
  northforce_signature_date date,
  northforce_signatory_name text,
  northforce_signatory_title text,
  pdf_url text,
  pdf_generated_at timestamptz,
  version integer DEFAULT 1,
  parent_contract_id uuid REFERENCES contracts(id),
  auto_renew boolean DEFAULT false,
  renewal_notice_days integer DEFAULT 30,
  renewed_by_contract_id uuid REFERENCES contracts(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  period_start date,
  period_end date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled', 'void')),
  subtotal decimal(12,2) NOT NULL DEFAULT 0,
  tax_rate decimal(5,2) NOT NULL DEFAULT 25.00,
  tax_amount decimal(12,2) NOT NULL DEFAULT 0,
  total_amount decimal(12,2) NOT NULL DEFAULT 0,
  paid_amount decimal(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SEK',
  payment_date date,
  payment_method text,
  payment_reference text,
  notes text,
  terms text DEFAULT 'Payment due within 30 days.',
  pdf_generated boolean DEFAULT false,
  pdf_url text,
  pdf_generated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  sent_at timestamptz,
  sent_by uuid REFERENCES admin_users(id)
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  line_number integer NOT NULL,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price decimal(12,2) NOT NULL,
  unit text DEFAULT 'hours',
  amount decimal(12,2) NOT NULL,
  time_entry_id uuid REFERENCES time_entries(id),
  project_id uuid REFERENCES projects(id),
  work_type_id uuid REFERENCES work_types(id),
  created_at timestamptz DEFAULT now()
);

-- Invoice audit log
CREATE TABLE IF NOT EXISTS invoice_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  action text NOT NULL,
  old_status text,
  new_status text,
  changed_by uuid REFERENCES admin_users(id),
  changed_at timestamptz DEFAULT now(),
  notes text
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (using auth.uid() = admin_users.id)
CREATE POLICY "Admins manage invoices" ON invoices FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins manage invoice items" ON invoice_line_items FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins manage contracts" ON contracts FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins manage templates" ON contract_templates FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins view audit log" ON invoice_audit_log FOR SELECT TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "System creates audit" ON invoice_audit_log FOR INSERT TO authenticated
  WITH CHECK (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS text AS $$
DECLARE next_num integer; year_suffix text;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS integer)), 0) + 1
  INTO next_num FROM invoices WHERE invoice_number LIKE 'INV' || year_suffix || '%';
  RETURN 'INV' || year_suffix || LPAD(next_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_invoice_number() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invoice_number BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

CREATE OR REPLACE FUNCTION generate_contract_number() RETURNS text AS $$
DECLARE next_num integer; year_suffix text;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 4) AS integer)), 0) + 1
  INTO next_num FROM contracts WHERE contract_number LIKE 'CON' || year_suffix || '%';
  RETURN 'CON' || year_suffix || LPAD(next_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_contract_number() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_contract_number BEFORE INSERT ON contracts
  FOR EACH ROW EXECUTE FUNCTION set_contract_number();

CREATE OR REPLACE FUNCTION update_invoice_totals() RETURNS TRIGGER AS $$
DECLARE invoice_subtotal decimal(12,2);
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_totals_insert AFTER INSERT ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();
CREATE TRIGGER trigger_update_invoice_totals_update AFTER UPDATE ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();
CREATE TRIGGER trigger_update_invoice_totals_delete AFTER DELETE ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

CREATE OR REPLACE FUNCTION log_invoice_status_change() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO invoice_audit_log (invoice_id, action, old_status, new_status, changed_by)
    VALUES (NEW.id, 'status_change', OLD.status, NEW.status, NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_invoice_status AFTER UPDATE ON invoices
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_invoice_status_change();

-- Default MSA template
INSERT INTO contract_templates (name, contract_type, content, variables, description) VALUES
('Master Service Agreement', 'msa', 
'MASTER SERVICE AGREEMENT

Between: NorthForce AB (Org: 559408-4707)
And: {{customer_name}} (Org: {{customer_org_number}})
Date: {{start_date}}

1. SERVICES: Digital transformation and AI automation via Statements of Work.

2. CREDITS SYSTEM
   - 1 credit = 1 normalized senior consultant hour
   - Monthly allocation: {{monthly_credits}} credits
   - Price per credit: {{price_per_credit}} SEK
   - Monthly fee: {{monthly_mrr}} SEK

3. PAYMENT TERMS: {{payment_terms}}

4. TERM: From {{start_date}}, terminable with {{notice_period}} days notice.

5. CONFIDENTIALITY: Proprietary information remains confidential.

6. LIABILITY: Limited to fees paid in preceding 12 months.

7. LAW: Governed by Swedish law.

SIGNATURES:
NorthForce: {{northforce_signatory_name}}, {{northforce_signatory_title}}
Client: {{customer_signatory_name}}, {{customer_signatory_title}}',
'["customer_name", "customer_org_number", "monthly_credits", "price_per_credit", "monthly_mrr", "payment_terms", "notice_period", "start_date", "northforce_signatory_name", "northforce_signatory_title", "customer_signatory_name", "customer_signatory_title"]',
'Standard MSA for NorthForce credits-based services'
) ON CONFLICT DO NOTHING;