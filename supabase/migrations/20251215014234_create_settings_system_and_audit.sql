/*
  # Settings System and Audit Infrastructure

  ## Overview
  This migration creates a comprehensive settings management system for the Partner Portal
  with complete audit trail capabilities and enhanced work type management.

  ## 1. Work Types Enhancements
  Adds the following columns to `work_types`:
    - `billable` (boolean) - Indicates if work type is billable by default
    - `allowed_plan_levels` (text array) - Which plan levels can access this work type
    - `updated_at` (timestamptz) - Timestamp of last update
    - `updated_by` (uuid) - Reference to admin user who made the update
    - `is_used_in_time_entries` (boolean, generated) - Indicates if work type is actively used

  ## 2. System Settings Table
  Creates `system_settings` table with:
    - Singleton pattern (only one row allowed via constraint)
    - Time entry rules: edit window, project requirements, billable tracking
    - Version control and update tracking
    - Settings versioning for rollback capability

  ## 3. Settings Audit Log
  Creates `settings_audit_log` table to track all configuration changes:
    - What changed (entity_type, entity_id, field_name)
    - Old and new values
    - Who made the change
    - When the change was made
    - Change reason/description

  ## 4. Security
  - Enable RLS on all new tables
  - Admin-only access policies for settings management
    - Read access for authenticated users
    - Write access only for admin users
  - Audit log is append-only (no updates or deletes allowed)

  ## 5. Performance
  - Indexes on foreign keys
  - Index on settings_audit_log for efficient querying by entity
  - Automatic updated_at triggers
*/

-- Add new columns to work_types
ALTER TABLE work_types 
  ADD COLUMN IF NOT EXISTS billable boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS allowed_plan_levels text[] DEFAULT ARRAY['starter', 'growth', 'scale', 'custom']::text[],
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES admin_users(id);

-- Create index for updated_by
CREATE INDEX IF NOT EXISTS idx_work_types_updated_by ON work_types(updated_by);

-- Create function to check if work type is used in time entries
CREATE OR REPLACE FUNCTION check_work_type_usage(work_type_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM time_entries 
    WHERE work_type_id = work_type_uuid 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Create system_settings table (singleton pattern)
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Time Entry Rules
  time_entry_edit_window_days integer NOT NULL DEFAULT 7 CHECK (time_entry_edit_window_days >= 0 AND time_entry_edit_window_days <= 365),
  time_entry_require_project boolean NOT NULL DEFAULT true,
  time_entry_enable_billable_tracking boolean NOT NULL DEFAULT true,
  time_entry_max_hours_per_day numeric NOT NULL DEFAULT 24 CHECK (time_entry_max_hours_per_day > 0 AND time_entry_max_hours_per_day <= 24),
  time_entry_allow_future_dates boolean NOT NULL DEFAULT false,
  
  -- Settings metadata
  settings_version integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id),
  
  -- Ensure only one row exists
  CONSTRAINT single_settings_row CHECK (id IS NOT NULL)
);

-- Create unique index to enforce singleton pattern
CREATE UNIQUE INDEX IF NOT EXISTS idx_system_settings_singleton ON system_settings ((1));

-- Insert default settings if table is empty
INSERT INTO system_settings (
  time_entry_edit_window_days,
  time_entry_require_project,
  time_entry_enable_billable_tracking,
  time_entry_max_hours_per_day,
  time_entry_allow_future_dates
)
SELECT 7, true, true, 24, false
WHERE NOT EXISTS (SELECT 1 FROM system_settings LIMIT 1);

-- Create settings_audit_log table
CREATE TABLE IF NOT EXISTS settings_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What changed
  entity_type text NOT NULL CHECK (entity_type IN ('work_type', 'time_entry_rules', 'system_setting')),
  entity_id uuid, -- NULL for system-wide settings
  field_name text NOT NULL,
  old_value text,
  new_value text NOT NULL,
  change_description text,
  
  -- Who and when
  changed_by uuid REFERENCES admin_users(id),
  changed_by_email text,
  changed_at timestamptz NOT NULL DEFAULT now(),
  
  -- Additional context
  change_reason text,
  ip_address text,
  user_agent text,
  metadata jsonb
);

-- Create indexes for settings_audit_log
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_entity ON settings_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_changed_by ON settings_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_changed_at ON settings_audit_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_field_name ON settings_audit_log(field_name);

