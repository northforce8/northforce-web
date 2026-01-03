import type {
  McKinsey7SAssessment,
  McKinsey7SElement,
  McKinsey7SAIInsights,
  ElementType,
  McKinsey7SImprovement,
} from './mckinsey-types';

export async function generateMcKinsey7SInsights(
  assessment: McKinsey7SAssessment,
  elements: McKinsey7SElement[]
): Promise<McKinsey7SAIInsights> {
  const hardElements = elements.filter((e) => e.element_category === 'hard');
  const softElements = elements.filter((e) => e.element_category === 'soft');

  const avgHardScore = hardElements.reduce((sum, e) => sum + (e.alignment_score || 0), 0) / hardElements.length || 0;
  const avgSoftScore = softElements.reduce((sum, e) => sum + (e.alignment_score || 0), 0) / softElements.length || 0;

  const criticalElements = elements.filter((e) => e.status === 'critical' || e.status === 'needs_attention');
  const alignedElements = elements.filter((e) => e.status === 'aligned');

  const overallAssessment = generateOverallAssessment(assessment, elements, avgHardScore, avgSoftScore);
  const alignmentAnalysis = generateAlignmentAnalysis(elements, avgHardScore, avgSoftScore);
  const hardSoftBalance = generateHardSoftBalance(avgHardScore, avgSoftScore);

  const keyStrengths = identifyKeyStrengths(elements);
  const criticalWeaknesses = identifyCriticalWeaknesses(elements);
  const riskAreas = identifyRiskAreas(elements);
  const quickWins = identifyQuickWins(elements);
  const strategicPriorities = identifyStrategicPriorities(elements);

  const elementInsights: McKinsey7SAIInsights['element_insights'] = {} as any;
  for (const element of elements) {
    elementInsights[element.element_type] = generateElementInsights(element);
  }

  const relationships = generateRelationshipAnalysis(elements);

  return {
    overall_assessment: overallAssessment,
    alignment_analysis: alignmentAnalysis,
    hard_soft_balance: hardSoftBalance,
    key_strengths: keyStrengths,
    critical_weaknesses: criticalWeaknesses,
    risk_areas: riskAreas,
    quick_wins: quickWins,
    strategic_priorities: strategicPriorities,
    element_insights: elementInsights,
    relationships,
  };
}

function generateOverallAssessment(
  assessment: McKinsey7SAssessment,
  elements: McKinsey7SElement[],
  avgHardScore: number,
  avgSoftScore: number
): string {
  const overallScore = assessment.overall_alignment_score || 0;

  if (overallScore >= 80) {
    return `Your organization demonstrates strong alignment across the McKinsey 7S Framework with an overall score of ${overallScore}%. The hard elements (strategy, structure, systems) and soft elements (shared values, skills, style, staff) are well-coordinated, creating a solid foundation for sustained organizational effectiveness.`;
  } else if (overallScore >= 60) {
    return `Your organization shows moderate alignment with an overall score of ${overallScore}%. There are areas of strength, but some elements require attention to improve overall organizational coherence. Focusing on the identified gaps will enhance your ability to execute strategy effectively.`;
  } else if (overallScore >= 40) {
    return `Your organization has significant alignment challenges with an overall score of ${overallScore}%. Multiple elements are misaligned, which can impede strategy execution and organizational performance. Immediate attention to critical areas is recommended to prevent further degradation.`;
  } else {
    return `Your organization faces critical alignment issues with an overall score of ${overallScore}%. There is substantial misalignment across multiple elements, creating systemic barriers to effectiveness. A comprehensive transformation initiative is needed to restore organizational coherence.`;
  }
}

