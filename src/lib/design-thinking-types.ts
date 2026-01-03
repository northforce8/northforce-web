export type DTPhase = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
export type DTProjectStatus = 'active' | 'paused' | 'completed';
export type DTCompletionStatus = 'not_started' | 'in_progress' | 'completed';

export type PersonaType = 'user' | 'customer' | 'stakeholder' | 'anti_persona';
export type TechSavviness = 'novice' | 'intermediate' | 'advanced' | 'expert';

export type InsightType = 'user_need' | 'pain_point' | 'idea' | 'prototype_feedback' | 'validation';
export type Priority = 'low' | 'medium' | 'high';

export type IdeaCategory = 'feature' | 'service' | 'process' | 'business_model' | 'other';
export type IdeaStatus = 'captured' | 'selected' | 'prototyping' | 'testing' | 'implemented' | 'rejected';

export type PrototypeType = 'paper' | 'wireframe' | 'mockup' | 'clickable' | 'functional' | 'mvp';
export type Fidelity = 'low' | 'medium' | 'high';
export type PrototypeStatus = 'in_progress' | 'ready_for_testing' | 'testing' | 'validated' | 'rejected' | 'archived';

export type TestType = 'usability' | 'concept' | 'a_b' | 'preference' | 'card_sorting' | 'tree_testing';
export type TestStatus = 'planning' | 'recruiting' | 'in_progress' | 'analyzing' | 'completed';

