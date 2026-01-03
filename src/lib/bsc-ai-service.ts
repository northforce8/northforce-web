import type {
  BalancedScorecardWithDetails,
  BSCPerspectiveType,
  BSCAIInsight,
  BSCPerformanceAnalysis,
  BSCMetricProgress,
  BSCCausalRelationship,
  BSCStrategicTheme,
  BSCBenchmarkComparison,
  BSCMetric
} from './enterprise-types';
import { aiService } from './ai-service';

export const bscAIService = {
  async generateBSCInsights(
    scorecard: BalancedScorecardWithDetails,
    industry?: string
  ): Promise<BSCAIInsight[]> {
    const prompt = `
Du är en erfaren strategikonsult och expert på Balanced Scorecard (BSC). Analysera följande scorecard och generera insikter för de 4 perspektiven.

SCORECARD: ${scorecard.title}
TIDSPERIOD: ${scorecard.time_period}
VISION: ${scorecard.vision || 'Ej specificerad'}
STRATEGI: ${scorecard.strategy || 'Ej specificerad'}
${industry ? `BRANSCH: ${industry}` : ''}

PERSPEKTIV & METRICS:
${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
- Mål: ${p.objective}
- Beskrivning: ${p.description || 'Ingen beskrivning'}
- Metrics (${p.metrics.length}):
${p.metrics.map(m => `  * ${m.metric_name}: ${m.current_value || 0}/${m.target_value || 0} ${m.unit || ''} (Status: ${m.status || 'not_started'})`).join('\n')}
`).join('\n')}

För varje perspektiv, generera 2-4 insikter med:
- Insight Type (strength, weakness, opportunity, action, warning)
- Titel (koncis och tydlig)
- Beskrivning (detaljerad analys)
- Priority (critical, high, medium, low)
- Confidence (0-100)
- Impact Score (0-10, hur viktigt)
- Recommendations (3-5 konkreta förslag)
- Related Metrics (vilka metrics detta påverkar)
- Related OKR Suggestions (objectives och key results)
- Data Source

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      const insights = this.parseAIResponse(response);
      return insights;
    } catch (error) {
      console.error('Error generating BSC insights:', error);
      return this.getFallbackInsights();
    }
  },

  async analyzePerformance(
    scorecard: BalancedScorecardWithDetails
  ): Promise<BSCPerformanceAnalysis> {
    const prompt = `
Genomför en fullständig performance-analys av denna Balanced Scorecard:

SCORECARD: ${scorecard.title}
VISION: ${scorecard.vision || 'Ej specificerad'}

${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
Mål: ${p.objective}
Metrics:
${p.metrics.map(m => `- ${m.metric_name}: ${m.current_value || 0}/${m.target_value || 0} (${m.status})`).join('\n')}
`).join('\n')}

Analysera och ge:
1. Overall Health Score (0-100, övergripande hälsa)
2. Perspective Scores (per perspektiv: score, status, trend, at_risk_metrics, achieved_metrics, total_metrics)
3. Balance Score (0-100, hur balanserat är det)
4. Strategic Alignment Score (0-100, alignment med vision/strategi)
5. Leading Indicators (metrics som förutsäger framtida resultat)
6. Lagging Indicators (metrics som mäter historiska resultat)
7. Key Findings (viktiga upptäckter)
8. Strategic Recommendations (prioriterade rekommendationer med effort)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parsePerformanceAnalysis(response, scorecard.id);
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return this.getFallbackPerformanceAnalysis(scorecard.id);
    }
  },

  async identifyCausalRelationships(
    scorecard: BalancedScorecardWithDetails
  ): Promise<BSCCausalRelationship[]> {
    const prompt = `
Identifiera kausala relationer mellan metrics i denna Balanced Scorecard.

BSC-principen: Learning & Growth → Internal Process → Customer → Financial

SCORECARD: ${scorecard.title}

${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
${p.metrics.map(m => `- ${m.metric_name} (${m.current_value || 0}/${m.target_value || 0})`).join('\n')}
`).join('\n')}

Identifiera:
1. Kausala relationer mellan metrics i olika perspektiv
2. Relationship Type (drives, influences, enables, depends_on)
3. Strength (strong, moderate, weak)
4. Description (förklaring av relationen)
5. Validated (true/false baserat på data)

