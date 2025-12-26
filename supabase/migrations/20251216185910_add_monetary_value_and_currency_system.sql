/*
  # Add Monetary Value and Currency System
  
  1. Currency Support
    - Create currencies table with exchange rates
    - Add currency to customers, invoices, contracts
    - Support: EUR (base), SEK, USD, NOK, DKK
  
  2. Credit Monetary Values
    - Add credit_value_eur to enterprise_plans
    - Add currency and credit_value to customers
    - Enable automatic revenue calculation
  
  3. Plan Pricing
    - Starter: 1 credit = €150
    - Growth: 1 credit = €135
    - Scale: 1 credit = €120
    - Enterprise: custom
  
  4. Revenue Calculations
    - MRR in customer's currency
    - Conversion for reporting
    - Historical exchange rate tracking
*/

-- =============================================
-- 1. CURRENCIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS currencies (
  code text PRIMARY KEY,
  name text NOT NULL,
  symbol text NOT NULL,
  rate_to_eur decimal(10,6) NOT NULL DEFAULT 1.0,
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view currencies" ON currencies FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins manage currencies" ON currencies FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

-- Seed currencies with approximate rates (EUR = 1.0 base)
INSERT INTO currencies (code, name, symbol, rate_to_eur) VALUES
  ('EUR', 'Euro', '€', 1.0),
  ('SEK', 'Swedish Krona', 'kr', 0.087),  -- 1 SEK ≈ 0.087 EUR
  ('USD', 'US Dollar', '$', 0.92),        -- 1 USD ≈ 0.92 EUR
  ('NOK', 'Norwegian Krone', 'kr', 0.084), -- 1 NOK ≈ 0.084 EUR
  ('DKK', 'Danish Krone', 'kr', 0.134)    -- 1 DKK ≈ 0.134 EUR
ON CONFLICT (code) DO NOTHING;

-- Index for exchange rate lookups
CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active) WHERE is_active = true;

-- =============================================
-- 2. ADD CREDIT VALUES TO PLANS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'enterprise_plans' AND column_name = 'credit_value_eur'
  ) THEN
    ALTER TABLE enterprise_plans ADD COLUMN credit_value_eur decimal(10,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'enterprise_plans' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE enterprise_plans ADD COLUMN currency_code text DEFAULT 'EUR';
  END IF;
END $$;

-- Add foreign key after column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'enterprise_plans_currency_code_fkey'
  ) THEN
    ALTER TABLE enterprise_plans ADD CONSTRAINT enterprise_plans_currency_code_fkey 
      FOREIGN KEY (currency_code) REFERENCES currencies(code);
  END IF;
END $$;

-- Set default credit values based on plan tier
UPDATE enterprise_plans SET 
  credit_value_eur = CASE 
    WHEN tier = 'starter' THEN 150.00
    WHEN tier = 'growth' THEN 135.00
    WHEN tier = 'scale' THEN 120.00
    WHEN tier = 'enterprise_custom' THEN 100.00
    ELSE 150.00
  END,
  currency_code = 'EUR'
WHERE credit_value_eur IS NULL;

-- =============================================
-- 3. ADD CURRENCY TO CUSTOMERS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE customers ADD COLUMN currency_code text DEFAULT 'SEK';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'credit_value_local'
  ) THEN
    ALTER TABLE customers ADD COLUMN credit_value_local decimal(10,2);
  END IF;
END $$;

-- Add foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'customers_currency_code_fkey'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_currency_code_fkey 
      FOREIGN KEY (currency_code) REFERENCES currencies(code);
  END IF;
END $$;

-- Set default currency for existing customers (Sweden-based company)
UPDATE customers SET 
  currency_code = 'SEK'
WHERE currency_code IS NULL;

-- Copy old price to new column if not set
UPDATE customers SET 
  credit_value_local = COALESCE(credits_price_per_credit, 1500.00)
WHERE credit_value_local IS NULL;

-- =============================================
-- 4. ADD CURRENCY TO INVOICES
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE invoices ADD COLUMN currency_code text DEFAULT 'EUR';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'exchange_rate_to_eur'
  ) THEN
    ALTER TABLE invoices ADD COLUMN exchange_rate_to_eur decimal(10,6) DEFAULT 1.0;
  END IF;
END $$;

-- Add foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'invoices_currency_code_fkey'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_currency_code_fkey 
      FOREIGN KEY (currency_code) REFERENCES currencies(code);
  END IF;
END $$;

-- Set currency from customer on invoice creation
CREATE OR REPLACE FUNCTION set_invoice_currency()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Get currency from customer
  SELECT currency_code, 
         (SELECT rate_to_eur FROM currencies WHERE code = customers.currency_code)
  INTO NEW.currency_code, NEW.exchange_rate_to_eur
  FROM customers
  WHERE id = NEW.customer_id;
  
  -- Default to SEK if not found (Sweden-based company)
  NEW.currency_code := COALESCE(NEW.currency_code, 'SEK');
  NEW.exchange_rate_to_eur := COALESCE(NEW.exchange_rate_to_eur, 0.087);
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_invoice_currency_trigger ON invoices;
CREATE TRIGGER set_invoice_currency_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_currency();

-- =============================================
-- 5. ADD CURRENCY TO CONTRACTS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contracts' AND column_name = 'currency_code'
  ) THEN
    ALTER TABLE contracts ADD COLUMN currency_code text DEFAULT 'SEK';
  END IF;
END $$;

-- Add foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'contracts_currency_code_fkey'
  ) THEN
    ALTER TABLE contracts ADD CONSTRAINT contracts_currency_code_fkey 
      FOREIGN KEY (currency_code) REFERENCES currencies(code);
  END IF;
