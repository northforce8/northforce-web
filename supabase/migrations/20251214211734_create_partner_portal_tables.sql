/*
  # Partner Portal Database Schema
  
  ## Overview
  Complete database schema for enterprise-grade Partner Portal enabling NorthForce 
  to manage external partners, customer relationships, projects, time tracking, 
  and collaboration notes.
  
  ## Tables Created
  
  ### 1. partners
  - Stores partner profiles linked to admin users
  - Fields: partner_name, partner_company, title, phone, notes, is_active
  - Links to admin_users via user_id
  
  ### 2. customers
  - Customer/client companies that partners work with
  - Fields: company details, contact info, status, owner
  - Tracks which admin owns the customer relationship
  
  ### 3. customer_assignments
  - Links partners to customers they can access
  - Defines partner's role on each customer account
  - Controls visibility via is_active and date ranges
  
  ### 4. projects
  - Projects/assignments under customers
  - Fields: name, description, workstream, status, dates, priority
  - One customer can have multiple projects
  
  ### 5. project_assignments
  - Links partners to specific projects
  - Defines partner's role on each project
  - Controls access via is_active and date ranges
  
  ### 6. work_types
  - Categorizes time entries (Strategy, Sales, SEO, etc.)
  - Reusable catalog maintained by admin
  
  ### 7. time_entries
  - Time tracking records
  - Links to customer, project, partner, work_type
  - Fields: date, hours, description, billable flag
  
  ### 8. notes
  - Internal collaboration notes
  - Links to customer and optionally project
  - Fields: note_type, visibility, content
  - Partners can only see notes they create or shared notes on their customers
  
  ### 9. activity_log
  - Audit trail for all important actions
  - Tracks who did what, when, on which entity
  
  ## Security
  - All tables have RLS enabled
  - Partners can only access data for customers/projects they're assigned to
  - Admins have full access to everything
  - No public access to any partner portal data
  
  ## Relationships
  Customer → Projects → Time Entries
  Customer → Customer Assignments → Partners
  Project → Project Assignments → Partners
  All entities → Activity Log
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update admin_users to support partner role if not already done
DO $$
BEGIN
  -- Check if we need to add name and is_active fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_active boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- 1. Partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  partner_name text NOT NULL,
  partner_company text,
  title text,
  phone text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  org_number text,
  website text,
  industry text,
  country text DEFAULT 'Sweden',
  contact_name text,
  contact_email text,
  contact_phone text,
  status text DEFAULT 'active',
  owner_admin_id uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Customer Assignments table
CREATE TABLE IF NOT EXISTS customer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  role_on_account text NOT NULL,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, partner_id)
);

-- 4. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  workstream text,
  status text DEFAULT 'active',
  start_date date,
  end_date date,
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Project Assignments table
CREATE TABLE IF NOT EXISTS project_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  role_on_project text NOT NULL,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, partner_id)
);

-- 6. Work Types table
CREATE TABLE IF NOT EXISTS work_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 7. Time Entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  work_type_id uuid REFERENCES work_types(id) NOT NULL,
  date date NOT NULL,
  hours numeric(5,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description text NOT NULL,
  billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  note_type text NOT NULL,
  visibility text DEFAULT 'shared' CHECK (visibility IN ('admin_only', 'shared')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Insert default work types
INSERT INTO work_types (name, description) VALUES
  ('Strategy', 'Strategic planning and consulting'),
  ('Sales', 'Sales activities and business development'),
  ('SEO', 'Search engine optimization'),
  ('Content', 'Content creation and marketing'),
  ('Automation', 'Process automation and optimization'),
  ('AI', 'AI implementation and consulting'),
  ('Development', 'Software development and technical work'),
  ('Analytics', 'Data analysis and reporting'),
  ('Leadership', 'Leadership and management'),
  ('Operations', 'Operations and project management')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active);

CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_admin_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

CREATE INDEX IF NOT EXISTS idx_customer_assignments_customer ON customer_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_assignments_partner ON customer_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_customer_assignments_active ON customer_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_project_assignments_project ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_partner ON project_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_active ON project_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_partner ON time_entries(partner_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_customer ON time_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON time_entries(project_id);

CREATE INDEX IF NOT EXISTS idx_notes_customer ON notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_partner ON notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_actor ON activity_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at);

-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Partners table
CREATE POLICY "Admins can view all partners"
  ON partners FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own profile"
  ON partners FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can insert partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Customers table
CREATE POLICY "Admins can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view assigned customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = auth.uid() 
      AND ca.customer_id = customers.id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Admins can manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Customer Assignments
CREATE POLICY "Admins can view all customer assignments"
  ON customer_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own assignments"
  ON customer_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = customer_assignments.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage customer assignments"
  ON customer_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Projects
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view projects on assigned customers"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = auth.uid() 
      AND ca.customer_id = projects.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Project Assignments
CREATE POLICY "Admins can view all project assignments"
  ON project_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their project assignments"
  ON project_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = project_assignments.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage project assignments"
  ON project_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Work Types
CREATE POLICY "Authenticated users can view work types"
  ON work_types FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage work types"
  ON work_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Time Entries
CREATE POLICY "Admins can view all time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create time entries on assigned customers"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = auth.uid() 
      AND p.id = time_entries.partner_id
      AND ca.customer_id = time_entries.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Partners can update their own recent time entries"
  ON time_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = auth.uid()
      AND time_entries.date >= CURRENT_DATE - INTERVAL '7 days'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = time_entries.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all time entries"
  ON time_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Notes
CREATE POLICY "Admins can view all notes"
  ON notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their own notes"
  ON notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view shared notes on assigned customers"
  ON notes FOR SELECT
  TO authenticated
  USING (
    notes.visibility = 'shared'
    AND EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = auth.uid() 
      AND ca.customer_id = notes.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Partners can create notes on assigned customers"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners p
      JOIN customer_assignments ca ON ca.partner_id = p.id
      WHERE p.user_id = auth.uid() 
      AND p.id = notes.partner_id
      AND ca.customer_id = notes.customer_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Partners can update their own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = notes.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all notes"
  ON notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for Activity Log
CREATE POLICY "Admins can view all activity logs"
  ON activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);
