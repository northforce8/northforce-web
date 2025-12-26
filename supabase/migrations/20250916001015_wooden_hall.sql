/*
  # DEPRECATED: contact_submissions and booking_submissions moved to 20251002161334_create_contact_and_booking_tables.sql

  This migration now only contains newsletter_submissions to avoid duplicate table definitions.

  1. New Tables
    - `newsletter_submissions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on newsletter_submissions
    - Add policies for public insert and authenticated admin access
*/

-- Newsletter submissions table
CREATE TABLE IF NOT EXISTS newsletter_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read newsletter submissions"
  ON newsletter_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert newsletter submissions"
  ON newsletter_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_submissions_created_at ON newsletter_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_submissions_email ON newsletter_submissions(email);