END $$;

-- =============================================
-- 6. CURRENCY CONVERSION FUNCTIONS
-- =============================================

-- Convert amount from one currency to another
CREATE OR REPLACE FUNCTION convert_currency(
  amount decimal,
  from_currency text,
  to_currency text
)
RETURNS decimal
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  from_rate decimal;
  to_rate decimal;
  result decimal;
BEGIN
  -- Get exchange rates
  SELECT rate_to_eur INTO from_rate FROM currencies WHERE code = from_currency AND is_active = true;
  SELECT rate_to_eur INTO to_rate FROM currencies WHERE code = to_currency AND is_active = true;
  
  -- Default to 1.0 if currency not found
  from_rate := COALESCE(from_rate, 1.0);
  to_rate := COALESCE(to_rate, 1.0);
  
  -- Convert: amount → EUR → target currency
  result := (amount * from_rate) / to_rate;
  
  RETURN ROUND(result, 2);
END;
$$;

-- Get MRR in specific currency
CREATE OR REPLACE FUNCTION get_mrr_in_currency(
  customer_uuid uuid,
  target_currency text DEFAULT 'EUR'
)
RETURNS decimal
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mrr decimal;
  cust_currency text;
  result decimal;
BEGIN
  -- Get customer MRR and currency
  SELECT monthly_recurring_revenue, currency_code 
  INTO mrr, cust_currency
  FROM customers 
  WHERE id = customer_uuid;
  
  -- Convert to target currency
  result := convert_currency(COALESCE(mrr, 0), COALESCE(cust_currency, 'EUR'), target_currency);
  
  RETURN result;
END;
$$;

-- =============================================
-- 7. ADD INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_customers_currency ON customers(currency_code);
CREATE INDEX IF NOT EXISTS idx_invoices_currency ON invoices(currency_code);
CREATE INDEX IF NOT EXISTS idx_contracts_currency ON contracts(currency_code);
CREATE INDEX IF NOT EXISTS idx_enterprise_plans_currency ON enterprise_plans(currency_code);
CREATE INDEX IF NOT EXISTS idx_customers_enterprise_tier ON customers(enterprise_tier);
CREATE INDEX IF NOT EXISTS idx_customers_credits_plan ON customers(credits_plan_level);

-- =============================================
-- 8. QUARTERLY PLAN CHANGE TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS plan_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  current_tier text NOT NULL,
  requested_tier text NOT NULL,
  requested_by uuid REFERENCES admin_users(id),
  requested_at timestamptz DEFAULT now(),
  effective_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  reason text,
  approved_by uuid REFERENCES admin_users(id),
  approved_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plan_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage plan changes" ON plan_change_requests FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_plan_changes_customer ON plan_change_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_plan_changes_status ON plan_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_plan_changes_effective_date ON plan_change_requests(effective_date);

-- =============================================
-- 9. REVENUE REPORTING VIEW
-- =============================================

-- View for revenue in multiple currencies
CREATE OR REPLACE VIEW revenue_by_currency AS
SELECT 
  c.currency_code,
  cur.symbol,
  COUNT(DISTINCT c.id) as customer_count,
  SUM(c.monthly_recurring_revenue) as total_mrr_local,
  SUM(convert_currency(COALESCE(c.monthly_recurring_revenue, 0), c.currency_code, 'EUR')) as total_mrr_eur,
  AVG(c.monthly_recurring_revenue) as avg_mrr_local,
  SUM(c.credits_balance) as total_credits_remaining,
  SUM(c.credits_consumed_this_month) as total_credits_consumed_this_month
FROM customers c
JOIN currencies cur ON c.currency_code = cur.code
WHERE c.status = 'active'
GROUP BY c.currency_code, cur.symbol;

-- =============================================
-- 10. CALENDAR & CAPACITY PLANNING TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS capacity_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  allocated_hours decimal(5,2) NOT NULL DEFAULT 0,
  allocated_credits decimal(8,2) NOT NULL DEFAULT 0,
  recurrence_pattern text CHECK (recurrence_pattern IN ('none', 'weekly', 'biweekly', 'monthly')),
  recurrence_end_date date,
  notes text,
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE capacity_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage capacity calendar" ON capacity_calendar FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_capacity_calendar_partner ON capacity_calendar(partner_id);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_customer ON capacity_calendar(customer_id);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_project ON capacity_calendar(project_id);
CREATE INDEX IF NOT EXISTS idx_capacity_calendar_dates ON capacity_calendar(start_date, end_date);

-- =============================================
-- 11. CAPACITY FORECAST TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS capacity_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id),
  forecasted_hours decimal(8,2) NOT NULL DEFAULT 0,
  forecasted_credits decimal(10,2) NOT NULL DEFAULT 0,
  confidence_level text NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  based_on_historical boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE capacity_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view capacity forecast" ON capacity_forecast FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_capacity_forecast_period ON capacity_forecast(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_capacity_forecast_partner ON capacity_forecast(partner_id);
CREATE INDEX IF NOT EXISTS idx_capacity_forecast_customer ON capacity_forecast(customer_id);

-- =============================================
-- VERIFICATION
-- =============================================

-- This migration adds:
-- ✓ Multi-currency support (EUR, SEK, USD, NOK, DKK)
-- ✓ Credit monetary values on plans
-- ✓ Currency conversion functions
-- ✓ Currency tracking on customers, invoices, contracts
-- ✓ Plan change request tracking (quarterly restrictions)
-- ✓ Revenue reporting by currency
-- ✓ Capacity calendar for planning
-- ✓ Capacity forecast for AI-powered predictions