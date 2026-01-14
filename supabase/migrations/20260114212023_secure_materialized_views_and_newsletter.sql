/*
  # Secure Materialized Views and Newsletter Submissions
  
  1. Purpose
    - Revoke public access to materialized views
    - Keep newsletter submissions accessible to anonymous users
  
  2. Changes
    - Revoke SELECT on materialized views from anon and authenticated
    - Grant SELECT only to service_role for materialized views
    - Newsletter policy remains open for public submissions
  
  3. Security Impact
    - Prevents unauthorized access to aggregated data
    - Materialized views are for admin dashboard use only
*/

-- Revoke access from anon and authenticated roles on materialized views
REVOKE ALL ON public.customer_summary_view FROM anon;
REVOKE ALL ON public.customer_summary_view FROM authenticated;
REVOKE ALL ON public.project_summary_view FROM anon;
REVOKE ALL ON public.project_summary_view FROM authenticated;

-- Grant access only to service_role for internal use
GRANT SELECT ON public.customer_summary_view TO service_role;
GRANT SELECT ON public.project_summary_view TO service_role;

-- Note: Newsletter submissions policy allows anon users to insert
-- This is intentional for public newsletter signups
-- The policy "Anyone can insert newsletter submissions" remains as-is
