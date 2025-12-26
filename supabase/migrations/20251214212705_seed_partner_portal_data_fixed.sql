/*
  # Seed Data for Partner Portal Testing
  
  ## Overview
  Creates sample data for testing the Partner Portal functionality.
  
  ## Contents
  - Sample Customers
  - Sample Projects
  - Helper functions for adding time entries and notes
*/

-- Sample Customers with Pricing Model
INSERT INTO customers (
  company_name,
  industry,
  country,
  contact_name,
  contact_email,
  status,
  credits_monthly_allocation,
  credits_balance,
  monthly_recurring_revenue,
  overdelivery_risk_level,
  website,
  org_number
)
VALUES
  (
    'TechCorp AB',
    'Technology',
    'Sweden',
    'Anna Svensson',
    'anna@techcorp.se',
    'active',
    40.0,
    35.5,
    250000,
    'low',
    'https://techcorp.se',
    '556123-4567'
  ),
  (
    'RetailPro Nordic',
    'Retail',
    'Sweden',
    'Erik Johansson',
    'erik@retailpro.se',
    'active',
    60.0,
    48.0,
    420000,
    'medium',
    'https://retailpro.se',
    '556234-5678'
  ),
  (
    'HealthPlus Solutions',
    'Healthcare',
    'Sweden',
    'Maria Andersson',
    'maria@healthplus.se',
    'active',
    80.0,
    12.5,
    580000,
    'high',
    'https://healthplus.se',
    '556345-6789'
  )
ON CONFLICT DO NOTHING;

-- Sample Projects
INSERT INTO projects (customer_id, name, description, workstream, status, priority)
SELECT 
  c.id,
  'Digital Transformation Initiative',
  'Complete digital transformation of sales and marketing processes',
  'Digital',
  'active',
  'high'
FROM customers c
WHERE c.company_name = 'TechCorp AB'
AND NOT EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.customer_id = c.id 
  AND p.name = 'Digital Transformation Initiative'
);

INSERT INTO projects (customer_id, name, description, workstream, status, priority)
SELECT 
  c.id,
  'E-commerce Platform',
  'Build and launch new e-commerce platform',
  'E-commerce',
  'active',
  'high'
FROM customers c
WHERE c.company_name = 'RetailPro Nordic'
AND NOT EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.customer_id = c.id 
  AND p.name = 'E-commerce Platform'
);

INSERT INTO projects (customer_id, name, description, workstream, status, priority)
SELECT 
  c.id,
  'Patient Portal Development',
  'Develop patient self-service portal',
  'Digital Health',
  'active',
  'medium'
FROM customers c
WHERE c.company_name = 'HealthPlus Solutions'
AND NOT EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.customer_id = c.id 
  AND p.name = 'Patient Portal Development'
);

-- Helper function to add sample time entries for a partner
CREATE OR REPLACE FUNCTION add_sample_time_entries(
  p_partner_id uuid,
  p_customer_id uuid,
  p_project_id uuid DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_work_type_id uuid;
BEGIN
  -- Get a work type
  SELECT id INTO v_work_type_id FROM work_types WHERE is_active = true LIMIT 1;
  
  IF v_work_type_id IS NULL THEN
    RAISE EXCEPTION 'No active work types found';
  END IF;
  
  -- Add sample time entries for the past 7 days
  INSERT INTO time_entries (partner_id, customer_id, project_id, work_type_id, date, hours, description, billable)
  VALUES
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '1 day', 4.5, 'Strategy workshop with client stakeholders', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '2 days', 6.0, 'Development of project roadmap and timeline', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '3 days', 3.5, 'Stakeholder interviews and requirements gathering', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '4 days', 5.0, 'Market analysis and competitive research', true),
    (p_partner_id, p_customer_id, p_project_id, v_work_type_id, CURRENT_DATE - INTERVAL '5 days', 7.0, 'Workshop facilitation and documentation', true);
END;
$$ LANGUAGE plpgsql;

-- Helper function to add sample notes for a partner
CREATE OR REPLACE FUNCTION add_sample_notes(
  p_partner_id uuid,
  p_customer_id uuid,
  p_project_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO notes (partner_id, customer_id, project_id, note_type, visibility, content)
  VALUES
    (p_partner_id, p_customer_id, p_project_id, 'Update', 'shared', 'Met with the client team today. Great progress on the discovery phase. They are excited about the proposed approach.'),
    (p_partner_id, p_customer_id, p_project_id, 'Decision', 'shared', 'Decision made to proceed with Option B for the technical architecture. Stakeholders aligned on timeline.'),
    (p_partner_id, p_customer_id, NULL, 'Next step', 'shared', 'Schedule follow-up meeting next week to review deliverables. Need to prepare presentation slides.');
END;
$$ LANGUAGE plpgsql;
