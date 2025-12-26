/*
  # Fix Work Type Audit Trigger
  
  Fixes the log_work_type_changes function to track correct fields:
  - Removes reference to non-existent 'rate' field
  - Adds tracking for credits_per_hour and internal_cost_factor
*/

CREATE OR REPLACE FUNCTION public.log_work_type_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log name change
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'name',
        OLD.name,
        NEW.name,
        auth.uid(),
        NOW()
      );
    END IF;

    -- Log credits_per_hour change
    IF NEW.credits_per_hour IS DISTINCT FROM OLD.credits_per_hour THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'credits_per_hour',
        COALESCE(OLD.credits_per_hour::text, 'NULL'),
        COALESCE(NEW.credits_per_hour::text, 'NULL'),
        auth.uid(),
        NOW()
      );
    END IF;

    -- Log internal_cost_factor change
    IF NEW.internal_cost_factor IS DISTINCT FROM OLD.internal_cost_factor THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'internal_cost_factor',
        COALESCE(OLD.internal_cost_factor::text, 'NULL'),
        COALESCE(NEW.internal_cost_factor::text, 'NULL'),
        auth.uid(),
        NOW()
      );
    END IF;

    -- Log is_active change
    IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      INSERT INTO public.settings_audit_log (
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        changed_at
      ) VALUES (
        'work_type',
        NEW.id,
        'is_active',
        OLD.is_active::text,
        NEW.is_active::text,
        auth.uid(),
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;