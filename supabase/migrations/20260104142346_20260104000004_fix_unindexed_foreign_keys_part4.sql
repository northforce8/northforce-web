/*
  # Fix Unindexed Foreign Keys - Part 4
  
  1. Summary
    - Add indexes for foreign keys that lack covering indexes
    - Part 4 covers mckinsey through swot_items tables
  
  2. Performance Impact
    - Optimizes strategic framework queries
    - Improves performance for SWOT, Porter, McKinsey modules
*/

-- McKinsey 7S
CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_assessments_created_by 
ON mckinsey_7s_assessments(created_by);

CREATE INDEX IF NOT EXISTS idx_mckinsey_7s_improvements_assessment_id 
ON mckinsey_7s_improvements(assessment_id);

-- Methodology Templates
CREATE INDEX IF NOT EXISTS idx_methodology_templates_created_by 
ON methodology_templates(created_by);

-- Porter Analysis
CREATE INDEX IF NOT EXISTS idx_porter_analyses_created_by 
ON porter_analyses(created_by);

-- Settings
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_changed_by 
ON settings_audit_log(changed_by);

-- Status Change Log
CREATE INDEX IF NOT EXISTS idx_status_change_log_changed_by 
ON status_change_log(changed_by);

-- SWOT Analysis
CREATE INDEX IF NOT EXISTS idx_swot_analyses_created_by 
ON swot_analyses(created_by);

CREATE INDEX IF NOT EXISTS idx_swot_items_created_by 
ON swot_items(created_by);