Exempel:
- "Medarbetartillfredsställelse" (Learning & Growth) → drives → "Kvalitet på service" (Internal Process)
- "Kvalitet på service" (Internal Process) → influences → "Kundnöjdhet" (Customer)
- "Kundnöjdhet" (Customer) → drives → "Återkommande intäkter" (Financial)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseCausalRelationships(response);
    } catch (error) {
      console.error('Error identifying causal relationships:', error);
      return [];
    }
  },

  async suggestStrategicThemes(
    scorecard: BalancedScorecardWithDetails
  ): Promise<BSCStrategicTheme[]> {
    const prompt = `
Baserat på denna Balanced Scorecard, föreslå 3-5 strategiska teman som kopplar samman olika perspektiv.

SCORECARD: ${scorecard.title}
VISION: ${scorecard.vision || 'Ej specificerad'}
STRATEGI: ${scorecard.strategy || 'Ej specificerad'}

${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
Mål: ${p.objective}
Metrics: ${p.metrics.map(m => m.metric_name).join(', ')}
`).join('\n')}

För varje tema, ge:
- Theme Name (kort och beskrivande)
- Description (vad temat handlar om)
- Perspectives (vilka perspektiv det berör)
- Objectives (vilka mål det kopplar till)
- Metrics (vilka metrics som ingår)
- Alignment Score (0-100, hur väl alignat)
- Priority (critical, high, medium, low)

Exempel på teman:
- "Kundupplevelse" (Customer + Internal Process)
- "Operational Excellence" (Internal Process + Financial)
- "Innovation & Growth" (Learning & Growth + Customer)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseStrategicThemes(response);
    } catch (error) {
      console.error('Error suggesting strategic themes:', error);
      return [];
    }
  },

  async generateOKRsFromBSC(
    scorecard: BalancedScorecardWithDetails
  ): Promise<Array<{
    objective: string;
    category: string;
    key_results: string[];
    rationale: string;
    perspective: BSCPerspectiveType;
    related_metrics: string[];
  }>> {
    const prompt = `
Baserat på denna Balanced Scorecard, generera 6-8 OKR (Objectives & Key Results):

SCORECARD: ${scorecard.title}
VISION: ${scorecard.vision || 'Ej specificerad'}

${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
Mål: ${p.objective}
Metrics: ${p.metrics.map(m => `${m.metric_name} (${m.current_value}/${m.target_value})`).join(', ')}
`).join('\n')}

För varje OKR, inkludera:
- Objective (inspirerande och tydligt mål)
- Category (financial, customer, process, learning)
- Key Results (3-4 mätbara resultat baserade på BSC metrics)
- Rationale (varför detta är viktigt)
- Perspective (vilket BSC-perspektiv)
- Related Metrics (vilka BSC metrics detta kopplar till)

