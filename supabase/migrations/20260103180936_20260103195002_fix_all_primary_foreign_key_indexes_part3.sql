/*
  # Fix All Primary Foreign Key Indexes - Part 3
  
  1. Summary
    - Add covering indexes for remaining primary foreign keys
    - Payments, porter, strategic, support, time tracking
*/

-- Payments
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_by ON payment_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer_id ON payment_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice_id ON payment_transactions(invoice_id);

-- Plan Changes
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_approved_by ON plan_change_requests(approved_by);
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_customer_id ON plan_change_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_plan_change_requests_requested_by ON plan_change_requests(requested_by);

-- Porter Five Forces
CREATE INDEX IF NOT EXISTS idx_porter_analyses_customer_id ON porter_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_porter_forces_porter_analysis_id ON porter_forces(porter_analysis_id);

-- Practice Categories
CREATE INDEX IF NOT EXISTS idx_practice_categories_parent_category_id ON practice_categories(parent_category_id);

-- Recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_actioned_by ON recommendations(actioned_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_customer_id ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_project_id ON recommendations(project_id);

-- SLA and Strategic
CREATE INDEX IF NOT EXISTS idx_sla_tracking_customer_id ON sla_tracking(customer_id);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket_id ON sla_tracking(ticket_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_customer_id ON strategic_goals(customer_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_growth_plan_id ON strategic_goals(growth_plan_id);

-- Support System
CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_partner_id ON support_tickets(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_project_id ON support_tickets(project_id);

-- SWOT
CREATE INDEX IF NOT EXISTS idx_swot_analyses_customer_id ON swot_analyses(customer_id);
CREATE INDEX IF NOT EXISTS idx_swot_items_swot_analysis_id ON swot_items(swot_analysis_id);

-- System Settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON system_settings(updated_by);

-- Time Tracking
CREATE INDEX IF NOT EXISTS idx_time_entries_customer_id ON time_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_partner_id ON time_entries(partner_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_work_type_id ON time_entries(work_type_id);

-- Time Entry Invoice Mapping
CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_customer_id ON time_entry_invoice_mapping(customer_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_invoice_line_item_id ON time_entry_invoice_mapping(invoice_line_item_id);
CREATE INDEX IF NOT EXISTS idx_time_entry_invoice_mapping_mapped_by ON time_entry_invoice_mapping(mapped_by);

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON user_profiles(customer_id);

-- Work Types
CREATE INDEX IF NOT EXISTS idx_work_types_updated_by ON work_types(updated_by);
