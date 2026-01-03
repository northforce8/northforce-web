/*
  # Fix Function and Materialized View Security
  
  1. Summary
    - Fix remaining function with mutable search_path
    - Restrict materialized view access from anonymous users
    - Ensure proper security isolation
  
  2. Security Impact
    - Prevents schema injection attacks
    - Protects sensitive data from unauthenticated access
*/

-- Fix initialize_mckinsey_7s_elements function
DROP FUNCTION IF EXISTS initialize_mckinsey_7s_elements() CASCADE;

CREATE FUNCTION initialize_mckinsey_7s_elements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mckinsey_7s_elements (assessment_id, element_name, current_score, target_score)
  VALUES
    (NEW.id, 'Strategy', 0, 0),
    (NEW.id, 'Structure', 0, 0),
    (NEW.id, 'Systems', 0, 0),
    (NEW.id, 'Shared Values', 0, 0),
    (NEW.id, 'Skills', 0, 0),
    (NEW.id, 'Style', 0, 0),
    (NEW.id, 'Staff', 0, 0);
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS initialize_mckinsey_7s_elements_trigger ON mckinsey_7s_assessments;

CREATE TRIGGER initialize_mckinsey_7s_elements_trigger
  AFTER INSERT ON mckinsey_7s_assessments
  FOR EACH ROW
  EXECUTE FUNCTION initialize_mckinsey_7s_elements();

-- Restrict materialized view access from anonymous users
DO $$
BEGIN
  -- Revoke from anon
  EXECUTE 'REVOKE ALL ON customer_summary_view FROM anon';
  EXECUTE 'REVOKE ALL ON project_summary_view FROM anon';
  
  -- Grant only to authenticated
  EXECUTE 'GRANT SELECT ON customer_summary_view TO authenticated';
  EXECUTE 'GRANT SELECT ON project_summary_view TO authenticated';
EXCEPTION
  WHEN undefined_table THEN
    -- Views don't exist yet, skip
    NULL;
  WHEN undefined_object THEN
    -- Role doesn't exist, skip
    NULL;
END $$;

-- Add security comments
COMMENT ON FUNCTION initialize_mckinsey_7s_elements() IS 'Secured function with explicit search_path to prevent schema injection. Automatically initializes 7S framework elements.';
