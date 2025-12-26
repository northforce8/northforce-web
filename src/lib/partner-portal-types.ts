export type PartnerStatus = 'invited' | 'verified' | 'active' | 'paused' | 'offboarded';
export type DeliveryStatus = 'on_track' | 'at_risk' | 'delayed';
export type StrategicStatus = 'initiering' | 'aktiv' | 'skalning' | 'optimering' | 'pausad';
export type CommercialStatus = 'under_scope' | 'near_limit' | 'over_scope';
export type CollaborationStatus = 'fungerar_bra' | 'kraver_beslut' | 'blockerad';
export type ImpactStatus = 'positiv_trend' | 'neutral' | 'negativ_trend';
export type PlanLevel = 'starter' | 'growth' | 'scale' | 'custom';

export interface Partner {
  id: string;
  user_id: string;
  partner_name: string;
  partner_company?: string;
  email?: string;
  title?: string;
  phone?: string;
  notes?: string;
  is_active: boolean;
  status: PartnerStatus;
  role?: string;
  role_id?: string;
  competency_areas?: string[];
  verified_at?: string;
  agreement_accepted_at?: string;
  allowed_work_types?: string[];
  default_hourly_cost: number;
  hourly_cost_rate?: number;
  capacity_hours_per_month: number;
  capacity_hours_per_week?: number;
  current_utilization_percentage: number;
  onboarding_date?: string;
  offboarding_date?: string;
  skills?: string[];
  certifications?: string[];
  availability_status?: 'available' | 'limited' | 'unavailable' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export interface PartnerRole {
  id: string;
  role_name: string;
  description?: string;
  can_report_time: boolean;
  can_view_all_customers: boolean;
  can_manage_projects: boolean;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  is_active: boolean;
  created_at: string;
}

export interface PartnerWorkTypeAssignment {
  id: string;
  partner_id: string;
  work_type_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_primary: boolean;
  assigned_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerWorkTypeAssignmentWithRelations extends PartnerWorkTypeAssignment {
  partner?: Partner;
  work_type?: WorkType;
}

export interface PartnerCapacityPeriod {
  id: string;
  partner_id: string;
  period_start: string;
  period_end: string;
  available_hours: number;
  allocated_hours: number;
  actual_hours: number;
  capacity_type: 'regular' | 'overtime' | 'reduced' | 'unavailable';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerCapacityPeriodWithRelations extends PartnerCapacityPeriod {
  partner?: Partner;
}

export interface PartnerPerformanceMetrics {
  id: string;
  partner_id: string;
  period_start: string;
  period_end: string;
  total_hours: number;
  billable_hours: number;
  credits_generated: number;
  internal_cost: number;
  active_customers_count: number;
  active_projects_count: number;
  utilization_percentage: number;
  avg_credits_per_hour: number;
  efficiency_score: number;
  quality_score: number;
  calculated_at: string;
  created_at: string;
}

export interface PartnerPerformanceMetricsWithRelations extends PartnerPerformanceMetrics {
  partner?: Partner;
}

export type PartnerWorkloadRecommendationType =
  | 'overload_warning'
  | 'underutilized'
  | 'reallocation_suggested'
  | 'skill_match'
  | 'capacity_increase'
  | 'capacity_decrease';

export interface PartnerWorkloadRecommendation {
  id: string;
  partner_id: string;
  recommendation_type: PartnerWorkloadRecommendationType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  current_utilization?: number;
  target_utilization?: number;
  suggested_action?: string;
  affected_customers?: string[];
  affected_projects?: string[];
  status: 'active' | 'acknowledged' | 'actioned' | 'dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  actioned_by?: string;
  actioned_at?: string;
  created_at: string;
  expires_at?: string;
}

export interface PartnerWorkloadRecommendationWithRelations extends PartnerWorkloadRecommendation {
  partner?: Partner;
}

export interface PartnerAvailabilitySummary {
  partner_id: string;
  partner_name: string;
  role_id?: string;
  role_name?: string;
  hourly_cost_rate?: number;
  capacity_hours_per_month: number;
  availability_status?: string;
  current_month_hours: number;
  current_month_allocated: number;
  remaining_capacity: number;
  utilization_percentage: number;
  active_customers: number;
  active_projects: number;
  work_types?: string[];
}

export interface Customer {
  id: string;
  company_name: string;
  org_number?: string;
  website?: string;
  industry?: string;
  country: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  owner_admin_id?: string;
  delivery_status: DeliveryStatus;
  strategic_status: StrategicStatus;
  commercial_status: CommercialStatus;
  collaboration_status: CollaborationStatus;
  impact_status: ImpactStatus;
  credits_balance: number;
  credits_plan_level: PlanLevel;
  credits_monthly_allocation: number;
  credits_auto_refill: boolean;
  primary_partner_id?: string;
  weekly_rhythm_active: boolean;
  goals_current_period?: string;
  last_review_date?: string;
  enterprise_tier: 'standard' | 'enterprise' | 'enterprise_plus' | 'enterprise_custom';
  sla_level: 'standard' | 'business' | 'rapid_response' | 'custom';
  support_priority: number;
  dedicated_success_manager?: string;
  credits_price_per_credit: number;
  monthly_recurring_revenue: number;
  credits_consumed_this_month: number;
  overdelivery_risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface CustomerAssignment {
  id: string;
  customer_id: string;
  partner_id: string;
  role_on_account: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  customer_id: string;
  name: string;
  description?: string;
  workstream?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  priority: string;
  scope_definition?: string;
  scope_included?: string;
  scope_excluded?: string;
  expected_credits_per_period?: number;
  next_action_required?: string;
  next_action_owner?: string;
  blocking_items?: string;
  requires_customer_decision: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectAssignment {
  id: string;
  project_id: string;
  partner_id: string;
  role_on_project: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  credits_per_hour: number;
  requires_plan_level: PlanLevel;
  internal_cost_factor: number;
  category?: 'strategic' | 'operational' | 'technical' | 'administrative' | 'leadership';
  billable: boolean;
  allowed_plan_levels: PlanLevel[];
  updated_at?: string;
  updated_by?: string;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  customer_id: string;
  project_id?: string;
  partner_id: string;
  work_type_id: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  internal_cost?: number;
  credits_consumed?: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  customer_id: string;
  project_id?: string;
  partner_id?: string;
  note_type: string;
  visibility: 'admin_only' | 'shared';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  actor_user_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface TimeEntryWithRelations extends TimeEntry {
  customer?: Customer;
  project?: Project;
  partner?: Partner;
  work_type?: WorkType;
}

export interface NoteWithRelations extends Note {
  customer?: Customer;
  project?: Project;
  partner?: Partner;
}

export interface CustomerWithStats extends Customer {
  total_hours?: number;
  active_projects?: number;
  assigned_partners?: number;
}

export interface PartnerWithStats extends Partner {
  total_hours?: number;
  active_customers?: number;
  active_projects?: number;
  credits_workload?: number;
}

export type CreditsTransactionType = 'allocation' | 'deduction' | 'adjustment' | 'refund' | 'bonus';

export interface CreditsTransaction {
  id: string;
  customer_id: string;
  transaction_type: CreditsTransactionType;
  amount: number;
  balance_after: number;
  related_time_entry_id?: string;
  related_partner_id?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_by?: string;
  created_at: string;
}

export interface CreditsTransactionWithRelations extends CreditsTransaction {
  customer?: Customer;
  partner?: Partner;
  time_entry?: TimeEntry;
}

export interface DecisionLog {
  id: string;
  customer_id: string;
  project_id?: string;
  decision_title: string;
  decision_description: string;
  decision_maker: string;
  decision_date: string;
  impact_assessment?: string;
  options_considered?: string;
  rationale?: string;
  created_by?: string;
  created_at: string;
}

export interface DecisionLogWithRelations extends DecisionLog {
  customer?: Customer;
  project?: Project;
}

export type CapacityRuleType = 'work_type_access' | 'max_parallel_projects' | 'max_partners' | 'feature_access';

export interface CapacityRule {
  id: string;
  plan_level: PlanLevel;
  rule_type: CapacityRuleType;
  rule_key: string;
  rule_value: Record<string, unknown>;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export type RecommendationType = 'scope_review' | 'credits_topup' | 'strategy_meeting' | 'risk_alert' | 'partner_change' | 'capacity_upgrade';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';
export type RecommendationStatus = 'active' | 'dismissed' | 'actioned';

export interface Recommendation {
  id: string;
  customer_id: string;
  project_id?: string;
  recommendation_type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  reasoning?: string;
  suggested_action?: string;
  status: RecommendationStatus;
  actioned_at?: string;
  actioned_by?: string;
  created_at: string;
  ai_priority_score?: number;
  impact_score?: number;
  business_criticality?: 'low' | 'medium' | 'high' | 'critical';
}

export interface RecommendationWithRelations extends Recommendation {
  customer?: Customer;
  project?: Project;
}

export type StatusEntityType = 'customer' | 'project' | 'partner';

export interface StatusChangeLog {
  id: string;
  entity_type: StatusEntityType;
  entity_id: string;
  status_field: string;
  old_value?: string;
  new_value: string;
  change_reason?: string;
  changed_by?: string;
  created_at: string;
}

export interface CustomerWithFullStats extends Customer {
  total_hours?: number;
  active_projects?: number;
  assigned_partners?: number;
  credits_used_this_month?: number;
  credits_percentage_remaining?: number;
  pending_recommendations?: number;
  primary_partner?: Partner;
}

export type EnterpriseTier = 'standard' | 'enterprise' | 'enterprise_plus' | 'enterprise_custom';
export type SlaLevel = 'standard' | 'business' | 'rapid_response' | 'custom';
export type SupportType = 'technical' | 'strategic' | 'billing' | 'general';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type ResponderType = 'admin' | 'partner' | 'customer' | 'system';
export type SlaMetricType = 'response_time' | 'resolution_time' | 'uptime' | 'availability';
export type BreachSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type BenefitType = 'feature_access' | 'service_level' | 'capacity_limit' | 'custom';

export interface EnterprisePlan {
  id: string;
  plan_name: string;
  tier: EnterpriseTier;
  display_name: string;
  description?: string;
  credits_monthly_base: number;
  credits_bonus_percentage: number;
  credits_rollover_allowed: boolean;
  credits_rollover_max_months: number;
  sla_level: SlaLevel;
  sla_response_time_hours: number;
  sla_resolution_time_hours: number;
  sla_uptime_guarantee: number;
  support_technical: boolean;
  support_strategic: boolean;
  support_24_7: boolean;
  support_channels: string[];
  max_parallel_projects?: number;
  max_partners?: number;
  advanced_reporting: boolean;
  custom_integrations: boolean;
  dedicated_success_manager: boolean;
  priority_development: boolean;
  monthly_price_sek?: number;
  setup_fee_sek: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_id: string;
  project_id?: string;
  support_type: SupportType;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  requested_by_name: string;
  requested_by_email: string;
  requested_by_role?: string;
  assigned_to?: string;
  assigned_partner_id?: string;
  sla_level: SlaLevel;
  sla_response_deadline?: string;
  sla_resolution_deadline?: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  sla_response_breached: boolean;
  sla_resolution_breached: boolean;
  sla_breach_reason?: string;
  tags?: string[];
  internal_notes?: string;
  customer_satisfaction_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketWithRelations extends SupportTicket {
  customer?: Customer;
  project?: Project;
  assigned_admin?: { id: string; email: string; full_name?: string };
  assigned_partner?: Partner;
  responses?: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticket_id: string;
  responder_type: ResponderType;
  responder_id?: string;
  responder_name: string;
  response_text: string;
  is_internal: boolean;
  attachments?: Record<string, unknown>;
  response_time_minutes?: number;
  created_at: string;
}

export interface SupportResponseWithRelations extends SupportResponse {
  ticket?: SupportTicket;
}

export interface SlaTracking {
  id: string;
  customer_id: string;
  ticket_id?: string;
  metric_type: SlaMetricType;
  metric_value: number;
  metric_unit: string;
  sla_target: number;
  sla_actual: number;
  is_breach: boolean;
  breach_severity?: BreachSeverity;
  breach_reason?: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface SlaTrackingWithRelations extends SlaTracking {
  customer?: Customer;
  ticket?: SupportTicket;
}

export interface EnterpriseBenefit {
  id: string;
  customer_id: string;
  benefit_type: BenefitType;
  benefit_key: string;
  benefit_value: Record<string, unknown>;
  benefit_description?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  granted_by?: string;
  created_at: string;
}

export interface EnterpriseBenefitWithRelations extends EnterpriseBenefit {
  customer?: Customer;
}

export interface CustomerWithEnterprise extends CustomerWithFullStats {
  enterprise_tier?: EnterpriseTier;
  sla_level?: SlaLevel;
  support_priority?: number;
  dedicated_success_manager_id?: string;
  enterprise_plan?: EnterprisePlan;
  enterprise_benefits?: EnterpriseBenefit[];
  active_support_tickets?: number;
  sla_compliance_rate?: number;
}

export interface PartnerCostRate {
  id: string;
  partner_id: string;
  hourly_cost: number;
  effective_from: string;
  effective_until?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface CreditsForecast {
  id: string;
  customer_id: string;
  forecast_period_start: string;
  forecast_period_end: string;
  estimated_credits_consumption: number;
  current_credits_balance: number;
  projected_balance_end_of_period: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors?: string[];
  recommended_action?: string;
  action_type?: 'none' | 'credits_topup' | 'scope_review' | 'capacity_adjustment' | 'level_upgrade';
  forecast_confidence: number;
  created_at: string;
  updated_at: string;
}

export interface CreditsForecastWithRelations extends CreditsForecast {
  customer?: Customer;
}

export interface MarginAnalysis {
  id: string;
  customer_id: string;
  project_id?: string;
  analysis_period_start: string;
  analysis_period_end: string;
  credits_consumed: number;
  credits_value_sek: number;
  internal_cost_sek: number;
  partner_hours: number;
  margin_sek: number;
  margin_percentage: number;
  avg_credit_cost?: number;
  avg_hourly_rate?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MarginAnalysisWithRelations extends MarginAnalysis {
  customer?: Customer;
  project?: Project;
}

export interface CapacityUtilization {
  id: string;
  partner_id: string;
  customer_id?: string;
  period_start: string;
  period_end: string;
  total_hours: number;
  billable_hours: number;
  non_billable_hours: number;
  available_capacity_hours: number;
  utilization_percentage: number;
  credits_generated: number;
  internal_cost: number;
  created_at: string;
}

export interface CapacityUtilizationWithRelations extends CapacityUtilization {
  partner?: Partner;
  customer?: Customer;
}

export interface BillingPeriod {
  id: string;
  customer_id: string;
  period_start: string;
  period_end: string;
  period_name: string;
  credits_allocated: number;
  credits_consumed: number;
  credits_remaining: number;
  base_price_sek: number;
  additional_credits_price_sek: number;
  total_amount_sek: number;
  internal_cost_sek: number;
  margin_sek: number;
  margin_percentage: number;
  status: 'draft' | 'approved' | 'invoiced' | 'paid' | 'cancelled';
  invoice_number?: string;
  invoice_date?: string;
  payment_date?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BillingPeriodWithRelations extends BillingPeriod {
  customer?: Customer;
}

export interface DashboardMetrics {
  customer_id: string;
  credits_remaining: number;
  credits_remaining_percentage: number;
  credits_consumed_this_month: number;
  estimated_credits_burn_rate: number;
  days_until_credits_depleted?: number;
  overdelivery_risk_level: 'low' | 'medium' | 'high' | 'critical';
  current_margin_percentage: number;
  partner_utilization_avg: number;
  active_projects_count: number;
  active_partners_count: number;
  recommendations: Recommendation[];
}

export interface PartnerPerformance {
  partner_id: string;
  partner_name: string;
  total_hours_this_month: number;
  billable_hours_this_month: number;
  credits_generated_this_month: number;
  internal_cost_this_month: number;
  utilization_percentage: number;
  avg_credits_per_hour: number;
  active_customers_count: number;
}

export interface SystemSettings {
  id: string;
  time_entry_edit_window_days: number;
  time_entry_require_project: boolean;
  time_entry_enable_billable_tracking: boolean;
  time_entry_max_hours_per_day: number;
  time_entry_allow_future_dates: boolean;
  default_currency_code: string;
  allowed_currencies: string[];
  date_format: string;
  time_zone: string;
  company_name: string;
  company_org_number?: string;
  company_email: string;
  company_phone?: string;
  settings_version: number;
  updated_at?: string;
  updated_by?: string;
}

export interface SettingsAuditLog {
  id: string;
  entity_type: 'work_type' | 'time_entry_rules' | 'system_setting';
  entity_id?: string;
  field_name: string;
  old_value?: string;
  new_value: string;
  change_description?: string;
  changed_by?: string;
  changed_by_email?: string;
  changed_at: string;
  change_reason?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

export interface WorkTypeUsageInfo {
  work_type_id: string;
  is_used: boolean;
  usage_count: number;
  last_used_date?: string;
}
