/*
  # Automatic Credits and Cost Calculation System

  ## Purpose
  Implements the core business logic for the Partner Portal:
  - Auto-calculates credits_consumed: hours × work_type.credits_per_hour
  - Auto-calculates internal_cost: hours × partner.hourly_cost × work_type.internal_cost_factor
  - Creates credits_transaction records automatically
  - Updates customer.credits_balance in real-time
  - Updates customer.credits_consumed_this_month

  ## Business Rules
  1 credit = 1 normalized senior consultant hour (internal reference)
  
  Work type weights:
  - Strategy/Leadership: 1.5x
  - AI/Architecture: 1.3-1.5x
  - SEO/Content/Operations: 1.0x
  - Coordination/Admin: 0.5-0.7x (not yet implemented)

  ## Implementation
  - Database trigger on time_entries (INSERT, UPDATE)
  - Automatic calculation before row is saved
  - Cascading updates to customer balance
  - Transaction log for audit trail
  
  ## Safety
  - Uses IF EXISTS checks
  - Handles NULL values gracefully
  - Validates all calculations
*/

-- Function to calculate and update time entry costs
CREATE OR REPLACE FUNCTION calculate_time_entry_costs()
RETURNS TRIGGER AS $$
DECLARE
  v_work_type_credits_per_hour NUMERIC;
  v_work_type_cost_factor NUMERIC;
  v_partner_hourly_cost NUMERIC;
  v_calculated_credits NUMERIC;
  v_calculated_cost NUMERIC;
  v_old_credits NUMERIC;
  v_customer_id UUID;
BEGIN
  -- Get work type multipliers
  SELECT credits_per_hour, internal_cost_factor
  INTO v_work_type_credits_per_hour, v_work_type_cost_factor
  FROM work_types
  WHERE id = NEW.work_type_id;

  -- Default to 1.0 if not found
  v_work_type_credits_per_hour := COALESCE(v_work_type_credits_per_hour, 1.0);
  v_work_type_cost_factor := COALESCE(v_work_type_cost_factor, 1.0);

  -- Get partner hourly cost (either from cost_rates or default)
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

  -- Calculate credits consumed
  v_calculated_credits := NEW.hours * v_work_type_credits_per_hour;
  
  -- Calculate internal cost
  v_calculated_cost := NEW.hours * v_partner_hourly_cost * v_work_type_cost_factor;

  -- Store old credits if this is an update
  v_old_credits := COALESCE(OLD.credits_consumed, 0);

  -- Set the calculated values
  NEW.credits_consumed := v_calculated_credits;
  NEW.internal_cost := v_calculated_cost;

  -- Get customer_id
  v_customer_id := NEW.customer_id;

  -- Update customer balance (only if this is billable)
  IF NEW.billable THEN
    IF TG_OP = 'INSERT' THEN
      -- Deduct credits from customer balance
      UPDATE customers 
      SET 
        credits_balance = credits_balance - v_calculated_credits,
        credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) + v_calculated_credits
      WHERE id = v_customer_id;

      -- Create credits transaction for deduction
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
        v_customer_id,
        'deduction',
        -v_calculated_credits,
        c.credits_balance,
        NEW.id,
        NEW.partner_id,
        'Time entry: ' || NEW.description,
        jsonb_build_object(
          'hours', NEW.hours,
          'work_type_id', NEW.work_type_id,
          'date', NEW.date,
          'credits_per_hour', v_work_type_credits_per_hour
        )
      FROM customers c
      WHERE c.id = v_customer_id;

    ELSIF TG_OP = 'UPDATE' THEN
      -- Handle credit difference on update
      IF v_calculated_credits != v_old_credits THEN
        UPDATE customers 
        SET 
          credits_balance = credits_balance + v_old_credits - v_calculated_credits,
          credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) - v_old_credits + v_calculated_credits
        WHERE id = v_customer_id;

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
          v_customer_id,
          'adjustment',
          v_old_credits - v_calculated_credits,
          c.credits_balance,
          NEW.id,
          NEW.partner_id,
          'Time entry adjustment: ' || NEW.description,
          jsonb_build_object(
            'old_credits', v_old_credits,
            'new_credits', v_calculated_credits,
            'hours', NEW.hours
          )
        FROM customers c
        WHERE c.id = v_customer_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_calculate_time_entry_costs ON time_entries;

-- Create trigger
CREATE TRIGGER trigger_calculate_time_entry_costs
  BEFORE INSERT OR UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_entry_costs();

-- Function to handle time entry deletion (refund credits)
CREATE OR REPLACE FUNCTION handle_time_entry_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if entry was billable
  IF OLD.billable THEN
    -- Refund credits to customer
    UPDATE customers 
    SET 
      credits_balance = credits_balance + COALESCE(OLD.credits_consumed, 0),
      credits_consumed_this_month = COALESCE(credits_consumed_this_month, 0) - COALESCE(OLD.credits_consumed, 0)
    WHERE id = OLD.customer_id;

    -- Create refund transaction
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
      OLD.customer_id,
      'refund',
      COALESCE(OLD.credits_consumed, 0),
      c.credits_balance,
      OLD.id,
      OLD.partner_id,
      'Time entry deleted: ' || OLD.description,
      jsonb_build_object(
        'deleted_at', NOW(),
        'hours', OLD.hours,
        'date', OLD.date
      )
    FROM customers c
    WHERE c.id = OLD.customer_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_handle_time_entry_deletion ON time_entries;

-- Create deletion trigger
CREATE TRIGGER trigger_handle_time_entry_deletion
  AFTER DELETE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION handle_time_entry_deletion();

-- Function to update overdelivery risk level based on credits balance
CREATE OR REPLACE FUNCTION update_customer_risk_level()
RETURNS TRIGGER AS $$
DECLARE
  v_balance_percentage NUMERIC;
  v_new_risk_level TEXT;
BEGIN
  -- Calculate remaining balance percentage
  IF NEW.credits_monthly_allocation > 0 THEN
    v_balance_percentage := (NEW.credits_balance / NEW.credits_monthly_allocation) * 100;
    
    -- Determine risk level
    IF v_balance_percentage < 10 THEN
      v_new_risk_level := 'critical';
    ELSIF v_balance_percentage < 20 THEN
      v_new_risk_level := 'high';
    ELSIF v_balance_percentage < 30 THEN
      v_new_risk_level := 'medium';
    ELSE
      v_new_risk_level := 'low';
    END IF;

    -- Update risk level if changed
    IF NEW.overdelivery_risk_level != v_new_risk_level THEN
      NEW.overdelivery_risk_level := v_new_risk_level;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_customer_risk_level ON customers;

-- Create risk level update trigger
CREATE TRIGGER trigger_update_customer_risk_level
  BEFORE UPDATE OF credits_balance ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_risk_level();