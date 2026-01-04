/*
  # Remove Unused Indexes - Part 6
  
  1. Summary
    - Remove unused indexes
    - Part 6 covers recommendations through work_types tables (final part)
  
  2. Performance Impact
    - Completes unused index cleanup
    - Maximizes write performance
*/

-- Recommendations
DROP INDEX IF EXISTS idx_recommendations_actioned_by;
DROP INDEX IF EXISTS idx_recommendations_customer_id;
DROP INDEX IF EXISTS idx_recommendations_project_id;

-- SLA Tracking
DROP INDEX IF EXISTS idx_sla_tracking_customer_id;
DROP INDEX IF EXISTS idx_sla_tracking_ticket_id;

-- Strategic Goals
DROP INDEX IF EXISTS idx_strategic_goals_customer_id;
DROP INDEX IF EXISTS idx_strategic_goals_growth_plan_id;

-- Support
DROP INDEX IF EXISTS idx_support_responses_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_partner_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_project_id;

-- SWOT
DROP INDEX IF EXISTS idx_swot_analyses_customer_id;
DROP INDEX IF EXISTS idx_swot_items_swot_analysis_id;

-- System Settings
DROP INDEX IF EXISTS idx_system_settings_updated_by;

-- Time Entries
DROP INDEX IF EXISTS idx_time_entries_customer_id;
DROP INDEX IF EXISTS idx_time_entries_partner_id;
DROP INDEX IF EXISTS idx_time_entries_project_id;
DROP INDEX IF EXISTS idx_time_entries_work_type_id;
DROP INDEX IF EXISTS idx_time_entry_invoice_mapping_customer_id;
DROP INDEX IF EXISTS idx_time_entry_invoice_mapping_invoice_line_item_id;
DROP INDEX IF EXISTS idx_time_entry_invoice_mapping_mapped_by;

-- User Profiles
DROP INDEX IF EXISTS idx_user_profiles_customer_id;

-- Work Types
DROP INDEX IF EXISTS idx_work_types_updated_by;