export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface DesignThinkingProject {
  id: string;
  customer_id: string;
  business_model_id?: string;
  project_name: string;
  project_objective: string;
  challenge_statement: string;
  target_users?: string;
  current_phase: DTPhase;
  status: DTProjectStatus;
  start_date: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  budget: number;
  spent: number;
  success_metrics: any[];
  team_members: any[];
  stakeholders: string[];
  constraints: string;
  ai_insights: string;
  ai_recommendations: string;
  ai_risk_assessment: string;
  ai_last_analyzed?: string;
  overall_progress: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DTPhaseData {
  id: string;
  project_id: string;
  phase_name: DTPhase;
  phase_objective: string;
  activities: any[];
  methods_used: string[];
  participants_count: number;
  duration_hours?: number;
  key_findings?: string;
  learnings: string;
  challenges: string;
  next_steps: string;
  artifacts: any[];
  completion_status: DTCompletionStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DTInsight {
  id: string;
  project_id: string;
  phase_name: string;
  insight_type?: InsightType;
  title: string;
  description: string;
  source: string;
  priority: Priority;
  related_persona_id?: string;
  is_actionable: boolean;
  action_taken: string;
  tags: string[];
  created_by?: string;
  created_at: string;
}

export interface DTPersona {
  id: string;
  project_id: string;
  persona_name: string;
  persona_type: PersonaType;
  age_range?: string;
  occupation?: string;
  background: string;
  goals: string[];
  frustrations: string[];
  motivations: string[];
  behaviors: string[];
  tech_savviness?: TechSavviness;
  quote?: string;
  is_primary: boolean;
  avatar_url?: string;
  demographics: any;
  created_at: string;
  updated_at: string;
}

export interface DTEmpathyMap {
  id: string;
  project_id: string;
  persona_id?: string;
  map_name: string;
  says: string[];
  thinks: string[];
  does: string[];
  feels: string[];
  pains: string[];
  gains: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DTJourneyMap {
  id: string;
  project_id: string;
  persona_id?: string;
  journey_name: string;
  scenario: string;
  stages: any[];
  touchpoints: any[];
  pain_points: any[];
  opportunities: any[];
  emotions_chart: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DTIdea {
  id: string;
  project_id: string;
  idea_title: string;
  idea_description: string;
  category?: IdeaCategory;
  source?: string;
  feasibility_score?: number;
  desirability_score?: number;
  viability_score?: number;
  effort_estimate?: EffortLevel;
  impact_estimate?: ImpactLevel;
  status: IdeaStatus;
  votes: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DTPrototype {
  id: string;
  project_id: string;
  idea_id?: string;
  prototype_name: string;
  prototype_type: PrototypeType;
  version: string;
  fidelity: Fidelity;
  description: string;
  prototype_url?: string;
  features_included: string[];
  testing_goals: string[];
  status: PrototypeStatus;
  feedback_summary: string;
  iteration_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DTUserTest {
  id: string;
  project_id: string;
  prototype_id?: string;
  test_name: string;
  test_type: TestType;
  test_date: string;
  participants_count: number;
  target_participants?: number;
  test_objectives: string[];
  methodology?: string;
  key_findings: string[];
  success_rate?: number;
  satisfaction_score?: number;
  recommendations: string[];
  status: TestStatus;
  notes: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignThinkingAIInsights {
  overall_assessment: string;
  phase_recommendations: Record<DTPhase, string>;
  user_insights_summary: string;
  empathy_gaps: string[];
  problem_definition_clarity: number;
  ideation_diversity_score: number;
  prototype_recommendations: string[];
  testing_adequacy: string;
  key_opportunities: string[];
  risk_areas: string[];
  next_actions: string[];
  persona_analysis: string;
  journey_insights: string;
  innovation_potential: number;
}

export interface DesignThinkingDashboardData {
  project: DesignThinkingProject;
  phases: DTPhaseData[];
  insights: DTInsight[];
  personas: DTPersona[];
  empathy_maps: DTEmpathyMap[];
  journey_maps: DTJourneyMap[];
  ideas: DTIdea[];
  prototypes: DTPrototype[];
  user_tests: DTUserTest[];
  ai_insights?: DesignThinkingAIInsights;
  progress_by_phase: Record<DTPhase, number>;
}

export const DT_PHASE_LABELS: Record<DTPhase, string> = {
  empathize: 'Empathize: Understand users and their needs',
  define: 'Define: Clearly articulate the problem to solve',
  ideate: 'Ideate: Generate creative solution ideas',
  prototype: 'Prototype: Build tangible representations',
  test: 'Test: Validate solutions with real users',
};

export const DT_PHASE_DESCRIPTIONS: Record<DTPhase, string> = {
  empathize: 'Conduct user research, interviews, observations to understand user needs, pain points, and contexts.',
  define: 'Synthesize research findings to define a clear, actionable problem statement and user needs.',
  ideate: 'Generate a wide range of creative ideas and potential solutions through brainstorming and ideation techniques.',
  prototype: 'Build low to high-fidelity prototypes to explore and test different aspects of solutions.',
  test: 'Test prototypes with real users to gather feedback, validate assumptions, and refine solutions.',
};

export const DT_PHASE_METHODS: Record<DTPhase, string[]> = {
  empathize: [
    'User Interviews',
    'Contextual Inquiry',
    'Shadowing',
    'Diary Studies',
    'Surveys',
    'Focus Groups',
    'Ethnographic Research',
    'Empathy Mapping',
  ],
  define: [
    'Affinity Diagramming',
    'Point of View Statements',
    'How Might We Questions',
    'Persona Creation',
    'Journey Mapping',
    'Problem Framing',
    'User Needs Statements',
  ],
  ideate: [
    'Brainstorming',
    'Brainwriting',
    'SCAMPER',
    'Mind Mapping',
    'Crazy 8s',
    'Reverse Thinking',
    'Analogies',
    'Storyboarding',
  ],
  prototype: [
    'Paper Prototyping',
    'Wireframing',
    'Mockups',
    'Click-through Prototypes',
    'Role Playing',
    'Storyboards',
    'Physical Models',
    'Service Blueprints',
  ],
  test: [
    'Usability Testing',
    'A/B Testing',
    'Concept Testing',
    'Think Aloud Protocol',
    'Heuristic Evaluation',
    'Remote Testing',
    'Preference Testing',
    'First Click Testing',
  ],
};

export const PROTOTYPE_TYPE_LABELS: Record<PrototypeType, string> = {
  paper: 'Paper Prototype (Quick sketches and low-fi)',
  wireframe: 'Wireframe (Structure and layout)',
  mockup: 'Mockup (Visual design)',
  clickable: 'Clickable Prototype (Interactive flow)',
  functional: 'Functional Prototype (Working features)',
  mvp: 'MVP (Minimum Viable Product)',
};

export const TEST_TYPE_LABELS: Record<TestType, string> = {
  usability: 'Usability Testing',
  concept: 'Concept Testing',
  a_b: 'A/B Testing',
  preference: 'Preference Testing',
  card_sorting: 'Card Sorting',
  tree_testing: 'Tree Testing',
};

export const PERSONA_TYPE_LABELS: Record<PersonaType, string> = {
  user: 'User Persona (Primary end-user)',
  customer: 'Customer Persona (Buyer/Decision maker)',
  stakeholder: 'Stakeholder Persona (Influencer)',
  anti_persona: 'Anti-Persona (Not target user)',
};

export interface IdeaScore {
  feasibility: number;
  desirability: number;
  viability: number;
  average: number;
}

export function calculateIdeaScore(idea: DTIdea): IdeaScore {
  const feasibility = idea.feasibility_score || 0;
  const desirability = idea.desirability_score || 0;
  const viability = idea.viability_score || 0;
  const average = (feasibility + desirability + viability) / 3;

  return {
    feasibility,
    desirability,
    viability,
    average: Math.round(average * 10) / 10,
  };
}

export function getEffortImpactPriority(effort: EffortLevel, impact: ImpactLevel): Priority {
  if (effort === 'low' && impact === 'high') return 'high';
  if (effort === 'low' && impact === 'medium') return 'high';
  if (effort === 'medium' && impact === 'high') return 'high';
  if (effort === 'medium' && impact === 'medium') return 'medium';
  if (effort === 'high' && impact === 'high') return 'medium';
  return 'low';
}
