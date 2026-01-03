import type {
  ChangeInitiativeWithDetails,
  ADKARStage,
  ADKARAIInsight,
  ADKARReadinessAnalysis,
  ADKARStageProgress,
  ADKARChangeImpactAnalysis,
  ADKARBestPractice,
  ADKARBarrierAnalysis,
  ADKARCommunicationPlan,
  ADKARTrainingPlan,
  ADKARReinforcementStrategy,
  CompletionStatus,
  ImpactLevel
} from './enterprise-types';
import { aiService } from './ai-service';

export const adkarAIService = {
  async generateADKARInsights(
    initiative: ChangeInitiativeWithDetails,
    industry?: string
  ): Promise<ADKARAIInsight[]> {
    const prompt = `
Du är en erfaren Change Management-konsult och expert på ADKAR-modellen. Analysera följande förändringsinitiativ och generera insikter för alla 5 ADKAR-steg.

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description || 'Ingen beskrivning'}
TYP: ${initiative.change_type || 'Ej specificerad'}
SCOPE: ${initiative.scope || 'Ej specificerad'}
STATUS: ${initiative.status}
PROGRESS: ${initiative.overall_progress || 0}%
${industry ? `BRANSCH: ${industry}` : ''}

ADKAR ASSESSMENTS:
${initiative.assessments.map(a => `
${this.getStageName(a.stage)}:
- Score: ${a.score || 0}/100
- Status: ${a.completion_status || 'not_started'}
- Notes: ${a.assessment_notes || 'Inga anteckningar'}
- Barriers: ${(a.barriers || []).join(', ') || 'Inga identifierade'}
- Actions Required: ${(a.actions_required || []).join(', ') || 'Inga definierade'}
- Actions (${a.actions.length}):
${a.actions.map(action => `  * ${action.action_title} (${action.status})`).join('\n')}
`).join('\n')}

För varje ADKAR-steg, generera 1-3 insikter med:
- Insight Type (strength, weakness, barrier, action, warning, opportunity)
- Titel (koncis och tydlig)
- Beskrivning (detaljerad analys)
- Priority (critical, high, medium, low)
- Confidence (0-100)
- Impact Score (0-10)
- Recommendations (3-5 konkreta förslag)
- Suggested Actions (konkreta actions med priority, effort, impact)
- Barriers Identified (specifika hinder)
- Success Factors (framgångsfaktorer)
- Related OKR Suggestions (objectives och key results)

Fokusera på:
1. AWARENESS: Förstår organisationen VARFÖR förändringen behövs?
2. DESIRE: Finns det VILJA att delta och stödja förändringen?
3. KNOWLEDGE: Har medarbetarna KUNSKAP om hur man genomför förändringen?
4. ABILITY: Kan medarbetarna faktiskt UTFÖRA förändringen?
5. REINFORCEMENT: Finns det system för att FÖRSTÄRKA och bibehålla förändringen?

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      const insights = this.parseAIResponse(response);
      return insights;
    } catch (error) {
      console.error('Error generating ADKAR insights:', error);
      return this.getFallbackInsights();
    }
  },

  async analyzeReadiness(
    initiative: ChangeInitiativeWithDetails
  ): Promise<ADKARReadinessAnalysis> {
    const prompt = `
Genomför en fullständig readiness-analys av detta förändringsinitiativ:

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}
STATUS: ${initiative.status}

${initiative.assessments.map(a => `
${this.getStageName(a.stage)}:
Score: ${a.score || 0}/100
Barriers: ${(a.barriers || []).join(', ')}
Actions: ${a.actions.length} (${a.actions.filter(ac => ac.status === 'completed').length} completed)
`).join('\n')}

Analysera och ge:
1. Overall Readiness Score (0-100, övergripande beredskap)
2. Readiness Level (low, medium, high, very_high)
3. Stage Scores (per stage: score, status, completion_percentage, barriers_count, actions_count, completed_actions)
4. Bottleneck Stage (vilket steg är den största flaskhalsen?)
5. Strongest Stage (vilket steg fungerar bäst?)
6. Critical Barriers (största hindren med mitigation suggestions)
7. Key Findings (viktiga upptäckter)
8. Risk Assessment (overall_risk, risk_factors med mitigation)
9. Recommended Next Steps (prioriterade actions med rationale och timeline)

ADKAR-principen: Förändring kan inte gå vidare till nästa steg förrän föregående steg är klart.
- Om Awareness (medvetenhet) är låg, kan Desire (vilja) inte byggas
- Om Desire är låg, hjälper inte Knowledge (kunskap)
- Om Knowledge är låg, kan Ability (förmåga) inte utvecklas
- Om Ability är låg, kan Reinforcement (förstärkning) inte fungera

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseReadinessAnalysis(response, initiative.id);
    } catch (error) {
      console.error('Error analyzing readiness:', error);
      return this.getFallbackReadinessAnalysis(initiative.id);
    }
  },

  async analyzeStageProgress(
    initiative: ChangeInitiativeWithDetails,
    stage: ADKARStage
  ): Promise<ADKARStageProgress> {
    const assessment = initiative.assessments.find(a => a.stage === stage);

    if (!assessment) {
      return {
        stage,
        stage_name: this.getStageName(stage),
        score: 0,
        completion_percentage: 0,
        status: 'not_started',
        barriers: [],
        actions_total: 0,
        actions_completed: 0,
        actions_in_progress: 0,
        actions_not_started: 0,
        is_on_track: false,
        blockers: []
      };
    }

    const actionsCounts = {
      total: assessment.actions.length,
      completed: assessment.actions.filter(a => a.status === 'completed').length,
      in_progress: assessment.actions.filter(a => a.status === 'in_progress').length,
      not_started: assessment.actions.filter(a => a.status === 'not_started').length,
      blocked: assessment.actions.filter(a => a.status === 'blocked').length
    };

    const completionPercentage = actionsCounts.total > 0
      ? (actionsCounts.completed / actionsCounts.total) * 100
      : 0;

    const blockers = assessment.actions
      .filter(a => a.status === 'blocked')
      .map(a => ({
        description: a.action_title,
        severity: a.impact_level || 'medium' as ImpactLevel,
        resolution_status: 'open' as const
      }));

    const isOnTrack = (assessment.score || 0) >= 70 && blockers.length === 0;

    return {
      stage,
      stage_name: this.getStageName(stage),
      score: assessment.score || 0,
      completion_percentage: Math.round(completionPercentage),
      status: assessment.completion_status || 'not_started',
      barriers: assessment.barriers || [],
      actions_total: actionsCounts.total,
      actions_completed: actionsCounts.completed,
      actions_in_progress: actionsCounts.in_progress,
      actions_not_started: actionsCounts.not_started,
      is_on_track: isOnTrack,
      blockers
    };
  },

  async analyzeChangeImpact(
    initiative: ChangeInitiativeWithDetails,
    organizationSize?: number
  ): Promise<ADKARChangeImpactAnalysis> {
    const prompt = `
Analysera förändringens påverkan på organisationen:

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}
TYP: ${initiative.change_type}
SCOPE: ${initiative.scope}
${organizationSize ? `ORGANISATION STORLEK: ${organizationSize} anställda` : ''}

Analysera:
1. Affected Stakeholders (grupper, storlek, impact_level, readiness_score, concerns, engagement_strategy)
2. Organizational Impact (area, impact_type, magnitude, description, mitigation_required)
3. Resistance Forecast (level, sources, strategies)
4. Success Probability (0-100)
5. Timeline Feasibility (realistic, tight, unrealistic)

Impact Types:
- process: Procedurmässiga förändringar
- structure: Organisationsstruktur
- culture: Företagskultur
- technology: Tekniska system
- skills: Kompetens & färdigheter

Impact Magnitude:
- minor: Mindre justeringar
- moderate: Medelstora förändringar
- major: Stora förändringar
- transformative: Transformativa förändringar

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseChangeImpactAnalysis(response, initiative.id);
    } catch (error) {
      console.error('Error analyzing change impact:', error);
      return this.getFallbackChangeImpactAnalysis(initiative.id);
    }
  },

  async suggestBestPractices(
    stage: ADKARStage,
    industry?: string
  ): Promise<ADKARBestPractice[]> {
    const prompt = `
Föreslå best practices för ${this.getStageName(stage)}-steget i ADKAR:

STAGE: ${stage}
${industry ? `BRANSCH: ${industry}` : ''}

För ${this.getStageName(stage)}, ge 3-5 best practices med:
- Practice Title
- Description
- Category (communication, training, coaching, reinforcement, leadership)
- Implementation Steps (steg-för-steg)
- Expected Outcomes (förväntade resultat)
- Estimated Effort (low, medium, high)
- Success Rate (0-100)
- Industry Examples (om tillgängliga)

Fokusera på beprövade metoder som har hög success rate.

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBestPractices(response, stage);
    } catch (error) {
      console.error('Error suggesting best practices:', error);
      return [];
    }
  },

  async analyzeBarriers(
    initiative: ChangeInitiativeWithDetails,
    stage: ADKARStage
  ): Promise<ADKARBarrierAnalysis[]> {
    const assessment = initiative.assessments.find(a => a.stage === stage);

    if (!assessment || !assessment.barriers || assessment.barriers.length === 0) {
      return [];
    }

    const prompt = `
Analysera barriärerna för ${this.getStageName(stage)}-steget:

INITIATIVE: ${initiative.title}
STAGE: ${stage}
BARRIERS:
${assessment.barriers.map((b, i) => `${i + 1}. ${b}`).join('\n')}

För varje barriär, analysera:
- Barrier Type (cultural, structural, technical, skill_based, motivational, resource)
- Description (detaljerad beskrivning)
- Severity (critical, high, medium, low)
- Affected Stakeholders (vilka grupper påverkas)
- Root Causes (grundorsaker)
- Mitigation Strategies (strategier för att hantera, med effectiveness, timeframe, resources_required)
- Related Barriers (andra relaterade barriärer)

Returnera i JSON-format som en array.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBarrierAnalysis(response, initiative.id, stage);
    } catch (error) {
      console.error('Error analyzing barriers:', error);
      return [];
    }
  },

  async generateCommunicationPlan(
    initiative: ChangeInitiativeWithDetails,
    stage: ADKARStage
  ): Promise<ADKARCommunicationPlan> {
    const prompt = `
Skapa en kommunikationsplan för ${this.getStageName(stage)}-steget:

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}
STAGE: ${stage}

