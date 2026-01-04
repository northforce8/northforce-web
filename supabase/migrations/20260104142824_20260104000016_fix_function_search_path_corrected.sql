/*
  # Fix Function Search Path Security - Corrected
  
  1. Summary
    - Fix all versions of initialize_mckinsey_7s_elements function
    - Set immutable search_path to prevent injection attacks
    - Secure materialized views
  
  2. Security Impact
    - Prevents search_path manipulation
    - Restricts view access to authenticated users only
*/

-- Drop all versions of the function with CASCADE
DROP FUNCTION IF EXISTS initialize_mckinsey_7s_elements(UUID) CASCADE;

-- Recreate with secure search_path
CREATE OR REPLACE FUNCTION initialize_mckinsey_7s_elements(assessment_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO mckinsey_7s_elements (assessment_id, element_name, description, current_score, target_score)
  VALUES
    (assessment_id_param, 'Strategy', 'Plans and direction of the organization', 0, 10),
    (assessment_id_param, 'Structure', 'How the organization is organized', 0, 10),
    (assessment_id_param, 'Systems', 'Daily activities and procedures', 0, 10),
    (assessment_id_param, 'Shared Values', 'Core beliefs and attitudes', 0, 10),
    (assessment_id_param, 'Style', 'Leadership approach and culture', 0, 10),
    (assessment_id_param, 'Staff', 'Employees and their capabilities', 0, 10),
    (assessment_id_param, 'Skills', 'Competencies and capabilities', 0, 10);
END;
$$;

-- Secure materialized views
REVOKE ALL ON customer_summary_view FROM anon;
REVOKE ALL ON customer_summary_view FROM public;
REVOKE ALL ON project_summary_view FROM anon;
REVOKE ALL ON project_summary_view FROM public;

GRANT SELECT ON customer_summary_view TO authenticated;
GRANT SELECT ON project_summary_view TO authenticated;

ALTER MATERIALIZED VIEW customer_summary_view OWNER TO postgres;
ALTER MATERIALIZED VIEW project_summary_view OWNER TO postgres;
