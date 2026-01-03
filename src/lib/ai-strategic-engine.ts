/**
 * AI Strategic Frameworks Engine
 *
 * Provides AI-powered analysis, recommendations, and insights for strategic frameworks:
 * - OKR (Objectives & Key Results)
 * - SWOT Analysis
 * - Business Model Canvas
 * - Balanced Scorecard
 * - Porter's Five Forces
 * - Agile/Scrum
 * - Lean Startup
 * - McKinsey 7S
 * - Design Thinking
 * - ADKAR Change Management
 */

import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface AIRecommendation {
  id: string;
  type: 'adjustment' | 'warning' | 'opportunity' | 'insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reasoning: string;
  confidence: ConfidenceLevel;
  data_points: Record<string, any>;
  suggested_actions: string[];
  impact_score: number; // 0-100
}

export interface OKRInsight {
  objective_id: string;
  health_score: number; // 0-100
  completion_probability: number; // 0-100
  risk_level: RiskLevel;
  trend: TrendDirection;
  recommendations: AIRecommendation[];
  predicted_completion_date: string | null;
  confidence: ConfidenceLevel;
  data_points: {
    current_progress: number;
    velocity: number; // progress per day
    days_remaining: number;
    key_results_on_track: number;
    key_results_at_risk: number;
    key_results_behind: number;
  };
}

export interface KeyResultRecommendation {
  type: 'metric_adjustment' | 'target_revision' | 'status_update' | 'milestone_suggestion';
  title: string;
  description: string;
  current_value: number;
  recommended_value: number;
  reasoning: string;
  confidence: ConfidenceLevel;
}

export interface CrossFrameworkInsight {
  insight_id: string;
  framework_connections: string[]; // e.g., ['OKR', 'SWOT', 'BMC']
  insight_type: 'alignment' | 'conflict' | 'opportunity' | 'risk';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_entities: {
    okr_ids?: string[];
    swot_ids?: string[];
    bmc_ids?: string[];
    customer_ids?: string[];
  };
  recommended_actions: string[];
}

export interface PerformanceBenchmark {
  metric: string;
  customer_value: number;
  industry_average: number;
  top_quartile: number;
  percentile: number;
  status: 'below_average' | 'average' | 'above_average' | 'top_performer';
}

// ============================================================================
// AI STRATEGIC ENGINE CLASS
// ============================================================================

class AIStrategicEngine {

  // ========================================================================
  // OKR ANALYSIS & RECOMMENDATIONS
  // ========================================================================

