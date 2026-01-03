import type {
  PorterAnalysis,
  PorterAnalysisWithForces,
  PorterForce,
  PorterForceType,
  PorterAIInsight,
  PorterAnalysisResult,
  PorterForceDetail
} from './enterprise-types';
import { aiService } from './ai-service';

export const porterAIService = {
  async generatePorterInsights(
    customerId: string,
    industry: string,
    context?: string
  ): Promise<PorterAIInsight[]> {
    const prompt = `
Du är en erfaren strategikonsult och expert på Porter's Five Forces-analys. Analysera följande företagsinformation och generera insikter för de fem konkurrensdrivande krafterna.

Kundid: ${customerId}
Bransch: ${industry}
${context ? `Kontext: ${context}` : ''}

Generera insikter för följande 5 krafter:
1. Competitive Rivalry (Konkurrens mellan befintliga aktörer)
2. Threat of New Entrants (Hot från nya aktörer)
3. Threat of Substitutes (Hot från substitutprodukter)
4. Bargaining Power of Buyers (Köpares förhandlingsstyrka)
5. Bargaining Power of Suppliers (Leverantörers förhandlingsstyrka)

För varje kraft, ge 2-3 insikter med:
- Insight Type (opportunity, threat, strategic, competitive)
- Titel (kort och koncis)
- Beskrivning (detaljerad förklaring)
- Intensity Impact (0-10, hur stark är kraften)
- Confidence (0-100)
- Data Source
- Recommendations (3-5 konkreta förslag)
- Related OKR Suggestions (objectives och key results)
- Related SWOT Elements
- Related BMC Blocks

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      const insights = this.parseAIResponse(response);
      return insights;
    } catch (error) {
      console.error('Error generating Porter insights:', error);
      return this.getFallbackInsights(industry);
    }
  },

  async analyzeForce(
    forceType: PorterForceType,
    currentFactors: string[],
    industry: string,
    context?: string
  ): Promise<PorterForceDetail> {
    const prompt = `
Analysera följande kraft i Porter's Five Forces-modellen:

Kraft: ${this.getForceName(forceType)}
Bransch: ${industry}
Nuvarande faktorer: ${currentFactors.join(', ')}
${context ? `Kontext: ${context}` : ''}

Ge en detaljerad analys av:
1. Beskrivning (vad denna kraft innebär i denna bransch)
2. Intensity Rating (1-10, hur stark är kraften)
3. Key Factors (specifika faktorer som påverkar denna kraft)
4. Strategic Implications (strategiska konsekvenser)
5. Threats (hot som denna kraft medför)
6. Opportunities (möjligheter att hantera kraften)
7. Recommendations (konkreta åtgärder)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseForceDetail(response, forceType);
    } catch (error) {
      console.error('Error analyzing force:', error);
      return this.getFallbackForceDetail(forceType);
    }
  },

  async analyzePorterModel(analysis: PorterAnalysisWithForces): Promise<PorterAnalysisResult> {
    const prompt = `
Utför en helhetsbedömning av följande Porter's Five Forces-analys:

ANALYS: ${analysis.title}
BRANSCH: ${analysis.industry}
MARKNAD: ${analysis.market_description || 'Ej specificerad'}

KRAFTER:
${analysis.forces.map(f => `
- ${this.getForceName(f.force_type)}: Intensitet ${f.intensity_rating}/10
  Faktorer: ${f.key_factors.join(', ')}
  ${f.description || ''}
`).join('\n')}

Analysera och ge:
1. Overall Attractiveness (0-100, hur attraktiv är marknaden)
2. Market Position Score (0-100, företagets position)
3. Competitive Intensity Score (0-100, konkurrensnivå)
4. Entry Barrier Score (0-100, inträdeshinder)
5. Customer Power Score (0-100, kundmakt)
6. Supplier Power Score (0-100, leverantörsmakt)
7. Forces Summary (sammanfattning per kraft)
8. Strategic Recommendations (prioriterade förslag)
9. Competitive Position (strong/moderate/weak)
10. Market Attractiveness (high/medium/low)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseAnalysisResult(response, analysis.id);
    } catch (error) {
      console.error('Error analyzing Porter model:', error);
      return this.getFallbackAnalysisResult(analysis.id);
    }
  },

  async suggestStrategicActions(
    analysis: PorterAnalysisWithForces,
    focusForce?: PorterForceType
  ): Promise<{
    immediate_actions: string[];
    short_term_initiatives: string[];
    long_term_strategies: string[];
    priority_order: string[];
  }> {
    const prompt = `
Baserat på denna Porter's Five Forces-analys, föreslå strategiska åtgärder:

${focusForce ? `Fokusera på: ${this.getForceName(focusForce)}` : 'Alla krafter'}

Analys: ${analysis.title}
Bransch: ${analysis.industry}

Krafter:
${analysis.forces.map(f => `- ${this.getForceName(f.force_type)}: ${f.intensity_rating}/10`).join('\n')}

Ge förslag inom tre tidsperspektiv:
1. Immediate Actions (0-3 månader, akuta åtgärder)
2. Short-term Initiatives (3-12 månader, kortsiktiga initiativ)
3. Long-term Strategies (12+ månader, långsiktig strategi)
4. Priority Order (prioritetsordning)

Varje förslag ska vara konkret, mätbart och genomförbart.

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseStrategicActions(response);
    } catch (error) {
      console.error('Error suggesting strategic actions:', error);
      return {
        immediate_actions: ['Genomför detaljerad konkurrentanalys', 'Identifiera differentiering'],
        short_term_initiatives: ['Stärk kundrelationer', 'Utveckla unika resurser'],
        long_term_strategies: ['Bygg inträdesbarriärer', 'Skapa ekosystem'],
        priority_order: ['Genomför detaljerad konkurrentanalys', 'Stärk kundrelationer']
      };
    }
  },

  async identifyCompetitiveThreats(
    analysis: PorterAnalysisWithForces
  ): Promise<{
    critical_threats: Array<{
      force_type: PorterForceType;
      threat: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      mitigation_strategies: string[];
    }>;
    emerging_threats: string[];
    monitoring_recommendations: string[];
  }> {
    const prompt = `
Identifiera konkurrenshot och risker i denna Porter's Five Forces-analys:

Analys: ${analysis.title}
Bransch: ${analysis.industry}

Krafter:
${analysis.forces.map(f => `
- ${this.getForceName(f.force_type)}: ${f.intensity_rating}/10
  ${f.description}
  Faktorer: ${f.key_factors.join(', ')}
`).join('\n')}

Analysera:
1. Critical Threats (kritiska hot per kraft)
2. Emerging Threats (framväxande hot)
3. Monitoring Recommendations (vad att övervaka)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseThreats(response);
    } catch (error) {
      console.error('Error identifying threats:', error);
      return {
        critical_threats: [],
        emerging_threats: [],
        monitoring_recommendations: []
      };
    }
  },

  async generateOKRsFromPorter(
    analysis: PorterAnalysisWithForces
  ): Promise<Array<{
    objective: string;
    category: string;
    key_results: string[];
    rationale: string;
    related_forces: PorterForceType[];
  }>> {
    const prompt = `
Baserat på denna Porter's Five Forces-analys, generera 5-7 OKR (Objectives & Key Results):

Analys: ${analysis.title}
Bransch: ${analysis.industry}

Krafter:
${analysis.forces.map(f => `- ${this.getForceName(f.force_type)}: ${f.intensity_rating}/10`).join('\n')}

För varje OKR, inkludera:
- Objective (tydligt mål)
- Category (competitive, defensive, growth, etc.)
- Key Results (3-4 mätbara resultat)
- Rationale (varför detta är viktigt)
- Related Forces (vilka krafter detta adresserar)

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

  async compareWithIndustryBenchmarks(
    analysis: PorterAnalysisWithForces,
    industry: string
  ): Promise<{
    industry_average_intensity: Record<PorterForceType, number>;
    company_vs_industry: Record<PorterForceType, 'above' | 'at' | 'below'>;
    competitive_advantages: string[];
    competitive_disadvantages: string[];
    recommendations: string[];
  }> {
    const prompt = `
Jämför denna Porter's Five Forces-analys med branschgenomsnitt:

Bransch: ${industry}
Företagets analys:
${analysis.forces.map(f => `- ${this.getForceName(f.force_type)}: ${f.intensity_rating}/10`).join('\n')}

Ge:
1. Industry Average Intensity (genomsnittlig intensitet per kraft i branschen)
2. Company vs Industry (företagets position relativt genomsnittet)
3. Competitive Advantages (konkurrensfördelar)
4. Competitive Disadvantages (konkurrensnackdelar)
5. Recommendations (rekommendationer baserat på jämförelsen)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBenchmarkComparison(response);
    } catch (error) {
      console.error('Error comparing with benchmarks:', error);
      return {
        industry_average_intensity: {
          competitive_rivalry: 7,
          threat_of_new_entrants: 5,
          threat_of_substitutes: 6,
          bargaining_power_of_buyers: 6,
          bargaining_power_of_suppliers: 5
        },
        company_vs_industry: {
          competitive_rivalry: 'at',
          threat_of_new_entrants: 'at',
          threat_of_substitutes: 'at',
          bargaining_power_of_buyers: 'at',
          bargaining_power_of_suppliers: 'at'
        },
        competitive_advantages: ['Etablerad marknadsnärvaro'],
        competitive_disadvantages: ['Begränsad differentiering'],
        recommendations: ['Utveckla unika värderbjudanden', 'Stärk kundlojalitet']
      };
    }
  },

  getForceName(forceType: PorterForceType): string {
    const names: Record<PorterForceType, string> = {
      competitive_rivalry: 'Konkurrens mellan befintliga aktörer',
      threat_of_new_entrants: 'Hot från nya aktörer',
      threat_of_substitutes: 'Hot från substitutprodukter',
      bargaining_power_of_buyers: 'Köpares förhandlingsstyrka',
      bargaining_power_of_suppliers: 'Leverantörers förhandlingsstyrka'
    };
    return names[forceType];
  },

  getForceIcon(forceType: PorterForceType): string {
    const icons: Record<PorterForceType, string> = {
      competitive_rivalry: '⚔️',
      threat_of_new_entrants: '🚪',
      threat_of_substitutes: '🔄',
      bargaining_power_of_buyers: '🛒',
      bargaining_power_of_suppliers: '🏭'
    };
    return icons[forceType];
  },

  getForceColor(forceType: PorterForceType): string {
    const colors: Record<PorterForceType, string> = {
      competitive_rivalry: 'bg-red-50 border-red-200 text-red-700',
      threat_of_new_entrants: 'bg-orange-50 border-orange-200 text-orange-700',
      threat_of_substitutes: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      bargaining_power_of_buyers: 'bg-blue-50 border-blue-200 text-blue-700',
      bargaining_power_of_suppliers: 'bg-green-50 border-green-200 text-green-700'
    };
    return colors[forceType];
  },

  getIntensityLabel(intensity: number): string {
    if (intensity >= 8) return 'Mycket hög';
    if (intensity >= 6) return 'Hög';
    if (intensity >= 4) return 'Medel';
    if (intensity >= 2) return 'Låg';
    return 'Mycket låg';
  },

  getIntensityColor(intensity: number): string {
    if (intensity >= 8) return 'text-red-600 bg-red-50';
    if (intensity >= 6) return 'text-orange-600 bg-orange-50';
    if (intensity >= 4) return 'text-yellow-600 bg-yellow-50';
    if (intensity >= 2) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  },

  parseAIResponse(response: string): PorterAIInsight[] {
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

  parseForceDetail(response: string, forceType: PorterForceType): PorterForceDetail {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          force_type: forceType,
          name: this.getForceName(forceType),
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing force detail:', error);
    }
    return this.getFallbackForceDetail(forceType);
  },

  parseAnalysisResult(response: string, analysisId: string): PorterAnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          analysis_id: analysisId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing analysis result:', error);
    }
    return this.getFallbackAnalysisResult(analysisId);
  },

  parseStrategicActions(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing strategic actions:', error);
    }
    return {
      immediate_actions: [],
      short_term_initiatives: [],
      long_term_strategies: [],
      priority_order: []
    };
  },

  parseThreats(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing threats:', error);
    }
    return {
      critical_threats: [],
      emerging_threats: [],
      monitoring_recommendations: []
    };
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

  parseBenchmarkComparison(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing benchmark comparison:', error);
    }
    return {
      industry_average_intensity: {},
      company_vs_industry: {},
      competitive_advantages: [],
      competitive_disadvantages: [],
      recommendations: []
    };
  },

  getFallbackInsights(industry: string): PorterAIInsight[] {
    return [
      {
        force_type: 'competitive_rivalry',
        insight_type: 'competitive',
        title: 'Hög konkurrensnivå',
        description: `Konkurrensen i ${industry}-branschen är intensiv med många etablerade aktörer.`,
        intensity_impact: 7,
        confidence: 75,
        data_source: 'market_analysis',
        recommendations: [
          'Utveckla tydlig differentiering',
          'Fokusera på nischmarknader',
          'Bygg starka kundrelationer'
        ]
      }
    ];
  },

  getFallbackForceDetail(forceType: PorterForceType): PorterForceDetail {
    return {
      force_type: forceType,
      name: this.getForceName(forceType),
      description: 'Kräver vidare analys',
      intensity_rating: 5,
      key_factors: ['Branschstruktur', 'Marknadsdynamik'],
      strategic_implications: 'Påverkar strategiska val',
      threats: ['Ökad press'],
      opportunities: ['Potential för differentiering'],
      recommendations: ['Genomför detaljerad analys', 'Övervaka marknaden']
    };
  },

  getFallbackAnalysisResult(analysisId: string): PorterAnalysisResult {
    return {
      analysis_id: analysisId,
      overall_attractiveness: 50,
      market_position_score: 60,
      competitive_intensity_score: 70,
      entry_barrier_score: 50,
      customer_power_score: 60,
      supplier_power_score: 50,
      forces_summary: [],
      strategic_recommendations: [],
      competitive_position: 'moderate',
      market_attractiveness: 'medium'
    };
  }
};
