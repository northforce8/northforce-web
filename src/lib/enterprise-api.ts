import { supabase } from './supabase';
import type {
  GrowthPlan,
  GrowthObjective,
  GrowthInitiative,
  GrowthMilestone,
  LeadershipCompetency,
  LeadershipAssessment,
  AssessmentParticipant,
  AssessmentScore,
  DevelopmentPlan,
  DevelopmentAction,
  MarketingCampaign,
  CampaignActivity,
  CampaignResult,
  BusinessModel,
  BusinessModelWithDetails,
  StrategicGoal,
  GoalMetric,
  FinancialSnapshot,
  MethodologyTemplate,
  BestPractice,
  PracticeCategory,
  GrowthPlanWithObjectives,
  MarketingCampaignWithActivities,
  SwotAnalysis,
  SwotItem,
  SwotAnalysisWithItems,
  PorterAnalysis,
  PorterForce,
  PorterAnalysisWithForces,
  PorterForceType,
  BalancedScorecard,
  BSCPerspective,
  BSCMetric,
  BSCPerspectiveWithMetrics,
  BalancedScorecardWithDetails,
  BSCPerspectiveType,
  BSCMetricStatus,
  ChangeInitiative,
  ADKARAssessment,
  ADKARAction,
  ADKARAssessmentWithActions,
  ChangeInitiativeWithDetails,
  ADKARStage,
  ChangeInitiativeStatus,
  ADKARActionStatus,
  CompletionStatus
} from './enterprise-types';