function generateAlignmentAnalysis(
  elements: McKinsey7SElement[],
  avgHardScore: number,
  avgSoftScore: number
): string {
  const alignedCount = elements.filter((e) => e.status === 'aligned').length;
  const needsAttentionCount = elements.filter((e) => e.status === 'needs_attention').length;
  const criticalCount = elements.filter((e) => e.status === 'critical').length;

  let analysis = `Of the 7 elements, ${alignedCount} are well-aligned, ${needsAttentionCount} need attention, and ${criticalCount} are in critical state. `;

  if (criticalCount > 0) {
    const criticalElements = elements.filter((e) => e.status === 'critical').map((e) => e.element_type);
    analysis += `Critical elements (${criticalElements.join(', ')}) require immediate intervention. `;
  }

  const scoreDiff = Math.abs(avgHardScore - avgSoftScore);
  if (scoreDiff > 20) {
    if (avgHardScore > avgSoftScore) {
      analysis += `Hard elements significantly outperform soft elements (${avgHardScore.toFixed(0)}% vs ${avgSoftScore.toFixed(0)}%), indicating strong systems and processes but potential cultural or people challenges.`;
    } else {
      analysis += `Soft elements significantly outperform hard elements (${avgSoftScore.toFixed(0)}% vs ${avgHardScore.toFixed(0)}%), indicating strong culture and people capabilities but potential strategic or structural gaps.`;
    }
  } else {
    analysis += `Hard and soft elements are relatively balanced (${avgHardScore.toFixed(0)}% vs ${avgSoftScore.toFixed(0)}%), which is positive for overall organizational coherence.`;
  }

  return analysis;
}

function generateHardSoftBalance(avgHardScore: number, avgSoftScore: number): string {
  const diff = avgHardScore - avgSoftScore;
  const absDiff = Math.abs(diff);

  if (absDiff < 10) {
    return `Excellent balance between hard elements (${avgHardScore.toFixed(0)}%) and soft elements (${avgSoftScore.toFixed(0)}%). This balance supports sustainable organizational performance.`;
  } else if (absDiff < 20) {
    if (diff > 0) {
      return `Hard elements (${avgHardScore.toFixed(0)}%) are stronger than soft elements (${avgSoftScore.toFixed(0)}%). Focus on developing culture, people capabilities, and leadership style to achieve better balance.`;
    } else {
      return `Soft elements (${avgSoftScore.toFixed(0)}%) are stronger than hard elements (${avgHardScore.toFixed(0)}%). Focus on strategy, structure, and systems to leverage your strong culture and people.`;
    }
  } else {
    if (diff > 0) {
      return `Significant imbalance: Hard elements (${avgHardScore.toFixed(0)}%) significantly outperform soft elements (${avgSoftScore.toFixed(0)}%). This creates risk as strong processes without aligned culture and people often fail. Prioritize soft elements development.`;
    } else {
      return `Significant imbalance: Soft elements (${avgSoftScore.toFixed(0)}%) significantly outperform hard elements (${avgHardScore.toFixed(0)}%). Without aligned strategy, structure, and systems, even the best culture and people cannot deliver sustained results. Prioritize hard elements alignment.`;
    }
  }
}

function identifyKeyStrengths(elements: McKinsey7SElement[]): string[] {
  return elements
    .filter((e) => e.alignment_score >= 75 && e.status === 'aligned')
    .map((e) => {
      const name = e.element_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return `${name}: ${e.desired_state || e.current_state}`;
    })
    .slice(0, 5);
}

function identifyCriticalWeaknesses(elements: McKinsey7SElement[]): string[] {
  return elements
    .filter((e) => e.alignment_score < 50 || e.status === 'critical')
    .sort((a, b) => (a.alignment_score || 0) - (b.alignment_score || 0))
    .map((e) => {
      const name = e.element_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return `${name}: ${e.gap_analysis || 'Significant misalignment requiring immediate attention'}`;
    })
    .slice(0, 5);
}

function identifyRiskAreas(elements: McKinsey7SElement[]): string[] {
  const risks: string[] = [];

  const criticalElements = elements.filter((e) => e.status === 'critical');
  if (criticalElements.length > 2) {
    risks.push(`Multiple critical elements (${criticalElements.length}) create systemic organizational risk`);
  }

  const lowScoreElements = elements.filter((e) => (e.alignment_score || 0) < 40);
  if (lowScoreElements.length >= 2) {
    const names = lowScoreElements.map((e) => e.element_type).join(', ');
    risks.push(`Low alignment in ${names} impedes strategy execution`);
  }

  const sharedValues = elements.find((e) => e.element_type === 'shared_values');
  if (sharedValues && (sharedValues.alignment_score || 0) < 60) {
    risks.push('Weak shared values (the central element) undermines all other elements');
  }

  const strategy = elements.find((e) => e.element_type === 'strategy');
  if (strategy && (strategy.alignment_score || 0) < 60) {
    risks.push('Unclear or misaligned strategy creates confusion and wasted resources');
  }

  if (risks.length === 0) {
    risks.push('No critical risks identified - focus on continuous improvement');
  }

  return risks;
}

