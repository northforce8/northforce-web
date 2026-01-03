import type { SwotAIInsight, SwotAnalysisWithItems, SwotCrossAnalysis } from './enterprise-types';
import { aiService } from './ai-service';

export const swotAIService = {
  async generateSwotInsights(
    customerId: string,
    context?: string
  ): Promise<SwotAIInsight[]> {
    const prompt = `
Du är en erfaren strategisk affärsanalytiker. Analysera följande företagsinformation och generera SWOT-insikter.

${context ? `Kontext: ${context}` : ''}

Kundid: ${customerId}

Generera insikter för följande kategorier:
1. Strengths (Styrkor) - Interna positiva faktorer
2. Weaknesses (Svagheter) - Interna negativa faktorer
3. Opportunities (Möjligheter) - Externa positiva faktorer
4. Threats (Hot) - Externa negativa faktorer

För varje insikt, inkludera:
- Titel (kort och koncis)
- Beskrivning (detaljerad förklaring)
- Impact Score (0-100, där 100 är högst påverkan)
- Confidence (0-100, hur säker är analysen)
- Source (data source typ)
- Reasoning (varför är detta viktigt)
- Recommended Actions (3-5 konkreta åtgärder)
- Related OKR Suggestions (förslag på objectives och key results)

Returnera 3-5 insikter per kategori i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      const insights = this.parseAIResponse(response);
      return insights;
    } catch (error) {
      console.error('Error generating SWOT insights:', error);
      return this.getFallbackInsights();
    }
  },

  async analyzeSwotItem(
    category: 'strength' | 'weakness' | 'opportunity' | 'threat',
    title: string,
    description?: string
  ): Promise<{
    impact_score: number;
    recommended_actions: string[];
    related_factors: string[];
  }> {
    const prompt = `
Analysera följande SWOT-element:

Kategori: ${this.getCategoryName(category)}
Titel: ${title}
${description ? `Beskrivning: ${description}` : ''}

Ge rekommendationer för:
1. Impact Score (0-100) - Hur stor påverkan har detta?
2. Recommended Actions (3-5 konkreta åtgärder)
3. Related Factors (andra SWOT-faktorer som påverkas)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseItemAnalysis(response);
    } catch (error) {
      console.error('Error analyzing SWOT item:', error);
      return {
        impact_score: 50,
        recommended_actions: ['Analysera vidare', 'Ta fram handlingsplan', 'Föl up regelbundet'],
        related_factors: []
      };
    }
  },

  async generateCrossAnalysis(
    analysis: SwotAnalysisWithItems
  ): Promise<SwotCrossAnalysis> {
    if (!analysis.strengths || !analysis.weaknesses || !analysis.opportunities || !analysis.threats) {
      throw new Error('Komplett SWOT-analys krävs för korsanalys');
    }

    const prompt = `
Utför en SWOT korsanalys (TOWS Matrix) baserat på följande:

STYRKOR:
${analysis.strengths.map(s => `- ${s.title}: ${s.description || ''}`).join('\n')}

SVAGHETER:
${analysis.weaknesses.map(w => `- ${w.title}: ${w.description || ''}`).join('\n')}

MÖJLIGHETER:
${analysis.opportunities.map(o => `- ${o.title}: ${o.description || ''}`).join('\n')}

HOT:
${analysis.threats.map(t => `- ${t.title}: ${t.description || ''}`).join('\n')}

Generera strategier för:

1. SO-strategier (Styrkor + Möjligheter): Använd styrkor för att dra nytta av möjligheter
2. WO-strategier (Svagheter + Möjligheter): Övervinn svagheter genom att utnyttja möjligheter
3. ST-strategier (Styrkor + Hot): Använd styrkor för att hantera hot
4. WT-strategier (Svagheter + Hot): Minimera svagheter och undvik hot

För varje strategi, inkludera:
- Strategi beskrivning
- Priority (1-10)
- Estimated Impact (0-100)

Returnera 3-5 strategier per kategori i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseCrossAnalysis(response, analysis.id);
    } catch (error) {
      console.error('Error generating cross analysis:', error);
      return this.getFallbackCrossAnalysis(analysis.id);
    }
  },

  async suggestActionsForItem(
    item: { category: string; title: string; description?: string; impact_level?: string }
  ): Promise<string[]> {
    const prompt = `
Ge konkreta handlingsförslag för följande SWOT-element:

Kategori: ${this.getCategoryName(item.category as any)}
Titel: ${item.title}
${item.description ? `Beskrivning: ${item.description}` : ''}
${item.impact_level ? `Påverkan: ${item.impact_level}` : ''}

Ge 5-7 konkreta, genomförbara åtgärder.
Var specifik och actionable.
Prioritera åtgärder som kan genomföras inom 3-6 månader.

Returnera som JSON array av strings.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseActionSuggestions(response);
    } catch (error) {
      console.error('Error suggesting actions:', error);
      return this.getFallbackActions(item.category as any);
    }
  },

  async identifyPatterns(analyses: SwotAnalysisWithItems[]): Promise<{
    common_strengths: string[];
    common_weaknesses: string[];
    emerging_opportunities: string[];
    recurring_threats: string[];
    trends: string[];
  }> {
    if (analyses.length === 0) {
      return {
        common_strengths: [],
        common_weaknesses: [],
        emerging_opportunities: [],
        recurring_threats: [],
        trends: []
      };
    }

    const allItems = analyses.flatMap(a => a.items || []);
    const strengths = allItems.filter(i => i.category === 'strength');
    const weaknesses = allItems.filter(i => i.category === 'weakness');
    const opportunities = allItems.filter(i => i.category === 'opportunity');
    const threats = allItems.filter(i => i.category === 'threat');

    const prompt = `
Analysera följande SWOT-data från flera analyser och identifiera mönster:

STYRKOR (${strengths.length} st):
${strengths.slice(0, 20).map(s => `- ${s.title}`).join('\n')}

SVAGHETER (${weaknesses.length} st):
${weaknesses.slice(0, 20).map(w => `- ${w.title}`).join('\n')}

MÖJLIGHETER (${opportunities.length} st):
${opportunities.slice(0, 20).map(o => `- ${o.title}`).join('\n')}

HOT (${threats.length} st):
${threats.slice(0, 20).map(t => `- ${t.title}`).join('\n')}

Identifiera:
1. Vanliga styrkor (återkommande teman)
2. Vanliga svagheter (återkommande problem)
3. Framväxande möjligheter (nya trender)
4. Återkommande hot (konstanta risker)
5. Övergripande trender och insikter

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parsePatterns(response);
    } catch (error) {
      console.error('Error identifying patterns:', error);
      return {
        common_strengths: ['Stark produktkvalitet', 'Erfaren team'],
        common_weaknesses: ['Begränsade resurser', 'Långsam innovation'],
        emerging_opportunities: ['Digital transformation', 'Nya marknader'],
        recurring_threats: ['Ökad konkurrens', 'Marknadsoföränderlighet'],
        trends: ['Digitalisering accelererar', 'Kundförväntningar ökar']
      };
    }
  },

  getCategoryName(category: 'strength' | 'weakness' | 'opportunity' | 'threat'): string {
    const names = {
      strength: 'Styrka',
      weakness: 'Svaghet',
      opportunity: 'Möjlighet',
      threat: 'Hot'
    };
    return names[category];
  },

  getCategoryColor(category: 'strength' | 'weakness' | 'opportunity' | 'threat'): string {
    const colors = {
      strength: 'green',
      weakness: 'red',
      opportunity: 'blue',
      threat: 'yellow'
    };
    return colors[category];
  },

  getImpactLevelColor(level?: string): string {
    const colors: Record<string, string> = {
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      critical: 'red'
    };
    return colors[level || 'medium'];
  },

  parseAIResponse(response: string): SwotAIInsight[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    return this.getFallbackInsights();
  },

  parseItemAnalysis(response: string): {
    impact_score: number;
    recommended_actions: string[];
    related_factors: string[];
  } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing item analysis:', error);
    }
    return {
      impact_score: 50,
      recommended_actions: ['Analysera vidare', 'Ta fram handlingsplan'],
      related_factors: []
    };
  },

  parseCrossAnalysis(response: string, swotAnalysisId: string): SwotCrossAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          swot_analysis_id: swotAnalysisId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing cross analysis:', error);
    }
    return this.getFallbackCrossAnalysis(swotAnalysisId);
  },

  parseActionSuggestions(response: string): string[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing action suggestions:', error);
    }
    return ['Analysera situationen', 'Ta fram handlingsplan', 'Implementera åtgärder'];
  },

  parsePatterns(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing patterns:', error);
    }
    return {
      common_strengths: [],
      common_weaknesses: [],
      emerging_opportunities: [],
      recurring_threats: [],
      trends: []
    };
  },

  getFallbackInsights(): SwotAIInsight[] {
    return [
      {
        category: 'strength',
        title: 'Stark marknadsposition',
        description: 'Företaget har etablerat sig väl på marknaden med lojala kunder.',
        impact_score: 75,
        confidence: 80,
        source: 'internal_data',
        reasoning: 'Baserat på kunddata och marknadstrender',
        recommended_actions: [
          'Utnyttja position för att expandera till nya segment',
          'Stärk varumärket ytterligare',
          'Utveckla kundlojalitetsprogram'
        ]
      }
    ];
  },

  getFallbackCrossAnalysis(swotAnalysisId: string): SwotCrossAnalysis {
    return {
      swot_analysis_id: swotAnalysisId,
      so_strategies: ['Använd styrkor för att utnyttja möjligheter'],
      wo_strategies: ['Övervinn svagheter genom möjligheter'],
      st_strategies: ['Använd styrkor för att hantera hot'],
      wt_strategies: ['Minimera svagheter och undvik hot'],
      priority_actions: []
    };
  },

  getFallbackActions(category: string): string[] {
    const actions: Record<string, string[]> = {
      strength: [
        'Kommunicera styrkan till kunder och intressenter',
        'Använd styrkan i marknadsföring',
        'Bygg vidare på styrkan för konkurrensfördelar'
      ],
      weakness: [
        'Identifiera grundorsak till svagheten',
        'Utveckla förbättringsplan',
        'Allokera resurser för att åtgärda'
      ],
      opportunity: [
        'Utvärdera möjlighetens potential',
        'Ta fram implementeringsplan',
        'Sätt mätbara mål'
      ],
      threat: [
        'Övervaka hotet kontinuerligt',
        'Utveckla riskreduceringsplan',
        'Förbered contingency plans'
      ]
    };
    return actions[category] || ['Analysera vidare', 'Ta fram handlingsplan'];
  }
};
