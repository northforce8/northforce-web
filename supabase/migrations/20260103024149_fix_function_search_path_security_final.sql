/*
  # Fix Function Security - Immutable Search Paths (Final)

  ## Security Improvements
  - Sets immutable search paths for all security-critical functions using ALTER FUNCTION
  - Prevents search_path injection attacks
  - Ensures functions always reference correct schemas
  - Does not drop functions to avoid breaking triggers

  ## Functions Updated (12 functions)
  - check_margin_health
  - check_collaboration_blockers
  - check_efficiency_ratio
  - update_partners_updated_at
  - update_projects_updated_at
  - update_time_entries_updated_at
  - update_notes_updated_at
  - update_customer_assignments_updated_at
  - update_project_assignments_updated_at
  - log_activity
  - refresh_all_recommendations

  ## Impact
  - No downtime or functionality changes
  - Immediate security improvement
  - Functions now immune to search_path injection
*/

-- Set secure search paths on existing functions (no parameters)
ALTER FUNCTION public.check_margin_health() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_collaboration_blockers() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_efficiency_ratio() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_partners_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_projects_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_time_entries_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_notes_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_customer_assignments_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_project_assignments_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.log_activity() SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_all_recommendations() SET search_path = public, pg_temp;