function identifyQuickWins(elements: McKinsey7SElement[]): string[] {
  return elements
    .filter((e) => e.improvement_priority === 'high' && e.estimated_effort === 'low')
    .map((e) => {
      const name = e.element_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return `${name}: ${e.ai_improvement_suggestions || 'High-impact, low-effort improvements available'}`;
    })
    .slice(0, 5);
}

function identifyStrategicPriorities(elements: McKinsey7SElement[]): string[] {
  const priorities: string[] = [];

  const criticalElements = elements
    .filter((e) => e.status === 'critical' || e.improvement_priority === 'critical')
    .sort((a, b) => (a.alignment_score || 0) - (b.alignment_score || 0));

  for (const element of criticalElements.slice(0, 3)) {
    const name = element.element_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    priorities.push(`Address ${name} misalignment: ${element.gap_analysis || 'Critical priority'}`);
  }

  const highPriorityElements = elements
    .filter((e) => e.improvement_priority === 'high' && e.status !== 'critical')
    .sort((a, b) => (a.alignment_score || 0) - (b.alignment_score || 0));

  for (const element of highPriorityElements.slice(0, 2)) {
    const name = element.element_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    priorities.push(`Improve ${name}: ${element.ai_improvement_suggestions || element.gap_analysis}`);
  }

  if (priorities.length === 0) {
    priorities.push('Maintain current alignment and focus on optimization');
  }

  return priorities.slice(0, 5);
}

