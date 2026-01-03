import { supabase } from './supabase';
import { logger } from './logger';

export interface Recommendation {
  id: string;
  type: 'strategic' | 'operational' | 'financial' | 'risk' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  category: string;
  relatedData?: any;
  confidence: number;
}

class RecommendationEngine {
  async generateCustomerRecommendations(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    try {
      const [okrData, swotData, bscData, projectData, invoiceData] = await Promise.all([
        this.getOKRInsights(customerId),
        this.getSWOTInsights(customerId),
        this.getBSCInsights(customerId),
        this.getProjectInsights(customerId),
        this.getFinancialInsights(customerId),
      ]);

      recommendations.push(...okrData, ...swotData, ...bscData, ...projectData, ...invoiceData);

      return recommendations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      logger.error('Failed to generate recommendations', error as Error, { customerId });
      return [];
    }
  }

  private async getOKRInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    const { data: objectives } = await supabase
      .from('okr_objectives')
      .select(`
        *,
        okr_key_results (*)
      `)
      .eq('customer_id', customerId);

    if (!objectives || objectives.length === 0) {
      recommendations.push({
        id: `okr-missing-${Date.now()}`,
        type: 'strategic',
        priority: 'high',
        title: 'Set Up OKR Framework',
        description: 'No OKRs defined. Establish objectives and key results to track strategic goals.',
        impact: 'Improves goal clarity and team alignment',
        effort: 'medium',
        category: 'OKR',
        confidence: 0.95,
      });
      return recommendations;
    }

    const atRiskObjectives = objectives.filter(obj => {
      const keyResults = obj.okr_key_results || [];
      const avgProgress =
        keyResults.reduce((sum: number, kr: any) => sum + (kr.current_value / kr.target_value), 0) /
        keyResults.length;
      return avgProgress < 0.3;
    });

    if (atRiskObjectives.length > 0) {
      recommendations.push({
        id: `okr-at-risk-${Date.now()}`,
        type: 'operational',
        priority: 'high',
        title: `${atRiskObjectives.length} OKRs At Risk`,
        description: 'Several objectives are significantly behind target. Review and adjust strategies.',
        impact: 'Prevents goal failure and resource waste',
        effort: 'medium',
        category: 'OKR',
        relatedData: { atRiskCount: atRiskObjectives.length },
        confidence: 0.88,
      });
    }

