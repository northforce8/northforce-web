import type {
  DesignThinkingProject,
  DTPhaseData,
  DTInsight,
  DTPersona,
  DTEmpathyMap,
  DTJourneyMap,
  DTIdea,
  DTPrototype,
  DTUserTest,
  DesignThinkingAIInsights,
  DTPhase,
} from './design-thinking-types';

export class DesignThinkingAIService {
  private analyzeEmpathizePhase(
    phase: DTPhaseData | undefined,
    personas: DTPersona[],
    empathyMaps: DTEmpathyMap[],
    insights: DTInsight[]
  ): { score: number; recommendation: string; gaps: string[] } {
    const gaps: string[] = [];
    let score = 50;

    if (!phase || phase.completion_status === 'not_started') {
      return {
        score: 0,
        recommendation: 'Start empathize phase by conducting user research and interviews to understand user needs.',
        gaps: ['No empathy phase activities initiated'],
      };
    }

    if (personas.length === 0) {
      gaps.push('No user personas created - develop detailed personas based on research');
      score -= 15;
    } else {
      score += 10;
      const primaryPersonas = personas.filter(p => p.is_primary);
      if (primaryPersonas.length === 0) {
        gaps.push('No primary persona identified - designate primary target user');
      }
    }

    if (empathyMaps.length === 0) {
      gaps.push('No empathy maps created - build empathy maps to understand user feelings and thoughts');
      score -= 10;
    } else {
      score += 10;
    }

    const empathyInsights = insights.filter(i => i.phase_name === 'empathize');
    if (empathyInsights.length < 5) {
      gaps.push('Limited user insights captured - conduct more research to gather diverse insights');
      score -= 10;
    } else {
      score += 15;
    }

    if (phase.participants_count < 5) {
      gaps.push('Low number of research participants - aim for at least 5-10 users for reliable insights');
      score -= 10;
    } else {
      score += 10;
    }

    const recommendation = score >= 75
      ? 'Excellent empathy work! Proceed to define phase with strong user understanding.'
      : score >= 50
      ? 'Good foundation. Address gaps in user research before moving to define phase.'
      : 'Insufficient empathy work. Invest more time in user research and persona development.';

    return { score: Math.max(0, Math.min(100, score)), recommendation, gaps };
  }

  private analyzeDefinePhase(
    phase: DTPhaseData | undefined,
    project: DesignThinkingProject,
    insights: DTInsight[]
  ): { score: number; recommendation: string; clarity: number } {
    let score = 50;
    let clarity = 50;

    if (!phase || phase.completion_status === 'not_started') {
      return {
        score: 0,
        recommendation: 'Begin define phase by synthesizing research findings into a clear problem statement.',
        clarity: 0,
      };
    }

    if (project.challenge_statement.length < 50) {
      score -= 20;
      clarity -= 30;
    } else if (project.challenge_statement.length > 100) {
      score += 15;
      clarity += 20;
    }

    const defineInsights = insights.filter(i => i.phase_name === 'define');
    if (defineInsights.length === 0) {
      score -= 15;
      clarity -= 20;
    } else {
      score += 10 + Math.min(defineInsights.length * 2, 20);
      clarity += 15;
    }

    if (project.target_users && project.target_users.length > 20) {
      score += 10;
      clarity += 15;
    }

    if (phase.key_findings && phase.key_findings.length > 50) {
      score += 15;
      clarity += 20;
    }

    const recommendation = clarity >= 75
      ? 'Problem is well-defined with clear user needs. Ready for ideation!'
      : clarity >= 50
      ? 'Problem definition is adequate but could be more specific. Refine before ideating.'
      : 'Problem definition is unclear. Revisit research findings and create focused problem statement.';

    return { score: Math.max(0, Math.min(100, score)), recommendation, clarity: Math.max(0, Math.min(100, clarity)) };
  }

