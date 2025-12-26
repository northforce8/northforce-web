/*
  # Fix Credits Calculation Trigger Timing
  
  ## Problem
  The BEFORE trigger tried to create credits_transactions before the time_entry row was saved,
  causing foreign key constraint violations.
  
  ## Solution
  - Keep cost calculation in BEFORE trigger (sets credits_consumed and internal_cost)
  - Move credits_transactions creation to AFTER trigger
  - Move customer balance update to AFTER trigger
  
  This ensures the time_entry exists before we reference it in transactions.
*/

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_calculate_time_entry_costs ON time_entries;
DROP TRIGGER IF EXISTS trigger_update_customer_credits ON time_entries;

-- Function to calculate costs (BEFORE trigger)
CREATE OR REPLACE FUNCTION calculate_time_entry_costs()
RETURNS TRIGGER AS $$
DECLARE
  v_work_type_credits_per_hour NUMERIC;
  v_work_type_cost_factor NUMERIC;
  v_partner_hourly_cost NUMERIC;
  v_calculated_credits NUMERIC;
  v_calculated_cost NUMERIC;
BEGIN
  -- Get work type multipliers
  SELECT credits_per_hour, internal_cost_factor
  INTO v_work_type_credits_per_hour, v_work_type_cost_factor
  FROM work_types
  WHERE id = NEW.work_type_id;

  -- Default to 1.0 if not found
  v_work_type_credits_per_hour := COALESCE(v_work_type_credits_per_hour, 1.0);
  v_work_type_cost_factor := COALESCE(v_work_type_cost_factor, 1.0);

  -- Get partner hourly cost
  SELECT COALESCE(
    (SELECT hourly_cost 
     FROM partner_cost_rates 
     WHERE partner_id = NEW.partner_id 
     AND effective_from <= NEW.date 
     AND (effective_until IS NULL OR effective_until >= NEW.date)
     ORDER BY effective_from DESC 
     LIMIT 1),
    (SELECT default_hourly_cost FROM partners WHERE id = NEW.partner_id),
    850.00
  ) INTO v_partner_hourly_cost;

  -- Calculate credits consumed and internal cost
  NEW.credits_consumed := NEW.hours * v_work_type_credits_per_hour;
  NEW.internal_cost := NEW.hours * v_partner_hourly_cost * v_work_type_cost_factor;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer credits (AFTER trigger)
CREATE OR REPLACE FUNCTION update_customer_credits()
RETURNS TRIGGER AS $$
DECLARE
  v_old_credits NUMERIC;
  v_credit_delta NUMERIC;
BEGIN
  -- Only process billable entries
  IF NOT NEW.billable THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Deduct credits from customer balance
    UPDATE customers 
    SET 
      credits_balance = credits_balance - NEW.credits_consumed,
      credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) + NEW.credits_consumed
    WHERE id = NEW.customer_id;

    -- Create credits transaction
    INSERT INTO credits_transactions (
      customer_id,
      transaction_type,
      amount,
      balance_after,
      related_time_entry_id,
      related_partner_id,
      reason,
      metadata
    )
    SELECT 
      NEW.customer_id,
      'deduction',
      -NEW.credits_consumed,
      c.credits_balance,
      NEW.id,
      NEW.partner_id,
      'Time entry: ' || NEW.description,
      jsonb_build_object(
        'hours', NEW.hours,
        'work_type_id', NEW.work_type_id,
        'date', NEW.date
      )
    FROM customers c
    WHERE c.id = NEW.customer_id;

  ELSIF TG_OP = 'UPDATE' THEN
    v_old_credits := COALESCE(OLD.credits_consumed, 0);
    v_credit_delta := NEW.credits_consumed - v_old_credits;
    
    IF v_credit_delta != 0 THEN
      -- Adjust customer balance
      UPDATE customers 
      SET 
        credits_balance = credits_balance - v_credit_delta,
        credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) + v_credit_delta
      WHERE id = NEW.customer_id;

      -- Create adjustment transaction
      INSERT INTO credits_transactions (
        customer_id,
        transaction_type,
        amount,
        balance_after,
        related_time_entry_id,
        related_partner_id,
        reason,
        metadata
      )
      SELECT 
        NEW.customer_id,
        'adjustment',
        -v_credit_delta,
        c.credits_balance,
        NEW.id,
        NEW.partner_id,
        'Time entry adjustment: ' || NEW.description,
        jsonb_build_object(
          'old_credits', v_old_credits,
          'new_credits', NEW.credits_consumed,
          'delta', v_credit_delta
        )
      FROM customers c
      WHERE c.id = NEW.customer_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create BEFORE trigger for cost calculation
CREATE TRIGGER trigger_calculate_time_entry_costs
  BEFORE INSERT OR UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_entry_costs();

-- Create AFTER trigger for customer credits update
CREATE TRIGGER trigger_update_customer_credits
  AFTER INSERT OR UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_credits();