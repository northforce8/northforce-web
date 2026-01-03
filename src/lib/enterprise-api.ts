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
  StrategicGoal,
  GoalMetric,
  FinancialSnapshot,
  MethodologyTemplate,
  BestPractice,
  PracticeCategory,
  GrowthPlanWithObjectives,
  MarketingCampaignWithActivities
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

  async getBusinessModels(customerId: string): Promise<BusinessModel[]> {
    const { data, error } = await supabase
      .from('business_models')
      .select('*')
      .eq('customer_id', customerId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from('business_models')
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBusinessModel(id: string, updates: Partial<BusinessModel>): Promise<BusinessModel> {
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

  async deleteMethodologyTemplate(id: string): Promise<void> {
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
  }
};
