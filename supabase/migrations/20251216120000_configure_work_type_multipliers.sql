/*
  # Configure Work Type Multipliers for Credits Engine
  
  Sets up proper credit multipliers and cost factors for all work types
  according to NorthForce business model:
  
  1 credit = 1 normalized senior consultant hour
  
  Multipliers:
  - Strategy/Leadership: 1.5x (high-value strategic work)
  - AI/Architecture: 1.3-1.5x (specialized technical expertise)
  - Operations/Development: 1.0x (standard consultancy work)
  - Sales/Coordination: 0.5-0.7x (administrative/coordination work)
  
  Internal cost factors help calculate actual costs vs credits consumed
*/

-- Update Strategy work type
UPDATE work_types 
SET 
  credits_per_hour = 1.5,
  internal_cost_factor = 1.2,
  description = 'Strategic planning and consulting (1.5x credits)'
WHERE name = 'Strategy';

-- Update Leadership work type
UPDATE work_types 
SET 
  credits_per_hour = 1.5,
  internal_cost_factor = 1.2,
  description = 'Leadership and management consulting (1.5x credits)'
WHERE name = 'Leadership';

-- Update AI work type
UPDATE work_types 
SET 
  credits_per_hour = 1.5,
  internal_cost_factor = 1.3,
  description = 'AI implementation and consulting (1.5x credits)'
WHERE name = 'AI';

-- Update Automation (Architecture-like work)
UPDATE work_types 
SET 
  credits_per_hour = 1.3,
  internal_cost_factor = 1.1,
  description = 'Process automation and optimization (1.3x credits)'
WHERE name = 'Automation';

-- Update Development (standard tech work)
UPDATE work_types 
SET 
  credits_per_hour = 1.0,
  internal_cost_factor = 1.0,
  description = 'Software development and technical work (1.0x credits)'
WHERE name = 'Development';

-- Update SEO (operational work)
UPDATE work_types 
SET 
  credits_per_hour = 1.0,
  internal_cost_factor = 0.9,
  description = 'Search engine optimization (1.0x credits)'
WHERE name = 'SEO';

-- Update Content (operational work)
UPDATE work_types 
SET 
  credits_per_hour = 1.0,
  internal_cost_factor = 0.9,
  description = 'Content creation and marketing (1.0x credits)'
WHERE name = 'Content';

-- Update Operations (operational work)
UPDATE work_types 
SET 
  credits_per_hour = 1.0,
  internal_cost_factor = 1.0,
  description = 'Operations and project management (1.0x credits)'
WHERE name = 'Operations';

-- Update Analytics (standard analytical work)
UPDATE work_types 
SET 
  credits_per_hour = 1.0,
  internal_cost_factor = 1.0,
  description = 'Data analysis and reporting (1.0x credits)'
WHERE name = 'Analytics';

-- Update Sales (coordination/admin work)
UPDATE work_types 
SET 
  credits_per_hour = 0.7,
  internal_cost_factor = 0.8,
  description = 'Sales activities and business development (0.7x credits)'
WHERE name = 'Sales';

-- Add new Coordination work type if it doesn't exist
INSERT INTO work_types (name, description, credits_per_hour, internal_cost_factor, is_active)
VALUES ('Coordination', 'Project coordination and administrative tasks (0.5x credits)', 0.5, 0.7, true)
ON CONFLICT (name) DO UPDATE
SET 
  credits_per_hour = 0.5,
  internal_cost_factor = 0.7,
  description = 'Project coordination and administrative tasks (0.5x credits)';

-- Add Architecture work type if it doesn't exist
INSERT INTO work_types (name, description, credits_per_hour, internal_cost_factor, is_active)
VALUES ('Architecture', 'System architecture and design (1.3x credits)', 1.3, 1.1, true)
ON CONFLICT (name) DO UPDATE
SET 
  credits_per_hour = 1.3,
  internal_cost_factor = 1.1,
  description = 'System architecture and design (1.3x credits)';
