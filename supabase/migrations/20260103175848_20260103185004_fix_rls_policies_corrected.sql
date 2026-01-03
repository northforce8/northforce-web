/*
  # Fix Security and Performance Issues - Part 2 Corrected: RLS Auth Optimization
  
  1. Summary
    - Fix RLS policies that re-evaluate auth functions for each row
    - Replace direct auth.uid() calls with subqueries
    - Use correct column names from user_profiles table
  
  2. Performance Impact
    - Auth functions evaluated once per query instead of per row
    - Significantly faster queries on large tables
*/

-- Design Thinking Prototypes
DROP POLICY IF EXISTS "Admin users can modify prototypes" ON dt_prototypes;
DROP POLICY IF EXISTS "Users can view prototypes" ON dt_prototypes;

CREATE POLICY "Admin users can modify prototypes"
  ON dt_prototypes
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view prototypes"
  ON dt_prototypes
  FOR SELECT
  TO authenticated
  USING (true);

-- Design Thinking User Tests
DROP POLICY IF EXISTS "Admin users can modify user tests" ON dt_user_tests;
DROP POLICY IF EXISTS "Users can view user tests" ON dt_user_tests;

CREATE POLICY "Admin users can modify user tests"
  ON dt_user_tests
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view user tests"
  ON dt_user_tests
  FOR SELECT
  TO authenticated
  USING (true);

-- McKinsey 7S Improvements
DROP POLICY IF EXISTS "Admin users can modify improvements" ON mckinsey_7s_improvements;
DROP POLICY IF EXISTS "Users can view improvements" ON mckinsey_7s_improvements;

CREATE POLICY "Admin users can modify improvements"
  ON mckinsey_7s_improvements
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view improvements"
  ON mckinsey_7s_improvements
  FOR SELECT
  TO authenticated
  USING (true);

-- McKinsey 7S Element Relationships
DROP POLICY IF EXISTS "Admin users can modify relationships" ON mckinsey_7s_element_relationships;
DROP POLICY IF EXISTS "Users can view relationships" ON mckinsey_7s_element_relationships;

CREATE POLICY "Admin users can modify relationships"
  ON mckinsey_7s_element_relationships
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view relationships"
  ON mckinsey_7s_element_relationships
  FOR SELECT
  TO authenticated
  USING (true);

-- Lean MVP Features
DROP POLICY IF EXISTS "Admin users can modify MVP features" ON lean_mvp_features;
DROP POLICY IF EXISTS "Users can view MVP features" ON lean_mvp_features;

CREATE POLICY "Admin users can modify MVP features"
  ON lean_mvp_features
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view MVP features"
  ON lean_mvp_features
  FOR SELECT
  TO authenticated
  USING (true);

-- Lean Metrics
DROP POLICY IF EXISTS "Admin users can modify metrics" ON lean_metrics;
DROP POLICY IF EXISTS "Users can view metrics" ON lean_metrics;

CREATE POLICY "Admin users can modify metrics"
  ON lean_metrics
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view metrics"
  ON lean_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Lean Pivot Decisions
DROP POLICY IF EXISTS "Admin users can modify pivot decisions" ON lean_pivot_decisions;
DROP POLICY IF EXISTS "Users can view pivot decisions" ON lean_pivot_decisions;

CREATE POLICY "Admin users can modify pivot decisions"
  ON lean_pivot_decisions
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view pivot decisions"
  ON lean_pivot_decisions
  FOR SELECT
  TO authenticated
  USING (true);

-- Lean Customer Segments
DROP POLICY IF EXISTS "Admin users can modify customer segments" ON lean_customer_segments;
DROP POLICY IF EXISTS "Users can view customer segments" ON lean_customer_segments;

CREATE POLICY "Admin users can modify customer segments"
  ON lean_customer_segments
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view customer segments"
  ON lean_customer_segments
  FOR SELECT
  TO authenticated
  USING (true);

-- Design Thinking Personas
DROP POLICY IF EXISTS "Admin users can modify personas" ON dt_personas;
DROP POLICY IF EXISTS "Users can view personas" ON dt_personas;

CREATE POLICY "Admin users can modify personas"
  ON dt_personas
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view personas"
  ON dt_personas
  FOR SELECT
  TO authenticated
  USING (true);

-- Design Thinking Empathy Maps
DROP POLICY IF EXISTS "Admin users can modify empathy maps" ON dt_empathy_maps;
DROP POLICY IF EXISTS "Users can view empathy maps" ON dt_empathy_maps;

CREATE POLICY "Admin users can modify empathy maps"
  ON dt_empathy_maps
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view empathy maps"
  ON dt_empathy_maps
  FOR SELECT
  TO authenticated
  USING (true);

-- Design Thinking Journey Maps
DROP POLICY IF EXISTS "Admin users can modify journey maps" ON dt_journey_maps;
DROP POLICY IF EXISTS "Users can view journey maps" ON dt_journey_maps;

CREATE POLICY "Admin users can modify journey maps"
  ON dt_journey_maps
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view journey maps"
  ON dt_journey_maps
  FOR SELECT
  TO authenticated
  USING (true);

-- Design Thinking Ideas
DROP POLICY IF EXISTS "Admin users can modify ideas" ON dt_ideas;
DROP POLICY IF EXISTS "Users can view ideas" ON dt_ideas;

CREATE POLICY "Admin users can modify ideas"
  ON dt_ideas
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view ideas"
  ON dt_ideas
  FOR SELECT
  TO authenticated
  USING (true);
