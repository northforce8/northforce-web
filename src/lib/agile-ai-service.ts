import type { AgileTransformation, AgileTransformationStage, AgileMaturityAssessment } from './agile-types';

interface AIInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat' | 'recommendation' | 'warning';
  title: string;
  description: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  confidence?: number;
  actions?: string[];
}

export class AgileAIService {
  async analyzeTransformation(transformation: AgileTransformation): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    if (transformation.overall_progress < 20) {
      insights.push({
        type: 'recommendation',
        title: 'Start with Vision Clarity',
        description: 'Begin by clearly defining why your organization is adopting agile. Articulate the pain points you want to solve and the desired outcomes.',
        priority: 'high',
        confidence: 90,
        actions: [
          'Conduct stakeholder workshops to align on transformation vision',
          'Document current state challenges and desired future state',
          'Create a compelling narrative for change'
        ]
      });
    }

    if (transformation.framework_type === 'Scrum' && !transformation.ceremonies?.length) {
      insights.push({
        type: 'warning',
        title: 'Scrum Ceremonies Not Defined',
        description: 'Scrum requires specific ceremonies (Daily Standup, Sprint Planning, Review, Retrospective). Set these up to ensure proper framework adoption.',
        priority: 'high',
        confidence: 95,
        actions: [
          'Schedule Daily Standups (15 min) for team synchronization',
          'Plan Sprint Planning sessions (2-4 hours) for work selection',
          'Set up Sprint Reviews for stakeholder feedback',
          'Establish Sprint Retrospectives for continuous improvement'
        ]
      });
    }

    if (transformation.overall_progress > 70) {
      insights.push({
        type: 'strength',
        title: 'Strong Progress Momentum',
        description: 'Your transformation is progressing well. Focus now on sustaining the change and optimizing practices based on metrics.',
        priority: 'medium',
        confidence: 85,
        actions: [
          'Establish regular metrics reviews',
          'Create communities of practice',
          'Document and share success stories'
        ]
      });
    }

    const daysSinceStart = transformation.start_date
      ? Math.floor((new Date().getTime() - new Date(transformation.start_date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    if (daysSinceStart > 180 && transformation.overall_progress < 40) {
      insights.push({
        type: 'threat',
        title: 'Slow Transformation Pace',
        description: 'After 6+ months, progress is below 40%. There may be organizational resistance or insufficient support. Consider reassessing your approach.',
        priority: 'critical',
        confidence: 80,
        actions: [
          'Conduct stakeholder interviews to identify blockers',
          'Assess if you have executive sponsorship',
          'Review and adjust transformation strategy',
          'Consider bringing in agile coaching support'
        ]
      });
    }

    if (transformation.scope === 'Organization-wide' && transformation.overall_progress < 30) {
      insights.push({
        type: 'recommendation',
        title: 'Consider Pilot Teams First',
        description: 'Organization-wide transformations are complex. Consider starting with 1-2 pilot teams to prove the model before scaling.',
        priority: 'high',
        confidence: 85,
        actions: [
          'Identify 1-2 high-performing teams for pilot',
          'Run 3-6 month pilot with close support',
          'Document lessons learned and success patterns',
          'Use pilot results to refine scaling strategy'
        ]
      });
    }

    return insights;
  }

  async analyzeStage(stage: AgileTransformationStage): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    if (stage.barriers.length > 5) {
      insights.push({
        type: 'warning',
        title: `High Barrier Count in ${stage.stage_name}`,
        description: `This stage has ${stage.barriers.length} identified barriers. Prioritize addressing the most critical ones first.`,
        priority: 'high',
        confidence: 90,
        actions: [
          'Categorize barriers by impact and effort to resolve',
          'Create action plans for top 3 barriers',
          'Assign owners to barrier resolution'
        ]
      });
    }

    if (stage.status === 'in_progress' && stage.progress_percentage < 20 && stage.key_activities.length === 0) {
      insights.push({
        type: 'recommendation',
        title: 'Define Key Activities',
        description: 'This stage is in progress but has no defined activities. Break down the work into concrete, actionable tasks.',
        priority: 'high',
        confidence: 95,
        actions: [
          'List 5-10 specific activities needed for this stage',
          'Assign owners and deadlines to each activity',
          'Set up regular check-ins to track progress'
        ]
      });
    }

    if (stage.stage_name === 'Vision' && stage.status === 'completed') {
      insights.push({
        type: 'strength',
        title: 'Vision Foundation Set',
        description: 'Completing the vision stage provides a strong foundation. Ensure this vision is communicated regularly to maintain alignment.',
        priority: 'medium',
        confidence: 85
      });
    }

    if (stage.stage_name === 'Team Readiness' && stage.progress_percentage > 50) {
      insights.push({
        type: 'recommendation',
        title: 'Start Agile Training',
        description: 'With team readiness assessment underway, initiate formal agile training. Focus on both mindset and practices.',
        priority: 'high',
        confidence: 90,
        actions: [
          'Schedule Scrum Master certification for team leads',
          'Provide Product Owner training',
          'Run agile simulation games (e.g., Lego Scrum)',
          'Create internal coaching support system'
        ]
      });
    }

    return insights;
  }

  async analyzeMaturity(assessment: AgileMaturityAssessment): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    const scores = [
      assessment.technical_practices_score,
      assessment.collaboration_score,
      assessment.delivery_speed_score,
      assessment.quality_score,
      assessment.customer_focus_score,
      assessment.continuous_improvement_score
    ];

    const lowestScore = Math.min(...scores);
    const highestScore = Math.max(...scores);
    const scoreVariance = highestScore - lowestScore;

    if (scoreVariance > 40) {
      insights.push({
        type: 'warning',
        title: 'Uneven Maturity Distribution',
        description: `There's a ${scoreVariance}-point gap between your highest and lowest maturity areas. Balance your improvement efforts.`,
        priority: 'high',
        confidence: 90,
        actions: [
          'Focus on strengthening your weakest area',
          'Leverage strengths from high-scoring areas',
          'Create cross-training opportunities'
        ]
      });
    }

    if (assessment.technical_practices_score < 40) {
      insights.push({
        type: 'threat',
        title: 'Low Technical Practices Score',
        description: 'Technical practices are foundational to sustainable agility. Low scores here will limit long-term success.',
        priority: 'critical',
        confidence: 95,
        actions: [
          'Implement automated testing (unit, integration, E2E)',
          'Set up continuous integration (CI) pipelines',
          'Adopt test-driven development (TDD) practices',
          'Introduce pair programming for knowledge sharing',
          'Establish code review standards'
        ]
      });
    }

    if (assessment.customer_focus_score > 75) {
      insights.push({
        type: 'strength',
        title: 'Strong Customer Focus',
        description: 'Your team demonstrates excellent customer focus. This is a key predictor of agile success. Continue building on this strength.',
        priority: 'medium',
        confidence: 90,
        actions: [
          'Document and share customer feedback loops',
          'Train other teams on your customer engagement practices',
          'Celebrate customer-focused wins to reinforce behavior'
        ]
      });
    }

    if (assessment.continuous_improvement_score < 50 && assessment.maturity_level >= 3) {
      insights.push({
        type: 'recommendation',
        title: 'Improve Continuous Improvement Practices',
        description: 'At maturity level 3+, continuous improvement should be stronger. Focus on establishing regular retrospectives and acting on insights.',
        priority: 'high',
        confidence: 85,
        actions: [
          'Ensure all teams run effective retrospectives',
          'Create action item tracking system',
          'Implement experiment-driven improvement (hypothesis, measure, learn)',
          'Share improvement experiments across teams'
        ]
      });
    }

    if (assessment.overall_score >= 70) {
      insights.push({
        type: 'strength',
        title: 'High Agile Maturity',
        description: 'Your team shows strong agile maturity. Focus now on optimization, innovation, and coaching others.',
        priority: 'low',
        confidence: 90,
        actions: [
          'Become an internal agile coaching resource',
          'Experiment with advanced practices (mob programming, BDD)',
          'Share your journey and lessons learned',
          'Contribute to the agile community of practice'
        ]
      });
    }

    return insights;
  }

