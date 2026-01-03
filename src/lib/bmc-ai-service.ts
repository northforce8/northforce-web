import type { BMCAIInsight, BMCAnalysis, BusinessModel, BusinessModelWithDetails } from './enterprise-types';
import { aiService } from './ai-service';

export const bmcAIService = {
  async generateBMCInsights(
    customerId: string,
    context?: string
  ): Promise<BMCAIInsight[]> {
    const prompt = `
Du är en erfaren affärsstrateg och Business Model Canvas-expert. Analysera följande företagsinformation och generera insikter för deras affärsmodell.

Kundid: ${customerId}
${context ? `Kontext: ${context}` : ''}

Generera insikter för följande 9 byggstenar i Business Model Canvas:
1. Value Proposition (Värdeerbjudande)
2. Customer Segments (Kundsegment)
3. Channels (Kanaler)
4. Customer Relationships (Kundrelationer)
5. Revenue Streams (Intäktsströmmar)
6. Key Resources (Nyckelresurser)
7. Key Activities (Nyckelaktiviteter)
8. Key Partnerships (Nyckelpartnerskap)
9. Cost Structure (Kostnadsstruktur)

För varje byggsten, ge 2-3 insikter med:
- Insight Type (opportunity, risk, optimization, trend)
- Titel (kort och koncis)
- Beskrivning (detaljerad förklaring)
- Impact Score (0-100)
- Confidence (0-100)
- Data Source
- Recommendations (3-5 konkreta förslag)
- Related OKR Suggestions (objectives och key results)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      const insights = this.parseAIResponse(response);
      return insights;
    } catch (error) {
      console.error('Error generating BMC insights:', error);
      return this.getFallbackInsights();
    }
  },

  async analyzeBuildingBlock(
    buildingBlock: string,
    currentItems: string[],
    context?: string
  ): Promise<{
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    recommendations: string[];
    impact_score: number;
  }> {
    const prompt = `
Analysera följande byggsten i Business Model Canvas:

Byggsten: ${this.getBuildingBlockName(buildingBlock)}
Nuvarande innehåll: ${currentItems.join(', ')}
${context ? `Kontext: ${context}` : ''}

Ge en analys av:
1. Strengths (styrkor i nuvarande approach)
2. Weaknesses (svagheter eller brister)
3. Opportunities (möjligheter för förbättring)
4. Recommendations (konkreta åtgärder)
5. Impact Score (0-100, hur kritisk är denna byggsten)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBlockAnalysis(response);
    } catch (error) {
      console.error('Error analyzing building block:', error);
      return {
        strengths: ['Etablerad grund'],
        weaknesses: ['Behöver vidareutveckling'],
        opportunities: ['Potential för optimering'],
        recommendations: ['Genomför djupare analys', 'Identifiera best practices'],
        impact_score: 50
      };
    }
  },

  async analyzeBusinessModel(model: BusinessModel): Promise<BMCAnalysis> {
    const prompt = `
Utför en helhetsbedömning av följande Business Model Canvas:

AFFÄRSMODELL: ${model.model_name}

VÄRDEERBJUDANDE:
${model.value_proposition || 'Ej definierat'}

KUNDSEGMENT:
${model.customer_segments.join(', ') || 'Inga definerade'}

KANALER:
${model.channels.join(', ') || 'Inga definerade'}

KUNDRELATIONER:
${model.customer_relationships.join(', ') || 'Inga definerade'}

INTÄKTSSTRÖMMAR:
${model.revenue_streams.join(', ') || 'Inga definerade'}

NYCKELRESURSER:
${model.key_resources.join(', ') || 'Inga definerade'}

NYCKELAKTIVITETER:
${model.key_activities.join(', ') || 'Inga definerade'}

NYCKELPARTNERSKAP:
${model.key_partnerships.join(', ') || 'Inga definerade'}

KOSTNADSSTRUKTUR:
${model.cost_structure.join(', ') || 'Inga definerade'}

Analysera och ge:
1. Overall Health Score (0-100)
2. Strengths (5-7 styrkor)
3. Weaknesses (3-5 svagheter)
4. Opportunities (5-7 möjligheter)
5. Threats (3-5 hot)
6. Strategic Fit Score (0-100, hur väl delarna passar ihop)
7. Market Viability Score (0-100, marknadsförutsättningar)
8. Execution Readiness Score (0-100, genomförbarheten)
9. Recommendations (prioriterade förslag med förväntad påverkan)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseBusinessModelAnalysis(response, model.id);
    } catch (error) {
      console.error('Error analyzing business model:', error);
      return this.getFallbackAnalysis(model.id);
    }
  },

  async suggestImprovements(
    model: BusinessModel,
    focusArea?: string
  ): Promise<{
    quick_wins: string[];
    strategic_initiatives: string[];
    long_term_vision: string[];
    priority_order: string[];
  }> {
    const prompt = `
Baserat på denna Business Model Canvas, föreslå förbättringar:

${focusArea ? `Fokusområde: ${focusArea}` : 'Allmän förbättring'}

Affärsmodell: ${model.model_name}
Värdeerbjudande: ${model.value_proposition}

Ge förslag inom tre tidsperspektiv:
1. Quick Wins (0-3 månader, snabba vinster)
2. Strategic Initiatives (3-12 månader, strategiska initiativ)
3. Long-term Vision (12+ månader, långsiktig vision)
4. Priority Order (prioritetsordning för alla förslag)

Varje förslag ska vara konkret, mätbart och genomförbart.

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseImprovementSuggestions(response);
    } catch (error) {
      console.error('Error suggesting improvements:', error);
      return {
        quick_wins: ['Optimera befintliga processer', 'Förbättra kundkommunikation'],
        strategic_initiatives: ['Utveckla ny kanal', 'Expandera kundsegment'],
        long_term_vision: ['Internationell expansion', 'Produktportföljutvidgning'],
        priority_order: ['Optimera befintliga processer', 'Utveckla ny kanal', 'Expandera kundsegment']
      };
    }
  },

  async identifyStrategicGaps(model: BusinessModel): Promise<{
    missing_elements: Array<{
      building_block: string;
      description: string;
      importance: 'critical' | 'high' | 'medium' | 'low';
      suggested_actions: string[];
    }>;
    misalignments: Array<{
      blocks: string[];
      issue: string;
      recommendation: string;
    }>;
    opportunities: string[];
  }> {
    const prompt = `
Identifiera strategiska luckor och missmatchningar i denna affärsmodell:

Affärsmodell: ${model.model_name}
${JSON.stringify(model, null, 2)}

Analysera:
1. Missing Elements (saknade eller ofullständiga delar)
2. Misalignments (delar som inte stämmer överens)
3. Opportunities (outnyttjade möjligheter)

Returnera i JSON-format.
`;

    try {
      const response = await aiService.generateText(prompt);
      return this.parseGapAnalysis(response);
    } catch (error) {
      console.error('Error identifying gaps:', error);
      return {
        missing_elements: [],
        misalignments: [],
        opportunities: []
      };
    }
  },

  async generateOKRsFromBMC(model: BusinessModel): Promise<Array<{
    objective: string;
    category: string;
    key_results: string[];
    rationale: string;
    related_building_blocks: string[];
  }>> {
    const prompt = `
Baserat på denna Business Model Canvas, generera 5-7 OKR (Objectives & Key Results):

Affärsmodell: ${model.model_name}
${JSON.stringify(model, null, 2)}

För varje OKR, inkludera:
- Objective (tydligt mål)
- Category (revenue, market, operational, etc.)
- Key Results (3-4 mätbara resultat)
- Rationale (varför detta är viktigt)
- Related Building Blocks (vilka delar av BMC detta påverkar)

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

  getBuildingBlockName(block: string): string {
    const names: Record<string, string> = {
      value_proposition: 'Värdeerbjudande',
      customer_segments: 'Kundsegment',
      channels: 'Kanaler',
      customer_relationships: 'Kundrelationer',
      revenue_streams: 'Intäktsströmmar',
      key_resources: 'Nyckelresurser',
      key_activities: 'Nyckelaktiviteter',
      key_partnerships: 'Nyckelpartnerskap',
      cost_structure: 'Kostnadsstruktur'
    };
    return names[block] || block;
  },

  getBuildingBlockIcon(block: string): string {
    const icons: Record<string, string> = {
      value_proposition: '💎',
      customer_segments: '👥',
      channels: '📢',
      customer_relationships: '🤝',
      revenue_streams: '💰',
      key_resources: '🔑',
      key_activities: '⚙️',
      key_partnerships: '🤜🤛',
      cost_structure: '💳'
    };
    return icons[block] || '📦';
  },

  getBuildingBlockColor(block: string): string {
    const colors: Record<string, string> = {
      value_proposition: 'bg-purple-50 border-purple-200 text-purple-700',
      customer_segments: 'bg-blue-50 border-blue-200 text-blue-700',
      channels: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      customer_relationships: 'bg-teal-50 border-teal-200 text-teal-700',
      revenue_streams: 'bg-green-50 border-green-200 text-green-700',
      key_resources: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      key_activities: 'bg-orange-50 border-orange-200 text-orange-700',
      key_partnerships: 'bg-red-50 border-red-200 text-red-700',
      cost_structure: 'bg-pink-50 border-pink-200 text-pink-700'
    };
    return colors[block] || 'bg-gray-50 border-gray-200 text-gray-700';
  },

  parseAIResponse(response: string): BMCAIInsight[] {
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

  parseBlockAnalysis(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing block analysis:', error);
    }
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      recommendations: [],
      impact_score: 50
    };
  },

  parseBusinessModelAnalysis(response: string, modelId: string): BMCAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          business_model_id: modelId,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error parsing business model analysis:', error);
    }
    return this.getFallbackAnalysis(modelId);
  },

  parseImprovementSuggestions(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing improvement suggestions:', error);
    }
    return {
      quick_wins: [],
      strategic_initiatives: [],
      long_term_vision: [],
      priority_order: []
    };
  },

  parseGapAnalysis(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing gap analysis:', error);
    }
    return {
      missing_elements: [],
      misalignments: [],
      opportunities: []
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

  getFallbackInsights(): BMCAIInsight[] {
    return [
      {
        building_block: 'value_proposition',
        insight_type: 'optimization',
        title: 'Förtydliga värdeerbjudandet',
        description: 'Ett tydligare värdeerbjudande kan förbättra konverteringen.',
        impact_score: 80,
        confidence: 75,
        data_source: 'market_analysis',
        recommendations: [
          'Definiera unika fördelar tydligt',
          'Kommunicera värdet i kundtermer',
          'Testa olika värdeerbjudanden'
        ]
      }
    ];
  },

  getFallbackAnalysis(modelId: string): BMCAnalysis {
    return {
      business_model_id: modelId,
      overall_health_score: 65,
      strengths: ['Etablerad grund', 'Tydlig målgrupp'],
      weaknesses: ['Begränsad kanalstrategi', 'Oklara intäktsströmmar'],
      opportunities: ['Digital expansion', 'Nya kundsegment'],
      threats: ['Ökad konkurrens', 'Marknadsoföränderlighet'],
      strategic_fit_score: 70,
      market_viability_score: 65,
      execution_readiness_score: 60,
      recommendations: [
        {
          priority: 'high',
          category: 'Channels',
          recommendation: 'Utveckla en multi-channel strategi',
          expected_impact: 'Ökad räckvidd och tillgänglighet'
        }
      ]
    };
  }
};
