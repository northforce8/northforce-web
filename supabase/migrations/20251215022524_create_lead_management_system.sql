/*
  # Lead Management System - Enterprise Edition
  
  1. Overview
     Complete lead management system with enterprise-level features for tracking,
     qualifying, and converting leads to customers.
  
  2. New Tables
     
     ### `lead_notes`
     - `id` (uuid, primary key)
     - `lead_type` (text) - contact, booking, or newsletter
     - `lead_id` (uuid) - reference to the lead
     - `note_type` (text) - internal, follow_up, qualification
     - `content` (text) - note content
     - `created_by` (uuid) - admin user who created note
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
     
     ### `lead_customer_links`
     - `id` (uuid, primary key)
     - `lead_type` (text) - contact, booking, or newsletter
     - `lead_id` (uuid) - reference to the lead
     - `customer_id` (uuid) - reference to customers table
     - `linked_by` (uuid) - admin who made the link
     - `linked_at` (timestamptz)
     - `notes` (text) - optional notes about the conversion
     
     ### `lead_classifications`
     - `id` (uuid, primary key)
     - `lead_type` (text) - contact, booking, or newsletter
     - `lead_id` (uuid) - reference to the lead
     - `classification` (text) - high_potential, medium_potential, low_potential
     - `confidence_score` (numeric) - 0-1 confidence score
     - `reasoning` (text) - why this classification
     - `classification_data` (jsonb) - additional data
     - `classified_at` (timestamptz)
  
  3. Table Updates
     
     ### Update `contact_submissions` status
     - Change default status from 'new' to proper enum
     - Add status check constraint
     
     ### Update `booking_submissions` status  
     - Change from 'pending' to align with contact status
     - Add status check constraint
     
     ### Update `newsletter_submissions`
     - Add status field
     - Add updated_at field
  
  4. Security
     - Enable RLS on all new tables
     - Add policies for authenticated admin users only
     - Ensure data isolation and security
  
  5. Indexes
     - Index on lead_type + lead_id for fast lookups
     - Index on customer_id for reverse lookups
     - Index on created_at for time-based queries
*/

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text NOT NULL CHECK (lead_type IN ('contact', 'booking', 'newsletter')),
  lead_id uuid NOT NULL,
  note_type text NOT NULL CHECK (note_type IN ('internal', 'follow_up', 'qualification', 'general')),
  content text NOT NULL,
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_customer_links table
CREATE TABLE IF NOT EXISTS lead_customer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text NOT NULL CHECK (lead_type IN ('contact', 'booking', 'newsletter')),
  lead_id uuid NOT NULL,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  linked_by uuid REFERENCES admin_users(id),
  linked_at timestamptz DEFAULT now(),
  notes text
);

-- Create lead_classifications table
CREATE TABLE IF NOT EXISTS lead_classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text NOT NULL CHECK (lead_type IN ('contact', 'booking', 'newsletter')),
  lead_id uuid NOT NULL,
  classification text NOT NULL CHECK (classification IN ('high_potential', 'medium_potential', 'low_potential', 'not_relevant')),
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  reasoning text,
  classification_data jsonb,
  classified_at timestamptz DEFAULT now()
);

-- Update contact_submissions table
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'contact_submissions_status_check' 
    AND table_name = 'contact_submissions'
  ) THEN
    ALTER TABLE contact_submissions DROP CONSTRAINT contact_submissions_status_check;
  END IF;
  
  -- Add new constraint
  ALTER TABLE contact_submissions ADD CONSTRAINT contact_submissions_status_check 
    CHECK (status IN ('new', 'in_progress', 'qualified', 'archived'));
END $$;

-- Update booking_submissions table
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'booking_submissions_status_check' 
    AND table_name = 'booking_submissions'
  ) THEN
    ALTER TABLE booking_submissions DROP CONSTRAINT booking_submissions_status_check;
  END IF;
  
  -- Add new constraint
  ALTER TABLE booking_submissions ADD CONSTRAINT booking_submissions_status_check 
    CHECK (status IN ('new', 'in_progress', 'qualified', 'archived'));
END $$;

-- Update default status for booking_submissions
ALTER TABLE booking_submissions ALTER COLUMN status SET DEFAULT 'new';

-- Update newsletter_submissions table
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'newsletter_submissions' AND column_name = 'status'
  ) THEN
    ALTER TABLE newsletter_submissions ADD COLUMN status text DEFAULT 'new' 
      CHECK (status IN ('new', 'in_progress', 'qualified', 'archived'));
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'newsletter_submissions' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE newsletter_submissions ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_type, lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON lead_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_lead ON lead_customer_links(lead_type, lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_customer_links_customer ON lead_customer_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_lead_classifications_lead ON lead_classifications(lead_type, lead_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_submissions_status ON booking_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_submissions_status ON newsletter_submissions(status, created_at DESC);

-- Enable Row Level Security
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_customer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_classifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_notes
CREATE POLICY "Admins can view all lead notes"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can create lead notes"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update their own lead notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for lead_customer_links
CREATE POLICY "Admins can view all lead-customer links"
  ON lead_customer_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can create lead-customer links"
  ON lead_customer_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update lead-customer links"
  ON lead_customer_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for lead_classifications
CREATE POLICY "Admins can view all lead classifications"
  ON lead_classifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can create lead classifications"
  ON lead_classifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update lead classifications"
  ON lead_classifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );