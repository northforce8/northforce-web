export type ElementType =
  | 'strategy'
  | 'structure'
  | 'systems'
  | 'shared_values'
  | 'skills'
  | 'style'
  | 'staff';

export type ElementCategory = 'hard' | 'soft';

export type MaturityLevel =
  | 'initial'
  | 'developing'
  | 'defined'
  | 'managed'
  | 'optimizing';

export type ElementStatus =
  | 'aligned'
  | 'partially_aligned'
  | 'needs_attention'
  | 'critical';

export type AssessmentStatus = 'draft' | 'active' | 'completed' | 'archived';

export type ImprovementCategory =
  | 'quick_win'
  | 'improvement'
  | 'strategic'
  | 'risk_mitigation';

export type ImprovementStatus =
  | 'planned'
  | 'in_progress'
  | 'blocked'
  | 'completed'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export type InfluenceStrength = 'weak' | 'moderate' | 'strong';
export type RelationshipType = 'supportive' | 'conflicting' | 'dependent' | 'neutral';

export interface McKinsey7SAssessment {
  id: string;
  customer_id: string;
  business_model_id?: string;
  title: string;
  description: string;
  assessment_date: string;
  status: AssessmentStatus;
  overall_alignment_score: number;
  hard_elements_score: number;
  soft_elements_score: number;
  ai_overall_analysis: string;
  ai_recommendations: string;
  ai_risk_areas: string;
  ai_last_analyzed?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface McKinsey7SElement {
  id: string;
  assessment_id: string;
  element_type: ElementType;
  element_category: ElementCategory;
  current_state: string;
  desired_state: string;
  gap_analysis: string;
  alignment_score: number;
  maturity_level: MaturityLevel;
  status: ElementStatus;
  ai_insights: string;
  ai_strengths: string;
  ai_weaknesses: string;
  ai_improvement_suggestions: string;
  ai_impact_on_other_elements: string;
  improvement_priority: Priority;
  estimated_effort: EffortLevel;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface McKinsey7SImprovement {
  id: string;
  assessment_id: string;
  element_type: ElementType;
  title: string;
  description: string;
  category: ImprovementCategory;
  priority: Priority;
  effort_level: EffortLevel;
  expected_impact: ImpactLevel;
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  status: ImprovementStatus;
  progress_percentage: number;
  assigned_to?: string;
  owner_name: string;
  elements_affected: ElementType[];
  success_metrics: string;
  actual_outcomes: string;
  ai_suggested: boolean;
  ai_rationale: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface McKinsey7SElementRelationship {
  id: string;
  assessment_id: string;
  source_element_type: ElementType;
  target_element_type: ElementType;
  influence_strength: InfluenceStrength;
  relationship_type: RelationshipType;
  description: string;
  impact_analysis: string;
  ai_relationship_analysis: string;
  created_at: string;
  updated_at: string;
}

export interface ElementDefinition {
  type: ElementType;
  category: ElementCategory;
  name: string;
  description: string;
  questions: string[];
  icon: string;
}

export const ELEMENT_DEFINITIONS: ElementDefinition[] = [
  {
    type: 'strategy',
    category: 'hard',
    name: 'Strategy',
    description: 'Plans and direction to achieve competitive advantage',
    questions: [
      'What are our key strategic goals?',
      'How do we differentiate from competitors?',
      'What is our path to sustainable growth?',
      'How do we allocate resources?',
    ],
    icon: 'Target',
  },
  {
    type: 'structure',
    category: 'hard',
    name: 'Structure',
    description: 'Organizational hierarchy and reporting relationships',
    questions: [
      'How is the organization designed?',
      'What are the reporting lines?',
      'How are decisions made?',
      'How do teams collaborate?',
    ],
    icon: 'Network',
  },
  {
    type: 'systems',
    category: 'hard',
    name: 'Systems',
    description: 'Processes, procedures, and routines',
    questions: [
      'What are our key processes?',
      'How do we measure performance?',
      'What systems support operations?',
      'How do we manage information?',
    ],
    icon: 'Settings',
  },
  {
    type: 'shared_values',
    category: 'soft',
    name: 'Shared Values',
    description: 'Core values and corporate culture (central element)',
    questions: [
      'What are our core values?',
      'What is our mission and purpose?',
      'What behaviors do we reward?',
      'How do we live our values?',
    ],
    icon: 'Heart',
  },
  {
    type: 'skills',
    category: 'soft',
    name: 'Skills',
    description: 'Capabilities and competencies of the organization',
    questions: [
      'What are our distinctive capabilities?',
      'What skills do we need to succeed?',
      'How do we develop talent?',
      'Where are our skill gaps?',
    ],
    icon: 'Award',
  },
  {
    type: 'style',
    category: 'soft',
    name: 'Style',
    description: 'Leadership and management approach',
    questions: [
      'What is our leadership style?',
      'How do leaders behave?',
      'What is our management approach?',
      'How do we make decisions?',
    ],
    icon: 'Users',
  },
  {
    type: 'staff',
    category: 'soft',
    name: 'Staff',
    description: 'Human resources and their capabilities',
    questions: [
      'Do we have the right people?',
      'How do we recruit and retain talent?',
      'How is performance managed?',
      'How do we develop our people?',
    ],
    icon: 'UserCheck',
  },
];

export interface McKinsey7SAIInsights {
  overall_assessment: string;
  alignment_analysis: string;
  hard_soft_balance: string;
  key_strengths: string[];
  critical_weaknesses: string[];
  risk_areas: string[];
  quick_wins: string[];
  strategic_priorities: string[];
  element_insights: Record<ElementType, {
    current_analysis: string;
    strengths: string[];
    weaknesses: string[];
    improvement_suggestions: string[];
    impact_on_others: string;
  }>;
  relationships: {
    source: ElementType;
    target: ElementType;
    strength: InfluenceStrength;
    type: RelationshipType;
    analysis: string;
  }[];
}

export interface McKinsey7SDashboardData {
  assessment: McKinsey7SAssessment;
  elements: McKinsey7SElement[];
  improvements: McKinsey7SImprovement[];
  relationships: McKinsey7SElementRelationship[];
  ai_insights?: McKinsey7SAIInsights;
}
