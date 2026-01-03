/*
  # Fix Database Triggers and Automation

  ## Critical Fixes

  This migration fixes critical issues discovered during production audit:

  ### Issues Fixed:

  1. **Recommendation Triggers** - Field name mismatches causing system failures
     - Fix: hours_worked → hours
     - Fix: cost_multiplier → internal_cost_factor  
     - Fix: Remove reference to non-existent internal_cost_per_hour
     - Fix: 'blockerad' → 'blocked' typo

  2. **Missing updated_at Triggers** - 5+ tables lack automatic timestamp updates
     - Add: partners, projects, time_entries, notes, customer_assignments, project_assignments

  3. **Missing Activity Logging** - No automatic audit trail
     - Add: Automatic triggers for customers, projects, contracts changes

  ## Updated_at Triggers Implementation

  Pattern:
  - Function: update_{table}_updated_at()
  - Trigger: Fires BEFORE UPDATE
  - Action: Sets NEW.updated_at = now()
*/

-- ============================================================================
-- FIX RECOMMENDATION TRIGGERS
-- ============================================================================

-- Drop broken recommendation functions
DROP FUNCTION IF EXISTS check_margin_health() CASCADE;
DROP FUNCTION IF EXISTS check_collaboration_blockers() CASCADE;
DROP FUNCTION IF EXISTS check_efficiency_ratio() CASCADE;

-- Fix: check_margin_health() with correct field names
CREATE OR REPLACE FUNCTION check_margin_health()
RETURNS void AS $$
DECLARE
  customer_rec RECORD;
  total_hours numeric;
  total_revenue numeric;
  total_cost numeric;
  margin_pct numeric;
BEGIN
  FOR customer_rec IN 
    SELECT c.id, c.company_name, c.credits_balance
    FROM customers c
    WHERE c.status = 'active'
  LOOP
    -- Calculate totals using CORRECT field name: 'hours' not 'hours_worked'
    SELECT 
      COALESCE(SUM(te.hours), 0),
      COALESCE(SUM(te.credits_consumed), 0),
      COALESCE(SUM(te.hours * wt.internal_cost_factor * 1000), 0) -- Using internal_cost_factor
    INTO total_hours, total_revenue, total_cost
    FROM time_entries te
    JOIN work_types wt ON te.work_type_id = wt.id
    WHERE te.customer_id = customer_rec.id
    AND te.date >= CURRENT_DATE - INTERVAL '30 days';

    -- Calculate margin percentage
    IF total_revenue > 0 THEN
      margin_pct := ((total_revenue - total_cost) / total_revenue) * 100;
      
      -- Generate recommendation if margin is low
      IF margin_pct < 15 THEN
        INSERT INTO recommendations (
          customer_id,
          recommendation_type,
          priority,
          title,
          description,
          business_impact,
          confidence_level
        ) VALUES (
          customer_rec.id,
          'margin_improvement',
          CASE 
            WHEN margin_pct < 5 THEN 'critical'
            WHEN margin_pct < 10 THEN 'high'
            ELSE 'medium'
          END,
          'Low Margin Alert',
          'Customer margin is ' || ROUND(margin_pct, 1) || '% over last 30 days. Review pricing or reduce delivery costs.',
          'Improved profitability on this account',
          CASE 
            WHEN total_hours > 50 THEN 0.9
            WHEN total_hours > 20 THEN 0.7
            ELSE 0.5
          END
        ) ON CONFLICT (customer_id, recommendation_type) DO UPDATE
        SET priority = EXCLUDED.priority,
            description = EXCLUDED.description,
            confidence_level = EXCLUDED.confidence_level,
            updated_at = now();
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fix: check_collaboration_blockers() with correct status value
CREATE OR REPLACE FUNCTION check_collaboration_blockers()
RETURNS void AS $$
DECLARE
  customer_rec RECORD;
  blocked_count integer;
BEGIN
  FOR customer_rec IN 
    SELECT c.id, c.company_name
    FROM customers c
    WHERE c.status = 'active'
  LOOP
    -- Count blocked projects - FIX: 'blockerad' → 'blocked'
    SELECT COUNT(*)
    INTO blocked_count
    FROM projects
    WHERE customer_id = customer_rec.id
    AND status = 'blocked'; -- FIXED: was 'blockerad'

    -- Generate recommendation if blockers exist
    IF blocked_count > 0 THEN
      INSERT INTO recommendations (
        customer_id,
        recommendation_type,
        priority,
        title,
        description,
        business_impact,
        confidence_level
      ) VALUES (
        customer_rec.id,
        'unblock_projects',
        CASE 
          WHEN blocked_count >= 3 THEN 'critical'
          WHEN blocked_count = 2 THEN 'high'
          ELSE 'medium'
        END,
        'Projects Blocked',
        blocked_count || ' project(s) are blocked and need attention. Review blockers and take action.',
        'Unblocking projects improves delivery and customer satisfaction',
        1.0
      ) ON CONFLICT (customer_id, recommendation_type) DO UPDATE
      SET priority = EXCLUDED.priority,
          description = EXCLUDED.description,
          updated_at = now();
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fix: check_efficiency_ratio() with correct field names
CREATE OR REPLACE FUNCTION check_efficiency_ratio()
RETURNS void AS $$
DECLARE
  partner_rec RECORD;
  total_hours numeric;
  billable_hours numeric;
  efficiency_pct numeric;