  private analyzeIdeatePhase(
    phase: DTPhaseData | undefined,
    ideas: DTIdea[]
  ): { score: number; recommendation: string; diversity: number } {
    let score = 50;
    let diversity = 50;

    if (!phase || phase.completion_status === 'not_started') {
      return {
        score: 0,
        recommendation: 'Start ideation by brainstorming diverse solutions to the defined problem.',
        diversity: 0,
      };
    }

    if (ideas.length < 10) {
      score -= 20;
      diversity -= 30;
    } else if (ideas.length >= 20) {
      score += 15;
      diversity += 20;
    } else {
      score += 5;
      diversity += 10;
    }

    const categories = new Set(ideas.map(i => i.category).filter(Boolean));
    if (categories.size >= 3) {
      diversity += 20;
      score += 10;
    }

    const selectedIdeas = ideas.filter(i => i.status === 'selected' || i.status === 'prototyping');
    if (selectedIdeas.length === 0) {
      score -= 15;
    } else if (selectedIdeas.length >= 3) {
      score += 15;
    }

    const scoredIdeas = ideas.filter(i => i.feasibility_score && i.desirability_score && i.viability_score);
    if (scoredIdeas.length > 0) {
      score += 10;
      diversity += 10;
    }

    const recommendation = diversity >= 75
      ? 'Excellent ideation with diverse solutions! Select top ideas for prototyping.'
      : diversity >= 50
      ? 'Good range of ideas. Consider more diverse approaches before selecting for prototyping.'
      : 'Limited ideation diversity. Run additional brainstorming sessions with different methods.';

    return { score: Math.max(0, Math.min(100, score)), recommendation, diversity: Math.max(0, Math.min(100, diversity)) };
  }

  private analyzePrototypePhase(
    phase: DTPhaseData | undefined,
    prototypes: DTPrototype[],
    ideas: DTIdea[]
  ): { score: number; recommendation: string; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 50;

    if (!phase || phase.completion_status === 'not_started') {
      return {
        score: 0,
        recommendation: 'Begin prototyping phase by creating tangible representations of selected ideas.',
        recommendations: ['Start with low-fidelity paper prototypes for quick iteration'],
      };
    }

    if (prototypes.length === 0) {
      recommendations.push('No prototypes created - build at least 2-3 prototypes to explore solutions');
      score -= 30;
    } else {
      score += 10 + Math.min(prototypes.length * 5, 20);
    }

    const lowFiPrototypes = prototypes.filter(p => p.fidelity === 'low');
    const highFiPrototypes = prototypes.filter(p => p.fidelity === 'high');

    if (lowFiPrototypes.length > 0 && highFiPrototypes.length > 0) {
      score += 15;
      recommendations.push('Good progression from low to high fidelity prototypes');
    } else if (highFiPrototypes.length > 0 && lowFiPrototypes.length === 0) {
      recommendations.push('Consider starting with low-fidelity prototypes before investing in high-fidelity');
    }

    const readyForTesting = prototypes.filter(p => p.status === 'ready_for_testing' || p.status === 'testing');
    if (readyForTesting.length === 0 && prototypes.length > 0) {
      recommendations.push('Mark prototypes as ready for testing to move forward');
      score -= 10;
    }

    const prototypesWithGoals = prototypes.filter(p => p.testing_goals.length > 0);
    if (prototypesWithGoals.length > 0) {
      score += 10;
    } else if (prototypes.length > 0) {
      recommendations.push('Define testing goals for each prototype to guide validation');
    }

    const selectedIdeasCount = ideas.filter(i => i.status === 'selected' || i.status === 'prototyping').length;
    if (prototypes.length < selectedIdeasCount) {
      recommendations.push(`You have ${selectedIdeasCount} selected ideas but only ${prototypes.length} prototypes - consider prototyping all selected ideas`);
    }

    const recommendation = score >= 75
      ? 'Strong prototyping work! Move to testing phase to validate with users.'
      : score >= 50
      ? 'Prototypes are developing well. Refine and prepare for user testing.'
      : 'Limited prototyping progress. Create more prototypes to explore solution space.';

    return { score: Math.max(0, Math.min(100, score)), recommendation, recommendations };
  }

