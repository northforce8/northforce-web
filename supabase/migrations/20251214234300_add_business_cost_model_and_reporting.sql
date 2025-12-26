/*
  # Affärs- och kostnadsmodell för NorthForce Partner Portal

  ## Översikt
  Implementerar en komplett affärs- och kostnadsmodell som styr credits, kapacitet,
  kostnader, leverans och rapportering enligt NorthForce hybridmodell.

  ## Grundprinciper
  - 1 credit = 1 normaliserad senior konsulttimme (intern referens)
  - Kunden köper credits, inte timmar
  - Tid rapporteras av partners → credits dras automatiskt
  - Intern kostnad beräknas separat från extern credits-förbrukning

  ## Nya tabeller

  ### 1. partner_cost_rates
  - Intern kostnadssats per partner
  - Effektiv period för kostnadssats
  - Historik för kostnadsförändringar

  ### 2. credits_forecast
  - Prognoser för credits-förbrukning per kund
  - Forecast per period
  - Risk för överleverans

  ### 3. margin_analysis
  - Marginalberäkningar per kund/projekt
  - Credits-intäkter vs interna kostnader
  - Marginal i SEK och procent

  ### 4. capacity_utilization
  - Partner-belastning och kapacitet
  - Tidsfördelning per kund
  - Utnyttjandegrad

  ### 5. billing_periods
  - Faktureringsperioder per kund
  - Credits-allokering per period
  - Underlag för fakturering

  ## Utökade tabeller

  ### partners
  - Lägger till default_hourly_cost (intern kostnad)
  - Lägger till capacity_hours_per_month (tillgänglig kapacitet)

  ### work_types
  - Lägger till internal_cost_factor (intern kostnadsfaktor)
  - Redan har credits_per_hour

  ### customers
  - Lägger till credits_price_per_credit (pris per credit i SEK)
  - Lägger till monthly_recurring_revenue (MRR)

  ## Säkerhet
  - Alla tabeller har RLS aktiverat
  - Endast admins har full access
  - Partners har begränsad läsaccess för egna data
*/

-- ============================================================================
-- EXTEND EXISTING TABLES
-- ============================================================================

-- Extend partners table with cost and capacity
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'default_hourly_cost') THEN
    ALTER TABLE partners ADD COLUMN default_hourly_cost numeric(10,2) DEFAULT 850.00;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'capacity_hours_per_month') THEN
    ALTER TABLE partners ADD COLUMN capacity_hours_per_month numeric(6,2) DEFAULT 160.00;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'current_utilization_percentage') THEN
    ALTER TABLE partners ADD COLUMN current_utilization_percentage numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Extend work_types with internal cost factor
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'work_types' AND column_name = 'internal_cost_factor') THEN
    ALTER TABLE work_types ADD COLUMN internal_cost_factor numeric(5,2) DEFAULT 1.0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'work_types' AND column_name = 'category') THEN
    ALTER TABLE work_types ADD COLUMN category text CHECK (category IN ('strategic', 'operational', 'technical', 'administrative', 'leadership'));
  END IF;
END $$;

-- Extend customers with pricing and revenue tracking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_price_per_credit') THEN
    ALTER TABLE customers ADD COLUMN credits_price_per_credit numeric(10,2) DEFAULT 1500.00;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'monthly_recurring_revenue') THEN
    ALTER TABLE customers ADD COLUMN monthly_recurring_revenue numeric(12,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'credits_consumed_this_month') THEN
    ALTER TABLE customers ADD COLUMN credits_consumed_this_month numeric(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'overdelivery_risk_level') THEN
    ALTER TABLE customers ADD COLUMN overdelivery_risk_level text DEFAULT 'low' CHECK (overdelivery_risk_level IN ('low', 'medium', 'high', 'critical'));
  END IF;
END $$;

-- Extend time_entries with cost tracking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'time_entries' AND column_name = 'internal_cost') THEN
    ALTER TABLE time_entries ADD COLUMN internal_cost numeric(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'time_entries' AND column_name = 'credits_consumed') THEN
    ALTER TABLE time_entries ADD COLUMN credits_consumed numeric(10,2);
  END IF;
END $$;

-- ============================================================================
-- NEW TABLES
-- ============================================================================

-- Partner Cost Rates (historisk kostnadsspårning)
CREATE TABLE IF NOT EXISTS partner_cost_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  hourly_cost numeric(10,2) NOT NULL,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_until date,
  notes text,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Credits Forecast (prognoser)
CREATE TABLE IF NOT EXISTS credits_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  forecast_period_start date NOT NULL,
  forecast_period_end date NOT NULL,
  
  estimated_credits_consumption numeric(10,2) NOT NULL,
  current_credits_balance numeric(10,2) NOT NULL,
  projected_balance_end_of_period numeric(10,2) NOT NULL,
  
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_factors text[],
  
  recommended_action text,
  action_type text CHECK (action_type IN ('none', 'credits_topup', 'scope_review', 'capacity_adjustment', 'level_upgrade')),
  
  forecast_confidence numeric(3,2) DEFAULT 0.80,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Margin Analysis (marginalberäkningar)
