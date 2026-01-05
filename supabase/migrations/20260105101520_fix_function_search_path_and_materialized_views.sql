/*
  # Fix Function Search Path and Secure Materialized Views
  
  1. Changes
    - Set immutable search_path for functions
    - Revoke public access from materialized views
  
  2. Security
    - Prevents search_path manipulation attacks
    - Restricts materialized view access to authorized users only
*/

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.activity_log (
    entity_type,
    entity_id,
    action_type,
    actor_type,
    actor_user_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    TG_ARGV[0],
    NEW.id,
    TG_OP,
    'user',
    auth.uid(),
    jsonb_build_object(
      'old', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      'new', to_jsonb(NEW)
    ),
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_strategic_initiatives_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Secure materialized views - revoke public access
REVOKE ALL ON public.customer_summary_view FROM anon, authenticated;
REVOKE ALL ON public.project_summary_view FROM anon, authenticated;

-- Grant restricted access to materialized views
GRANT SELECT ON public.customer_summary_view TO authenticated;
GRANT SELECT ON public.project_summary_view TO authenticated;

-- Add RLS policies for materialized views (via security definer functions)
CREATE OR REPLACE FUNCTION public.get_customer_summary(p_customer_id uuid DEFAULT NULL)
RETURNS TABLE (
  customer_id uuid,
  customer_name text,
  total_projects bigint,
  total_hours numeric,
  total_invoiced numeric,
  currency_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check user has permission
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND (
      role IN ('admin', 'partner')
      OR (role = 'customer' AND customer_id = COALESCE(p_customer_id, user_profiles.customer_id))
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    csv.customer_id,
    csv.customer_name,
    csv.total_projects,
    csv.total_hours,
    csv.total_invoiced,
    csv.currency_code
  FROM public.customer_summary_view csv
  WHERE csv.customer_id = COALESCE(p_customer_id, csv.customer_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_project_summary(p_project_id uuid DEFAULT NULL)
RETURNS TABLE (
  project_id uuid,
  project_name text,
  customer_name text,
  total_hours numeric,
  total_cost numeric,
  currency_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check user has permission
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'partner')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    psv.project_id,
    psv.project_name,
    psv.customer_name,
    psv.total_hours,
    psv.total_cost,
    psv.currency_code
  FROM public.project_summary_view psv
  WHERE psv.project_id = COALESCE(p_project_id, psv.project_id);
END;
$$;