export const enterpriseAPI = {
  async getGrowthPlans(customerId?: string): Promise<GrowthPlan[]> {
    let query = supabase
      .from('growth_plans')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getGrowthPlanById(id: string): Promise<GrowthPlanWithObjectives | null> {
    const { data, error } = await supabase
      .from('growth_plans')
      .select(`
        *,
        customer:customers(id, company_name),
        objectives:growth_objectives(
          *,
          initiatives:growth_initiatives(*),
          milestones:growth_milestones(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createGrowthPlan(plan: Omit<GrowthPlan, 'id' | 'created_at' | 'updated_at'>): Promise<GrowthPlan> {
    const { data, error } = await supabase
      .from('growth_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGrowthPlan(id: string, updates: Partial<GrowthPlan>): Promise<GrowthPlan> {
    const { data, error } = await supabase
      .from('growth_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGrowthPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('growth_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getGrowthObjectives(planId: string): Promise<GrowthObjective[]> {
    const { data, error } = await supabase
      .from('growth_objectives')
      .select('*')
      .eq('growth_plan_id', planId)
      .order('priority', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createGrowthObjective(objective: Omit<GrowthObjective, 'id' | 'created_at' | 'updated_at'>): Promise<GrowthObjective> {
    const { data, error } = await supabase
      .from('growth_objectives')
      .insert(objective)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGrowthObjective(id: string, updates: Partial<GrowthObjective>): Promise<GrowthObjective> {
    const { data, error } = await supabase
      .from('growth_objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGrowthObjective(id: string): Promise<void> {
    const { error } = await supabase
      .from('growth_objectives')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getGrowthInitiatives(objectiveId: string): Promise<GrowthInitiative[]> {
    const { data, error } = await supabase
      .from('growth_initiatives')
      .select('*')
      .eq('growth_objective_id', objectiveId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createGrowthInitiative(initiative: Omit<GrowthInitiative, 'id' | 'created_at' | 'updated_at'>): Promise<GrowthInitiative> {
    const { data, error } = await supabase
      .from('growth_initiatives')
      .insert(initiative)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGrowthInitiative(id: string, updates: Partial<GrowthInitiative>): Promise<GrowthInitiative> {
    const { data, error } = await supabase
      .from('growth_initiatives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGrowthInitiative(id: string): Promise<void> {
    const { error } = await supabase
      .from('growth_initiatives')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getLeadershipCompetencies(activeOnly = true): Promise<LeadershipCompetency[]> {
    let query = supabase
      .from('leadership_competencies')
      .select('*')
      .order('sort_order', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getLeadershipAssessments(customerId?: string): Promise<LeadershipAssessment[]> {
    let query = supabase
      .from('leadership_assessments')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getLeadershipAssessmentById(id: string) {
    const { data, error } = await supabase
      .from('leadership_assessments')
      .select(`
        *,
        customer:customers(id, company_name),
        participants:assessment_participants(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createLeadershipAssessment(assessment: Omit<LeadershipAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<LeadershipAssessment> {
    const { data, error } = await supabase
      .from('leadership_assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLeadershipAssessment(id: string, updates: Partial<LeadershipAssessment>): Promise<LeadershipAssessment> {
    const { data, error } = await supabase
      .from('leadership_assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createAssessmentParticipant(participant: Omit<AssessmentParticipant, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentParticipant> {
    const { data, error } = await supabase
      .from('assessment_participants')
      .insert(participant)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAssessmentParticipant(id: string, updates: Partial<AssessmentParticipant>): Promise<AssessmentParticipant> {
    const { data, error } = await supabase
      .from('assessment_participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAssessmentScores(participantId: string): Promise<AssessmentScore[]> {
    const { data, error } = await supabase
      .from('assessment_scores')
      .select('*, competency:leadership_competencies(*)')
      .eq('participant_id', participantId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async upsertAssessmentScore(score: Omit<AssessmentScore, 'created_at' | 'updated_at'>): Promise<AssessmentScore> {
    const { data, error } = await supabase
      .from('assessment_scores')
      .upsert(score, {
        onConflict: 'participant_id,competency_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDevelopmentPlans(participantId: string): Promise<DevelopmentPlan[]> {
    const { data, error } = await supabase
      .from('development_plans')
      .select('*')
      .eq('participant_id', participantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createDevelopmentPlan(plan: Omit<DevelopmentPlan, 'id' | 'created_at' | 'updated_at'>): Promise<DevelopmentPlan> {
    const { data, error } = await supabase
      .from('development_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDevelopmentPlan(id: string, updates: Partial<DevelopmentPlan>): Promise<DevelopmentPlan> {
    const { data, error } = await supabase
      .from('development_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDevelopmentActions(planId: string): Promise<DevelopmentAction[]> {
    const { data, error } = await supabase
      .from('development_actions')
      .select('*, competency:leadership_competencies(*)')
      .eq('development_plan_id', planId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createDevelopmentAction(action: Omit<DevelopmentAction, 'id' | 'created_at' | 'updated_at'>): Promise<DevelopmentAction> {
    const { data, error } = await supabase
      .from('development_actions')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDevelopmentAction(id: string, updates: Partial<DevelopmentAction>): Promise<DevelopmentAction> {
    const { data, error } = await supabase
      .from('development_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMarketingCampaigns(customerId?: string): Promise<MarketingCampaign[]> {
    let query = supabase
      .from('marketing_campaigns')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getMarketingCampaignById(id: string): Promise<MarketingCampaignWithActivities | null> {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select(`
        *,
        customer:customers(id, company_name),
        activities:campaign_activities(*),
        results:campaign_results(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMarketingCampaign(campaign: Omit<MarketingCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<MarketingCampaign> {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .insert(campaign)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMarketingCampaign(id: string, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMarketingCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketing_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getCampaignActivities(campaignId: string): Promise<CampaignActivity[]> {
    const { data, error } = await supabase
      .from('campaign_activities')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCampaignActivity(activity: Omit<CampaignActivity, 'id' | 'created_at' | 'updated_at'>): Promise<CampaignActivity> {
    const { data, error } = await supabase
      .from('campaign_activities')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCampaignActivity(id: string, updates: Partial<CampaignActivity>): Promise<CampaignActivity> {
    const { data, error } = await supabase
      .from('campaign_activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createCampaignResult(result: Omit<CampaignResult, 'id' | 'created_at'>): Promise<CampaignResult> {
    const { data, error } = await supabase
      .from('campaign_results')
      .insert(result)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkBusinessModelDependencies(id: string): Promise<{
    hasGrowthPlans: boolean;
    growthPlanCount: number;
    canDelete: boolean;
    blockingReason?: string;
  }> {
    const { data: model } = await supabase
      .from('business_models')
      .select('customer_id')
      .eq('id', id)
      .maybeSingle();

    if (!model) {
      return { hasGrowthPlans: false, growthPlanCount: 0, canDelete: true };
    }

    const { count } = await supabase
      .from('growth_plans')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', model.customer_id);

    const growthPlanCount = count || 0;
    const hasGrowthPlans = growthPlanCount > 0;

    return {
      hasGrowthPlans,
      growthPlanCount,
      canDelete: true,
      blockingReason: hasGrowthPlans
        ? `Observera: Kunden har ${growthPlanCount} tillväxtplaner som kan påverkas.`
        : undefined,
    };
  },

  async getStrategicGoals(customerId: string): Promise<StrategicGoal[]> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .select('*')
      .eq('customer_id', customerId)
      .order('priority', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createStrategicGoal(goal: Omit<StrategicGoal, 'id' | 'created_at' | 'updated_at'>): Promise<StrategicGoal> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStrategicGoal(id: string, updates: Partial<StrategicGoal>): Promise<StrategicGoal> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGoalMetrics(goalId: string): Promise<GoalMetric[]> {
    const { data, error } = await supabase
      .from('goal_metrics')
      .select('*')
      .eq('strategic_goal_id', goalId)
      .order('measurement_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createGoalMetric(metric: Omit<GoalMetric, 'id' | 'created_at'>): Promise<GoalMetric> {
    const { data, error } = await supabase
      .from('goal_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFinancialSnapshots(customerId: string): Promise<FinancialSnapshot[]> {
    const { data, error } = await supabase
      .from('financial_snapshots')
      .select('*')
      .eq('customer_id', customerId)
      .order('snapshot_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createFinancialSnapshot(snapshot: Omit<FinancialSnapshot, 'id' | 'created_at'>): Promise<FinancialSnapshot> {
    const { data, error } = await supabase
      .from('financial_snapshots')
      .insert(snapshot)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMethodologyTemplates(category?: string): Promise<MethodologyTemplate[]> {
    let query = supabase
      .from('methodology_templates')
      .select('*')
      .eq('is_public', true)
      .order('template_name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getMethodologyTemplateById(id: string): Promise<MethodologyTemplate | null> {
    const { data, error } = await supabase
      .from('methodology_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMethodologyTemplate(template: Omit<MethodologyTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<MethodologyTemplate> {
    const { data, error } = await supabase
      .from('methodology_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMethodologyTemplate(id: string, updates: Partial<MethodologyTemplate>): Promise<MethodologyTemplate> {
    const { data, error } = await supabase
      .from('methodology_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkMethodologyTemplateDependencies(id: string): Promise<{
    isUsedByProjects: boolean;
    projectCount: number;
    canDelete: boolean;
    blockingReason?: string;
  }> {
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('methodology_template_id', id);

    const projectCount = projects?.length || 0;
    const isUsedByProjects = projectCount > 0;

    return {
      isUsedByProjects,
      projectCount,
      canDelete: !isUsedByProjects,
      blockingReason: isUsedByProjects
        ? `Mallen används av ${projectCount} projekt och kan inte raderas.`
        : undefined,
    };
  },

  async deleteMethodologyTemplate(id: string): Promise<void> {
    const dependencies = await this.checkMethodologyTemplateDependencies(id);
    if (!dependencies.canDelete) {
      throw new Error(dependencies.blockingReason || 'Cannot delete template with dependencies');
    }

    const { error } = await supabase
      .from('methodology_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBestPractices(category?: string): Promise<BestPractice[]> {
    let query = supabase
      .from('best_practices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getBestPracticeById(id: string): Promise<BestPractice | null> {
    const { data, error } = await supabase
      .from('best_practices')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await supabase
        .from('best_practices')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id);
    }

    return data;
  },

  async createBestPractice(practice: Omit<BestPractice, 'id' | 'created_at' | 'updated_at'>): Promise<BestPractice> {
    const { data, error } = await supabase
      .from('best_practices')
      .insert(practice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBestPractice(id: string, updates: Partial<BestPractice>): Promise<BestPractice> {
    const { data, error } = await supabase
      .from('best_practices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkBestPracticeDependencies(id: string): Promise<{
    canDelete: boolean;
    viewCount: number;
    isPublished: boolean;
    warningMessage?: string;
  }> {
    const { data: practice } = await supabase
      .from('best_practices')
      .select('view_count, is_published')
      .eq('id', id)
      .maybeSingle();

    const viewCount = practice?.view_count || 0;
    const isPublished = practice?.is_published || false;

    return {
      canDelete: true,
      viewCount,
      isPublished,
      warningMessage: isPublished && viewCount > 0
        ? `Denna best practice har ${viewCount} visningar och är publicerad.`
        : undefined,
    };
  },

  async deleteBestPractice(id: string): Promise<void> {
    const { error } = await supabase
      .from('best_practices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPracticeCategories(): Promise<PracticeCategory[]> {
    const { data, error } = await supabase
      .from('practice_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getSwotAnalyses(customerId?: string): Promise<SwotAnalysis[]> {
    let query = supabase
      .from('swot_analyses')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getSwotAnalysisById(id: string): Promise<SwotAnalysisWithItems | null> {
    const { data, error } = await supabase
      .from('swot_analyses')
      .select(`
        *,
        customer:customers(id, company_name),
        items:swot_items(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data && data.items) {
      const strengths = data.items.filter((item: SwotItem) => item.category === 'strength');
      const weaknesses = data.items.filter((item: SwotItem) => item.category === 'weakness');
      const opportunities = data.items.filter((item: SwotItem) => item.category === 'opportunity');
      const threats = data.items.filter((item: SwotItem) => item.category === 'threat');

      return {
        ...data,
        strengths,
        weaknesses,
        opportunities,
        threats
      };
    }

    return data;
  },

  async createSwotAnalysis(analysis: Omit<SwotAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<SwotAnalysis> {
    const { data, error } = await supabase
      .from('swot_analyses')
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSwotAnalysis(id: string, updates: Partial<SwotAnalysis>): Promise<SwotAnalysis> {
    const { data, error } = await supabase
      .from('swot_analyses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSwotAnalysis(id: string): Promise<void> {
    const { error } = await supabase
      .from('swot_analyses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getSwotItems(swotAnalysisId: string): Promise<SwotItem[]> {
    const { data, error } = await supabase
      .from('swot_items')
      .select('*')
      .eq('swot_analysis_id', swotAnalysisId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getSwotItemsByCategory(swotAnalysisId: string, category: 'strength' | 'weakness' | 'opportunity' | 'threat'): Promise<SwotItem[]> {
    const { data, error } = await supabase
      .from('swot_items')
      .select('*')
      .eq('swot_analysis_id', swotAnalysisId)
      .eq('category', category)
      .order('impact_level', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSwotItem(item: Omit<SwotItem, 'id' | 'created_at' | 'updated_at'>): Promise<SwotItem> {
    const { data, error } = await supabase
      .from('swot_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSwotItem(id: string, updates: Partial<SwotItem>): Promise<SwotItem> {
    const { data, error } = await supabase
      .from('swot_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSwotItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('swot_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getSwotStatistics(swotAnalysisId: string): Promise<{
    total_items: number;
    strengths_count: number;
    weaknesses_count: number;
    opportunities_count: number;
    threats_count: number;
    high_impact_count: number;
    actionable_count: number;
  }> {
    const items = await this.getSwotItems(swotAnalysisId);

    return {
      total_items: items.length,
      strengths_count: items.filter(i => i.category === 'strength').length,
      weaknesses_count: items.filter(i => i.category === 'weakness').length,
      opportunities_count: items.filter(i => i.category === 'opportunity').length,
      threats_count: items.filter(i => i.category === 'threat').length,
      high_impact_count: items.filter(i => i.impact_level === 'high' || i.impact_level === 'critical').length,
      actionable_count: items.filter(i => i.actionable).length,
    };
  },

  async getBusinessModels(customerId?: string): Promise<BusinessModel[]> {
    let query = supabase
      .from('business_models')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getBusinessModelById(id: string): Promise<BusinessModelWithDetails | null> {
    const { data, error } = await supabase
      .from('business_models')
      .select('*, customer:customers(id, company_name)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const { data: previousVersions } = await supabase
        .from('business_models')
        .select('*')
        .eq('customer_id', data.customer_id)
        .neq('id', id)
        .order('version', { ascending: false })
        .limit(5);

      return {
        ...data,
        previous_versions: previousVersions || []
      };
    }

    return data;
  },

  async getCurrentBusinessModel(customerId: string): Promise<BusinessModel | null> {
    const { data, error } = await supabase
      .from('business_models')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_current', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createBusinessModel(model: Omit<BusinessModel, 'id' | 'created_at' | 'updated_at'>): Promise<BusinessModel> {
    if (model.is_current) {
      await supabase
        .from('business_models')
        .update({ is_current: false })
        .eq('customer_id', model.customer_id);
    }

    const { data, error } = await supabase
      .from('business_models')
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBusinessModel(id: string, updates: Partial<BusinessModel>): Promise<BusinessModel> {
    if (updates.is_current) {
      const model = await this.getBusinessModelById(id);
      if (model) {
        await supabase
          .from('business_models')
          .update({ is_current: false })
          .eq('customer_id', model.customer_id)
          .neq('id', id);
      }
    }

    const { data, error } = await supabase
      .from('business_models')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBusinessModel(id: string): Promise<void> {
    const { error } = await supabase
      .from('business_models')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async createBusinessModelVersion(modelId: string): Promise<BusinessModel> {
    const original = await this.getBusinessModelById(modelId);
    if (!original) throw new Error('Business model not found');

    const newVersion: Omit<BusinessModel, 'id' | 'created_at' | 'updated_at'> = {
      customer_id: original.customer_id,
      model_name: `${original.model_name} (v${original.version + 1})`,
      value_proposition: original.value_proposition,
      customer_segments: original.customer_segments,
      channels: original.channels,
      customer_relationships: original.customer_relationships,
      revenue_streams: original.revenue_streams,
      key_resources: original.key_resources,
      key_activities: original.key_activities,
      key_partnerships: original.key_partnerships,
      cost_structure: original.cost_structure,
      competitive_advantage: original.competitive_advantage,
      version: original.version + 1,
      is_current: false,
      created_by: original.created_by
    };

    return await this.createBusinessModel(newVersion);
  },

  async compareBusinessModels(currentId: string, previousId: string): Promise<{
    added: Record<string, string[]>;
    removed: Record<string, string[]>;
    modified: Record<string, { before: string[]; after: string[] }>;
  }> {
    const [current, previous] = await Promise.all([
      this.getBusinessModelById(currentId),
      this.getBusinessModelById(previousId)
    ]);

    if (!current || !previous) {
      throw new Error('Models not found');
    }

    const buildingBlocks = [
      'customer_segments',
      'channels',
      'customer_relationships',
      'revenue_streams',
      'key_resources',
      'key_activities',
      'key_partnerships',
      'cost_structure'
    ] as const;

    const result: {
      added: Record<string, string[]>;
      removed: Record<string, string[]>;
      modified: Record<string, { before: string[]; after: string[] }>;
    } = {
      added: {},
      removed: {},
      modified: {}
    };

    for (const block of buildingBlocks) {
      const currentItems = current[block] || [];
      const previousItems = previous[block] || [];

      const added = currentItems.filter(item => !previousItems.includes(item));
      const removed = previousItems.filter(item => !currentItems.includes(item));

      if (added.length > 0) {
        result.added[block] = added;
      }

      if (removed.length > 0) {
        result.removed[block] = removed;
      }

      if (added.length > 0 || removed.length > 0) {
        result.modified[block] = {
          before: previousItems,
          after: currentItems
        };
      }
    }

    if (current.value_proposition !== previous.value_proposition) {
      result.modified['value_proposition'] = {
        before: [previous.value_proposition || ''],
        after: [current.value_proposition || '']
      };
    }

    return result;
  },

  async getBusinessModelStatistics(modelId: string): Promise<{
    total_building_blocks: number;
    completed_blocks: number;
    completion_percentage: number;
    total_items: number;
    items_per_block: Record<string, number>;
  }> {
    const model = await this.getBusinessModelById(modelId);
    if (!model) throw new Error('Business model not found');

    const buildingBlocks = [
      'customer_segments',
      'channels',
      'customer_relationships',
      'revenue_streams',
      'key_resources',
      'key_activities',
      'key_partnerships',
      'cost_structure'
    ] as const;

    let completedBlocks = 0;
    let totalItems = 0;
    const itemsPerBlock: Record<string, number> = {};

    if (model.value_proposition && model.value_proposition.length > 0) {
      completedBlocks++;
    }

    for (const block of buildingBlocks) {
      const items = model[block] || [];
      itemsPerBlock[block] = items.length;
      totalItems += items.length;

      if (items.length > 0) {
        completedBlocks++;
      }
    }

    return {
      total_building_blocks: 9,
      completed_blocks: completedBlocks,
      completion_percentage: Math.round((completedBlocks / 9) * 100),
      total_items: totalItems,
      items_per_block: itemsPerBlock
    };
  },

  async getPorterAnalyses(customerId?: string): Promise<PorterAnalysis[]> {
    let query = supabase
      .from('porter_analyses')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getPorterAnalysisById(id: string): Promise<PorterAnalysisWithForces | null> {
    const { data: analysis, error: analysisError } = await supabase
      .from('porter_analyses')
      .select('*, customer:customers(id, company_name)')
      .eq('id', id)
      .maybeSingle();

    if (analysisError) throw analysisError;
    if (!analysis) return null;

    const { data: forces, error: forcesError } = await supabase
      .from('porter_forces')
      .select('*')
      .eq('porter_analysis_id', id)
      .order('force_type');

    if (forcesError) throw forcesError;

    return {
      ...analysis,
      forces: forces || []
    };
  },

  async createPorterAnalysis(
    analysis: Omit<PorterAnalysis, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PorterAnalysis> {
    const { data, error } = await supabase
      .from('porter_analyses')
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePorterAnalysis(
    id: string,
    updates: Partial<PorterAnalysis>
  ): Promise<PorterAnalysis> {
    const { data, error } = await supabase
      .from('porter_analyses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePorterAnalysis(id: string): Promise<void> {
    await supabase
      .from('porter_forces')
      .delete()
      .eq('porter_analysis_id', id);

    const { error } = await supabase
      .from('porter_analyses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPorterForces(analysisId: string): Promise<PorterForce[]> {
    const { data, error } = await supabase
      .from('porter_forces')
      .select('*')
      .eq('porter_analysis_id', analysisId)
      .order('force_type');

    if (error) throw error;
    return data || [];
  },

  async getPorterForceById(id: string): Promise<PorterForce | null> {
    const { data, error } = await supabase
      .from('porter_forces')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getPorterForceByType(
    analysisId: string,
    forceType: PorterForceType
  ): Promise<PorterForce | null> {
    const { data, error } = await supabase
      .from('porter_forces')
      .select('*')
      .eq('porter_analysis_id', analysisId)
      .eq('force_type', forceType)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createPorterForce(
    force: Omit<PorterForce, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PorterForce> {
    const { data, error } = await supabase
      .from('porter_forces')
      .insert(force)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePorterForce(
    id: string,
    updates: Partial<PorterForce>
  ): Promise<PorterForce> {
    const { data, error } = await supabase
      .from('porter_forces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePorterForce(id: string): Promise<void> {
    const { error } = await supabase
      .from('porter_forces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async upsertPorterForce(
    analysisId: string,
    forceType: PorterForceType,
    forceData: Partial<PorterForce>
  ): Promise<PorterForce> {
    const existing = await this.getPorterForceByType(analysisId, forceType);

    if (existing) {
      return await this.updatePorterForce(existing.id, forceData);
    } else {
      return await this.createPorterForce({
        porter_analysis_id: analysisId,
        force_type: forceType,
        intensity_rating: forceData.intensity_rating || 5,
        description: forceData.description,
        key_factors: forceData.key_factors || [],
        strategic_implications: forceData.strategic_implications
      });
    }
  },

  async calculateOverallAttractiveness(analysisId: string): Promise<number> {
    const forces = await this.getPorterForces(analysisId);

    if (forces.length === 0) return 50;

    const totalIntensity = forces.reduce((sum, force) => sum + force.intensity_rating, 0);
    const averageIntensity = totalIntensity / forces.length;

    const attractiveness = 100 - (averageIntensity * 10);

    await this.updatePorterAnalysis(analysisId, {
      overall_attractiveness: Math.round(attractiveness)
    });

    return Math.round(attractiveness);
  },

  async getPorterAnalysisStatistics(analysisId: string): Promise<{
    total_forces: number;
    completed_forces: number;
    average_intensity: number;
    highest_threat: { force_type: PorterForceType; intensity: number } | null;
    lowest_threat: { force_type: PorterForceType; intensity: number } | null;
    overall_market_attractiveness: number;
  }> {
    const forces = await this.getPorterForces(analysisId);

    if (forces.length === 0) {
      return {
        total_forces: 5,
        completed_forces: 0,
        average_intensity: 0,
        highest_threat: null,
        lowest_threat: null,
        overall_market_attractiveness: 50
      };
    }

    const completedForces = forces.filter(f => f.description && f.key_factors.length > 0);
    const totalIntensity = forces.reduce((sum, f) => sum + f.intensity_rating, 0);
    const avgIntensity = totalIntensity / forces.length;

    const sortedByIntensity = [...forces].sort((a, b) => b.intensity_rating - a.intensity_rating);
    const highest = sortedByIntensity[0];
    const lowest = sortedByIntensity[sortedByIntensity.length - 1];

    const attractiveness = 100 - (avgIntensity * 10);

    return {
      total_forces: 5,
      completed_forces: completedForces.length,
      average_intensity: Math.round(avgIntensity * 10) / 10,
      highest_threat: { force_type: highest.force_type, intensity: highest.intensity_rating },
      lowest_threat: { force_type: lowest.force_type, intensity: lowest.intensity_rating },
      overall_market_attractiveness: Math.round(attractiveness)
    };
  },

  async getBalancedScorecards(customerId?: string): Promise<BalancedScorecard[]> {
    let query = supabase
      .from('balanced_scorecards')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getBalancedScorecardById(id: string): Promise<BalancedScorecardWithDetails | null> {
    const { data: scorecard, error: scorecardError } = await supabase
      .from('balanced_scorecards')
      .select('*, customer:customers(id, company_name)')
      .eq('id', id)
      .maybeSingle();

    if (scorecardError) throw scorecardError;
    if (!scorecard) return null;

    const { data: perspectives, error: perspectivesError } = await supabase
      .from('bsc_perspectives')
      .select('*')
      .eq('scorecard_id', id)
      .order('perspective_type');

    if (perspectivesError) throw perspectivesError;

    const perspectivesWithMetrics: BSCPerspectiveWithMetrics[] = [];

    for (const perspective of perspectives || []) {
      const { data: metrics, error: metricsError } = await supabase
        .from('bsc_metrics')
        .select('*')
        .eq('perspective_id', perspective.id)
        .order('metric_name');

      if (metricsError) throw metricsError;

      perspectivesWithMetrics.push({
        ...perspective,
        metrics: metrics || []
      });
    }

    return {
      ...scorecard,
      perspectives: perspectivesWithMetrics
    };
  },

  async createBalancedScorecard(
    scorecard: Omit<BalancedScorecard, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BalancedScorecard> {
    const { data, error } = await supabase
      .from('balanced_scorecards')
      .insert(scorecard)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBalancedScorecard(
    id: string,
    updates: Partial<BalancedScorecard>
  ): Promise<BalancedScorecard> {
    const { data, error } = await supabase
      .from('balanced_scorecards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBalancedScorecard(id: string): Promise<void> {
    const perspectives = await this.getBSCPerspectives(id);

    for (const perspective of perspectives) {
      await supabase
        .from('bsc_metrics')
        .delete()
        .eq('perspective_id', perspective.id);
    }

    await supabase
      .from('bsc_perspectives')
      .delete()
      .eq('scorecard_id', id);

    const { error } = await supabase
      .from('balanced_scorecards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBSCPerspectives(scorecardId: string): Promise<BSCPerspective[]> {
    const { data, error } = await supabase
      .from('bsc_perspectives')
      .select('*')
      .eq('scorecard_id', scorecardId)
      .order('perspective_type');

    if (error) throw error;
    return data || [];
  },

  async getBSCPerspectiveById(id: string): Promise<BSCPerspectiveWithMetrics | null> {
    const { data: perspective, error: perspectiveError } = await supabase
      .from('bsc_perspectives')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (perspectiveError) throw perspectiveError;
    if (!perspective) return null;

    const { data: metrics, error: metricsError } = await supabase
      .from('bsc_metrics')
      .select('*')
      .eq('perspective_id', id)
      .order('metric_name');

    if (metricsError) throw metricsError;

    return {
      ...perspective,
      metrics: metrics || []
    };
  },

  async createBSCPerspective(
    perspective: Omit<BSCPerspective, 'id' | 'created_at'>
  ): Promise<BSCPerspective> {
    const { data, error } = await supabase
      .from('bsc_perspectives')
      .insert(perspective)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBSCPerspective(
    id: string,
    updates: Partial<BSCPerspective>
  ): Promise<BSCPerspective> {
    const { data, error } = await supabase
      .from('bsc_perspectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBSCPerspective(id: string): Promise<void> {
    await supabase
      .from('bsc_metrics')
      .delete()
      .eq('perspective_id', id);

    const { error } = await supabase
      .from('bsc_perspectives')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBSCMetrics(perspectiveId: string): Promise<BSCMetric[]> {
    const { data, error } = await supabase
      .from('bsc_metrics')
      .select('*')
      .eq('perspective_id', perspectiveId)
      .order('metric_name');

    if (error) throw error;
    return data || [];
  },

  async getBSCMetricById(id: string): Promise<BSCMetric | null> {
    const { data, error } = await supabase
      .from('bsc_metrics')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createBSCMetric(
    metric: Omit<BSCMetric, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BSCMetric> {
    const { data, error } = await supabase
      .from('bsc_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBSCMetric(
    id: string,
    updates: Partial<BSCMetric>
  ): Promise<BSCMetric> {
    const { data, error } = await supabase
      .from('bsc_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBSCMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('bsc_metrics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateBSCMetricValue(
    id: string,
    currentValue: number
  ): Promise<BSCMetric> {
    const metric = await this.getBSCMetricById(id);
    if (!metric) throw new Error('Metric not found');

    let status: BSCMetricStatus = 'not_started';

    if (metric.target_value) {
      const progress = (currentValue / metric.target_value) * 100;

      if (progress >= 100) {
        status = 'achieved';
      } else if (progress >= 80) {
        status = 'on_track';
      } else if (progress >= 60) {
        status = 'at_risk';
      } else {
        status = 'off_track';
      }
    }

    return await this.updateBSCMetric(id, {
      current_value: currentValue,
      status
    });
  },

  async getBSCScorecardStatistics(scorecardId: string): Promise<{
    total_perspectives: number;
    total_metrics: number;
    metrics_by_perspective: Record<BSCPerspectiveType, number>;
    metrics_by_status: Record<BSCMetricStatus, number>;
    overall_completion: number;
    perspectives_with_data: number;
    average_progress: number;
  }> {
    const perspectives = await this.getBSCPerspectives(scorecardId);

    let totalMetrics = 0;
    const metricsByPerspective: Record<BSCPerspectiveType, number> = {
      financial: 0,
      customer: 0,
      internal_process: 0,
      learning_growth: 0
    };
    const metricsByStatus: Record<BSCMetricStatus, number> = {
      on_track: 0,
      at_risk: 0,
      off_track: 0,
      achieved: 0,
      not_started: 0
    };

    let totalProgress = 0;
    let metricsWithValues = 0;

    for (const perspective of perspectives) {
      const metrics = await this.getBSCMetrics(perspective.id);
      totalMetrics += metrics.length;
      metricsByPerspective[perspective.perspective_type] = metrics.length;

      for (const metric of metrics) {
        if (metric.status) {
          metricsByStatus[metric.status]++;
        }

        if (metric.current_value !== null && metric.target_value !== null) {
          const progress = (metric.current_value / metric.target_value) * 100;
          totalProgress += Math.min(progress, 100);
          metricsWithValues++;
        }
      }
    }

    const perspectivesWithData = perspectives.filter(p =>
      metricsByPerspective[p.perspective_type] > 0
    ).length;

    return {
      total_perspectives: 4,
      total_metrics: totalMetrics,
      metrics_by_perspective: metricsByPerspective,
      metrics_by_status: metricsByStatus,
      overall_completion: metricsWithValues > 0 ? Math.round(totalProgress / metricsWithValues) : 0,
      perspectives_with_data: perspectivesWithData,
      average_progress: metricsWithValues > 0 ? Math.round(totalProgress / metricsWithValues) : 0
    };
  },

  async getBSCPerspectiveByType(
    scorecardId: string,
    perspectiveType: BSCPerspectiveType
  ): Promise<BSCPerspectiveWithMetrics | null> {
    const { data: perspective, error: perspectiveError } = await supabase
      .from('bsc_perspectives')
      .select('*')
      .eq('scorecard_id', scorecardId)
      .eq('perspective_type', perspectiveType)
      .maybeSingle();

    if (perspectiveError) throw perspectiveError;
    if (!perspective) return null;

    const { data: metrics, error: metricsError } = await supabase
      .from('bsc_metrics')
      .select('*')
      .eq('perspective_id', perspective.id)
      .order('metric_name');

    if (metricsError) throw metricsError;

    return {
      ...perspective,
      metrics: metrics || []
    };
  },

  async upsertBSCPerspective(
    scorecardId: string,
    perspectiveType: BSCPerspectiveType,
    perspectiveData: Partial<BSCPerspective>
  ): Promise<BSCPerspective> {
    const existing = await this.getBSCPerspectiveByType(scorecardId, perspectiveType);

    if (existing) {
      return await this.updateBSCPerspective(existing.id, perspectiveData);
    } else {
      return await this.createBSCPerspective({
        scorecard_id: scorecardId,
        perspective_type: perspectiveType,
        objective: perspectiveData.objective || '',
        description: perspectiveData.description,
        target: perspectiveData.target
      });
    }
  },

  async getChangeInitiatives(customerId?: string): Promise<ChangeInitiative[]> {
    let query = supabase
      .from('change_initiatives')
      .select('*, customer:customers(id, company_name)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getChangeInitiativeById(id: string): Promise<ChangeInitiativeWithDetails | null> {
    const { data: initiative, error: initiativeError } = await supabase
      .from('change_initiatives')
      .select('*, customer:customers(id, company_name)')
      .eq('id', id)
      .maybeSingle();

    if (initiativeError) throw initiativeError;
    if (!initiative) return null;

    const { data: assessments, error: assessmentsError } = await supabase
      .from('adkar_assessments')
      .select('*')
      .eq('initiative_id', id)
      .order('stage');

    if (assessmentsError) throw assessmentsError;

    const assessmentsWithActions: ADKARAssessmentWithActions[] = [];

    for (const assessment of assessments || []) {
      const { data: actions, error: actionsError } = await supabase
        .from('adkar_actions')
        .select('*')
        .eq('assessment_id', assessment.id)
        .order('created_at');

      if (actionsError) throw actionsError;

      assessmentsWithActions.push({
        ...assessment,
        actions: actions || []
      });
    }

    return {
      ...initiative,
      assessments: assessmentsWithActions
    };
  },

  async createChangeInitiative(
    initiative: Omit<ChangeInitiative, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ChangeInitiative> {
    const { data, error } = await supabase
      .from('change_initiatives')
      .insert(initiative)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChangeInitiative(
    id: string,
    updates: Partial<ChangeInitiative>
  ): Promise<ChangeInitiative> {
    const { data, error } = await supabase
      .from('change_initiatives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteChangeInitiative(id: string): Promise<void> {
    const assessments = await this.getADKARAssessments(id);

    for (const assessment of assessments) {
      await supabase
        .from('adkar_actions')
        .delete()
        .eq('assessment_id', assessment.id);
    }

    await supabase
      .from('adkar_assessments')
      .delete()
      .eq('initiative_id', id);

    const { error } = await supabase
      .from('change_initiatives')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getADKARAssessments(initiativeId: string): Promise<ADKARAssessment[]> {
    const { data, error } = await supabase
      .from('adkar_assessments')
      .select('*')
      .eq('initiative_id', initiativeId)
      .order('stage');

    if (error) throw error;
    return data || [];
  },

  async getADKARAssessmentById(id: string): Promise<ADKARAssessmentWithActions | null> {
    const { data: assessment, error: assessmentError } = await supabase
      .from('adkar_assessments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (assessmentError) throw assessmentError;
    if (!assessment) return null;

    const { data: actions, error: actionsError } = await supabase
      .from('adkar_actions')
      .select('*')
      .eq('assessment_id', id)
      .order('created_at');

    if (actionsError) throw actionsError;

    return {
      ...assessment,
      actions: actions || []
    };
  },

  async getADKARAssessmentByStage(
    initiativeId: string,
    stage: ADKARStage
  ): Promise<ADKARAssessmentWithActions | null> {
    const { data: assessment, error: assessmentError } = await supabase
      .from('adkar_assessments')
      .select('*')
      .eq('initiative_id', initiativeId)
      .eq('stage', stage)
      .maybeSingle();

    if (assessmentError) throw assessmentError;
    if (!assessment) return null;

    const { data: actions, error: actionsError } = await supabase
      .from('adkar_actions')
      .select('*')
      .eq('assessment_id', assessment.id)
      .order('created_at');

    if (actionsError) throw actionsError;

    return {
      ...assessment,
      actions: actions || []
    };
  },

  async createADKARAssessment(
    assessment: Omit<ADKARAssessment, 'id' | 'created_at'>
  ): Promise<ADKARAssessment> {
    const { data, error } = await supabase
      .from('adkar_assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateADKARAssessment(
    id: string,
    updates: Partial<ADKARAssessment>
  ): Promise<ADKARAssessment> {
    const { data, error } = await supabase
      .from('adkar_assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteADKARAssessment(id: string): Promise<void> {
    await supabase
      .from('adkar_actions')
      .delete()
      .eq('assessment_id', id);

    const { error } = await supabase
      .from('adkar_assessments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async upsertADKARAssessment(
    initiativeId: string,
    stage: ADKARStage,
    assessmentData: Partial<ADKARAssessment>
  ): Promise<ADKARAssessment> {
    const existing = await this.getADKARAssessmentByStage(initiativeId, stage);

    if (existing) {
      return await this.updateADKARAssessment(existing.id, assessmentData);
    } else {
      return await this.createADKARAssessment({
        initiative_id: initiativeId,
        stage,
        score: assessmentData.score,
        assessment_notes: assessmentData.assessment_notes,
        barriers: assessmentData.barriers,
        actions_required: assessmentData.actions_required,
        completion_status: assessmentData.completion_status || 'not_started',
        assessed_by: assessmentData.assessed_by,
        assessed_at: assessmentData.assessed_at
      });
    }
  },

  async getADKARActions(assessmentId: string): Promise<ADKARAction[]> {
    const { data, error } = await supabase
      .from('adkar_actions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async getADKARActionById(id: string): Promise<ADKARAction | null> {
    const { data, error } = await supabase
      .from('adkar_actions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createADKARAction(
    action: Omit<ADKARAction, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ADKARAction> {
    const { data, error } = await supabase
      .from('adkar_actions')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateADKARAction(
    id: string,
    updates: Partial<ADKARAction>
  ): Promise<ADKARAction> {
    const { data, error } = await supabase
      .from('adkar_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteADKARAction(id: string): Promise<void> {
    const { error } = await supabase
      .from('adkar_actions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateADKARActionStatus(
    id: string,
    status: ADKARActionStatus
  ): Promise<ADKARAction> {
    return await this.updateADKARAction(id, { status });
  },

  async getChangeInitiativeStatistics(initiativeId: string): Promise<{
    total_stages: number;
    stages_by_status: Record<CompletionStatus, number>;
    overall_score: number;
    total_actions: number;
    actions_by_status: Record<ADKARActionStatus, number>;
    completion_percentage: number;
    bottleneck_stage?: ADKARStage;
    strongest_stage?: ADKARStage;
  }> {
    const assessments = await this.getADKARAssessments(initiativeId);

    const statusCounts: Record<CompletionStatus, number> = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      needs_attention: 0
    };

    const actionStatusCounts: Record<ADKARActionStatus, number> = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      blocked: 0
    };

    let totalScore = 0;
    let totalActions = 0;
    let lowestScore = 100;
    let highestScore = 0;
    let bottleneckStage: ADKARStage | undefined;
    let strongestStage: ADKARStage | undefined;

    for (const assessment of assessments) {
      if (assessment.completion_status) {
        statusCounts[assessment.completion_status]++;
      }

      const score = assessment.score || 0;
      totalScore += score;

      if (score < lowestScore) {
        lowestScore = score;
        bottleneckStage = assessment.stage;
      }

      if (score > highestScore) {
        highestScore = score;
        strongestStage = assessment.stage;
      }

      const actions = await this.getADKARActions(assessment.id);
      totalActions += actions.length;

      for (const action of actions) {
        if (action.status) {
          actionStatusCounts[action.status]++;
        }
      }
    }

    const averageScore = assessments.length > 0 ? totalScore / assessments.length : 0;
    const completionPercentage = assessments.length > 0
      ? (statusCounts.completed / assessments.length) * 100
      : 0;

    return {
      total_stages: 5,
      stages_by_status: statusCounts,
      overall_score: Math.round(averageScore),
      total_actions: totalActions,
      actions_by_status: actionStatusCounts,
      completion_percentage: Math.round(completionPercentage),
      bottleneck_stage: bottleneckStage,
      strongest_stage: strongestStage
    };
  },

  async updateChangeInitiativeProgress(initiativeId: string): Promise<ChangeInitiative> {
    const stats = await this.getChangeInitiativeStatistics(initiativeId);

    return await this.updateChangeInitiative(initiativeId, {
      overall_progress: stats.completion_percentage
    });
  }
};