    return recommendations;
  }

  private async getSWOTInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    const { data: analyses } = await supabase
      .from('swot_analyses')
      .select(`
        *,
        swot_items (*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!analyses || analyses.length === 0) {
      recommendations.push({
        id: `swot-missing-${Date.now()}`,
        type: 'strategic',
        priority: 'medium',
        title: 'Conduct SWOT Analysis',
        description: 'Identify strengths, weaknesses, opportunities, and threats to inform strategy.',
        impact: 'Improves strategic decision-making',
        effort: 'low',
        category: 'SWOT',
        confidence: 0.90,
      });
      return recommendations;
    }

    const analysis = analyses[0];
    const items = analysis.swot_items || [];

    const threats = items.filter((item: any) => item.category === 'threats');
    const opportunities = items.filter((item: any) => item.category === 'opportunities');

    if (threats.length > opportunities.length * 1.5) {
      recommendations.push({
        id: `swot-threats-${Date.now()}`,
        type: 'risk',
        priority: 'high',
        title: 'Address Strategic Threats',
        description: 'High threat-to-opportunity ratio. Develop mitigation strategies.',
        impact: 'Reduces business risk',
        effort: 'high',
        category: 'SWOT',
        relatedData: { threats: threats.length, opportunities: opportunities.length },
        confidence: 0.82,
      });
    }

    if (opportunities.length > 0) {
      recommendations.push({
        id: `swot-opportunities-${Date.now()}`,
        type: 'opportunity',
        priority: 'medium',
        title: 'Capitalize on Opportunities',
        description: `${opportunities.length} opportunities identified. Prioritize and execute.`,
        impact: 'Drives growth and competitive advantage',
        effort: 'medium',
        category: 'SWOT',
        relatedData: { count: opportunities.length },
        confidence: 0.85,
      });
    }

    return recommendations;
  }

  private async getBSCInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    const { data: scorecards } = await supabase
      .from('balanced_scorecards')
      .select(`
        *,
        bsc_perspectives (
          *,
          bsc_metrics (*)
        )
      `)
      .eq('customer_id', customerId);

    if (!scorecards || scorecards.length === 0) {
      recommendations.push({
        id: `bsc-missing-${Date.now()}`,
        type: 'strategic',
        priority: 'medium',
        title: 'Implement Balanced Scorecard',
        description: 'Track performance across financial, customer, process, and learning perspectives.',
        impact: 'Provides balanced performance view',
        effort: 'medium',
        category: 'BSC',
        confidence: 0.88,
      });
      return recommendations;
    }

    for (const scorecard of scorecards) {
      const perspectives = scorecard.bsc_perspectives || [];

      for (const perspective of perspectives) {
        const metrics = perspective.bsc_metrics || [];
        const underperforming = metrics.filter(
          (m: any) => m.current_value < m.target_value * 0.7
        );

        if (underperforming.length > 0) {
          recommendations.push({
            id: `bsc-underperforming-${perspective.id}`,
            type: 'operational',
            priority: 'high',
            title: `${perspective.name} Perspective Underperforming`,
            description: `${underperforming.length} metrics below target. Review and improve.`,
            impact: 'Improves overall business performance',
            effort: 'medium',
            category: 'BSC',
            relatedData: { perspective: perspective.name, count: underperforming.length },
            confidence: 0.86,
          });
        }
      }
    }

    return recommendations;
  }

  private async getProjectInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('customer_id', customerId);

    if (!projects) return recommendations;

    const activeProjects = projects.filter(p => p.status === 'active');
    const onHoldProjects = projects.filter(p => p.status === 'on_hold');

    if (activeProjects.length > 5) {
      recommendations.push({
        id: `project-overload-${Date.now()}`,
        type: 'operational',
        priority: 'medium',
        title: 'High Project Load',
        description: `${activeProjects.length} active projects. Consider prioritization to avoid spreading resources thin.`,
        impact: 'Improves project success rate',
        effort: 'low',
        category: 'Projects',
        relatedData: { activeCount: activeProjects.length },
        confidence: 0.80,
      });
    }

    if (onHoldProjects.length > 0) {
      recommendations.push({
        id: `project-onhold-${Date.now()}`,
        type: 'operational',
        priority: 'low',
        title: 'Review On-Hold Projects',
        description: `${onHoldProjects.length} projects on hold. Evaluate for closure or reactivation.`,
        impact: 'Clarifies project portfolio',
        effort: 'low',
        category: 'Projects',
        relatedData: { onHoldCount: onHoldProjects.length },
        confidence: 0.75,
      });
    }

    return recommendations;
  }

  private async getFinancialInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', customerId)
      .gte('issue_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (!invoices) return recommendations;

    const overdueInvoices = invoices.filter(
      inv => inv.status === 'sent' && new Date(inv.due_date) < new Date()
    );

    if (overdueInvoices.length > 0) {
      const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

      recommendations.push({
        id: `finance-overdue-${Date.now()}`,
        type: 'financial',
        priority: 'high',
        title: 'Overdue Invoices',
        description: `${overdueInvoices.length} invoices overdue. Total: $${totalOverdue.toFixed(2)}`,
        impact: 'Improves cash flow',
        effort: 'low',
        category: 'Finance',
        relatedData: { count: overdueInvoices.length, total: totalOverdue },
        confidence: 0.95,
      });
    }

    const avgInvoiceValue =
      invoices.reduce((sum, inv) => sum + inv.total_amount, 0) / invoices.length;

    if (avgInvoiceValue < 5000) {
      recommendations.push({
        id: `finance-value-${Date.now()}`,
        type: 'opportunity',
        priority: 'medium',
        title: 'Increase Project Value',
        description: 'Average invoice value is low. Explore upselling opportunities.',
        impact: 'Increases revenue per customer',
        effort: 'medium',
        category: 'Finance',
        relatedData: { avgValue: avgInvoiceValue },
        confidence: 0.72,
      });
    }

    return recommendations;
  }

  async generateCrossModuleInsights(customerId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    try {
      const [okrs, swots, projects] = await Promise.all([
        supabase.from('okr_objectives').select('*').eq('customer_id', customerId),
        supabase.from('swot_analyses').select('*').eq('customer_id', customerId),
        supabase.from('projects').select('*').eq('customer_id', customerId),
      ]);

      const hasOKRs = okrs.data && okrs.data.length > 0;
      const hasSWOTs = swots.data && swots.data.length > 0;
      const hasProjects = projects.data && projects.data.length > 0;

      if (hasOKRs && !hasSWOTs) {
        recommendations.push({
          id: `cross-okr-swot-${Date.now()}`,
          type: 'strategic',
          priority: 'medium',
          title: 'Align OKRs with SWOT Analysis',
          description: 'Create SWOT analysis to validate and strengthen OKR strategy.',
          impact: 'Improves strategic alignment',
          effort: 'low',
          category: 'Cross-Module',
          confidence: 0.83,
        });
      }

      if (hasProjects && !hasOKRs) {
        recommendations.push({
          id: `cross-project-okr-${Date.now()}`,
          type: 'strategic',
          priority: 'high',
          title: 'Link Projects to OKRs',
          description: 'Define OKRs to ensure projects align with strategic objectives.',
          impact: 'Ensures project-strategy alignment',
          effort: 'medium',
          category: 'Cross-Module',
          confidence: 0.87,
        });
      }

      return recommendations;
    } catch (error) {
      logger.error('Failed to generate cross-module insights', error as Error, { customerId });
      return [];
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