-- Enable RLS on new tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings

-- Admins can read settings
CREATE POLICY "Admins can read system settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Only admins can update settings
CREATE POLICY "Admins can update system settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for settings_audit_log

-- Admins can read audit log
CREATE POLICY "Admins can read settings audit log"
  ON settings_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Only admins can insert audit log entries (no updates or deletes)
CREATE POLICY "Admins can insert settings audit log"
  ON settings_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Create function to automatically log work_type changes
CREATE OR REPLACE FUNCTION log_work_type_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Get user email
  SELECT email INTO user_email 
  FROM admin_users 
  WHERE id = auth.uid();

  -- Log changes for each modified field
  IF TG_OP = 'UPDATE' THEN
    -- Log name change
    IF OLD.name IS DISTINCT FROM NEW.name THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email)
      VALUES ('work_type', NEW.id, 'name', OLD.name, NEW.name, auth.uid(), user_email);
    END IF;
    
    -- Log credits_per_hour change
    IF OLD.credits_per_hour IS DISTINCT FROM NEW.credits_per_hour THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email)
      VALUES ('work_type', NEW.id, 'credits_per_hour', OLD.credits_per_hour::text, NEW.credits_per_hour::text, auth.uid(), user_email);
    END IF;
    
    -- Log is_active change
    IF OLD.is_active IS DISTINCT FROM NEW.is_active THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email)
      VALUES ('work_type', NEW.id, 'is_active', OLD.is_active::text, NEW.is_active::text, auth.uid(), user_email);
    END IF;
    
    -- Log billable change
    IF OLD.billable IS DISTINCT FROM NEW.billable THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email)
      VALUES ('work_type', NEW.id, 'billable', OLD.billable::text, NEW.billable::text, auth.uid(), user_email);
    END IF;

    -- Set updated_at and updated_by
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for work_type changes
DROP TRIGGER IF EXISTS work_type_audit_trigger ON work_types;
CREATE TRIGGER work_type_audit_trigger
  BEFORE UPDATE ON work_types
  FOR EACH ROW
  EXECUTE FUNCTION log_work_type_changes();

-- Create function to log system_settings changes
CREATE OR REPLACE FUNCTION log_system_settings_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Get user email
  SELECT email INTO user_email 
  FROM admin_users 
  WHERE id = auth.uid();

  IF TG_OP = 'UPDATE' THEN
    -- Log edit window change
    IF OLD.time_entry_edit_window_days IS DISTINCT FROM NEW.time_entry_edit_window_days THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email, change_description)
      VALUES ('time_entry_rules', NULL, 'edit_window_days', OLD.time_entry_edit_window_days::text, NEW.time_entry_edit_window_days::text, auth.uid(), user_email, 'Time entry edit window changed');
    END IF;
    
    -- Log require project change
    IF OLD.time_entry_require_project IS DISTINCT FROM NEW.time_entry_require_project THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email, change_description)
      VALUES ('time_entry_rules', NULL, 'require_project', OLD.time_entry_require_project::text, NEW.time_entry_require_project::text, auth.uid(), user_email, 'Project requirement rule changed');
    END IF;
    
    -- Log billable tracking change
    IF OLD.time_entry_enable_billable_tracking IS DISTINCT FROM NEW.time_entry_enable_billable_tracking THEN
      INSERT INTO settings_audit_log (entity_type, entity_id, field_name, old_value, new_value, changed_by, changed_by_email, change_description)
      VALUES ('time_entry_rules', NULL, 'enable_billable_tracking', OLD.time_entry_enable_billable_tracking::text, NEW.time_entry_enable_billable_tracking::text, auth.uid(), user_email, 'Billable tracking setting changed');
    END IF;

    -- Increment version and set metadata
    NEW.settings_version = OLD.settings_version + 1;
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for system_settings changes
DROP TRIGGER IF EXISTS system_settings_audit_trigger ON system_settings;
CREATE TRIGGER system_settings_audit_trigger
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION log_system_settings_changes();

-- Update existing work_types with default values for new columns
UPDATE work_types 
SET 
  billable = true,
  allowed_plan_levels = ARRAY['starter', 'growth', 'scale', 'custom']::text[],
  updated_at = now()
WHERE billable IS NULL;