CREATE TABLE IF NOT EXISTS margin_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  
  analysis_period_start date NOT NULL,
  analysis_period_end date NOT NULL,
  
  credits_consumed numeric(10,2) NOT NULL DEFAULT 0,
  credits_value_sek numeric(12,2) NOT NULL DEFAULT 0,
  
  internal_cost_sek numeric(12,2) NOT NULL DEFAULT 0,
  partner_hours numeric(10,2) NOT NULL DEFAULT 0,
  
  margin_sek numeric(12,2) NOT NULL DEFAULT 0,
  margin_percentage numeric(5,2) NOT NULL DEFAULT 0,
  
  avg_credit_cost numeric(10,2),
  avg_hourly_rate numeric(10,2),
  
  metadata jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Capacity Utilization (partnerbelastning)
CREATE TABLE IF NOT EXISTS capacity_utilization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  
  period_start date NOT NULL,
  period_end date NOT NULL,
  
  total_hours numeric(10,2) NOT NULL DEFAULT 0,
  billable_hours numeric(10,2) NOT NULL DEFAULT 0,
  non_billable_hours numeric(10,2) NOT NULL DEFAULT 0,
  
  available_capacity_hours numeric(10,2) NOT NULL,
  utilization_percentage numeric(5,2) NOT NULL DEFAULT 0,
  
  credits_generated numeric(10,2) NOT NULL DEFAULT 0,
  internal_cost numeric(12,2) NOT NULL DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Billing Periods (faktureringsperioder)
