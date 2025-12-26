/*
  # Enterprise Audit & Tracking Systems

  1. New Tables
    - email_delivery_log - Tracks all emails sent for audit trail
    - payment_transactions - Tracks all payment attempts and successes
    - sla_metrics - Tracks actual SLA performance metrics (complements existing sla_tracking)
    - fx_rate_history - Historical exchange rate tracking
    - time_entry_invoice_mapping - Maps time entries to invoice line items

  2. Security
    - Enable RLS on all tables
    - Admin-only access for all audit tables

  3. Functions
    - Calculate SLA compliance automatically
    - Track email delivery status
    - Map time entries to invoices with proper tracking
*/

-- Email Delivery Log Table
CREATE TABLE IF NOT EXISTS email_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type text NOT NULL CHECK (email_type IN ('invoice', 'contract', 'notification', 'reminder', 'newsletter')),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked')),
  delivery_timestamp timestamptz,
  bounce_reason text,
  related_entity_id uuid,
  related_entity_type text CHECK (related_entity_type IN ('invoice', 'contract', 'customer', 'lead')),
  sent_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_delivery_log_recipient ON email_delivery_log(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_delivery_log_entity ON email_delivery_log(related_entity_id, related_entity_type);
CREATE INDEX IF NOT EXISTS idx_email_delivery_log_status ON email_delivery_log(delivery_status);
CREATE INDEX IF NOT EXISTS idx_email_delivery_log_sent_at ON email_delivery_log(sent_at DESC);

ALTER TABLE email_delivery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email delivery log"
  ON email_delivery_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert email delivery log"
  ON email_delivery_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id),
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  payment_method text CHECK (payment_method IN ('card', 'bank_transfer', 'stripe', 'paypal', 'invoice', 'cash', 'other')),
  transaction_status text DEFAULT 'pending' CHECK (transaction_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  transaction_id text,
  gateway_reference text,
  gateway_fee decimal(10,2),
  net_amount decimal(15,2),
  payment_date timestamptz,
  processed_at timestamptz,
  processor_response jsonb DEFAULT '{}',
  failure_reason text,
  refund_amount decimal(15,2),
  refunded_at timestamptz,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer ON payment_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(transaction_status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_date ON payment_transactions(payment_date DESC);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment transactions"
  ON payment_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- SLA Metrics Table (complements existing sla_tracking with aggregated metrics)
CREATE TABLE IF NOT EXISTS sla_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  metric_type text NOT NULL CHECK (metric_type IN ('response_time', 'resolution_time', 'uptime', 'availability', 'delivery_time', 'support_response')),
  target_value decimal(10,2) NOT NULL,
  actual_value decimal(10,2) NOT NULL,
  unit text NOT NULL CHECK (unit IN ('hours', 'minutes', 'days', 'percentage', 'count')),
  measurement_period_start timestamptz NOT NULL,
  measurement_period_end timestamptz NOT NULL,
  compliance_percentage decimal(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN metric_type IN ('uptime', 'availability') THEN actual_value
      ELSE LEAST(100, (target_value / NULLIF(actual_value, 0)) * 100)
    END
  ) STORED,
  is_breach boolean GENERATED ALWAYS AS (
    CASE
      WHEN metric_type IN ('uptime', 'availability') THEN actual_value < target_value
      ELSE actual_value > target_value
    END
  ) STORED,
  breach_severity text CHECK (breach_severity IN ('minor', 'major', 'critical')),
  related_entity_id uuid,
  related_entity_type text CHECK (related_entity_type IN ('support_ticket', 'project', 'delivery', 'incident')),
  notes text,
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sla_metrics_customer ON sla_metrics(customer_id);
CREATE INDEX IF NOT EXISTS idx_sla_metrics_breach ON sla_metrics(is_breach) WHERE is_breach = true;
CREATE INDEX IF NOT EXISTS idx_sla_metrics_period ON sla_metrics(measurement_period_start, measurement_period_end);

ALTER TABLE sla_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage SLA metrics"
  ON sla_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- FX Rate History Table
CREATE TABLE IF NOT EXISTS fx_rate_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code text NOT NULL,
  rate_to_eur decimal(12,6) NOT NULL,
  effective_date date NOT NULL,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'ecb', 'api', 'system')),
  is_active boolean DEFAULT true,
  notes text,
  recorded_at timestamptz DEFAULT now(),
  recorded_by uuid REFERENCES auth.users(id),
  UNIQUE(currency_code, effective_date)
);

CREATE INDEX IF NOT EXISTS idx_fx_rate_history_currency ON fx_rate_history(currency_code, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_fx_rate_history_active ON fx_rate_history(is_active) WHERE is_active = true;

ALTER TABLE fx_rate_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage FX rate history"
  ON fx_rate_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Time Entry to Invoice Line Item Mapping (CORRECTED: time_entries not time_reporting)
CREATE TABLE IF NOT EXISTS time_entry_invoice_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_entry_id uuid REFERENCES time_entries(id) ON DELETE CASCADE,
  invoice_line_item_id uuid REFERENCES invoice_line_items(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id),
  hours_billed decimal(8,2) NOT NULL,
  credits_billed decimal(10,2) NOT NULL,
  amount_billed decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  billing_rate decimal(10,2),
  mapped_at timestamptz DEFAULT now(),
  mapped_by uuid REFERENCES auth.users(id),
  billing_period_start date,
  billing_period_end date,
  notes text,
  UNIQUE(time_entry_id, invoice_line_item_id)
);

CREATE INDEX IF NOT EXISTS idx_time_entry_mapping_time_entry ON time_entry_invoice_mapping(time_entry_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_mapping_line_item ON time_entry_invoice_mapping(invoice_line_item_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_mapping_customer ON time_entry_invoice_mapping(customer_id);

ALTER TABLE time_entry_invoice_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage time entry mappings"
  ON time_entry_invoice_mapping FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to calculate SLA breach count for a customer
CREATE OR REPLACE FUNCTION get_sla_breach_count(customer_uuid uuid, days_back integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  breach_count integer;
BEGIN
  SELECT COUNT(*)
  INTO breach_count
  FROM sla_metrics
  WHERE customer_id = customer_uuid
    AND is_breach = true
    AND measurement_period_start >= (CURRENT_DATE - days_back);

  RETURN COALESCE(breach_count, 0);
END;
$$;

-- Function to log email delivery
CREATE OR REPLACE FUNCTION log_email_delivery(
  p_email_type text,
  p_recipient text,
  p_subject text,
  p_entity_id uuid,
  p_entity_type text,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO email_delivery_log (
    email_type,
    recipient_email,
    subject,
    related_entity_id,
    related_entity_type,
    sent_by,
    metadata
  ) VALUES (
    p_email_type,
    p_recipient,
    p_subject,
    p_entity_id,
    p_entity_type,
    auth.uid(),
    p_metadata
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$;

-- Update FX rates from history (automated lookup)
CREATE OR REPLACE FUNCTION get_fx_rate_for_date(p_currency text, p_date date DEFAULT CURRENT_DATE)
RETURNS decimal(12,6)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rate decimal(12,6);
BEGIN
  SELECT rate_to_eur
  INTO rate
  FROM fx_rate_history
  WHERE currency_code = p_currency
    AND effective_date <= p_date
    AND is_active = true
  ORDER BY effective_date DESC
  LIMIT 1;

  IF rate IS NULL THEN
    SELECT rate_to_eur
    INTO rate
    FROM currencies
    WHERE code = p_currency
      AND is_active = true;
  END IF;

  RETURN COALESCE(rate, 1.0);
END;
$$;