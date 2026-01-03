export type ExperimentStatus = 'planning' | 'running' | 'completed' | 'pivoted' | 'abandoned';
export type HypothesisType = 'problem' | 'solution' | 'customer' | 'channel' | 'revenue';
export type BuildMeasureLearnCycle = 'build' | 'measure' | 'learn';
export type PivotOrPersevere = 'persevere' | 'pivot' | 'undecided';

export type HypothesisCategory = 'assumption' | 'riskiest' | 'leap_of_faith' | 'validated';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type FeatureType = 'core' | 'nice_to_have' | 'differentiator' | 'must_have';
export type FeatureStatus = 'planned' | 'in_development' | 'testing' | 'released' | 'removed';
export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export type MetricType = 'actionable' | 'vanity' | 'pirate';
export type PirateStage = 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
export type MeasurementFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type MetricTrend = 'improving' | 'stable' | 'declining';

export type PivotType =
  | 'zoom_in'
  | 'zoom_out'
  | 'customer_segment'
  | 'customer_need'
  | 'platform'
  | 'business_architecture'
  | 'value_capture'
  | 'engine_of_growth'
  | 'channel'
  | 'technology';

export type PainLevel = 'low' | 'medium' | 'high' | 'critical';
export type WillingnessToPay = 'low' | 'medium' | 'high';

export type FeedbackType = 'positive' | 'negative' | 'neutral' | 'insight';

export interface LeanExperiment {
  id: string;
  customer_id: string;
  business_model_id?: string;
  experiment_name: string;
  mvp_description?: string;
  problem_statement: string;
  target_segment?: string;
  hypothesis_type: HypothesisType;
  current_cycle: BuildMeasureLearnCycle;
  cycle_count: number;
  start_date: string;
  end_date?: string;
  status: ExperimentStatus;
  validated_learning: string;
  pivot_or_persevere?: PivotOrPersevere;
  success_metrics: any[];
  actual_results: any;
  customer_segments: string[];
  learning_outcome?: string;
  next_steps?: string;
  ai_insights: string;
  ai_recommendations: string;
  ai_risk_assessment: string;
  ai_last_analyzed?: string;
  budget_allocated: number;
  budget_spent: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeanHypothesis {
  id: string;
  experiment_id: string;
  hypothesis_statement: string;
  hypothesis_category: HypothesisCategory;
  priority: Priority;
  success_criteria: string;
  validation_method?: string;
  test_duration_days?: number;
  sample_size_target?: number;
  sample_size_actual: number;
  metric_name?: string;
  metric_target?: number;
  metric_actual?: number;
  is_validated?: boolean;
  validation_result?: string;
  confidence_level?: number;
  created_at: string;
  updated_at: string;
}

export interface LeanMVPFeature {
  id: string;
  experiment_id: string;
  feature_name: string;
  feature_description: string;
  feature_type: FeatureType;
  priority: Priority;
  effort_estimate: EffortLevel;
  expected_impact: ImpactLevel;
  status: FeatureStatus;
  user_feedback_score?: number;
  usage_percentage: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeanMetric {
  id: string;
  experiment_id: string;
  metric_name: string;
  metric_description: string;
  metric_type: MetricType;
  pirate_stage?: PirateStage;
  target_value: number;
  current_value: number;
  unit?: string;
  measurement_frequency: MeasurementFrequency;
  is_north_star: boolean;
  trend: MetricTrend;
  last_measured_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeanPivotDecision {
  id: string;
  experiment_id: string;
  decision_date: string;
  pivot_type: PivotType;
  rationale: string;
  data_supporting: any;
  expected_outcome?: string;
  actual_outcome?: string;
  success?: boolean;
  lessons_learned?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeanCustomerSegment {
  id: string;
  experiment_id: string;
  segment_name: string;
  segment_description: string;
  segment_size_estimate?: number;
  is_early_adopter: boolean;
  pain_level?: PainLevel;
  willingness_to_pay?: WillingnessToPay;
  acquisition_cost?: number;
  lifetime_value?: number;
  engagement_score?: number;
  retention_rate?: number;
  key_characteristics: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeanFeedback {
  id: string;
  experiment_id: string;
  feedback_source: string;
  feedback_type?: FeedbackType;
  feedback_text: string;
  customer_segment?: string;
  actionable: boolean;
  action_taken?: string;
  collected_at: string;
  created_at: string;
}

export interface LeanStartupAIInsights {
  experiment_analysis: string;
  hypothesis_validation_status: string;
  build_measure_learn_recommendations: string;
  pivot_recommendation: 'persevere' | 'pivot' | 'more_data_needed';
  pivot_rationale: string;
  key_learnings: string[];
  risk_areas: string[];
  quick_wins: string[];
  next_experiments: string[];
  customer_segment_insights: string[];
  mvp_feature_priorities: string[];
  metric_analysis: string;
  success_probability: number;
}

export interface LeanStartupDashboardData {
  experiment: LeanExperiment;
  hypotheses: LeanHypothesis[];
  mvp_features: LeanMVPFeature[];
  metrics: LeanMetric[];
  pivot_decisions: LeanPivotDecision[];
  customer_segments: LeanCustomerSegment[];
  feedback: LeanFeedback[];
  ai_insights?: LeanStartupAIInsights;
  progress_percentage: number;
}

export const PIVOT_TYPE_LABELS: Record<PivotType, string> = {
  zoom_in: 'Zoom-in Pivot (Focus on single feature)',
  zoom_out: 'Zoom-out Pivot (Feature becomes one of many)',
  customer_segment: 'Customer Segment Pivot',
  customer_need: 'Customer Need Pivot',
  platform: 'Platform Pivot',
  business_architecture: 'Business Architecture Pivot',
  value_capture: 'Value Capture Pivot (Monetization)',
  engine_of_growth: 'Engine of Growth Pivot',
  channel: 'Channel Pivot',
  technology: 'Technology Pivot',
};

export const PIRATE_METRICS_LABELS: Record<PirateStage, string> = {
  acquisition: 'Acquisition (How do users find us?)',
  activation: 'Activation (Do users have a great first experience?)',
  retention: 'Retention (Do users come back?)',
  revenue: 'Revenue (How do we monetize?)',
  referral: 'Referral (Do users tell others?)',
};

export const HYPOTHESIS_TYPE_LABELS: Record<HypothesisType, string> = {
  problem: 'Problem Hypothesis (Does the problem exist?)',
  solution: 'Solution Hypothesis (Does our solution work?)',
  customer: 'Customer Hypothesis (Is this the right segment?)',
  channel: 'Channel Hypothesis (Can we reach customers?)',
  revenue: 'Revenue Hypothesis (Will customers pay?)',
};

export const BUILD_MEASURE_LEARN_DESCRIPTIONS: Record<BuildMeasureLearnCycle, string> = {
  build: 'Build: Create MVP or experiment to test hypothesis',
  measure: 'Measure: Collect data and feedback from real users',
  learn: 'Learn: Analyze results and decide to pivot or persevere',
};