CREATE TABLE IF NOT EXISTS billing_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  
  period_start date NOT NULL,
  period_end date NOT NULL,
  period_name text NOT NULL,
  
  credits_allocated numeric(10,2) NOT NULL DEFAULT 0,
  credits_consumed numeric(10,2) NOT NULL DEFAULT 0,
  credits_remaining numeric(10,2) NOT NULL DEFAULT 0,
  
  base_price_sek numeric(12,2) NOT NULL DEFAULT 0,
  additional_credits_price_sek numeric(12,2) DEFAULT 0,
  total_amount_sek numeric(12,2) NOT NULL DEFAULT 0,
  
  internal_cost_sek numeric(12,2) NOT NULL DEFAULT 0,
  margin_sek numeric(12,2) NOT NULL DEFAULT 0,
  margin_percentage numeric(5,2) NOT NULL DEFAULT 0,
  
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'invoiced', 'paid', 'cancelled')),
  
  invoice_number text,
  invoice_date date,
  payment_date date,
  
  notes text,
  metadata jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_partner ON partner_cost_rates(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_cost_rates_effective ON partner_cost_rates(effective_from, effective_until);

CREATE INDEX IF NOT EXISTS idx_credits_forecast_customer ON credits_forecast(customer_id);
CREATE INDEX IF NOT EXISTS idx_credits_forecast_period ON credits_forecast(forecast_period_start, forecast_period_end);
CREATE INDEX IF NOT EXISTS idx_credits_forecast_risk ON credits_forecast(risk_level);

CREATE INDEX IF NOT EXISTS idx_margin_analysis_customer ON margin_analysis(customer_id);
CREATE INDEX IF NOT EXISTS idx_margin_analysis_project ON margin_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_margin_analysis_period ON margin_analysis(analysis_period_start, analysis_period_end);

CREATE INDEX IF NOT EXISTS idx_capacity_utilization_partner ON capacity_utilization(partner_id);
CREATE INDEX IF NOT EXISTS idx_capacity_utilization_customer ON capacity_utilization(customer_id);
CREATE INDEX IF NOT EXISTS idx_capacity_utilization_period ON capacity_utilization(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_billing_periods_customer ON billing_periods(customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_periods_period ON billing_periods(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_billing_periods_status ON billing_periods(status);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE partner_cost_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE margin_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_periods ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Partner Cost Rates (admin only)
CREATE POLICY "partner_cost_rates_admin_all"
  ON partner_cost_rates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Credits Forecast
CREATE POLICY "credits_forecast_select_policy"
  ON credits_forecast FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "credits_forecast_admin_manage"
  ON credits_forecast FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Margin Analysis (admin only)
CREATE POLICY "margin_analysis_admin_all"
  ON margin_analysis FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Capacity Utilization
CREATE POLICY "capacity_utilization_select_policy"
  ON capacity_utilization FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM partners p
      WHERE p.user_id = (select auth.uid())
      AND p.id = capacity_utilization.partner_id
    )
  );

CREATE POLICY "capacity_utilization_admin_manage"
  ON capacity_utilization FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Billing Periods (admin only)
CREATE POLICY "billing_periods_admin_all"
  ON billing_periods FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- ============================================================================
-- SEED DEFAULT WORK TYPES WITH COSTS
-- ============================================================================

-- Update existing work types with cost factors and categories
UPDATE work_types SET 
  internal_cost_factor = 1.5,
  credits_per_hour = 1.5,
  category = 'strategic'
WHERE name ILIKE '%strategy%' OR name ILIKE '%leadership%' OR name ILIKE '%consulting%';

UPDATE work_types SET 
  internal_cost_factor = 1.3,
  credits_per_hour = 1.3,
  category = 'technical'
WHERE name ILIKE '%ai%' OR name ILIKE '%architect%' OR name ILIKE '%development%';

UPDATE work_types SET 
  internal_cost_factor = 1.0,
  credits_per_hour = 1.0,
  category = 'operational'
WHERE name ILIKE '%seo%' OR name ILIKE '%content%' OR name ILIKE '%marketing%';

UPDATE work_types SET 
  internal_cost_factor = 0.7,
  credits_per_hour = 0.5,
  category = 'administrative'
WHERE name ILIKE '%admin%' OR name ILIKE '%coordination%' OR name ILIKE '%meeting%';

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to calculate costs on time entry
CREATE OR REPLACE FUNCTION calculate_time_entry_costs()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_credits_per_hour numeric(5,2);
  v_partner_hourly_cost numeric(10,2);
  v_credits_consumed numeric(10,2);
  v_internal_cost numeric(10,2);
BEGIN
  -- Get credits per hour from work type
  SELECT credits_per_hour INTO v_credits_per_hour
  FROM work_types
  WHERE id = NEW.work_type_id;
  
  -- Get partner hourly cost (current rate or default)
  SELECT COALESCE(
    (SELECT hourly_cost FROM partner_cost_rates 
     WHERE partner_id = NEW.partner_id 
     AND effective_from <= NEW.date
     AND (effective_until IS NULL OR effective_until >= NEW.date)
     ORDER BY effective_from DESC LIMIT 1),
    (SELECT default_hourly_cost FROM partners WHERE id = NEW.partner_id),
    850.00
  ) INTO v_partner_hourly_cost;
  
  -- Calculate values
  v_credits_consumed := NEW.hours * COALESCE(v_credits_per_hour, 1.0);
  v_internal_cost := NEW.hours * v_partner_hourly_cost;
  
  -- Set values on the time entry
  NEW.credits_consumed := v_credits_consumed;
  NEW.internal_cost := v_internal_cost;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate costs before inserting time entry
DROP TRIGGER IF EXISTS trigger_calculate_time_entry_costs ON time_entries;
CREATE TRIGGER trigger_calculate_time_entry_costs
  BEFORE INSERT ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_entry_costs();

-- Function to update customer credits consumption
CREATE OR REPLACE FUNCTION update_customer_credits_consumption()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_month_start date;
  v_monthly_consumed numeric(10,2);
BEGIN
  -- Calculate start of current month
  v_month_start := DATE_TRUNC('month', NEW.date)::date;
  
  -- Calculate total consumed this month
  SELECT COALESCE(SUM(credits_consumed), 0) INTO v_monthly_consumed
  FROM time_entries
  WHERE customer_id = NEW.customer_id
  AND date >= v_month_start;
  
  -- Update customer
  UPDATE customers
  SET credits_consumed_this_month = v_monthly_consumed
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update customer consumption after time entry
DROP TRIGGER IF EXISTS trigger_update_customer_credits_consumption ON time_entries;
CREATE TRIGGER trigger_update_customer_credits_consumption
  AFTER INSERT ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_credits_consumption();

-- Function to assess overdelivery risk
CREATE OR REPLACE FUNCTION assess_overdelivery_risk()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_remaining_percentage numeric(5,2);
  v_risk_level text;
BEGIN
  -- Calculate remaining percentage
  IF NEW.credits_monthly_allocation > 0 THEN
    v_remaining_percentage := ((NEW.credits_balance / NEW.credits_monthly_allocation) * 100);
    
    -- Assess risk level
    IF v_remaining_percentage < 10 THEN
      v_risk_level := 'critical';
    ELSIF v_remaining_percentage < 25 THEN
      v_risk_level := 'high';
    ELSIF v_remaining_percentage < 50 THEN
      v_risk_level := 'medium';
    ELSE
      v_risk_level := 'low';
    END IF;
    
    NEW.overdelivery_risk_level := v_risk_level;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assess risk on customer update
DROP TRIGGER IF EXISTS trigger_assess_overdelivery_risk ON customers;
CREATE TRIGGER trigger_assess_overdelivery_risk
  BEFORE UPDATE OF credits_balance, credits_monthly_allocation ON customers
  FOR EACH ROW
  EXECUTE FUNCTION assess_overdelivery_risk();
