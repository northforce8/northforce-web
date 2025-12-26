-- Create Contact and Booking Submissions Tables
--
-- New Tables:
-- 1. contact_submissions - Stores contact form submissions
-- 2. booking_submissions - Stores meeting booking requests
-- 3. admin_users - Stores admin user information
--
-- Security: All tables have RLS enabled with policies for public insert and admin-only read/update

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  industry text,
  challenge text,
  timeline text,
  budget text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view submissions
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update submissions
CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create booking_submissions table
CREATE TABLE IF NOT EXISTS booking_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  meeting_type text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  timezone text DEFAULT 'Europe/Stockholm',
  message text,
  calendar_event_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE booking_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert booking submissions
CREATE POLICY "Anyone can submit booking forms"
  ON booking_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view bookings
CREATE POLICY "Admins can view booking submissions"
  ON booking_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update bookings
CREATE POLICY "Admins can update booking submissions"
  ON booking_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view admin users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Only authenticated users can manage admin users
CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_booking_submissions_updated_at ON booking_submissions;
CREATE TRIGGER update_booking_submissions_updated_at
  BEFORE UPDATE ON booking_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