  private analyzeTestPhase(
    phase: DTPhaseData | undefined,
    userTests: DTUserTest[],
    prototypes: DTPrototype[]
  ): { score: number; recommendation: string; adequacy: string } {
    let score = 50;

    if (!phase || phase.completion_status === 'not_started') {
      return {
        score: 0,
        recommendation: 'Start testing phase by validating prototypes with real users.',
        adequacy: 'No testing conducted yet',
      };
    }

    if (userTests.length === 0) {
      score -= 30;
      return {
        score: 20,
        recommendation: 'Critical: No user tests conducted. Plan and execute user testing sessions immediately.',
        adequacy: 'Insufficient - no testing done',
      };
    }

    const completedTests = userTests.filter(t => t.status === 'completed');
    if (completedTests.length === 0) {
      score -= 15;
    } else {
      score += 10 + Math.min(completedTests.length * 5, 15);
    }

    const totalParticipants = userTests.reduce((sum, t) => sum + t.participants_count, 0);
    if (totalParticipants < 5) {
      score -= 20;
    } else if (totalParticipants >= 10) {
      score += 15;
    }

    const testedPrototypes = new Set(userTests.map(t => t.prototype_id).filter(Boolean));
    const readyPrototypes = prototypes.filter(p => p.status === 'ready_for_testing' || p.status === 'testing');

    if (testedPrototypes.size < readyPrototypes.length && readyPrototypes.length > 0) {
      score -= 10;
    }

    const testsWithFindings = userTests.filter(t => t.key_findings.length > 0);
    if (testsWithFindings.length > 0) {
      score += 15;
    }

    let adequacy = 'Insufficient';
    if (score >= 75) {
      adequacy = 'Comprehensive - thorough validation conducted';
    } else if (score >= 50) {
      adequacy = 'Adequate - basic validation completed';
    } else if (score >= 25) {
      adequacy = 'Limited - more testing needed';
    }

    const recommendation = score >= 75
      ? 'Excellent testing! Use insights to iterate on design or implement validated solution.'
      : score >= 50
      ? 'Good testing progress. Conduct additional tests to validate remaining assumptions.'
      : 'Insufficient testing. Plan and execute more comprehensive user testing sessions.';

    return { score: Math.max(0, Math.min(100, score)), recommendation, adequacy };
  }

