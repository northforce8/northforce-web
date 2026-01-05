/*
  # Create Value Tracking System
  
  1. New Tables
    - `strategic_initiatives`: Tracks initiatives with expected and realized value
    - `framework_links`: Generic linking table connecting frameworks to customers, projects, and initiatives
  
  2. Purpose
    - Enable value tracking for customer initiatives
    - Create cross-module relationships between strategic frameworks
    - Link frameworks to operational entities (customers, projects)
  
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Strategic Initiatives with Value Tracking
CREATE TABLE IF NOT EXISTS strategic_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'hypothesis' CHECK (status IN ('hypothesis', 'in_progress', 'realized', 'cancelled')),
  expected_value_sek numeric(12,2),
  realized_value_sek numeric(12,2),
  value_realization_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  owner text,
  target_date date,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategic_initiatives_customer ON strategic_initiatives(customer_id);
CREATE INDEX IF NOT EXISTS idx_strategic_initiatives_project ON strategic_initiatives(project_id);
CREATE INDEX IF NOT EXISTS idx_strategic_initiatives_status ON strategic_initiatives(status);

ALTER TABLE strategic_initiatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage strategic initiatives"
  ON strategic_initiatives FOR ALL
  TO authenticated
  USING (true);

-- Framework Links: Generic linking system
CREATE TABLE IF NOT EXISTS framework_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_type text NOT NULL,
  framework_id uuid NOT NULL,
  link_type text NOT NULL CHECK (link_type IN ('customer', 'project', 'initiative', 'decision')),
  linked_entity_id uuid NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_framework_links_framework ON framework_links(framework_type, framework_id);
CREATE INDEX IF NOT EXISTS idx_framework_links_entity ON framework_links(link_type, linked_entity_id);

ALTER TABLE framework_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage framework links"
  ON framework_links FOR ALL
  TO authenticated
  USING (true);

-- Update trigger for strategic_initiatives
CREATE OR REPLACE FUNCTION update_strategic_initiatives_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_strategic_initiatives_timestamp ON strategic_initiatives;
CREATE TRIGGER update_strategic_initiatives_timestamp
  BEFORE UPDATE ON strategic_initiatives
  FOR EACH ROW
  EXECUTE FUNCTION update_strategic_initiatives_timestamp();
