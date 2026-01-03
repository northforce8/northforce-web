/*
  # Fix Functions with CASCADE - Corrected
  
  1. Summary
    - Drop functions and dependent triggers with CASCADE
    - Recreate functions with proper search paths
    - Recreate all dependent triggers
*/

-- Drop functions with CASCADE to remove dependent triggers
DROP FUNCTION IF EXISTS calculate_mckinsey_7s_alignment_score(uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_update_mckinsey_7s_scores() CASCADE;
DROP FUNCTION IF EXISTS initialize_mckinsey_7s_elements() CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_mckinsey_7s_elements() CASCADE;
DROP FUNCTION IF EXISTS update_mckinsey_7s_updated_at() CASCADE;
DROP FUNCTION IF EXISTS calculate_lean_experiment_progress(uuid) CASCADE;
DROP FUNCTION IF EXISTS update_lean_updated_at() CASCADE;
DROP FUNCTION IF EXISTS calculate_dt_project_progress(uuid) CASCADE;
DROP FUNCTION IF EXISTS update_dt_updated_at() CASCADE;

-- Recreate functions with proper search paths
CREATE FUNCTION calculate_mckinsey_7s_alignment_score(assessment_id_param uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_score numeric;
BEGIN
  SELECT AVG(current_score)
  INTO total_score
  FROM mckinsey_7s_elements
  WHERE assessment_id = assessment_id_param;
  
  RETURN COALESCE(total_score, 0);
END;
$$;

CREATE FUNCTION trigger_update_mckinsey_7s_scores()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE mckinsey_7s_assessments
  SET overall_score = calculate_mckinsey_7s_alignment_score(NEW.assessment_id),
      updated_at = now()
  WHERE id = NEW.assessment_id;
  
  RETURN NEW;
END;
$$;

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

CREATE FUNCTION update_mckinsey_7s_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION calculate_lean_experiment_progress(experiment_id_param uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  validated_count integer;
  total_count integer;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE validated = true),
    COUNT(*)
  INTO validated_count, total_count
  FROM lean_hypotheses
  WHERE experiment_id = experiment_id_param;
  
  IF total_count = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (validated_count::numeric / total_count::numeric) * 100;
END;
$$;

CREATE FUNCTION update_lean_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION calculate_dt_project_progress(project_id_param uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  completed_phases integer;
  total_phases integer;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*)
  INTO completed_phases, total_phases
  FROM dt_phases
  WHERE project_id = project_id_param;
  
  IF total_phases = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (completed_phases::numeric / total_phases::numeric) * 100;
END;
$$;

CREATE FUNCTION update_dt_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_mckinsey_7s_scores
  AFTER INSERT OR UPDATE ON mckinsey_7s_elements
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_mckinsey_7s_scores();

CREATE TRIGGER initialize_mckinsey_7s_elements_trigger
  AFTER INSERT ON mckinsey_7s_assessments
  FOR EACH ROW
  EXECUTE FUNCTION initialize_mckinsey_7s_elements();

CREATE TRIGGER update_mckinsey_assessments_updated_at
  BEFORE UPDATE ON mckinsey_7s_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_mckinsey_7s_updated_at();

CREATE TRIGGER update_mckinsey_elements_updated_at
  BEFORE UPDATE ON mckinsey_7s_elements
  FOR EACH ROW
  EXECUTE FUNCTION update_mckinsey_7s_updated_at();

CREATE TRIGGER update_lean_experiments_updated_at
  BEFORE UPDATE ON lean_experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_lean_updated_at();

CREATE TRIGGER update_dt_projects_updated_at
  BEFORE UPDATE ON design_thinking_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_dt_updated_at();