  generateMaturityRecommendations(scores: {
    technical: number;
    collaboration: number;
    speed: number;
    quality: number;
    customer: number;
    improvement: number;
  }): string[] {
    const recommendations: string[] = [];

    if (scores.technical < 60) {
      recommendations.push('Invest in technical practices: automated testing, CI/CD, code quality tools');
    }

    if (scores.collaboration < 60) {
      recommendations.push('Improve team collaboration: daily standups, pair programming, shared workspace');
    }

    if (scores.speed < 60) {
      recommendations.push('Increase delivery speed: reduce work-in-progress, eliminate bottlenecks, automate manual tasks');
    }

    if (scores.quality < 60) {
      recommendations.push('Enhance quality practices: definition of done, test automation, code reviews');
    }

    if (scores.customer < 60) {
      recommendations.push('Strengthen customer focus: regular demos, user research, feedback loops');
    }

    if (scores.improvement < 60) {
      recommendations.push('Build continuous improvement culture: effective retrospectives, experimentation, metrics tracking');
    }

    return recommendations;
  }

  suggestNextSteps(transformation: AgileTransformation): string[] {
    const suggestions: string[] = [];

    if (!transformation.stages || transformation.stages.length === 0) {
      return ['Create transformation stages (Vision, Strategy, Team Readiness, Change Management, Performance Metrics)'];
    }

    const currentStage = transformation.stages
      .filter(s => s.status === 'in_progress')
      .sort((a, b) => a.stage_order - b.stage_order)[0];

    if (!currentStage) {
      const nextStage = transformation.stages
        .filter(s => s.status === 'not_started')
        .sort((a, b) => a.stage_order - b.stage_order)[0];

      if (nextStage) {
        suggestions.push(`Start working on: ${nextStage.stage_name}`);
      }
    } else {
      if (currentStage.progress_percentage < 50) {
        suggestions.push(`Continue focusing on ${currentStage.stage_name} (${currentStage.progress_percentage}% complete)`);
      } else {
        suggestions.push(`Complete ${currentStage.stage_name} (${currentStage.progress_percentage}% complete) before moving to next stage`);
      }
    }

    if (!transformation.assessments || transformation.assessments.length === 0) {
      suggestions.push('Conduct initial maturity assessment to establish baseline');
    }

    if (!transformation.metrics || transformation.metrics.length === 0) {
      suggestions.push('Define key metrics to track (e.g., velocity, lead time, deployment frequency)');
    }

    return suggestions;
  }
}

export const agileAI = new AgileAIService();