  /**
   * Analyze an OKR objective and provide AI-driven insights
   */
  async analyzeObjective(objectiveId: string): Promise<OKRInsight> {
    try {
      // Fetch objective with key results
      const { data: objective } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          okr_key_results(*)
        `)
        .eq('id', objectiveId)
        .single();

      if (!objective) {
        throw new Error('Objective not found');
      }

      const keyResults = objective.okr_key_results || [];

      // Calculate current progress
      const currentProgress = this.calculateObjectiveProgress(keyResults);

      // Calculate velocity (progress per day)
      const velocity = await this.calculateProgressVelocity(objectiveId, keyResults);

      // Calculate days remaining
      const startDate = new Date(objective.start_date);
      const endDate = new Date(objective.end_date);
      const today = new Date();
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, totalDays - elapsedDays);

      // Analyze key results status
      const keyResultsOnTrack = keyResults.filter(kr => kr.status === 'on_track').length;
      const keyResultsAtRisk = keyResults.filter(kr => kr.status === 'at_risk').length;
      const keyResultsBehind = keyResults.filter(kr => kr.status === 'behind').length;

      // Calculate expected progress based on time elapsed
      const expectedProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;

      // Calculate health score
      let healthScore = 100;

      // Factor 1: Progress vs. expected (40 points)
      const progressGap = currentProgress - expectedProgress;
      if (progressGap < -20) healthScore -= 40;
      else if (progressGap < -10) healthScore -= 25;
      else if (progressGap < 0) healthScore -= 10;

      // Factor 2: Key results at risk or behind (30 points)
      healthScore -= keyResultsAtRisk * 5;
      healthScore -= keyResultsBehind * 10;

      // Factor 3: Velocity assessment (30 points)
      const requiredVelocity = daysRemaining > 0 ? (100 - currentProgress) / daysRemaining : 0;
      if (velocity < requiredVelocity * 0.5) healthScore -= 30;
      else if (velocity < requiredVelocity * 0.8) healthScore -= 15;

      healthScore = Math.max(0, Math.min(100, healthScore));

      // Determine risk level
      let riskLevel: RiskLevel = 'low';
      if (healthScore < 40) riskLevel = 'critical';
      else if (healthScore < 60) riskLevel = 'high';
      else if (healthScore < 80) riskLevel = 'medium';

      // Determine trend
      let trend: TrendDirection = 'stable';
      if (progressGap > 10) trend = 'improving';
      else if (progressGap < -10) trend = 'declining';

      // Calculate completion probability
      let completionProbability = healthScore;
      if (velocity > requiredVelocity * 1.2) completionProbability = Math.min(95, completionProbability + 10);
      else if (velocity < requiredVelocity * 0.8) completionProbability = Math.max(5, completionProbability - 15);

      // Predict completion date
      let predictedCompletionDate: string | null = null;
      if (velocity > 0 && currentProgress < 100) {
        const remainingProgress = 100 - currentProgress;
        const daysToComplete = remainingProgress / velocity;
        const predictedDate = new Date(today);
        predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysToComplete));
        predictedCompletionDate = predictedDate.toISOString().split('T')[0];
      }

      // Generate recommendations
      const recommendations = await this.generateOKRRecommendations(
        objective,
        keyResults,
        currentProgress,
        expectedProgress,
        velocity,
        requiredVelocity,
        daysRemaining
      );

      // Determine confidence
      const confidence: ConfidenceLevel = keyResults.length >= 3 ? 'high' : keyResults.length >= 2 ? 'medium' : 'low';

      return {
        objective_id: objectiveId,
        health_score: Math.round(healthScore),
        completion_probability: Math.round(completionProbability),
        risk_level: riskLevel,
        trend,
        recommendations,
        predicted_completion_date: predictedCompletionDate,
        confidence,
        data_points: {
          current_progress: Math.round(currentProgress),
          velocity: Number(velocity.toFixed(2)),
          days_remaining: daysRemaining,
          key_results_on_track: keyResultsOnTrack,
          key_results_at_risk: keyResultsAtRisk,
          key_results_behind: keyResultsBehind,
        }
      };
    } catch (error) {
      console.error('Error analyzing objective:', error);
      throw error;
    }
  }

  /**
   * Calculate overall progress of an objective based on key results
   */
  private calculateObjectiveProgress(keyResults: any[]): number {
    if (!keyResults || keyResults.length === 0) return 0;

    const totalProgress = keyResults.reduce((sum, kr) => {
      const progress = (kr.current_value / kr.target_value) * 100;
      return sum + Math.min(progress, 100);
    }, 0);

    return totalProgress / keyResults.length;
  }

  /**
   * Calculate progress velocity (progress per day)
   */
  private async calculateProgressVelocity(objectiveId: string, keyResults: any[]): Promise<number> {
    // In a real implementation, this would analyze historical progress updates
    // For now, we'll use a simplified calculation based on current progress and time elapsed

    const { data: objective } = await supabase
      .from('okr_objectives')
      .select('start_date, created_at')
      .eq('id', objectiveId)
      .single();

    if (!objective) return 0;

    const startDate = new Date(objective.start_date);
    const today = new Date();
    const daysElapsed = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    const currentProgress = this.calculateObjectiveProgress(keyResults);

    return currentProgress / daysElapsed;
  }

  /**
   * Generate AI recommendations for an OKR objective
   */
  private async generateOKRRecommendations(
    objective: any,
    keyResults: any[],
    currentProgress: number,
    expectedProgress: number,
    velocity: number,
    requiredVelocity: number,
    daysRemaining: number
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Recommendation 1: Behind schedule
    if (currentProgress < expectedProgress - 10) {
      recommendations.push({
        id: `behind_schedule_${objective.id}`,
        type: 'warning',
        priority: currentProgress < expectedProgress - 20 ? 'critical' : 'high',
        title: 'Objective Behind Schedule',
        description: `This objective is ${Math.round(expectedProgress - currentProgress)}% behind expected progress`,
        reasoning: `Based on elapsed time (${Math.round((new Date().getTime() - new Date(objective.start_date).getTime()) / (1000 * 60 * 60 * 24))} days), the objective should be at ${Math.round(expectedProgress)}% but is at ${Math.round(currentProgress)}%`,
        confidence: 'high',
        data_points: {
          current_progress: currentProgress,
          expected_progress: expectedProgress,
          gap: expectedProgress - currentProgress
        },
        suggested_actions: [
          'Review and prioritize key results that are behind',
          'Identify and remove blockers',
          'Consider adjusting resource allocation',
          'Review if objectives are still realistic'
        ],
        impact_score: 85
      });
    }

    // Recommendation 2: Insufficient velocity
    if (velocity < requiredVelocity * 0.8 && daysRemaining > 0) {
      recommendations.push({
        id: `low_velocity_${objective.id}`,
        type: 'warning',
        priority: 'high',
        title: 'Progress Velocity Too Low',
        description: `Current progress rate (${velocity.toFixed(2)}%/day) is below required rate (${requiredVelocity.toFixed(2)}%/day)`,
        reasoning: `To complete this objective on time, progress needs to accelerate by ${Math.round(((requiredVelocity - velocity) / velocity) * 100)}%`,
        confidence: 'high',
        data_points: {
          current_velocity: velocity,
          required_velocity: requiredVelocity,
          velocity_gap: requiredVelocity - velocity
        },
        suggested_actions: [
          'Increase team focus on this objective',
          'Remove lower-priority tasks',
          'Break down key results into smaller milestones',
          'Schedule daily check-ins to maintain momentum'
        ],
        impact_score: 80
      });
    }

    // Recommendation 3: Key results at risk or behind
    const problematicKRs = keyResults.filter(kr => kr.status === 'at_risk' || kr.status === 'behind');
    if (problematicKRs.length > 0) {
      recommendations.push({
        id: `kr_issues_${objective.id}`,
        type: 'warning',
        priority: problematicKRs.length > keyResults.length / 2 ? 'critical' : 'high',
        title: `${problematicKRs.length} Key Results Need Attention`,
        description: `${problematicKRs.filter(kr => kr.status === 'behind').length} behind, ${problematicKRs.filter(kr => kr.status === 'at_risk').length} at risk`,
        reasoning: 'These key results are preventing the objective from reaching its target',
        confidence: 'high',
        data_points: {
          total_key_results: keyResults.length,
          behind: problematicKRs.filter(kr => kr.status === 'behind').length,
          at_risk: problematicKRs.filter(kr => kr.status === 'at_risk').length
        },
        suggested_actions: problematicKRs.map(kr => `Review "${kr.title}": ${kr.current_value}/${kr.target_value} ${kr.unit}`),
        impact_score: 75
      });
    }

    // Recommendation 4: Approaching deadline
    if (daysRemaining <= 7 && currentProgress < 90) {
      recommendations.push({
        id: `deadline_approaching_${objective.id}`,
        type: 'warning',
        priority: 'critical',
        title: 'Deadline Approaching',
        description: `Only ${daysRemaining} days remaining with ${Math.round(100 - currentProgress)}% progress needed`,
        reasoning: 'Immediate action required to complete objective on time',
        confidence: 'high',
        data_points: {
          days_remaining: daysRemaining,
          progress_remaining: 100 - currentProgress,
          required_daily_progress: (100 - currentProgress) / Math.max(1, daysRemaining)
        },
        suggested_actions: [
          'Focus all efforts on completing this objective',
          'Identify what can realistically be completed',
          'Consider requesting deadline extension if needed',
          'Prepare status report for stakeholders'
        ],
        impact_score: 95
      });
    }

    // Recommendation 5: Ahead of schedule (positive)
    if (currentProgress > expectedProgress + 15) {
      recommendations.push({
        id: `ahead_schedule_${objective.id}`,
        type: 'opportunity',
        priority: 'medium',
        title: 'Objective Ahead of Schedule',
        description: `Progress is ${Math.round(currentProgress - expectedProgress)}% ahead of expected timeline`,
        reasoning: 'Excellent execution - consider opportunities to leverage this success',
        confidence: 'high',
        data_points: {
          current_progress: currentProgress,
          expected_progress: expectedProgress,
          lead: currentProgress - expectedProgress
        },
        suggested_actions: [
          'Consider setting more ambitious key results',
          'Document success factors for other objectives',
          'Explore opportunities to expand scope',
          'Share best practices with team'
        ],
        impact_score: 60
      });
    }

    // Recommendation 6: All key results on track
    if (keyResults.length > 0 && keyResults.every(kr => kr.status === 'on_track' || kr.status === 'completed')) {
      recommendations.push({
        id: `all_on_track_${objective.id}`,
        type: 'insight',
        priority: 'low',
        title: 'All Key Results On Track',
        description: 'Excellent progress across all key results',
        reasoning: 'Current execution strategy is working well',
        confidence: 'high',
        data_points: {
          on_track_count: keyResults.filter(kr => kr.status === 'on_track').length,
          completed_count: keyResults.filter(kr => kr.status === 'completed').length
        },
        suggested_actions: [
          'Maintain current approach',
          'Continue regular progress updates',
          'Consider early completion opportunities'
        ],
        impact_score: 40
      });
    }

    // Sort by priority and impact
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.impact_score - a.impact_score;
    });

    return recommendations;
  }

  /**
   * Suggest key results based on objective and customer context
   */
  async suggestKeyResults(objectiveId: string, objectiveTitle: string): Promise<KeyResultRecommendation[]> {
    // This would use ML/AI in production - for now, return intelligent rule-based suggestions
    const suggestions: KeyResultRecommendation[] = [];

    // Analyze objective title for common patterns
    const title = objectiveTitle.toLowerCase();

    if (title.includes('revenue') || title.includes('sales')) {
      suggestions.push({
        type: 'metric_adjustment',
        title: 'Track Monthly Recurring Revenue',
        description: 'Measure consistent revenue growth',
        current_value: 0,
        recommended_value: 100000,
        reasoning: 'Revenue objectives should track MRR as a key metric',
        confidence: 'high'
      });
    }

    if (title.includes('customer') || title.includes('user')) {
      suggestions.push({
        type: 'metric_adjustment',
        title: 'Track Active Users',
        description: 'Measure user engagement and growth',
        current_value: 0,
        recommended_value: 1000,
        reasoning: 'Customer-focused objectives should measure active usage',
        confidence: 'high'
      });
    }

    if (title.includes('quality') || title.includes('satisfaction')) {
      suggestions.push({
        type: 'metric_adjustment',
        title: 'Net Promoter Score (NPS)',
        description: 'Measure customer satisfaction',
        current_value: 0,
        recommended_value: 50,
        reasoning: 'Quality objectives benefit from satisfaction metrics',
        confidence: 'high'
      });
    }

    return suggestions;
  }

  /**
   * Benchmark objective performance against similar objectives
   */
  async benchmarkObjective(objectiveId: string, customerId: string): Promise<PerformanceBenchmark[]> {
    try {
      // Get all objectives for this customer
      const { data: customerObjectives } = await supabase
        .from('okr_objectives')
        .select('*, okr_key_results(*)')
        .eq('customer_id', customerId);

      if (!customerObjectives || customerObjectives.length === 0) {
        return [];
      }

      // Calculate average progress across all objectives
      const progressValues = customerObjectives.map(obj =>
        this.calculateObjectiveProgress(obj.okr_key_results || [])
      );

      const avgProgress = progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
      const sortedProgress = [...progressValues].sort((a, b) => a - b);
      const topQuartile = sortedProgress[Math.floor(sortedProgress.length * 0.75)] || 0;

      // Get current objective's progress
      const currentObj = customerObjectives.find(obj => obj.id === objectiveId);
      const currentProgress = currentObj ? this.calculateObjectiveProgress(currentObj.okr_key_results || []) : 0;

      // Calculate percentile
      const percentile = (progressValues.filter(val => val <= currentProgress).length / progressValues.length) * 100;

      let status: 'below_average' | 'average' | 'above_average' | 'top_performer' = 'average';
      if (percentile >= 75) status = 'top_performer';
      else if (percentile >= 55) status = 'above_average';
      else if (percentile < 40) status = 'below_average';

      return [{
        metric: 'Progress vs. Customer Average',
        customer_value: currentProgress,
        industry_average: avgProgress,
        top_quartile: topQuartile,
        percentile: Math.round(percentile),
        status
      }];
    } catch (error) {
      console.error('Error benchmarking objective:', error);
      return [];
    }
  }

  /**
   * Analyze cross-framework connections and insights
   */
  async analyzeCrossFrameworkInsights(customerId: string): Promise<CrossFrameworkInsight[]> {
    const insights: CrossFrameworkInsight[] = [];

    try {
      // Get customer's strategic data
      const [okrData, swotData, bmcData] = await Promise.all([
        supabase.from('okr_objectives').select('*').eq('customer_id', customerId),
        supabase.from('swot_analyses').select('*').eq('customer_id', customerId),
        supabase.from('business_model_canvas').select('*').eq('customer_id', customerId)
      ]);

      // Insight: OKRs aligned with SWOT opportunities
      if (okrData.data && swotData.data) {
        // Check if OKRs address SWOT opportunities
        // This is a simplified check - real implementation would use NLP
        insights.push({
          insight_id: `okr_swot_alignment_${customerId}`,
          framework_connections: ['OKR', 'SWOT'],
          insight_type: 'alignment',
          priority: 'medium',
          title: 'Strategic Alignment Analysis',
          description: 'Review how OKRs align with identified SWOT opportunities and threats',
          affected_entities: {
            okr_ids: okrData.data.map(o => o.id),
            swot_ids: swotData.data.map(s => s.id),
            customer_ids: [customerId]
          },
          recommended_actions: [
            'Review SWOT opportunities and create corresponding OKRs',
            'Ensure threats from SWOT are addressed in defensive OKRs',
            'Document how each OKR contributes to strategic goals'
          ]
        });
      }

      return insights;
    } catch (error) {
      console.error('Error analyzing cross-framework insights:', error);
      return [];
    }
  }
}

// Export singleton instance
export const aiStrategicEngine = new AIStrategicEngine();