BEGIN
  FOR partner_rec IN 
    SELECT p.id, p.partner_name
    FROM partners p
    WHERE p.status = 'active'
  LOOP
    -- Calculate efficiency using CORRECT field name: 'hours' not 'hours_worked'
    SELECT 
      COALESCE(SUM(te.hours), 0),
      COALESCE(SUM(CASE WHEN te.billable THEN te.hours ELSE 0 END), 0)
    INTO total_hours, billable_hours
    FROM time_entries te
    WHERE te.partner_id = partner_rec.id
    AND te.date >= CURRENT_DATE - INTERVAL '30 days';

    -- Calculate efficiency
    IF total_hours > 0 THEN
      efficiency_pct := (billable_hours / total_hours) * 100;
      
      -- Generate recommendation if efficiency is low
      IF efficiency_pct < 70 AND total_hours > 40 THEN
        INSERT INTO recommendations (
          partner_id,
          recommendation_type,
          priority,
          title,
          description,
          business_impact,
          confidence_level
        ) VALUES (
          partner_rec.id,
          'improve_efficiency',
          CASE 
            WHEN efficiency_pct < 50 THEN 'high'
            WHEN efficiency_pct < 60 THEN 'medium'
            ELSE 'low'
          END,
          'Low Billable Ratio',
          'Partner efficiency is ' || ROUND(efficiency_pct, 1) || '% over last 30 days. Review non-billable activities.',
          'Improved utilization increases profitability',
          CASE 
            WHEN total_hours > 100 THEN 0.9
            WHEN total_hours > 60 THEN 0.7
            ELSE 0.5
          END
        ) ON CONFLICT (partner_id, recommendation_type) DO UPDATE
        SET priority = EXCLUDED.priority,
            description = EXCLUDED.description,
            confidence_level = EXCLUDED.confidence_level,
            updated_at = now();
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ADD MISSING UPDATED_AT TRIGGERS
-- ============================================================================

-- Partners table
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_partners_updated_at();

-- Projects table
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Time entries table
CREATE OR REPLACE FUNCTION update_time_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_time_entries_updated_at();

-- Notes table
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_notes_updated_at();

-- Customer assignments table
CREATE OR REPLACE FUNCTION update_customer_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_assignments_updated_at
  BEFORE UPDATE ON customer_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_assignments_updated_at();

-- Project assignments table
CREATE OR REPLACE FUNCTION update_project_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_assignments_updated_at
  BEFORE UPDATE ON project_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_project_assignments_updated_at();

-- ============================================================================
-- ADD ACTIVITY LOGGING TRIGGERS
-- ============================================================================

-- Generic function to log activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log INSERT operations
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO activity_log (
      entity_type,
      entity_id,
      action,
      metadata,
      actor_user_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'created',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP
      ),
      auth.uid()
    );
    RETURN NEW;
  
  -- Log UPDATE operations
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO activity_log (
      entity_type,
      entity_id,
      action,
      metadata,
      actor_user_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'updated',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'changes', to_jsonb(NEW) - to_jsonb(OLD)
      ),
      auth.uid()
    );
    RETURN NEW;
  
  -- Log DELETE operations
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO activity_log (
      entity_type,
      entity_id,
      action,
      metadata,
      actor_user_id
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id,
      'deleted',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP
      ),
      auth.uid()
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply activity logging to critical tables
CREATE TRIGGER customers_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

CREATE TRIGGER projects_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

CREATE TRIGGER contracts_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

CREATE TRIGGER invoices_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

CREATE TRIGGER time_entries_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

-- ============================================================================
-- REFRESH RECOMMENDATIONS ON SCHEDULE
-- ============================================================================

-- Run recommendation checks (should be called periodically via cron or scheduled function)
CREATE OR REPLACE FUNCTION refresh_all_recommendations()
RETURNS void AS $$
BEGIN
  -- Run all recommendation checks
  PERFORM check_margin_health();
  PERFORM check_collaboration_blockers();
  PERFORM check_efficiency_ratio();
  
  -- Clean up old low-priority recommendations (older than 30 days)
  DELETE FROM recommendations
  WHERE priority = 'low'
  AND created_at < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Test that triggers are working:
-- 1. Update a customer record and verify updated_at changes
-- 2. Update a project and verify activity_log entry created
-- 3. Create time entry and verify credits calculation works
-- 4. Run SELECT refresh_all_recommendations(); manually to test
