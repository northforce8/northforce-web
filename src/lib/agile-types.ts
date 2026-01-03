export interface AgileTransformation {
  id: string;
  customer_id: string;
  title: string;
  vision?: string;
  description?: string;
  framework_type: 'Scrum' | 'Kanban' | 'SAFe' | 'LeSS' | 'Scrumban' | 'XP' | 'Custom';
  scope: 'Team' | 'Department' | 'Division' | 'Organization-wide';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  overall_progress: number;
  start_date: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  stages?: AgileTransformationStage[];
  assessments?: AgileMaturityAssessment[];
  ceremonies?: AgileCeremony[];
  metrics?: AgileMetric[];
}

export interface AgileTransformationStage {
  id: string;
  transformation_id: string;
  stage_name: 'Vision' | 'Strategy' | 'Team Readiness' | 'Change Management' | 'Performance Metrics';
  stage_order: 1 | 2 | 3 | 4 | 5;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  description?: string;
  key_activities: string[];
  barriers: string[];
  success_criteria: string[];
  created_at: string;
  updated_at: string;
}

export interface AgileMaturityAssessment {
  id: string;
  transformation_id: string;
  assessment_date: string;
  team_name?: string;
  maturity_level: 1 | 2 | 3 | 4 | 5;
  technical_practices_score: number;
  collaboration_score: number;
  delivery_speed_score: number;
  quality_score: number;
  customer_focus_score: number;
  continuous_improvement_score: number;
  overall_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface AgileCeremony {
  id: string;
  transformation_id: string;
  ceremony_type: 'Daily Standup' | 'Sprint Planning' | 'Sprint Review' | 'Sprint Retrospective' | 'Backlog Refinement' | 'Kanban Replenishment';
  team_name?: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'per-sprint' | 'monthly';
  duration_minutes: number;
  participants: string[];
  effectiveness_score: number;
  last_conducted_date?: string;
  next_scheduled_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AgileMetric {
  id: string;
  transformation_id: string;
  metric_name: string;
  metric_category: 'speed' | 'quality' | 'predictability' | 'value' | 'collaboration';
  current_value: number;
  target_value: number;
  unit: string;
  measurement_date: string;
  trend: 'improving' | 'stable' | 'declining';
  created_at: string;
  updated_at: string;
}

export const AGILE_FRAMEWORKS = [
  { value: 'Scrum', label: 'Scrum' },
  { value: 'Kanban', label: 'Kanban' },
  { value: 'SAFe', label: 'SAFe (Scaled Agile Framework)' },
  { value: 'LeSS', label: 'LeSS (Large-Scale Scrum)' },
  { value: 'Scrumban', label: 'Scrumban' },
  { value: 'XP', label: 'Extreme Programming (XP)' },
  { value: 'Custom', label: 'Custom/Hybrid' }
] as const;

export const TRANSFORMATION_SCOPES = [
  { value: 'Team', label: 'Single Team' },
  { value: 'Department', label: 'Department' },
  { value: 'Division', label: 'Division/Business Unit' },
  { value: 'Organization-wide', label: 'Organization-wide' }
] as const;

export const TRANSFORMATION_STAGES = [
  { order: 1, name: 'Vision', description: 'Define transformation vision and goals' },
  { order: 2, name: 'Strategy', description: 'Plan agile adoption strategy' },
  { order: 3, name: 'Team Readiness', description: 'Assess and prepare teams' },
  { order: 4, name: 'Change Management', description: 'Manage organizational change' },
  { order: 5, name: 'Performance Metrics', description: 'Track and optimize performance' }
] as const;

export const MATURITY_LEVELS = [
  { level: 1, label: 'Initial', description: 'Processes unpredictable, poorly controlled' },
  { level: 2, label: 'Managed', description: 'Processes characterized for projects' },
  { level: 3, label: 'Defined', description: 'Processes characterized for organization' },
  { level: 4, label: 'Quantitatively Managed', description: 'Processes measured and controlled' },
  { level: 5, label: 'Optimizing', description: 'Focus on continuous improvement' }
] as const;

export const CEREMONY_TYPES = [
  { value: 'Daily Standup', label: 'Daily Standup', defaultDuration: 15 },
  { value: 'Sprint Planning', label: 'Sprint Planning', defaultDuration: 120 },
  { value: 'Sprint Review', label: 'Sprint Review', defaultDuration: 60 },
  { value: 'Sprint Retrospective', label: 'Sprint Retrospective', defaultDuration: 90 },
  { value: 'Backlog Refinement', label: 'Backlog Refinement', defaultDuration: 60 },
  { value: 'Kanban Replenishment', label: 'Kanban Replenishment', defaultDuration: 30 }
] as const;

export const METRIC_CATEGORIES = [
  { value: 'speed', label: 'Speed', metrics: ['Velocity', 'Lead Time', 'Cycle Time', 'Deployment Frequency'] },
  { value: 'quality', label: 'Quality', metrics: ['Defect Density', 'Code Coverage', 'Technical Debt Ratio'] },
  { value: 'predictability', label: 'Predictability', metrics: ['Sprint Goal Success Rate', 'Forecast Accuracy'] },
  { value: 'value', label: 'Value', metrics: ['Feature Adoption Rate', 'Customer Satisfaction', 'Business Value Delivered'] },
  { value: 'collaboration', label: 'Collaboration', metrics: ['Team Health', 'Cross-team Dependencies', 'Knowledge Sharing'] }
] as const;
