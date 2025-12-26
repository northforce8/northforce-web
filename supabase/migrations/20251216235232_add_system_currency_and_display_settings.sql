/*
  # Add Currency and Display Settings to System

  1. Changes to `system_settings` table
    - Add `default_currency_code` (text, default 'SEK')
    - Add `allowed_currencies` (text array, default ['SEK', 'EUR', 'USD'])
    - Add `date_format` (text, default 'YYYY-MM-DD')
    - Add `time_zone` (text, default 'Europe/Stockholm')
    - Add `company_name` (text)
    - Add `company_org_number` (text)
    - Add `company_email` (text)
    - Add `company_phone` (text)
    
  2. Security
    - Maintains existing RLS on system_settings
    - No changes to policies needed
    
  3. Notes
    - Default currency is SEK (Swedish Krona)
    - Supports multi-currency with allowed list
    - Company info for invoices and contracts
*/

-- Add new columns to system_settings
DO $$
BEGIN
  -- Currency settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'default_currency_code'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN default_currency_code text DEFAULT 'SEK';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'allowed_currencies'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN allowed_currencies text[] DEFAULT ARRAY['SEK', 'EUR', 'USD', 'GBP', 'NOK', 'DKK'];
  END IF;

  -- Display settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'date_format'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN date_format text DEFAULT 'YYYY-MM-DD';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'time_zone'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN time_zone text DEFAULT 'Europe/Stockholm';
  END IF;

  -- Company information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN company_name text DEFAULT 'Northforce';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'company_org_number'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN company_org_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'company_email'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN company_email text DEFAULT 'admin@northforce.se';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' AND column_name = 'company_phone'
  ) THEN
    ALTER TABLE system_settings ADD COLUMN company_phone text;
  END IF;
END $$;

-- Insert default settings if none exist
INSERT INTO system_settings (
  id,
  time_entry_edit_window_days,
  time_entry_require_project,
  time_entry_enable_billable_tracking,
  time_entry_max_hours_per_day,
  time_entry_allow_future_dates,
  default_currency_code,
  allowed_currencies,
  date_format,
  time_zone,
  company_name,
  company_email,
  settings_version
)
SELECT
  gen_random_uuid(),
  30,
  true,
  true,
  24,
  false,
  'SEK',
  ARRAY['SEK', 'EUR', 'USD', 'GBP', 'NOK', 'DKK'],
  'YYYY-MM-DD',
  'Europe/Stockholm',
  'Northforce',
  'admin@northforce.se',
  1
WHERE NOT EXISTS (SELECT 1 FROM system_settings);

-- Create index for currency lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_currency 
ON system_settings(default_currency_code);
