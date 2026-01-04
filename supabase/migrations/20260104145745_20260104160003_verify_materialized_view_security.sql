/*
  # Verify and Secure Materialized Views - Final
  
  1. Summary
    - Remove ALL public access to materialized views
    - Ensure only authenticated users can query
    - Add explicit security comments
  
  2. Security Impact
    - Prevents data exposure to anonymous users
    - Enforces authentication requirement
*/

-- Complete lockdown of customer_summary_view
REVOKE ALL ON customer_summary_view FROM anon, public, authenticated;
GRANT SELECT ON customer_summary_view TO authenticated;
ALTER MATERIALIZED VIEW customer_summary_view OWNER TO postgres;

-- Complete lockdown of project_summary_view
REVOKE ALL ON project_summary_view FROM anon, public, authenticated;
GRANT SELECT ON project_summary_view TO authenticated;
ALTER MATERIALIZED VIEW project_summary_view OWNER TO postgres;

-- Add security documentation
COMMENT ON MATERIALIZED VIEW customer_summary_view IS 
'Customer summary statistics - AUTHENTICATED USERS ONLY - No anonymous access';

COMMENT ON MATERIALIZED VIEW project_summary_view IS 
'Project summary statistics - AUTHENTICATED USERS ONLY - No anonymous access';

-- Verify no public schema grants exist
DO $$
BEGIN
  -- Ensure the views are not in the public API by default
  EXECUTE 'REVOKE ALL ON customer_summary_view FROM anon';
  EXECUTE 'REVOKE ALL ON project_summary_view FROM anon';
  EXECUTE 'REVOKE ALL ON customer_summary_view FROM public';
  EXECUTE 'REVOKE ALL ON project_summary_view FROM public';
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if already revoked
    NULL;
END $$;
