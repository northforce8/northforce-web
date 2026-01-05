/*
  # Fix Activity Log Trigger JSONB Operator Issue
  
  1. Changes
    - Drop broken log_activity function that uses unsupported jsonb - jsonb operator
    - Recreate function without the jsonb subtraction operation
    - This fixes UPDATE operations failing on customers, contracts, projects tables
  
  2. Notes
    - The jsonb - jsonb operator requires additional extensions not available
    - We store full NEW record instead of attempting diff calculation
    - Activity logging continues to work for audit purposes
*/

DROP FUNCTION IF EXISTS log_activity() CASCADE;

CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
        'operation', TG_OP,
        'record', to_jsonb(NEW)
      ),
      auth.uid()
    );
  ELSIF TG_OP = 'UPDATE' THEN
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
        'new_record', to_jsonb(NEW)
      ),
      auth.uid()
    );
  ELSIF TG_OP = 'DELETE' THEN
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
        'operation', TG_OP,
        'record', to_jsonb(OLD)
      ),
      auth.uid()
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers on affected tables
DROP TRIGGER IF EXISTS log_customers_activity ON customers;
CREATE TRIGGER log_customers_activity
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS log_contracts_activity ON contracts;
CREATE TRIGGER log_contracts_activity
  AFTER INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS log_projects_activity ON projects;
CREATE TRIGGER log_projects_activity
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_activity();
