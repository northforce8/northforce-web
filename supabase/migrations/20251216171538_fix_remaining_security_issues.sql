/*
  # Fix Remaining Security Issues
  
  Fixes the old version of calculate_ai_priority_score function that still has a mutable search_path.
*/

-- Drop and recreate the old version of calculate_ai_priority_score with proper search_path
DROP FUNCTION IF EXISTS calculate_ai_priority_score(uuid, text, text) CASCADE;

CREATE FUNCTION calculate_ai_priority_score(
  p_customer_id uuid,
  p_recommendation_type text,
  p_severity text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  score integer := 0;
BEGIN
  -- Base score from severity
  CASE p_severity
    WHEN 'critical' THEN score := 90;
    WHEN 'high' THEN score := 70;
    WHEN 'medium' THEN score := 50;
    WHEN 'low' THEN score := 30;
    ELSE score := 40;
  END CASE;

  -- Adjust based on recommendation type
  CASE p_recommendation_type
    WHEN 'credits_low' THEN score := score + 10;
    WHEN 'margin_low' THEN score := score + 5;
    WHEN 'blocker_critical' THEN score := 100;
    ELSE score := score;
  END CASE;

  RETURN LEAST(score, 100);
END;
$$;