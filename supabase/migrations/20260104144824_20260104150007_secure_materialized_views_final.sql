/*
  # Secure Materialized Views - Final Fix
  
  1. Summary
    - Ensure materialized views are NOT accessible to anonymous users
    - Only authenticated users should have access
  
  2. Security Impact
    - Prevents data leakage to public
    - Enforces authentication requirement
*/

-- Revoke all access from anon and public
REVOKE ALL ON customer_summary_view FROM anon;
REVOKE ALL ON customer_summary_view FROM public;
REVOKE ALL ON project_summary_view FROM anon;
REVOKE ALL ON project_summary_view FROM public;

-- Grant only to authenticated users
GRANT SELECT ON customer_summary_view TO authenticated;
GRANT SELECT ON project_summary_view TO authenticated;

-- Ensure ownership is correct
ALTER MATERIALIZED VIEW customer_summary_view OWNER TO postgres;
ALTER MATERIALIZED VIEW project_summary_view OWNER TO postgres;

-- Add comment for documentation
COMMENT ON MATERIALIZED VIEW customer_summary_view IS 'Customer summary statistics - authenticated users only';
COMMENT ON MATERIALIZED VIEW project_summary_view IS 'Project summary statistics - authenticated users only';