Skapa OKR från alla 4 perspektiv för balans.

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

  async compareWithBenchmarks(
    scorecard: BalancedScorecardWithDetails,
    industry: string
  ): Promise<BSCBenchmarkComparison> {
    const prompt = `
Jämför denna Balanced Scorecard med branschgenomsnitt och best practices:

BRANSCH: ${industry}
SCORECARD: ${scorecard.title}

${scorecard.perspectives.map(p => `
${this.getPerspectiveName(p.perspective_type)}:
${p.metrics.map(m => `- ${m.metric_name}: ${m.current_value || 0}/${m.target_value || 0}`).join('\n')}
`).join('\n')}

Ge:
1. Perspective Benchmarks (per perspektiv):
   - Company Score (0-100)
   - Industry Average (0-100)
   - Industry Top Quartile (0-100)
   - Percentile Rank (0-100)
   - Gap to Average
   - Gap to Top Quartile

2. Key Strengths (områden där företaget är över genomsnittet)
3. Key Gaps (områden med förbättringspotential)
4. Improvement Opportunities (konkreta förbättringsmöjligheter med:
   - Perspective
   - Area
   - Current Performance
   - Benchmark Target
   - Potential Gain
   - Recommended Actions)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBenchmarkComparison(response, scorecard.id);
    } catch (error) {
      console.error('Error comparing with benchmarks:', error);
      return this.getFallbackBenchmarkComparison(scorecard.id, industry);
    }
  },

  async suggestMetricImprovements(
    perspectiveType: BSCPerspectiveType,
    currentMetrics: BSCMetric[],
    industry?: string
  ): Promise<{
    suggested_metrics: Array<{
      metric_name: string;
      description: string;
      unit: string;
      target_value: number;
      measurement_frequency: string;
      rationale: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
    }>;
    improvement_recommendations: string[];
  }> {
    const prompt = `
Föreslå förbättringar för metrics i ${this.getPerspectiveName(perspectiveType)}-perspektivet:

${industry ? `BRANSCH: ${industry}` : ''}

NUVARANDE METRICS:
${currentMetrics.map(m => `- ${m.metric_name}: ${m.current_value}/${m.target_value} ${m.unit || ''}`).join('\n')}

Analysera och ge:
1. Suggested Metrics (nya metrics att lägga till):
   - Metric Name
   - Description
   - Unit
   - Target Value (realistiskt)
   - Measurement Frequency (daily, weekly, monthly, quarterly)
   - Rationale (varför denna metric är viktig)
   - Priority

2. Improvement Recommendations (för befintliga metrics)

Fokusera på:
- Leading indicators (förutsägande metrics)
- Lagging indicators (resultatmätning)
- Balans mellan de två

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseMetricImprovements(response);
    } catch (error) {
      console.error('Error suggesting metric improvements:', error);
      return {
        suggested_metrics: [],
        improvement_recommendations: []
      };
    }
  },

  async calculateMetricProgress(
    metrics: BSCMetric[]
  ): Promise<BSCMetricProgress[]> {
    return metrics.map(metric => {
      const currentValue = metric.current_value || 0;
      const targetValue = metric.target_value || 0;
      const previousValue = 0;

      let progressPercentage = 0;
      let variance = 0;
      let variancePercentage = 0;

      if (targetValue > 0) {
        progressPercentage = (currentValue / targetValue) * 100;
        variance = currentValue - targetValue;
        variancePercentage = (variance / targetValue) * 100;
      }

      let status: typeof metric.status = 'not_started';
      if (progressPercentage >= 100) {
        status = 'achieved';
      } else if (progressPercentage >= 80) {
        status = 'on_track';
      } else if (progressPercentage >= 60) {
        status = 'at_risk';
      } else if (progressPercentage > 0) {
        status = 'off_track';
      }

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (previousValue > 0) {
        if (currentValue > previousValue) trend = 'improving';
        else if (currentValue < previousValue) trend = 'declining';
      }

      return {
        metric_id: metric.id,
        metric_name: metric.metric_name,
        perspective_type: 'financial' as BSCPerspectiveType,
        current_value: currentValue,
        target_value: targetValue,
        previous_value: previousValue,
        progress_percentage: Math.round(progressPercentage),
        status: status || 'not_started',
        variance,
        variance_percentage: Math.round(variancePercentage),
        trend
      };
    });
  },

  getPerspectiveName(perspectiveType: BSCPerspectiveType): string {
    const names: Record<BSCPerspectiveType, string> = {
      financial: 'Finansiellt Perspektiv',
      customer: 'Kundperspektiv',
      internal_process: 'Interna Processer',
      learning_growth: 'Lärande & Tillväxt'
    };
    return names[perspectiveType];
  },

  getPerspectiveIcon(perspectiveType: BSCPerspectiveType): string {
    const icons: Record<BSCPerspectiveType, string> = {
      financial: '💰',
      customer: '👥',
      internal_process: '⚙️',
      learning_growth: '📚'
    };
    return icons[perspectiveType];
  },

  getPerspectiveColor(perspectiveType: BSCPerspectiveType): string {
    const colors: Record<BSCPerspectiveType, string> = {
      financial: 'bg-green-50 border-green-200 text-green-700',
      customer: 'bg-blue-50 border-blue-200 text-blue-700',
      internal_process: 'bg-orange-50 border-orange-200 text-orange-700',
      learning_growth: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[perspectiveType];
  },

  getMetricStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      on_track: 'På spår',
      at_risk: 'I riskzonen',
      off_track: 'Ej på spår',
      achieved: 'Uppnått',
      not_started: 'Ej påbörjat'
    };
    return labels[status] || status;
  },

  getMetricStatusColor(status: string): string {
    const colors: Record<string, string> = {
      on_track: 'text-green-600 bg-green-50',
      at_risk: 'text-yellow-600 bg-yellow-50',
      off_track: 'text-red-600 bg-red-50',
      achieved: 'text-blue-600 bg-blue-50',
      not_started: 'text-gray-600 bg-gray-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  },

  parseAIResponse(response: string): BSCAIInsight[] {
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

  parsePerformanceAnalysis(response: string, scorecardId: string): BSCPerformanceAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          scorecard_id: scorecardId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing performance analysis:', error);
    }
    return this.getFallbackPerformanceAnalysis(scorecardId);
  },

  parseCausalRelationships(response: string): BSCCausalRelationship[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing causal relationships:', error);
    }
    return [];
  },

  parseStrategicThemes(response: string): BSCStrategicTheme[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing strategic themes:', error);
    }
    return [];
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

  parseBenchmarkComparison(response: string, scorecardId: string): BSCBenchmarkComparison {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          scorecard_id: scorecardId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing benchmark comparison:', error);
    }
    return this.getFallbackBenchmarkComparison(scorecardId, 'Unknown');
  },

  parseMetricImprovements(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing metric improvements:', error);
    }
    return {
      suggested_metrics: [],
      improvement_recommendations: []
    };
  },

  getFallbackInsights(): BSCAIInsight[] {
    return [
      {
        perspective_type: 'financial',
        insight_type: 'action',
        title: 'Förbättra kostnadseffektivitet',
        description: 'Fokusera på att optimera kostnadsstrukturen för att förbättra lönsamheten.',
        priority: 'high',
        confidence: 75,
        impact_score: 8,
        recommendations: [
          'Analysera största kostnadsdrivare',
          'Identifiera besparingsmöjligheter',
          'Implementera kostnadsuppföljning'
        ],
        data_source: 'performance_data'
      }
    ];
  },

  getFallbackPerformanceAnalysis(scorecardId: string): BSCPerformanceAnalysis {
    return {
      scorecard_id: scorecardId,
      overall_health_score: 60,
      perspective_scores: {
        financial: { score: 65, status: 'good', trend: 'stable', at_risk_metrics: 0, achieved_metrics: 0, total_metrics: 0 },
        customer: { score: 70, status: 'good', trend: 'improving', at_risk_metrics: 0, achieved_metrics: 0, total_metrics: 0 },
        internal_process: { score: 55, status: 'fair', trend: 'stable', at_risk_metrics: 0, achieved_metrics: 0, total_metrics: 0 },
        learning_growth: { score: 50, status: 'fair', trend: 'declining', at_risk_metrics: 0, achieved_metrics: 0, total_metrics: 0 }
      },
      balance_score: 65,
      strategic_alignment_score: 70,
      leading_indicators: [],
      lagging_indicators: [],
      key_findings: ['Kräver detaljerad analys'],
      strategic_recommendations: []
    };
  },

  getFallbackBenchmarkComparison(scorecardId: string, industry: string): BSCBenchmarkComparison {
    return {
      scorecard_id: scorecardId,
      industry,
      comparison_date: new Date().toISOString(),
      perspective_benchmarks: {
        financial: { company_score: 60, industry_average: 65, industry_top_quartile: 85, percentile_rank: 45, gap_to_average: -5, gap_to_top_quartile: -25 },
        customer: { company_score: 70, industry_average: 68, industry_top_quartile: 88, percentile_rank: 55, gap_to_average: 2, gap_to_top_quartile: -18 },
        internal_process: { company_score: 55, industry_average: 62, industry_top_quartile: 82, percentile_rank: 40, gap_to_average: -7, gap_to_top_quartile: -27 },
        learning_growth: { company_score: 50, industry_average: 60, industry_top_quartile: 80, percentile_rank: 35, gap_to_average: -10, gap_to_top_quartile: -30 }
      },
      key_strengths: ['Kundnöjdhet över genomsnittet'],
      key_gaps: ['Lärande & Tillväxt behöver förbättras'],
      improvement_opportunities: []
    };
  }
};
