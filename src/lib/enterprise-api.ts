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
  SwotAnalysisWithItems
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
  }
};