För ${this.getStageName(stage)}, skapa:
1. Messages (per stakeholder-grupp):
   - Audience (målgrupp)
   - Key Message (huvudbudskap)
   - Delivery Method (metod)
   - Frequency (hur ofta)
   - Messenger (vem levererar)
   - Timing (när)

2. Communication Objectives (mål med kommunikationen)
3. Feedback Mechanisms (hur samla in feedback)
4. Success Metrics (hur mäta framgång)

Stage-specifika fokus:
- AWARENESS: Kommunicera VARFÖR förändringen behövs
- DESIRE: Skapa motivation och visa fördelar
- KNOWLEDGE: Utbilda och informera om HUR
- ABILITY: Support och coaching
- REINFORCEMENT: Fira framgångar och påminn om fördelar

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseCommunicationPlan(response, initiative.id, stage);
    } catch (error) {
      console.error('Error generating communication plan:', error);
      return this.getFallbackCommunicationPlan(initiative.id, stage);
    }
  },

  async generateTrainingPlan(
    initiative: ChangeInitiativeWithDetails,
    stage: 'knowledge' | 'ability'
  ): Promise<ADKARTrainingPlan> {
    const prompt = `
Skapa en utbildningsplan för ${this.getStageName(stage)}-steget:

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}
STAGE: ${stage}

Skapa:
1. Training Modules:
   - Module Name
   - Objectives (lärandemål)
   - Target Audience (målgrupp)
   - Delivery Method (classroom, online, hands_on, coaching, hybrid)
   - Duration
   - Prerequisites (om några)
   - Success Criteria (framgångskriterier)

2. Skill Gaps:
   - Skill (kompetens)
   - Current Level (none, basic, intermediate, advanced)
   - Required Level (basic, intermediate, advanced, expert)
   - Training Path (steg för att nå målet)

3. Assessment Methods (hur utvärdera lärande)

${stage === 'knowledge' ? 'KNOWLEDGE: Fokusera på att förmedla INFORMATION och KUNSKAP' : 'ABILITY: Fokusera på praktisk TILLÄMPNING och FÄRDIGHETER'}

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseTrainingPlan(response, initiative.id, stage);
    } catch (error) {
      console.error('Error generating training plan:', error);
      return this.getFallbackTrainingPlan(initiative.id, stage);
    }
  },

  async generateReinforcementStrategy(
    initiative: ChangeInitiativeWithDetails
  ): Promise<ADKARReinforcementStrategy> {
    const prompt = `
Skapa en reinforcement-strategi för att säkerställa långsiktig framgång:

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}

