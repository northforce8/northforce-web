/*
  # Fix Unindexed Foreign Keys - Part 3
  
  1. Summary
    - Add indexes for foreign keys that lack covering indexes
    - Part 3 covers design_thinking through leadership_assessments tables
  
  2. Performance Impact
    - Speeds up complex queries across design thinking and lean modules
    - Optimizes leadership assessment queries
*/

-- Design Thinking
CREATE INDEX IF NOT EXISTS idx_design_thinking_projects_created_by 
ON design_thinking_projects(created_by);

CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_persona_id 
ON dt_empathy_maps(persona_id);

CREATE INDEX IF NOT EXISTS idx_dt_empathy_maps_project_id 
ON dt_empathy_maps(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_ideas_project_id 
ON dt_ideas(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_persona_id 
ON dt_journey_maps(persona_id);

CREATE INDEX IF NOT EXISTS idx_dt_journey_maps_project_id 
ON dt_journey_maps(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_personas_project_id 
ON dt_personas(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_prototypes_idea_id 
ON dt_prototypes(idea_id);

CREATE INDEX IF NOT EXISTS idx_dt_prototypes_project_id 
ON dt_prototypes(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_user_tests_project_id 
ON dt_user_tests(project_id);

CREATE INDEX IF NOT EXISTS idx_dt_user_tests_prototype_id 
ON dt_user_tests(prototype_id);

-- Leadership Assessments
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_created_by 
ON leadership_assessments(created_by);

-- Lean Startup
CREATE INDEX IF NOT EXISTS idx_lean_customer_segments_experiment_id 
ON lean_customer_segments(experiment_id);

CREATE INDEX IF NOT EXISTS idx_lean_experiments_created_by 
ON lean_experiments(created_by);

CREATE INDEX IF NOT EXISTS idx_lean_metrics_experiment_id 
ON lean_metrics(experiment_id);

CREATE INDEX IF NOT EXISTS idx_lean_mvp_features_experiment_id 
ON lean_mvp_features(experiment_id);

CREATE INDEX IF NOT EXISTS idx_lean_pivot_decisions_experiment_id 
ON lean_pivot_decisions(experiment_id);