function generateElementInsights(element: McKinsey7SElement) {
  const score = element.alignment_score || 0;

  let currentAnalysis = '';
  if (score >= 75) {
    currentAnalysis = `Strong performance with ${score}% alignment. ${element.current_state}`;
  } else if (score >= 50) {
    currentAnalysis = `Moderate performance with ${score}% alignment. ${element.current_state} ${element.gap_analysis}`;
  } else {
    currentAnalysis = `Weak performance with ${score}% alignment requiring immediate attention. ${element.gap_analysis}`;
  }

  const strengths: string[] = [];
  if (element.ai_strengths) {
    strengths.push(element.ai_strengths);
  }
  if (score >= 75) {
    strengths.push('High alignment score indicates effective implementation');
  }
  if (element.maturity_level === 'optimizing' || element.maturity_level === 'managed') {
    strengths.push(`Mature ${element.maturity_level} level demonstrates continuous improvement`);
  }

  const weaknesses: string[] = [];
  if (element.ai_weaknesses) {
    weaknesses.push(element.ai_weaknesses);
  }
  if (score < 50) {
    weaknesses.push('Low alignment score indicates significant gaps');
  }
  if (element.gap_analysis) {
    weaknesses.push(element.gap_analysis);
  }

  const improvementSuggestions: string[] = [];
  if (element.ai_improvement_suggestions) {
    improvementSuggestions.push(element.ai_improvement_suggestions);
  }
  if (element.desired_state) {
    improvementSuggestions.push(`Move toward desired state: ${element.desired_state}`);
  }

  const impactOnOthers = element.ai_impact_on_other_elements ||
    'Changes to this element will require corresponding adjustments in related elements to maintain overall alignment.';

  return {
    current_analysis: currentAnalysis,
    strengths: strengths.length > 0 ? strengths : ['Assessment in progress'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Assessment in progress'],
    improvement_suggestions: improvementSuggestions.length > 0 ? improvementSuggestions : ['Complete assessment for recommendations'],
    impact_on_others: impactOnOthers,
  };
}

function generateRelationshipAnalysis(elements: McKinsey7SElement[]) {
  const relationships: McKinsey7SAIInsights['relationships'] = [];

  const sharedValues = elements.find((e) => e.element_type === 'shared_values');
  if (sharedValues) {
    for (const element of elements) {
      if (element.element_type !== 'shared_values') {
        relationships.push({
          source: 'shared_values',
          target: element.element_type,
          strength: 'strong',
          type: 'supportive',
          analysis: 'Shared values (central element) influence and support this element',
        });
      }
    }
  }

  const strategy = elements.find((e) => e.element_type === 'strategy');
  const structure = elements.find((e) => e.element_type === 'structure');
  if (strategy && structure) {
    relationships.push({
      source: 'strategy',
      target: 'structure',
      strength: 'strong',
      type: 'dependent',
      analysis: 'Structure must align with and enable strategy execution',
    });
  }

  const systems = elements.find((e) => e.element_type === 'systems');
  if (structure && systems) {
    relationships.push({
      source: 'structure',
      target: 'systems',
      strength: 'moderate',
      type: 'supportive',
      analysis: 'Systems and processes must support the organizational structure',
    });
  }

  const skills = elements.find((e) => e.element_type === 'skills');
  if (strategy && skills) {
    relationships.push({
      source: 'strategy',
      target: 'skills',
      strength: 'strong',
      type: 'dependent',
      analysis: 'Skills and capabilities must match strategic requirements',
    });
  }

  const style = elements.find((e) => e.element_type === 'style');
  const staff = elements.find((e) => e.element_type === 'staff');
  if (style && staff) {
    relationships.push({
      source: 'style',
      target: 'staff',
      strength: 'strong',
      type: 'supportive',
      analysis: 'Leadership style significantly impacts staff motivation and performance',
    });
  }

  return relationships.slice(0, 10);
}

export async function generateElementRecommendations(
  element: McKinsey7SElement
): Promise<Partial<McKinsey7SElement>> {
  const score = element.alignment_score || 0;
  const updates: Partial<McKinsey7SElement> = {};

  if (score < 40) {
    updates.improvement_priority = 'critical';
    updates.ai_insights = 'Critical misalignment requiring immediate attention and executive sponsorship';
  } else if (score < 60) {
    updates.improvement_priority = 'high';
    updates.ai_insights = 'Significant gaps that should be addressed in the near term';
  } else if (score < 80) {
    updates.improvement_priority = 'medium';
    updates.ai_insights = 'Moderate alignment with opportunities for improvement';
  } else {
    updates.improvement_priority = 'low';
    updates.ai_insights = 'Strong alignment - focus on maintaining and optimizing';
  }

  if (!element.gap_analysis && element.desired_state && element.current_state) {
    updates.gap_analysis = `Gap between current state and desired state requires focused improvement efforts`;
  }

  return updates;
}

export async function generateImprovementSuggestions(
  element: McKinsey7SElement
): Promise<Partial<McKinsey7SImprovement>[]> {
  const suggestions: Partial<McKinsey7SImprovement>[] = [];
  const score = element.alignment_score || 0;

  if (score < 50) {
    suggestions.push({
      title: `Address critical ${element.element_type} gaps`,
      description: element.gap_analysis || 'Significant misalignment requiring comprehensive intervention',
      category: 'risk_mitigation',
      priority: 'critical',
      effort_level: 'high',
      expected_impact: 'high',
      ai_suggested: true,
      ai_rationale: 'Critical misalignment poses risk to organizational effectiveness',
    });
  }

  if (element.improvement_priority === 'high' && element.estimated_effort === 'low') {
    suggestions.push({
      title: `Quick win: Improve ${element.element_type}`,
      description: element.ai_improvement_suggestions || 'High-impact, low-effort improvement opportunity',
      category: 'quick_win',
      priority: 'high',
      effort_level: 'low',
      expected_impact: 'high',
      ai_suggested: true,
      ai_rationale: 'High impact with low effort makes this an attractive quick win',
    });
  }

  if (!element.desired_state) {
    suggestions.push({
      title: `Define desired state for ${element.element_type}`,
      description: 'Establish clear vision and goals for this element',
      category: 'improvement',
      priority: 'medium',
      effort_level: 'low',
      expected_impact: 'medium',
      ai_suggested: true,
      ai_rationale: 'Clear desired state is essential for effective improvement planning',
    });
  }

  return suggestions;
}