  public async generateInsights(
    project: DesignThinkingProject,
    phases: DTPhaseData[],
    insights: DTInsight[],
    personas: DTPersona[],
    empathyMaps: DTEmpathyMap[],
    journeyMaps: DTJourneyMap[],
    ideas: DTIdea[],
    prototypes: DTPrototype[],
    userTests: DTUserTest[]
  ): Promise<DesignThinkingAIInsights> {
    const phaseMap = phases.reduce((acc, p) => {
      acc[p.phase_name] = p;
      return acc;
    }, {} as Record<DTPhase, DTPhaseData | undefined>);

    const empathizeAnalysis = this.analyzeEmpathizePhase(
      phaseMap.empathize,
      personas,
      empathyMaps,
      insights
    );

    const defineAnalysis = this.analyzeDefinePhase(
      phaseMap.define,
      project,
      insights
    );

    const ideateAnalysis = this.analyzeIdeatePhase(
      phaseMap.ideate,
      ideas
    );

    const prototypeAnalysis = this.analyzePrototypePhase(
      phaseMap.prototype,
      prototypes,
      ideas
    );

    const testAnalysis = this.analyzeTestPhase(
      phaseMap.test,
      userTests,
      prototypes
    );

    const overallScore = (
      empathizeAnalysis.score +
      defineAnalysis.score +
      ideateAnalysis.score +
      prototypeAnalysis.score +
      testAnalysis.score
    ) / 5;

    const userInsightsCount = insights.filter(i => i.insight_type === 'user_need' || i.insight_type === 'pain_point').length;
    const validationInsights = insights.filter(i => i.insight_type === 'validation').length;

    const personaAnalysis = personas.length > 0
      ? `${personas.length} personas created. ${personas.filter(p => p.is_primary).length} primary personas identified. ${personas.filter(p => p.goals.length > 0).length} personas have defined goals.`
      : 'No personas created yet. Develop detailed user personas based on research.';

    const journeyInsights = journeyMaps.length > 0
      ? `${journeyMaps.length} journey maps created, providing holistic view of user experience. ${journeyMaps.filter(j => j.pain_points && Array.isArray(j.pain_points) && j.pain_points.length > 0).length} maps identify pain points.`
      : 'No journey maps created. Consider mapping user journeys to identify opportunities.';

    const keyOpportunities: string[] = [];
    const riskAreas: string[] = [];
    const nextActions: string[] = [];

    if (empathizeAnalysis.score < 60) {
      riskAreas.push('Insufficient user empathy - may lead to solutions that miss user needs');
      nextActions.push('Conduct more user interviews and observations');
    }

    if (defineAnalysis.clarity < 60) {
      riskAreas.push('Unclear problem definition - team may work on wrong problem');
      nextActions.push('Refine problem statement using "How Might We" questions');
    }

    if (ideateAnalysis.diversity < 60) {
      riskAreas.push('Limited ideation diversity - may miss innovative solutions');
      nextActions.push('Run divergent thinking sessions with different ideation methods');
    }

    if (prototypeAnalysis.score < 50) {
      riskAreas.push('Inadequate prototyping - risk of building wrong solution');
      nextActions.push('Create low-fidelity prototypes to explore more options');
    }

    if (testAnalysis.score < 50) {
      riskAreas.push('Insufficient user testing - validation is incomplete');
      nextActions.push('Plan and conduct user testing sessions immediately');
    }

    const highScoreIdeas = ideas.filter(i =>
      i.feasibility_score && i.desirability_score && i.viability_score &&
      (i.feasibility_score + i.desirability_score + i.viability_score) / 3 >= 4
    );

    if (highScoreIdeas.length > 0) {
      keyOpportunities.push(`${highScoreIdeas.length} highly-rated ideas ready for implementation`);
    }

    if (userTests.length > 0) {
      const avgSatisfaction = userTests
        .filter(t => t.satisfaction_score)
        .reduce((sum, t) => sum + (t.satisfaction_score || 0), 0) / userTests.filter(t => t.satisfaction_score).length;

      if (avgSatisfaction >= 4) {
        keyOpportunities.push('High user satisfaction with prototypes - strong solution-market fit');
      }
    }

    if (personas.length >= 3 && empathyMaps.length >= 2) {
      keyOpportunities.push('Rich user understanding provides strong foundation for innovation');
    }

    if (nextActions.length === 0) {
      if (project.current_phase === 'empathize') {
        nextActions.push('Complete empathy research and move to define phase');
      } else if (project.current_phase === 'define') {
        nextActions.push('Finalize problem statement and begin ideation');
      } else if (project.current_phase === 'ideate') {
        nextActions.push('Evaluate ideas and select top candidates for prototyping');
      } else if (project.current_phase === 'prototype') {
        nextActions.push('Complete prototypes and prepare for user testing');
      } else if (project.current_phase === 'test') {
        nextActions.push('Analyze test results and decide on iteration or implementation');
      }
    }

    let overallAssessment = '';
    if (overallScore >= 75) {
      overallAssessment = `Excellent Design Thinking execution! The project shows strong user-centered approach with comprehensive research, clear problem definition, diverse ideation, and thorough validation. Overall score: ${Math.round(overallScore)}/100.`;
    } else if (overallScore >= 50) {
      overallAssessment = `Good progress on Design Thinking journey. The project has solid foundations but some areas need strengthening. Focus on addressing gaps to maximize innovation potential. Overall score: ${Math.round(overallScore)}/100.`;
    } else {
      overallAssessment = `Design Thinking process needs significant improvement. Critical gaps exist in user research, problem definition, or validation. Invest more time in each phase before progressing. Overall score: ${Math.round(overallScore)}/100.`;
    }

    return {
      overall_assessment: overallAssessment,
      phase_recommendations: {
        empathize: empathizeAnalysis.recommendation,
        define: defineAnalysis.recommendation,
        ideate: ideateAnalysis.recommendation,
        prototype: prototypeAnalysis.recommendation,
        test: testAnalysis.recommendation,
      },
      user_insights_summary: `${userInsightsCount} user needs and pain points captured. ${validationInsights} validation insights recorded. ${insights.length} total insights across all phases.`,
      empathy_gaps: empathizeAnalysis.gaps,
      problem_definition_clarity: defineAnalysis.clarity,
      ideation_diversity_score: ideateAnalysis.diversity,
      prototype_recommendations: prototypeAnalysis.recommendations,
      testing_adequacy: testAnalysis.adequacy,
      key_opportunities: keyOpportunities.length > 0 ? keyOpportunities : ['Continue building strong user understanding'],
      risk_areas: riskAreas.length > 0 ? riskAreas : ['No major risks identified - maintain current approach'],
      next_actions: nextActions,
      persona_analysis: personaAnalysis,
      journey_insights: journeyInsights,
      innovation_potential: Math.round(overallScore),
    };
  }
}

export const designThinkingAIService = new DesignThinkingAIService();
