/*
  # Fix Multiple Permissive RLS Policies - Part 2
  
  1. Summary
    - Consolidate multiple permissive SELECT policies
    - Part 2 covers design_thinking_projects through growth_plans tables
  
  2. Security Impact
    - Simplifies policy evaluation
    - Reduces performance overhead of multiple policy checks
*/

-- Design Thinking Projects
DROP POLICY IF EXISTS "Admins can manage all Design Thinking projects" ON design_thinking_projects;
DROP POLICY IF EXISTS "Customers can view their Design Thinking projects" ON design_thinking_projects;

CREATE POLICY "Users can view relevant Design Thinking projects"
  ON design_thinking_projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- DT Empathy Maps
DROP POLICY IF EXISTS "Admin users can modify empathy maps" ON dt_empathy_maps;
DROP POLICY IF EXISTS "Users can view empathy maps" ON dt_empathy_maps;

CREATE POLICY "Users can view relevant empathy maps"
  ON dt_empathy_maps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- DT Ideas
DROP POLICY IF EXISTS "Admin users can modify ideas" ON dt_ideas;
DROP POLICY IF EXISTS "Users can view ideas" ON dt_ideas;

CREATE POLICY "Users can view relevant ideas"
  ON dt_ideas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- DT Journey Maps
DROP POLICY IF EXISTS "Admin users can modify journey maps" ON dt_journey_maps;
DROP POLICY IF EXISTS "Users can view journey maps" ON dt_journey_maps;

CREATE POLICY "Users can view relevant journey maps"
  ON dt_journey_maps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- DT Personas
DROP POLICY IF EXISTS "Admin users can modify personas" ON dt_personas;
DROP POLICY IF EXISTS "Users can view personas" ON dt_personas;

CREATE POLICY "Users can view relevant personas"
  ON dt_personas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- DT Prototypes
DROP POLICY IF EXISTS "Admin users can modify prototypes" ON dt_prototypes;
DROP POLICY IF EXISTS "Users can view prototypes" ON dt_prototypes;

CREATE POLICY "Users can view relevant prototypes"
  ON dt_prototypes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- DT User Tests
DROP POLICY IF EXISTS "Admin users can modify user tests" ON dt_user_tests;
DROP POLICY IF EXISTS "Users can view user tests" ON dt_user_tests;

CREATE POLICY "Users can view relevant user tests"
  ON dt_user_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    project_id IN (
      SELECT id FROM design_thinking_projects
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- Growth Initiatives
DROP POLICY IF EXISTS "Admins have full access to growth_initiatives" ON growth_initiatives;
DROP POLICY IF EXISTS "Customers can view their growth_initiatives" ON growth_initiatives;

CREATE POLICY "Users can view relevant growth initiatives"
  ON growth_initiatives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    growth_objective_id IN (
      SELECT id FROM growth_objectives
      WHERE growth_plan_id IN (
        SELECT id FROM growth_plans
        WHERE customer_id IN (
          SELECT customer_id FROM user_profiles
          WHERE user_profiles.id = auth.uid()
        )
      )
    )
  );

-- Growth Objectives
DROP POLICY IF EXISTS "Admins have full access to growth_objectives" ON growth_objectives;
DROP POLICY IF EXISTS "Customers can view their growth_objectives" ON growth_objectives;

CREATE POLICY "Users can view relevant growth objectives"
  ON growth_objectives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    growth_plan_id IN (
      SELECT id FROM growth_plans
      WHERE customer_id IN (
        SELECT customer_id FROM user_profiles
        WHERE user_profiles.id = auth.uid()
      )
    )
  );

-- Growth Plans
DROP POLICY IF EXISTS "Admins have full access to growth_plans" ON growth_plans;
DROP POLICY IF EXISTS "Customers can view their growth_plans" ON growth_plans;

CREATE POLICY "Users can view relevant growth plans"
  ON growth_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
    OR
    customer_id IN (
      SELECT customer_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );
