export interface GrowthPlan {
  id: string;
  customer_id: string;
  plan_name: string;
  vision_statement?: string;
  mission_statement?: string;
  time_horizon_months: number;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  overall_progress: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthObjective {
  id: string;
  growth_plan_id: string;
  objective_title: string;
  description?: string;
  category: 'revenue' | 'market_share' | 'customer_acquisition' | 'operational_efficiency' | 'innovation' | 'people' | 'other';
  priority: number;
  target_metric?: string;
  baseline_value?: number;
  target_value?: number;
  current_value?: number;
  unit?: string;
  target_date?: string;
  status: 'not_started' | 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'cancelled';
  progress_percentage: number;
  owner_name?: string;
  owner_email?: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthInitiative {
  id: string;
  growth_objective_id: string;
  initiative_name: string;
  description?: string;
  assigned_to_partner_id?: string;
  assigned_to_name?: string;
  project_id?: string;
  estimated_credits: number;
  actual_credits: number;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  status: 'planned' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  deliverables: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthMilestone {
  id: string;
  growth_objective_id?: string;
  growth_initiative_id?: string;
  milestone_name: string;
  description?: string;
  target_date: string;
  completed_date?: string;
  is_completed: boolean;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadershipCompetency {
  id: string;
  competency_name: string;
  description?: string;
  category: 'strategic' | 'operational' | 'people' | 'change' | 'communication' | 'innovation' | 'general';
  level_1_descriptor?: string;
  level_2_descriptor?: string;
  level_3_descriptor?: string;
  level_4_descriptor?: string;
  level_5_descriptor?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LeadershipAssessment {
  id: string;
  customer_id: string;
  assessment_name: string;
  description?: string;
  assessment_type: 'self' | '180' | '360' | 'team';
  launch_date: string;
  due_date?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  participants_count: number;
  completed_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentParticipant {
  id: string;
  assessment_id: string;
  participant_name: string;
  participant_email: string;
  role_in_organization?: string;
  department?: string;
  self_assessment_completed: boolean;
  self_assessment_date?: string;
  peer_count: number;
  manager_assessment_completed: boolean;
  overall_completion_percentage: number;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface AssessmentScore {
  id: string;
  participant_id: string;
  competency_id: string;
  self_score?: number;
  peer_scores: number[];
  peer_score_avg?: number;
  manager_score?: number;
  team_score_avg?: number;
  overall_score_avg?: number;
  self_comments?: string;
  peer_comments: string[];
  manager_comments?: string;
  gap_analysis?: string;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentPlan {
  id: string;
  participant_id: string;
  plan_name: string;
  development_focus?: string;
  key_strengths: string[];
  development_areas: string[];
  overall_goal?: string;
  review_frequency: 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
  next_review_date?: string;
  status: 'draft' | 'active' | 'on_hold' | 'completed';
  progress_percentage: number;
  coach_name?: string;
  coach_email?: string;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentAction {
  id: string;
  development_plan_id: string;
  competency_id?: string;
  action_title: string;
  action_description?: string;
  action_type: 'training' | 'coaching' | 'mentoring' | 'project' | 'reading' | 'practice' | 'feedback' | 'other';
  target_date?: string;
  completed_date?: string;
  is_completed: boolean;
  impact_assessment?: string;
  resources_needed?: string;
  progress_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingCampaign {
  id: string;
  customer_id: string;
  campaign_name: string;
  description?: string;
  objective?: string;
  target_audience?: string;
  value_proposition?: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'approved' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget_allocated: number;
  budget_spent: number;
  credits_allocated: number;
  credits_spent: number;
  roi_target?: number;
  roi_actual?: number;
  lead_target?: number;
  leads_generated: number;
  conversion_target?: number;
  conversions_actual: number;
  assigned_partner_id?: string;
  project_id?: string;
  created_by?: string;
  approved_by_customer: boolean;
  approved_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignActivity {
  id: string;
  campaign_id: string;
  activity_name: string;
  activity_type: 'content' | 'ads' | 'email' | 'social' | 'event' | 'pr' | 'seo' | 'other';
  description?: string;
  channel?: string;
  credits_allocated: number;
  credits_spent: number;
  budget_allocated: number;
  budget_spent: number;
  partner_id?: string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  deliverables: string[];
  created_at: string;
  updated_at: string;
}

export interface CampaignResult {
  id: string;
  campaign_id?: string;
  campaign_activity_id?: string;
  measurement_date: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  notes?: string;
  created_at: string;
}

export interface CampaignBudget {
  id: string;
  campaign_id: string;
  budget_category: string;
  allocated_amount: number;
  spent_amount: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessModel {
  id: string;
  customer_id: string;
  model_name: string;
  value_proposition?: string;
  customer_segments: string[];
  channels: string[];
  customer_relationships: string[];
  revenue_streams: string[];
  key_resources: string[];
  key_activities: string[];
  key_partnerships: string[];
  cost_structure: string[];
  competitive_advantage?: string;
  version: number;
  is_current: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface StrategicGoal {
  id: string;
  customer_id: string;
  growth_plan_id?: string;
  goal_name: string;
  goal_category: 'revenue' | 'margin' | 'market_share' | 'customer_satisfaction' | 'employee_engagement' | 'innovation' | 'sustainability' | 'other';
  description?: string;
  target_value?: number;
  current_value?: number;
  baseline_value?: number;
  unit?: string;
  target_date?: string;
  status: 'active' | 'achieved' | 'at_risk' | 'missed' | 'cancelled';
  priority: number;
  owner_name?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalMetric {
  id: string;
  strategic_goal_id: string;
  measurement_date: string;
  metric_value: number;
  notes?: string;
  data_source?: string;
  created_at: string;
}

export interface FinancialSnapshot {
  id: string;
  customer_id: string;
  snapshot_date: string;
  period_type: 'monthly' | 'quarterly' | 'annual';
  period_label?: string;
  revenue?: number;
  costs?: number;
  gross_margin?: number;
  net_margin?: number;
  ebitda?: number;
  currency: string;
  linked_projects: string[];
  linked_campaigns: string[];
  notes?: string;
  created_at: string;
}

export interface MethodologyTemplate {
  id: string;
  template_name: string;
  description?: string;
  category: 'growth' | 'leadership' | 'marketing' | 'operations' | 'strategy' | 'transformation' | 'general';
  use_case?: string;
  phases: {
    name: string;
    description?: string;
    duration_weeks?: number;
    deliverables?: string[];
  }[];
  deliverables: string[];
  typical_duration_weeks?: number;
  typical_credits?: number;
  required_competencies: string[];
  is_public: boolean;
  created_by?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface BestPractice {
  id: string;
  practice_title: string;
  category: string;
  description: string;
  detailed_guidance?: string;
  when_to_use?: string;
  tools_needed: string[];
  expected_outcomes?: string;
  case_study_reference?: string;
  related_competencies: string[];
  tags: string[];
  is_published: boolean;
  created_by?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface PracticeCategory {
  id: string;
  category_name: string;
  description?: string;
  parent_category_id?: string;
  icon_name?: string;
  sort_order: number;
  created_at: string;
}

export interface GrowthPlanWithObjectives extends GrowthPlan {
  objectives?: GrowthObjective[];
  customer?: {
    id: string;
    company_name: string;
  };
}

export interface GrowthObjectiveWithInitiatives extends GrowthObjective {
  initiatives?: GrowthInitiative[];
  milestones?: GrowthMilestone[];
}

export interface LeadershipAssessmentWithParticipants extends LeadershipAssessment {
  participants?: AssessmentParticipant[];
  customer?: {
    id: string;
    company_name: string;
  };
}

export interface AssessmentParticipantWithScores extends AssessmentParticipant {
  scores?: AssessmentScore[];
  development_plans?: DevelopmentPlan[];
}

export interface MarketingCampaignWithActivities extends MarketingCampaign {
  activities?: CampaignActivity[];
  results?: CampaignResult[];
  customer?: {
    id: string;
    company_name: string;
  };
}

export interface SwotAnalysis {
  id: string;
  customer_id?: string;
  title: string;
  description?: string;
  context?: string;
  created_by?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SwotItem {
  id: string;
  swot_analysis_id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description?: string;
  impact_level?: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action_plan?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SwotAnalysisWithItems extends SwotAnalysis {
  items?: SwotItem[];
  strengths?: SwotItem[];
  weaknesses?: SwotItem[];
  opportunities?: SwotItem[];
  threats?: SwotItem[];
  customer?: {
    id: string;
    company_name: string;
  };
}

export interface SwotAIInsight {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact_score: number;
  confidence: number;
  source: 'internal_data' | 'market_analysis' | 'competitor_analysis' | 'trend_analysis';
  reasoning: string;
  recommended_actions: string[];
  related_okr_suggestions?: {
    objective: string;
    key_results: string[];
  };
}

export interface SwotCrossAnalysis {
  swot_analysis_id: string;
  so_strategies: string[];
  wo_strategies: string[];
  st_strategies: string[];
  wt_strategies: string[];
  priority_actions: {
    action: string;
    strategy_type: 'SO' | 'WO' | 'ST' | 'WT';
    priority: number;
    estimated_impact: number;
  }[];
}

export interface BusinessModelWithDetails extends BusinessModel {
  customer?: {
    id: string;
    company_name: string;
  };
  previous_versions?: BusinessModel[];
}

export interface BMCBuildingBlock {
  id: string;
  type: 'value_proposition' | 'customer_segments' | 'channels' | 'customer_relationships' |
        'revenue_streams' | 'key_resources' | 'key_activities' | 'key_partnerships' | 'cost_structure';
  title: string;
  description?: string;
  items: string[];
  impact_score?: number;
  confidence?: number;
  recommendations?: string[];
}

export interface BMCAIInsight {
  building_block: 'value_proposition' | 'customer_segments' | 'channels' | 'customer_relationships' |
                   'revenue_streams' | 'key_resources' | 'key_activities' | 'key_partnerships' | 'cost_structure';
  insight_type: 'opportunity' | 'risk' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact_score: number;
  confidence: number;
  data_source: 'market_analysis' | 'competitor_analysis' | 'customer_data' | 'financial_data' | 'industry_trends';
  recommendations: string[];
  related_okr_suggestions?: {
    objective: string;
    key_results: string[];
  };
  related_swot_elements?: string[];
}

export interface BMCAnalysis {
  business_model_id: string;
  overall_health_score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategic_fit_score: number;
  market_viability_score: number;
  execution_readiness_score: number;
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    recommendation: string;
    expected_impact: string;
  }[];
}

export interface BMCComparison {
  current_model: BusinessModel;
  previous_model?: BusinessModel;
  changes: {
    building_block: string;
    change_type: 'added' | 'removed' | 'modified';
    details: string;
  }[];
  improvement_score: number;
  analysis: string;
}

export type PorterForceType =
  | 'competitive_rivalry'
  | 'threat_of_new_entrants'
  | 'threat_of_substitutes'
  | 'bargaining_power_of_buyers'
  | 'bargaining_power_of_suppliers';

export interface PorterAnalysis {
  id: string;
  customer_id?: string;
  title: string;
  industry: string;
  market_description?: string;
  overall_attractiveness: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PorterForce {
  id: string;
  porter_analysis_id: string;
  force_type: PorterForceType;
  intensity_rating: number;
  description?: string;
  key_factors: string[];
  strategic_implications?: string;
  created_at: string;
  updated_at: string;
}

export interface PorterAnalysisWithForces extends PorterAnalysis {
  forces: PorterForce[];
  customer?: {
    id: string;
    company_name: string;
  };
}

export interface PorterForceDetail {
  force_type: PorterForceType;
  name: string;
  description: string;
  intensity_rating: number;
  key_factors: string[];
  strategic_implications: string;
  threats: string[];
  opportunities: string[];
  recommendations: string[];
}

export interface PorterAIInsight {
  force_type: PorterForceType;
  insight_type: 'opportunity' | 'threat' | 'strategic' | 'competitive';
  title: string;
  description: string;
  intensity_impact: number;
  confidence: number;
  data_source: 'market_analysis' | 'competitor_analysis' | 'industry_trends' | 'customer_data';
  recommendations: string[];
  related_okr_suggestions?: {
    objective: string;
    key_results: string[];
  };
  related_swot_elements?: string[];
  related_bmc_blocks?: string[];
}

export interface PorterAnalysisResult {
  analysis_id: string;
  overall_attractiveness: number;
  market_position_score: number;
  competitive_intensity_score: number;
  entry_barrier_score: number;
  customer_power_score: number;
  supplier_power_score: number;
  forces_summary: {
    force_type: PorterForceType;
    intensity: number;
    impact: 'high' | 'medium' | 'low';
    key_insights: string[];
  }[];
  strategic_recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    recommendation: string;
    expected_impact: string;
    force_types: PorterForceType[];
  }[];
  competitive_position: 'strong' | 'moderate' | 'weak';
  market_attractiveness: 'high' | 'medium' | 'low';
}

export interface PorterForceComparison {
  force_type: PorterForceType;
  current_intensity: number;
  previous_intensity?: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  factors_added: string[];
  factors_removed: string[];
  impact_change: string;
}
