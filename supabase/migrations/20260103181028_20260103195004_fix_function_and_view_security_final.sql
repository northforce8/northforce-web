/*
  # Fix Function and View Security - Final
  
  1. Summary
    - Re-fix initialize_mckinsey_7s_elements function with explicit search_path
    - Restrict materialized views from anonymous access
    - Ensure proper security isolation
  
  2. Security Impact
    - Prevents schema injection attacks
    - No data exposure to unauthenticated users
*/

-- Drop and recreate function with explicit search_path
DROP FUNCTION IF EXISTS public.initialize_mckinsey_7s_elements() CASCADE;

CREATE OR REPLACE FUNCTION public.initialize_mckinsey_7s_elements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.mckinsey_7s_elements (assessment_id, element_name, current_score, target_score)
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
DROP TRIGGER IF EXISTS initialize_mckinsey_7s_elements_trigger ON public.mckinsey_7s_assessments;

CREATE TRIGGER initialize_mckinsey_7s_elements_trigger
  AFTER INSERT ON public.mckinsey_7s_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_mckinsey_7s_elements();

-- Restrict materialized view access - use DO block for error handling
DO $$
BEGIN
  -- Revoke all from anon on customer_summary_view
  BEGIN
    EXECUTE 'REVOKE ALL ON public.customer_summary_view FROM anon';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
  END;

  -- Revoke all from anon on project_summary_view
  BEGIN
    EXECUTE 'REVOKE ALL ON public.project_summary_view FROM anon';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
  END;

  -- Grant only to authenticated on customer_summary_view
  BEGIN
    EXECUTE 'GRANT SELECT ON public.customer_summary_view TO authenticated';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
  END;

  -- Grant only to authenticated on project_summary_view
  BEGIN
    EXECUTE 'GRANT SELECT ON public.project_summary_view TO authenticated';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;

-- Add security comment
COMMENT ON FUNCTION public.initialize_mckinsey_7s_elements() IS 'Secured function with explicit search_path SET TO public to prevent schema injection. Automatically initializes 7S framework elements when a new assessment is created.';
