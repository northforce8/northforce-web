/*
  # Add Contract Versioning System

  1. New Tables
    - `contract_version_history`
      - Tracks every version of a contract
      - Stores snapshot of contract data at version creation
      - Links to parent version and original contract

  2. Functions
    - `create_contract_version()` - Creates a new version snapshot
    - `trigger_create_contract_version()` - Auto-creates versions on significant changes

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated admin access
*/

-- Create contract version history table
CREATE TABLE IF NOT EXISTS contract_version_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  parent_version_id uuid REFERENCES contract_version_history(id),
  
  -- Snapshot of contract data at this version
  contract_number text NOT NULL,
  title text NOT NULL,
  contract_type text NOT NULL,
  status text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  content text NOT NULL,
  contract_value decimal(12,2),
  currency_code text DEFAULT 'SEK',
  
  -- Version metadata
  change_reason text,
  change_summary text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  
  UNIQUE(contract_id, version_number)
);

-- Indexes for quick version lookups
CREATE INDEX IF NOT EXISTS idx_contract_version_history_contract_id 
  ON contract_version_history(contract_id);

CREATE INDEX IF NOT EXISTS idx_contract_version_history_parent 
  ON contract_version_history(parent_version_id);

CREATE INDEX IF NOT EXISTS idx_contract_version_history_created_at 
  ON contract_version_history(created_at DESC);

-- Enable RLS
ALTER TABLE contract_version_history ENABLE ROW LEVEL SECURITY;

-- Policies for contract_version_history
CREATE POLICY "Admins can view contract version history"
  ON contract_version_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can create contract versions"
  ON contract_version_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Function to create a new contract version
CREATE OR REPLACE FUNCTION create_contract_version(
  p_contract_id uuid,
  p_change_reason text DEFAULT NULL,
  p_change_summary text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_version_number integer;
  v_contract_data record;
  v_version_id uuid;
  v_parent_version_id uuid;
BEGIN
  -- Get current contract data
  SELECT * INTO v_contract_data
  FROM contracts
  WHERE id = p_contract_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;
  
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_new_version_number
  FROM contract_version_history
  WHERE contract_id = p_contract_id;
  
  -- Get parent version ID (most recent version)
  SELECT id INTO v_parent_version_id
  FROM contract_version_history
  WHERE contract_id = p_contract_id
  ORDER BY version_number DESC
  LIMIT 1;
  
  -- Create version history entry
  INSERT INTO contract_version_history (
    contract_id,
    version_number,
    parent_version_id,
    contract_number,
    title,
    contract_type,
    status,
    start_date,
    end_date,
    content,
    contract_value,
    currency_code,
    change_reason,
    change_summary,
    created_by
  )
  VALUES (
    p_contract_id,
    v_new_version_number,
    v_parent_version_id,
    v_contract_data.contract_number,
    v_contract_data.title,
    v_contract_data.contract_type,
    v_contract_data.status,
    v_contract_data.start_date,
    v_contract_data.end_date,
    v_contract_data.content,
    v_contract_data.contract_value,
    COALESCE(v_contract_data.currency_code, 'SEK'),
    p_change_reason,
    p_change_summary,
    auth.uid()
  )
  RETURNING id INTO v_version_id;
  
  -- Update contract version number
  UPDATE contracts
  SET version = v_new_version_number,
      updated_at = now()
  WHERE id = p_contract_id;
  
  RETURN v_version_id;
END;
$$;

-- Trigger to automatically create version history when contract is updated
CREATE OR REPLACE FUNCTION trigger_create_contract_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create version if significant fields changed
  IF (OLD.title IS DISTINCT FROM NEW.title OR
      OLD.content IS DISTINCT FROM NEW.content OR
      OLD.start_date IS DISTINCT FROM NEW.start_date OR
      OLD.end_date IS DISTINCT FROM NEW.end_date OR
      OLD.contract_value IS DISTINCT FROM NEW.contract_value OR
      OLD.status IS DISTINCT FROM NEW.status) THEN
    
    PERFORM create_contract_version(
      NEW.id,
      'Automatic version on update',
      'Contract updated'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'contract_version_on_update'
  ) THEN
    CREATE TRIGGER contract_version_on_update
      AFTER UPDATE ON contracts
      FOR EACH ROW
      EXECUTE FUNCTION trigger_create_contract_version();
  END IF;
END $$;

-- Create initial versions for existing contracts
INSERT INTO contract_version_history (
  contract_id,
  version_number,
  parent_version_id,
  contract_number,
  title,
  contract_type,
  status,
  start_date,
  end_date,
  content,
  contract_value,
  currency_code,
  change_reason,
  change_summary,
  created_by,
  created_at
)
SELECT
  id,
  1,
  NULL,
  contract_number,
  title,
  contract_type,
  status,
  start_date,
  end_date,
  COALESCE(content, ''),
  contract_value,
  COALESCE(currency_code, 'SEK'),
  'Initial version',
  'Contract created',
  created_by,
  created_at
FROM contracts
WHERE NOT EXISTS (
  SELECT 1 FROM contract_version_history
  WHERE contract_version_history.contract_id = contracts.id
);

COMMENT ON TABLE contract_version_history IS 'Tracks all versions of contracts with full snapshots';
COMMENT ON FUNCTION create_contract_version IS 'Creates a new version snapshot of a contract';