Skapa:
1. Reinforcement Mechanisms:
   - Mechanism Type (recognition, reward, accountability, measurement, feedback)
   - Description (beskrivning)
   - Frequency (hur ofta)
   - Responsibility (vem ansvarar)
   - Success Indicators (framgångsindikatorer)

2. Sustainability Plan:
   - Action (åtgärd)
   - Timeline (tidsplan)
   - Ownership (ansvarig)
   - Monitoring Method (uppföljningsmetod)

3. Regression Risk Mitigation:
   - Risk (risk för återfall)
   - Likelihood (low, medium, high)
   - Mitigation (hur förhindra)

REINFORCEMENT-principen:
- Fira framgångar
- Belöna önskat beteende
- Påminn om fördelar
- Korrigera avvikelser tidigt
- Mät och följ upp kontinuerligt

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseReinforcementStrategy(response, initiative.id);
    } catch (error) {
      console.error('Error generating reinforcement strategy:', error);
      return this.getFallbackReinforcementStrategy(initiative.id);
    }
  },

  async generateOKRsFromADKAR(
    initiative: ChangeInitiativeWithDetails
  ): Promise<Array<{
    objective: string;
    stage: ADKARStage;
    key_results: string[];
    rationale: string;
  }>> {
    const prompt = `
Baserat på detta förändringsinitiativ, generera 5-8 OKR (per ADKAR-steg):

INITIATIVE: ${initiative.title}
BESKRIVNING: ${initiative.description}

${initiative.assessments.map(a => `
${this.getStageName(a.stage)}:
Score: ${a.score || 0}/100
Barriers: ${(a.barriers || []).join(', ')}
`).join('\n')}

För varje ADKAR-steg, skapa relevanta OKR:
- Objective (inspirerande och tydligt mål)
- Stage (vilket ADKAR-steg)
- Key Results (3-4 mätbara resultat)
- Rationale (varför detta är viktigt för detta steg)

Exempel:
AWARENESS:
- Objective: "Skapa förståelse för varför vi förändras"
  KR: "90% av medarbetarna kan förklara varför förändringen behövs"
  KR: "Genomföra 5 kommunikationsworkshops"
  KR: "NPS för förändringskommunikation > 50"

DESIRE:
- Objective: "Bygga vilja och motivation för förändringen"
  KR: "80% av medarbetarna är positiva till förändringen"
  KR: "Identifiera och aktivera 20 change champions"

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseOKRSuggestions(response);
    } catch (error) {
      console.error('Error generating OKRs:', error);
      return [];
    }
  },

  getStageName(stage: ADKARStage): string {
    const names: Record<ADKARStage, string> = {
      awareness: 'Awareness (Medvetenhet)',
      desire: 'Desire (Önskan)',
      knowledge: 'Knowledge (Kunskap)',
      ability: 'Ability (Förmåga)',
      reinforcement: 'Reinforcement (Förstärkning)'
    };
    return names[stage];
  },

  getStageIcon(stage: ADKARStage): string {
    const icons: Record<ADKARStage, string> = {
      awareness: '💡',
      desire: '❤️',
      knowledge: '📚',
      ability: '⚡',
      reinforcement: '🎯'
    };
    return icons[stage];
  },

  getStageColor(stage: ADKARStage): string {
    const colors: Record<ADKARStage, string> = {
      awareness: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      desire: 'bg-red-50 border-red-200 text-red-700',
      knowledge: 'bg-blue-50 border-blue-200 text-blue-700',
      ability: 'bg-green-50 border-green-200 text-green-700',
      reinforcement: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[stage];
  },

  getCompletionStatusLabel(status: CompletionStatus): string {
    const labels: Record<CompletionStatus, string> = {
      not_started: 'Ej påbörjat',
      in_progress: 'Pågående',
      completed: 'Klart',
      needs_attention: 'Behöver uppmärksamhet'
    };
    return labels[status];
  },

  getCompletionStatusColor(status: CompletionStatus): string {
    const colors: Record<CompletionStatus, string> = {
      not_started: 'text-gray-600 bg-gray-50',
      in_progress: 'text-blue-600 bg-blue-50',
      completed: 'text-green-600 bg-green-50',
      needs_attention: 'text-red-600 bg-red-50'
    };
    return colors[status];
  },

  parseAIResponse(response: string): ADKARAIInsight[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    return [];
  },

  parseReadinessAnalysis(response: string, initiativeId: string): ADKARReadinessAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          initiative_id: initiativeId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing readiness analysis:', error);
    }
    return this.getFallbackReadinessAnalysis(initiativeId);
  },

  parseChangeImpactAnalysis(response: string, initiativeId: string): ADKARChangeImpactAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          initiative_id: initiativeId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing change impact analysis:', error);
    }
    return this.getFallbackChangeImpactAnalysis(initiativeId);
  },

  parseBestPractices(response: string, stage: ADKARStage): ADKARBestPractice[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const practices = JSON.parse(jsonMatch[0]);
        return practices.map((p: any) => ({ ...p, stage }));
      }
    } catch (error) {
      console.error('Error parsing best practices:', error);
    }
    return [];
  },

  parseBarrierAnalysis(response: string, initiativeId: string, stage: ADKARStage): ADKARBarrierAnalysis[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const barriers = JSON.parse(jsonMatch[0]);
        return barriers.map((b: any) => ({
          initiative_id: initiativeId,
          stage,
          ...b
        }));
      }
    } catch (error) {
      console.error('Error parsing barrier analysis:', error);
    }
    return [];
  },

  parseCommunicationPlan(response: string, initiativeId: string, stage: ADKARStage): ADKARCommunicationPlan {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          initiative_id: initiativeId,
          stage,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing communication plan:', error);
    }
    return this.getFallbackCommunicationPlan(initiativeId, stage);
  },

  parseTrainingPlan(response: string, initiativeId: string, stage: 'knowledge' | 'ability'): ADKARTrainingPlan {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          initiative_id: initiativeId,
          stage,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing training plan:', error);
    }
    return this.getFallbackTrainingPlan(initiativeId, stage);
  },

  parseReinforcementStrategy(response: string, initiativeId: string): ADKARReinforcementStrategy {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          initiative_id: initiativeId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing reinforcement strategy:', error);
    }
    return this.getFallbackReinforcementStrategy(initiativeId);
  },

  parseOKRSuggestions(response: string): any[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing OKR suggestions:', error);
    }
    return [];
  },

  getFallbackInsights(): ADKARAIInsight[] {
    return [
      {
        stage: 'awareness',
        insight_type: 'action',
        title: 'Öka medvetenheten om förändringen',
        description: 'Kommunicera tydligt varför förändringen är nödvändig.',
        priority: 'high',
        confidence: 75,
        impact_score: 8,
        recommendations: [
          'Genomför kommunikationsworkshops',
          'Skapa FAQ-dokument',
          'Arrangera Q&A-sessioner'
        ],
        suggested_actions: []
      }
    ];
  },

  getFallbackReadinessAnalysis(initiativeId: string): ADKARReadinessAnalysis {
    return {
      initiative_id: initiativeId,
      overall_readiness_score: 50,
      readiness_level: 'medium',
      stage_scores: {
        awareness: { score: 60, status: 'good', completion_percentage: 60, barriers_count: 0, actions_count: 0, completed_actions: 0 },
        desire: { score: 50, status: 'needs_work', completion_percentage: 50, barriers_count: 0, actions_count: 0, completed_actions: 0 },
        knowledge: { score: 40, status: 'needs_work', completion_percentage: 40, barriers_count: 0, actions_count: 0, completed_actions: 0 },
        ability: { score: 30, status: 'critical', completion_percentage: 30, barriers_count: 0, actions_count: 0, completed_actions: 0 },
        reinforcement: { score: 20, status: 'critical', completion_percentage: 20, barriers_count: 0, actions_count: 0, completed_actions: 0 }
      },
      critical_barriers: [],
      key_findings: ['Kräver detaljerad analys'],
      risk_assessment: {
        overall_risk: 'medium',
        risk_factors: []
      },
      recommended_next_steps: []
    };
  },

  getFallbackChangeImpactAnalysis(initiativeId: string): ADKARChangeImpactAnalysis {
    return {
      initiative_id: initiativeId,
      affected_stakeholders: [],
      organizational_impact: [],
      resistance_forecast: {
        level: 'medium',
        sources: [],
        strategies: []
      },
      success_probability: 60,
      timeline_feasibility: 'realistic'
    };
  },

  getFallbackCommunicationPlan(initiativeId: string, stage: ADKARStage): ADKARCommunicationPlan {
    return {
      initiative_id: initiativeId,
      stage,
      messages: [],
      communication_objectives: [],
      feedback_mechanisms: [],
      success_metrics: []
    };
  },

  getFallbackTrainingPlan(initiativeId: string, stage: 'knowledge' | 'ability'): ADKARTrainingPlan {
    return {
      initiative_id: initiativeId,
      stage,
      training_modules: [],
      skill_gaps: [],
      assessment_methods: []
    };
  },

  getFallbackReinforcementStrategy(initiativeId: string): ADKARReinforcementStrategy {
    return {
      initiative_id: initiativeId,
      reinforcement_mechanisms: [],
      sustainability_plan: [],
      regression_risk_mitigation: []
    };
  }
};
