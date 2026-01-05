import { supabase } from './supabase';
import type {
  Partner,
  PartnerRole,
  PartnerWorkTypeAssignment,
  PartnerWorkTypeAssignmentWithRelations,
  PartnerCapacityPeriod,
  PartnerCapacityPeriodWithRelations,
  PartnerPerformanceMetrics,
  PartnerPerformanceMetricsWithRelations,
  PartnerWorkloadRecommendation,
  PartnerWorkloadRecommendationWithRelations,
  PartnerAvailabilitySummary,
  Customer,
  CustomerAssignment,
  Project,
  ProjectAssignment,
  WorkType,
  TimeEntry,
  Note,
  TimeEntryWithRelations,
  NoteWithRelations,
  CustomerWithStats,
  PartnerWithStats,
  CreditsTransaction,
  CreditsTransactionWithRelations,
  DecisionLog,
  DecisionLogWithRelations,
  CapacityRule,
  Recommendation,
  RecommendationWithRelations,
  StatusChangeLog,
  CustomerWithFullStats,
  EnterprisePlan,
  SupportTicket,
  SupportTicketWithRelations,
  SupportResponse,
  SlaTracking,
  SlaTrackingWithRelations,
  EnterpriseBenefit,
  EnterpriseBenefitWithRelations,
  PartnerCostRate,
  CreditsForecast,
  CreditsForecastWithRelations,
  MarginAnalysis,
  MarginAnalysisWithRelations,
  CapacityUtilization,
  CapacityUtilizationWithRelations,
  BillingPeriod,
  BillingPeriodWithRelations,
  DashboardMetrics,
  PartnerPerformance,
  SystemSettings,
  SettingsAuditLog,
  WorkTypeUsageInfo,
} from './partner-portal-types';

export const partnerPortalApi = {
  partners: {
    async getAll(): Promise<Partner[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('partner_name');
      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<Partner | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async getByUserId(userId: string): Promise<Partner | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Partner>): Promise<Partner> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partners')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    async getAvailabilitySummary(): Promise<PartnerAvailabilitySummary[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partner_availability_summary')
        .select('*')
        .order('utilization_percentage', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getPerformanceMetrics(partnerId: string, startDate?: string, endDate?: string): Promise<PartnerPerformanceMetrics | null> {
      if (!supabase) return null;

      const periodStart = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const periodEnd = endDate || new Date().toISOString().split('T')[0];

      const { data: rawData, error: rawError } = await supabase
        .rpc('calculate_partner_performance_metrics', {
          p_partner_id: partnerId,
          p_period_start: periodStart,
          p_period_end: periodEnd
        });

      if (rawError) throw rawError;
      if (!rawData) return null;

      const { data, error } = await supabase
        .from('partner_performance_metrics')
        .insert(rawData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  partnerRoles: {
    async getAll(): Promise<PartnerRole[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partner_roles')
        .select('*')
        .eq('is_active', true)
        .order('role_name');
      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<PartnerRole | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('partner_roles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(role: Omit<PartnerRole, 'id' | 'created_at'>): Promise<PartnerRole> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_roles')
        .insert(role)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<PartnerRole>): Promise<PartnerRole> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  partnerWorkTypeAssignments: {
    async getByPartner(partnerId: string): Promise<PartnerWorkTypeAssignmentWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partner_work_type_assignments')
        .select(`
          *,
          work_type:work_types(*)
        `)
        .eq('partner_id', partnerId)
        .order('is_primary', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(assignment: Omit<PartnerWorkTypeAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<PartnerWorkTypeAssignment> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_work_type_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<PartnerWorkTypeAssignment>): Promise<PartnerWorkTypeAssignment> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_work_type_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('partner_work_type_assignments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    async getAllowedWorkTypes(partnerId: string): Promise<WorkType[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partner_work_type_assignments')
        .select('work_type:work_types(*)')
        .eq('partner_id', partnerId);
      if (error) throw error;
      return data?.map(item => item.work_type).filter(Boolean) || [];
    },
  },

  partnerCapacityPeriods: {
    async getByPartner(partnerId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }): Promise<PartnerCapacityPeriod[]> {
      if (!supabase) return [];

      let query = supabase
        .from('partner_capacity_periods')
        .select('*')
        .eq('partner_id', partnerId);

      if (filters?.startDate) query = query.gte('period_start', filters.startDate);
      if (filters?.endDate) query = query.lte('period_end', filters.endDate);

      query = query.order('period_start', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(period: Omit<PartnerCapacityPeriod, 'id' | 'created_at' | 'updated_at'>): Promise<PartnerCapacityPeriod> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_capacity_periods')
        .insert(period)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<PartnerCapacityPeriod>): Promise<PartnerCapacityPeriod> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_capacity_periods')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('partner_capacity_periods')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  partnerPerformanceMetrics: {
    async getByPartner(partnerId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }): Promise<PartnerPerformanceMetrics[]> {
      if (!supabase) return [];

      let query = supabase
        .from('partner_performance_metrics')
        .select('*')
        .eq('partner_id', partnerId);

      if (filters?.startDate) query = query.gte('period_start', filters.startDate);
      if (filters?.endDate) query = query.lte('period_end', filters.endDate);

      query = query.order('period_start', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getLatest(partnerId: string): Promise<PartnerPerformanceMetrics | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('partner_performance_metrics')
        .select('*')
        .eq('partner_id', partnerId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  },

  partnerWorkloadRecommendations: {
    async getAll(filters?: {
      partnerId?: string;
      status?: string;
      severity?: string;
    }): Promise<PartnerWorkloadRecommendationWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('partner_workload_recommendations')
        .select(`
          *,
          partner:partners(*)
        `);

      if (filters?.partnerId) query = query.eq('partner_id', filters.partnerId);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.severity) query = query.eq('severity', filters.severity);

      query = query.order('severity', { ascending: false }).order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async acknowledge(id: string, userId: string): Promise<PartnerWorkloadRecommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_workload_recommendations')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async action(id: string, userId: string): Promise<PartnerWorkloadRecommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_workload_recommendations')
        .update({
          status: 'actioned',
          actioned_at: new Date().toISOString(),
          actioned_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async dismiss(id: string): Promise<PartnerWorkloadRecommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_workload_recommendations')
        .update({
          status: 'dismissed',
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async generateRecommendations(): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.rpc('generate_partner_workload_recommendations');
      if (error) throw error;
    },
  },

  customers: {
    async getAll(): Promise<Customer[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('company_name');
      if (error) {
        console.error('API Error [customers.getAll]:', error);
        throw new Error(`RLS/Auth: ${error.message}`);
      }
      return data || [];
    },

    async getById(id: string): Promise<Customer | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Customer>): Promise<Customer> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async checkDependencies(id: string): Promise<{
      hasContracts: boolean;
      hasInvoices: boolean;
      hasProjects: boolean;
      contractCount: number;
      invoiceCount: number;
      projectCount: number;
      canDelete: boolean;
      blockingReason?: string;
    }> {
      if (!supabase) throw new Error('Supabase not configured');

      const [contractsResult, invoicesResult, projectsResult] = await Promise.all([
        supabase.from('contracts').select('id', { count: 'exact', head: true }).eq('customer_id', id),
        supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('customer_id', id),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('customer_id', id),
      ]);

      const contractCount = contractsResult.count || 0;
      const invoiceCount = invoicesResult.count || 0;
      const projectCount = projectsResult.count || 0;

      const hasContracts = contractCount > 0;
      const hasInvoices = invoiceCount > 0;
      const hasProjects = projectCount > 0;

      let canDelete = true;
      let blockingReason: string | undefined;

      if (hasContracts || hasInvoices) {
        canDelete = false;
        const blocking = [];
        if (hasContracts) blocking.push(`${contractCount} kontrakt`);
        if (hasInvoices) blocking.push(`${invoiceCount} fakturor`);
        blockingReason = `Kunden har ${blocking.join(' och ')} som måste hanteras först.`;
      }

      return {
        hasContracts,
        hasInvoices,
        hasProjects,
        contractCount,
        invoiceCount,
        projectCount,
        canDelete,
        blockingReason,
      };
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');

      const dependencies = await this.checkDependencies(id);
      if (!dependencies.canDelete) {
        throw new Error(dependencies.blockingReason || 'Cannot delete customer with dependencies');
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  customerAssignments: {
    async getByCustomer(customerId: string): Promise<CustomerAssignment[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('customer_assignments')
        .select('*')
        .eq('customer_id', customerId);
      if (error) throw error;
      return data || [];
    },

    async getByPartner(partnerId: string): Promise<CustomerAssignment[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('customer_assignments')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    },

    async create(assignment: Omit<CustomerAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerAssignment> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('customer_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<CustomerAssignment>): Promise<CustomerAssignment> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('customer_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  projects: {
    async getAll(): Promise<Project[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },

    async getByCustomer(customerId: string): Promise<Project[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customerId)
        .order('name');
      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<Project | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Project>): Promise<Project> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  projectAssignments: {
    async getByProject(projectId: string): Promise<ProjectAssignment[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('project_assignments')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data || [];
    },

    async getByPartner(partnerId: string): Promise<ProjectAssignment[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('project_assignments')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    },

    async create(assignment: Omit<ProjectAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAssignment> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('project_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  workTypes: {
    async getAll(): Promise<WorkType[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('work_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data || [];
    },

    async getAllIncludingInactive(): Promise<WorkType[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('work_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<WorkType | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('work_types')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async checkUsage(id: string): Promise<WorkTypeUsageInfo> {
      if (!supabase) return { work_type_id: id, is_used: false, usage_count: 0 };

      const { data, error } = await supabase
        .from('time_entries')
        .select('date')
        .eq('work_type_id', id)
        .order('date', { ascending: false });

      if (error) throw error;

      return {
        work_type_id: id,
        is_used: (data?.length || 0) > 0,
        usage_count: data?.length || 0,
        last_used_date: data?.[0]?.date,
      };
    },

    async create(workType: Omit<WorkType, 'id' | 'created_at'>): Promise<WorkType> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('work_types')
        .insert(workType)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<WorkType>): Promise<WorkType> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('work_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('work_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  timeEntries: {
    async getAll(filters?: {
      partnerId?: string;
      customerId?: string;
      projectId?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<TimeEntryWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('time_entries')
        .select(`
          *,
          customer:customers(*),
          project:projects(*),
          partner:partners(*),
          work_type:work_types(*)
        `);

      if (filters?.partnerId) query = query.eq('partner_id', filters.partnerId);
      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.projectId) query = query.eq('project_id', filters.projectId);
      if (filters?.startDate) query = query.gte('date', filters.startDate);
      if (filters?.endDate) query = query.lte('date', filters.endDate);

      query = query.order('date', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(timeEntry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<TimeEntry> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('time_entries')
        .insert(timeEntry)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('time_entries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  notes: {
    async getAll(filters?: {
      customerId?: string;
      projectId?: string;
      partnerId?: string;
    }): Promise<NoteWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('notes')
        .select(`
          *,
          customer:customers(*),
          project:projects(*),
          partner:partners(*)
        `);

      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.projectId) query = query.eq('project_id', filters.projectId);
      if (filters?.partnerId) query = query.eq('partner_id', filters.partnerId);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('notes')
        .insert(note)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Note>): Promise<Note> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  stats: {
    async getPartnerStats(partnerId: string, startDate?: string, endDate?: string): Promise<{
      totalHours: number;
      activeCustomers: number;
      activeProjects: number;
      thisWeekHours: number;
    }> {
      if (!supabase) return { totalHours: 0, activeCustomers: 0, activeProjects: 0, thisWeekHours: 0 };

      let query = supabase
        .from('time_entries')
        .select('hours')
        .eq('partner_id', partnerId);

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      const { data: timeData } = await query;
      const totalHours = timeData?.reduce((sum, entry) => sum + Number(entry.hours), 0) || 0;

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const { data: weekData } = await supabase
        .from('time_entries')
        .select('hours')
        .eq('partner_id', partnerId)
        .gte('date', weekStart.toISOString().split('T')[0]);
      const thisWeekHours = weekData?.reduce((sum, entry) => sum + Number(entry.hours), 0) || 0;

      const { data: customerAssignments } = await supabase
        .from('customer_assignments')
        .select('customer_id')
        .eq('partner_id', partnerId)
        .eq('is_active', true);
      const activeCustomers = customerAssignments?.length || 0;

      const { data: projectAssignments } = await supabase
        .from('project_assignments')
        .select('project_id')
        .eq('partner_id', partnerId)
        .eq('is_active', true);
      const activeProjects = projectAssignments?.length || 0;

      return { totalHours, activeCustomers, activeProjects, thisWeekHours };
    },

    async getAdminStats(startDate?: string, endDate?: string): Promise<{
      totalHours: number;
      activeCustomers: number;
      activeProjects: number;
      activePartners: number;
    }> {
      if (!supabase) return { totalHours: 0, activeCustomers: 0, activeProjects: 0, activePartners: 0 };

      let query = supabase
        .from('time_entries')
        .select('hours');

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      const { data: timeData } = await query;
      const totalHours = timeData?.reduce((sum, entry) => sum + Number(entry.hours), 0) || 0;

      const { data: customers } = await supabase
        .from('customers')
        .select('id')
        .eq('status', 'active');
      const activeCustomers = customers?.length || 0;

      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('status', 'active');
      const activeProjects = projects?.length || 0;

      const { data: partners } = await supabase
        .from('partners')
        .select('id')
        .eq('is_active', true);
      const activePartners = partners?.length || 0;

      return { totalHours, activeCustomers, activeProjects, activePartners };
    },
  },

  credits: {
    async getTransactions(customerId: string): Promise<CreditsTransactionWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('credits_transactions')
        .select(`
          *,
          customer:customers(*),
          partner:partners(*),
          time_entry:time_entries(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async addCredits(
      customerId: string,
      amount: number,
      reason: string,
      createdBy?: string
    ): Promise<CreditsTransaction> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: customer } = await supabase
        .from('customers')
        .select('credits_balance')
        .eq('id', customerId)
        .maybeSingle();

      if (!customer) throw new Error('Customer not found');

      const newBalance = Number(customer.credits_balance) + amount;

      await supabase
        .from('customers')
        .update({ credits_balance: newBalance })
        .eq('id', customerId);

      const { data, error } = await supabase
        .from('credits_transactions')
        .insert({
          customer_id: customerId,
          transaction_type: 'allocation',
          amount,
          balance_after: newBalance,
          reason,
          created_by: createdBy,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async adjustCredits(
      customerId: string,
      amount: number,
      reason: string,
      createdBy?: string
    ): Promise<CreditsTransaction> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: customer } = await supabase
        .from('customers')
        .select('credits_balance')
        .eq('id', customerId)
        .maybeSingle();

      if (!customer) throw new Error('Customer not found');

      const newBalance = Number(customer.credits_balance) + amount;

      await supabase
        .from('customers')
        .update({ credits_balance: newBalance })
        .eq('id', customerId);

      const { data, error } = await supabase
        .from('credits_transactions')
        .insert({
          customer_id: customerId,
          transaction_type: 'adjustment',
          amount,
          balance_after: newBalance,
          reason,
          created_by: createdBy,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  decisions: {
    async getAll(filters?: {
      customerId?: string;
      projectId?: string;
    }): Promise<DecisionLogWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('decision_log')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `);

      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.projectId) query = query.eq('project_id', filters.projectId);

      query = query.order('decision_date', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(decision: Omit<DecisionLog, 'id' | 'created_at'>): Promise<DecisionLog> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('decision_log')
        .insert(decision)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<DecisionLog>): Promise<DecisionLog> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('decision_log')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  capacityRules: {
    async getAll(): Promise<CapacityRule[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('capacity_rules')
        .select('*')
        .eq('is_active', true)
        .order('plan_level');
      if (error) throw error;
      return data || [];
    },

    async getByPlanLevel(planLevel: string): Promise<CapacityRule[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('capacity_rules')
        .select('*')
        .eq('plan_level', planLevel)
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    },
  },

  recommendations: {
    async getAll(filters?: {
      customerId?: string;
      status?: string;
      priority?: string;
    }): Promise<RecommendationWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('recommendations')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `);

      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.priority) query = query.eq('priority', filters.priority);

      query = query.order('ai_priority_score', { ascending: false }).order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(recommendation: Omit<Recommendation, 'id' | 'created_at'>): Promise<Recommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('recommendations')
        .insert(recommendation)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async dismiss(id: string, userId: string): Promise<Recommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('recommendations')
        .update({
          status: 'dismissed',
          actioned_at: new Date().toISOString(),
          actioned_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async action(id: string, userId: string): Promise<Recommendation> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('recommendations')
        .update({
          status: 'actioned',
          actioned_at: new Date().toISOString(),
          actioned_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  statusChanges: {
    async logChange(
      entityType: 'customer' | 'project' | 'partner',
      entityId: string,
      statusField: string,
      oldValue: string | undefined,
      newValue: string,
      reason?: string,
      changedBy?: string
    ): Promise<StatusChangeLog> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('status_change_log')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          status_field: statusField,
          old_value: oldValue,
          new_value: newValue,
          change_reason: reason,
          changed_by: changedBy,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async getHistory(entityType: string, entityId: string): Promise<StatusChangeLog[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('status_change_log')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  },

  enterprisePlans: {
    async getAll(): Promise<EnterprisePlan[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('enterprise_plans')
        .select('*')
        .eq('is_active', true)
        .order('tier');
      if (error) throw error;
      return data || [];
    },

    async getByTier(tier: string): Promise<EnterprisePlan | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('enterprise_plans')
        .select('*')
        .eq('tier', tier)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async getById(id: string): Promise<EnterprisePlan | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('enterprise_plans')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  },

  supportTickets: {
    async getAll(filters?: {
      customerId?: string;
      status?: string;
      priority?: string;
      supportType?: string;
    }): Promise<SupportTicketWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `);

      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.priority) query = query.eq('priority', filters.priority);
      if (filters?.supportType) query = query.eq('support_type', filters.supportType);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<SupportTicketWithRelations | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `)
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(ticket: Omit<SupportTicket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'>): Promise<SupportTicket> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('support_tickets')
        .insert(ticket)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateStatus(
      id: string,
      status: string,
      updatedBy?: string
    ): Promise<SupportTicket> {
      if (!supabase) throw new Error('Supabase not configured');

      const updates: Partial<SupportTicket> & { updated_at: string } = {
        status: status as any,
        updated_at: new Date().toISOString(),
      };

      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      } else if (status === 'closed') {
        updates.closed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async getBreachedTickets(): Promise<SupportTicketWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `)
        .or('sla_response_breached.eq.true,sla_resolution_breached.eq.true')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  },

  supportResponses: {
    async getByTicket(ticketId: string): Promise<SupportResponse[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('support_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },

    async create(response: Omit<SupportResponse, 'id' | 'created_at'>): Promise<SupportResponse> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select('first_response_at')
        .eq('id', response.ticket_id)
        .maybeSingle();

      if (ticketError) throw ticketError;

      const { data, error } = await supabase
        .from('support_responses')
        .insert(response)
        .select()
        .single();

      if (error) throw error;

      if (ticket && !ticket.first_response_at && response.responder_type !== 'customer') {
        await supabase
          .from('support_tickets')
          .update({
            first_response_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', response.ticket_id);
      }

      return data;
    },
  },

  slaTracking: {
    async getByCustomer(customerId: string): Promise<SlaTrackingWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('sla_tracking')
        .select(`
          *,
          customer:customers(*),
          ticket:support_tickets(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getBreaches(filters?: {
      customerId?: string;
      severity?: string;
    }): Promise<SlaTrackingWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('sla_tracking')
        .select(`
          *,
          customer:customers(*),
          ticket:support_tickets(*)
        `)
        .eq('is_breach', true);

      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.severity) query = query.eq('breach_severity', filters.severity);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getComplianceRate(customerId: string, periodDays: number = 30): Promise<number> {
      if (!supabase) return 100;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      const { data, error } = await supabase
        .from('sla_tracking')
        .select('is_breach')
        .eq('customer_id', customerId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;
      if (!data || data.length === 0) return 100;

      const breaches = data.filter(item => item.is_breach).length;
      return ((data.length - breaches) / data.length) * 100;
    },
  },

  enterpriseBenefits: {
    async getByCustomer(customerId: string): Promise<EnterpriseBenefitWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('enterprise_benefits')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('customer_id', customerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(benefit: Omit<EnterpriseBenefit, 'id' | 'created_at'>): Promise<EnterpriseBenefit> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('enterprise_benefits')
        .insert(benefit)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<EnterpriseBenefit>): Promise<EnterpriseBenefit> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('enterprise_benefits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async deactivate(id: string): Promise<EnterpriseBenefit> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('enterprise_benefits')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  partnerCostRates: {
    async getByPartner(partnerId: string): Promise<PartnerCostRate[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('partner_cost_rates')
        .select('*')
        .eq('partner_id', partnerId)
        .order('effective_from', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async getCurrentRate(partnerId: string, date?: string): Promise<PartnerCostRate | null> {
      if (!supabase) return null;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('partner_cost_rates')
        .select('*')
        .eq('partner_id', partnerId)
        .lte('effective_from', targetDate)
        .or(`effective_until.is.null,effective_until.gte.${targetDate}`)
        .order('effective_from', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(costRate: Omit<PartnerCostRate, 'id' | 'created_at'>): Promise<PartnerCostRate> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('partner_cost_rates')
        .insert(costRate)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  creditsForecast: {
    async getByCustomer(customerId: string): Promise<CreditsForecastWithRelations | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('credits_forecast')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(forecast: Omit<CreditsForecast, 'id' | 'created_at' | 'updated_at'>): Promise<CreditsForecast> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('credits_forecast')
        .insert(forecast)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async generateForecast(customerId: string, periodDays: number = 30): Promise<CreditsForecast> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: customer } = await supabase
        .from('customers')
        .select('credits_balance, credits_monthly_allocation, credits_consumed_this_month')
        .eq('id', customerId)
        .maybeSingle();

      if (!customer) throw new Error('Customer not found');

      const daysInMonth = 30;
      const daysElapsed = new Date().getDate();
      const dailyBurnRate = customer.credits_consumed_this_month / daysElapsed;
      const estimatedConsumption = dailyBurnRate * periodDays;
      const projectedBalance = customer.credits_balance - estimatedConsumption;

      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let actionType: 'none' | 'credits_topup' | 'scope_review' | 'capacity_adjustment' | 'level_upgrade' = 'none';
      const riskFactors: string[] = [];

      if (projectedBalance < 0) {
        riskLevel = 'critical';
        actionType = 'credits_topup';
        riskFactors.push('Projected balance is negative');
      } else if (projectedBalance < customer.credits_monthly_allocation * 0.1) {
        riskLevel = 'high';
        actionType = 'credits_topup';
        riskFactors.push('Projected balance below 10%');
      } else if (projectedBalance < customer.credits_monthly_allocation * 0.25) {
        riskLevel = 'medium';
        actionType = 'scope_review';
        riskFactors.push('Projected balance below 25%');
      }

      if (dailyBurnRate > (customer.credits_monthly_allocation / daysInMonth) * 1.5) {
        riskFactors.push('Burn rate 50% above expected');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      const forecastData: Omit<CreditsForecast, 'id' | 'created_at' | 'updated_at'> = {
        customer_id: customerId,
        forecast_period_start: new Date().toISOString().split('T')[0],
        forecast_period_end: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_credits_consumption: estimatedConsumption,
        current_credits_balance: customer.credits_balance,
        projected_balance_end_of_period: projectedBalance,
        risk_level: riskLevel,
        risk_factors: riskFactors,
        recommended_action: actionType !== 'none' ? `Consider ${actionType.replace('_', ' ')}` : undefined,
        action_type: actionType,
        forecast_confidence: 0.75,
      };

      return this.create(forecastData);
    },
  },

  marginAnalysis: {
    async getByCustomer(customerId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }): Promise<MarginAnalysisWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('margin_analysis')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `)
        .eq('customer_id', customerId);

      if (filters?.startDate) query = query.gte('analysis_period_start', filters.startDate);
      if (filters?.endDate) query = query.lte('analysis_period_end', filters.endDate);

      query = query.order('analysis_period_start', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async calculate(
      customerId: string,
      periodStart: string,
      periodEnd: string,
      projectId?: string
    ): Promise<MarginAnalysis> {
      if (!supabase) throw new Error('Supabase not configured');

      let timeQuery = supabase
        .from('time_entries')
        .select('hours, credits_consumed, internal_cost')
        .eq('customer_id', customerId)
        .gte('date', periodStart)
        .lte('date', periodEnd);

      if (projectId) timeQuery = timeQuery.eq('project_id', projectId);

      const { data: timeEntries } = await timeQuery;

      const totalHours = timeEntries?.reduce((sum, e) => sum + Number(e.hours), 0) || 0;
      const totalCredits = timeEntries?.reduce((sum, e) => sum + Number(e.credits_consumed || 0), 0) || 0;
      const totalCost = timeEntries?.reduce((sum, e) => sum + Number(e.internal_cost || 0), 0) || 0;

      const { data: customer } = await supabase
        .from('customers')
        .select('credits_price_per_credit')
        .eq('id', customerId)
        .maybeSingle();

      const pricePerCredit = customer?.credits_price_per_credit || 1500;
      const creditsValue = totalCredits * pricePerCredit;
      const margin = creditsValue - totalCost;
      const marginPercentage = creditsValue > 0 ? (margin / creditsValue) * 100 : 0;

      const analysisData: Omit<MarginAnalysis, 'id' | 'created_at' | 'updated_at'> = {
        customer_id: customerId,
        project_id: projectId,
        analysis_period_start: periodStart,
        analysis_period_end: periodEnd,
        credits_consumed: totalCredits,
        credits_value_sek: creditsValue,
        internal_cost_sek: totalCost,
        partner_hours: totalHours,
        margin_sek: margin,
        margin_percentage: marginPercentage,
        avg_credit_cost: totalCredits > 0 ? totalCost / totalCredits : undefined,
        avg_hourly_rate: totalHours > 0 ? totalCost / totalHours : undefined,
      };

      const { data, error } = await supabase
        .from('margin_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  capacityUtilization: {
    async getByPartner(partnerId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }): Promise<CapacityUtilizationWithRelations[]> {
      if (!supabase) return [];

      let query = supabase
        .from('capacity_utilization')
        .select(`
          *,
          partner:partners(*),
          customer:customers(*)
        `)
        .eq('partner_id', partnerId);

      if (filters?.startDate) query = query.gte('period_start', filters.startDate);
      if (filters?.endDate) query = query.lte('period_end', filters.endDate);

      query = query.order('period_start', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async calculate(
      partnerId: string,
      periodStart: string,
      periodEnd: string,
      customerId?: string
    ): Promise<CapacityUtilization> {
      if (!supabase) throw new Error('Supabase not configured');

      let timeQuery = supabase
        .from('time_entries')
        .select('hours, billable, credits_consumed, internal_cost')
        .eq('partner_id', partnerId)
        .gte('date', periodStart)
        .lte('date', periodEnd);

      if (customerId) timeQuery = timeQuery.eq('customer_id', customerId);

      const { data: timeEntries } = await timeQuery;

      const totalHours = timeEntries?.reduce((sum, e) => sum + Number(e.hours), 0) || 0;
      const billableHours = timeEntries?.filter(e => e.billable).reduce((sum, e) => sum + Number(e.hours), 0) || 0;
      const nonBillableHours = totalHours - billableHours;
      const creditsGenerated = timeEntries?.reduce((sum, e) => sum + Number(e.credits_consumed || 0), 0) || 0;
      const internalCost = timeEntries?.reduce((sum, e) => sum + Number(e.internal_cost || 0), 0) || 0;

      const { data: partner } = await supabase
        .from('partners')
        .select('capacity_hours_per_month')
        .eq('id', partnerId)
        .maybeSingle();

      const availableCapacity = partner?.capacity_hours_per_month || 160;
      const utilization = (totalHours / availableCapacity) * 100;

      const utilizationData: Omit<CapacityUtilization, 'id' | 'created_at'> = {
        partner_id: partnerId,
        customer_id: customerId,
        period_start: periodStart,
        period_end: periodEnd,
        total_hours: totalHours,
        billable_hours: billableHours,
        non_billable_hours: nonBillableHours,
        available_capacity_hours: availableCapacity,
        utilization_percentage: utilization,
        credits_generated: creditsGenerated,
        internal_cost: internalCost,
      };

      const { data, error } = await supabase
        .from('capacity_utilization')
        .insert(utilizationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  billingPeriods: {
    async getByCustomer(customerId: string): Promise<BillingPeriodWithRelations[]> {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('billing_periods')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('customer_id', customerId)
        .order('period_start', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(billingPeriod: Omit<BillingPeriod, 'id' | 'created_at' | 'updated_at'>): Promise<BillingPeriod> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('billing_periods')
        .insert(billingPeriod)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<BillingPeriod>): Promise<BillingPeriod> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('billing_periods')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  settings: {
    async getSystemSettings(): Promise<SystemSettings | null> {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async updateSystemSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: current } = await supabase
        .from('system_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!current) {
        const { data, error } = await supabase
          .from('system_settings')
          .insert(updates)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('system_settings')
        .update(updates)
        .eq('id', current.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async getAuditLog(filters?: {
      entityType?: string;
      entityId?: string;
      limit?: number;
    }): Promise<SettingsAuditLog[]> {
      if (!supabase) return [];

      let query = supabase
        .from('settings_audit_log')
        .select('*');

      if (filters?.entityType) query = query.eq('entity_type', filters.entityType);
      if (filters?.entityId) query = query.eq('entity_id', filters.entityId);

      query = query.order('changed_at', { ascending: false });

      if (filters?.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async createAuditLog(log: Omit<SettingsAuditLog, 'id' | 'changed_at'>): Promise<SettingsAuditLog> {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('settings_audit_log')
        .insert(log)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  dashboard: {
    async getCustomerMetrics(customerId: string): Promise<DashboardMetrics> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .maybeSingle();

      if (!customer) throw new Error('Customer not found');

      const creditsRemaining = customer.credits_balance;
      const creditsRemainingPercentage = (creditsRemaining / customer.credits_monthly_allocation) * 100;

      const monthStart = new Date();
      monthStart.setDate(1);
      const daysElapsed = new Date().getDate();
      const burnRate = customer.credits_consumed_this_month / daysElapsed;
      const daysUntilDepleted = burnRate > 0 ? creditsRemaining / burnRate : undefined;

      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('customer_id', customerId)
        .eq('status', 'active');

      const { data: assignments } = await supabase
        .from('customer_assignments')
        .select('partner_id')
        .eq('customer_id', customerId)
        .eq('is_active', true);

      const { data: recommendations } = await supabase
        .from('recommendations')
        .select('*')
        .eq('customer_id', customerId)
        .eq('status', 'active')
        .order('priority', { ascending: false });

      const marginAnalysis = await partnerPortalApi.marginAnalysis.calculate(
        customerId,
        monthStart.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      return {
        customer_id: customerId,
        credits_remaining: creditsRemaining,
        credits_remaining_percentage: creditsRemainingPercentage,
        credits_consumed_this_month: customer.credits_consumed_this_month,
        estimated_credits_burn_rate: burnRate,
        days_until_credits_depleted: daysUntilDepleted,
        overdelivery_risk_level: customer.overdelivery_risk_level,
        current_margin_percentage: marginAnalysis.margin_percentage,
        partner_utilization_avg: 0,
        active_projects_count: projects?.length || 0,
        active_partners_count: assignments?.length || 0,
        recommendations: recommendations || [],
      };
    },

    async getPartnerPerformance(partnerId: string, startDate?: string, endDate?: string): Promise<PartnerPerformance> {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: partner } = await supabase
        .from('partners')
        .select('partner_name, capacity_hours_per_month')
        .eq('id', partnerId)
        .maybeSingle();

      if (!partner) throw new Error('Partner not found');

      const monthStart = new Date();
      monthStart.setDate(1);
      const periodStart = startDate || monthStart.toISOString().split('T')[0];
      const periodEnd = endDate || new Date().toISOString().split('T')[0];

      let query = supabase
        .from('time_entries')
        .select('hours, billable, credits_consumed, internal_cost')
        .eq('partner_id', partnerId)
        .gte('date', periodStart);

      if (endDate) {
        query = query.lte('date', periodEnd);
      }

      const { data: timeEntries } = await query;

      const totalHours = timeEntries?.reduce((sum, e) => sum + Number(e.hours), 0) || 0;
      const billableHours = timeEntries?.filter(e => e.billable).reduce((sum, e) => sum + Number(e.hours), 0) || 0;
      const creditsGenerated = timeEntries?.reduce((sum, e) => sum + Number(e.credits_consumed || 0), 0) || 0;
      const internalCost = timeEntries?.reduce((sum, e) => sum + Number(e.internal_cost || 0), 0) || 0;

      const utilization = (totalHours / partner.capacity_hours_per_month) * 100;
      const avgCreditsPerHour = totalHours > 0 ? creditsGenerated / totalHours : 0;

      const { data: assignments } = await supabase
        .from('customer_assignments')
        .select('customer_id')
        .eq('partner_id', partnerId)
        .eq('is_active', true);

      return {
        partner_id: partnerId,
        partner_name: partner.partner_name,
        total_hours_this_month: totalHours,
        billable_hours_this_month: billableHours,
        credits_generated_this_month: creditsGenerated,
        internal_cost_this_month: internalCost,
        utilization_percentage: utilization,
        avg_credits_per_hour: avgCreditsPerHour,
        active_customers_count: assignments?.length || 0,
      };
    },
  },

  invoices: {
    async getAll(filters?: { status?: string; customerId?: string; dateFrom?: string; dateTo?: string }) {
      if (!supabase) return [];
      let query = supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(id, company_name, currency_code),
          created_by_user:admin_users!invoices_created_by_fkey(id, email)
        `)
        .order('invoice_date', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.dateFrom) query = query.gte('invoice_date', filters.dateFrom);
      if (filters?.dateTo) query = query.lte('invoice_date', filters.dateTo);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getById(id: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(*),
          line_items:invoice_line_items(
            *,
            time_entry:time_entries(*),
            work_type:work_types(*),
            project:projects(*)
          ),
          created_by_user:admin_users!invoices_created_by_fkey(id, email),
          sent_by_user:admin_users!invoices_sent_by_fkey(id, email)
        `)
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async getByCustomer(customerId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('invoice_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(invoice: {
      customer_id: string;
      invoice_date: string;
      due_date: string;
      billing_period_start?: string;
      billing_period_end?: string;
      notes?: string;
      tax_rate: number;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoice,
          created_by: user?.id,
          status: 'draft',
        })
        .select(`
          *,
          customer:customers(*),
          line_items:invoice_line_items(*)
        `)
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<{
      invoice_date: string;
      due_date: string;
      billing_period_start: string;
      billing_period_end: string;
      notes: string;
      tax_rate: number;
      payment_terms: string;
    }>) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateStatus(id: string, status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void') {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const updates: any = { status };
      if (status === 'sent') {
        updates.sent_date = new Date().toISOString();
        updates.sent_by = user?.id;
      } else if (status === 'paid') {
        updates.paid_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async generateFromTimeEntries(params: {
      customerId: string;
      periodStart: string;
      periodEnd: string;
      dueDate: string;
      taxRate: number;
      notes?: string;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const { data: timeEntries, error: timeError } = await supabase
        .from('time_entries')
        .select('*, work_type:work_types(*), project:projects(*)')
        .eq('customer_id', params.customerId)
        .gte('date', params.periodStart)
        .lte('date', params.periodEnd)
        .eq('billable', true)
        .is('invoice_id', null);

      if (timeError) throw timeError;
      if (!timeEntries || timeEntries.length === 0) {
        throw new Error('No billable time entries found for period');
      }

      const { data: customer } = await supabase
        .from('customers')
        .select('credit_value_local, currency_code')
        .eq('id', params.customerId)
        .single();

      const invoice = await this.create({
        customer_id: params.customerId,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: params.dueDate,
        billing_period_start: params.periodStart,
        billing_period_end: params.periodEnd,
        notes: params.notes,
        tax_rate: params.taxRate,
      });

      const lineItems = timeEntries.map((entry: any) => ({
        invoice_id: invoice.id,
        time_entry_id: entry.id,
        project_id: entry.project_id,
        work_type_id: entry.work_type_id,
        description: `${entry.work_type?.work_type_name || 'Work'} - ${entry.project?.project_name || 'Project'}`,
        quantity: entry.hours,
        unit_price: (customer?.credit_value_local || 1500) * (entry.work_type?.credits_per_hour || 1),
        amount: entry.hours * (customer?.credit_value_local || 1500) * (entry.work_type?.credits_per_hour || 1),
      }));

      const { error: lineItemsError } = await supabase
        .from('invoice_line_items')
        .insert(lineItems);

      if (lineItemsError) throw lineItemsError;

      const { error: updateTimeError } = await supabase
        .from('time_entries')
        .update({ invoice_id: invoice.id })
        .in('id', timeEntries.map(e => e.id));

      if (updateTimeError) throw updateTimeError;

      return this.getById(invoice.id);
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  invoiceLineItems: {
    async getByInvoice(invoiceId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('invoice_line_items')
        .select(`
          *,
          time_entry:time_entries(*),
          work_type:work_types(*),
          project:projects(*)
        `)
        .eq('invoice_id', invoiceId)
        .order('created_at');
      if (error) throw error;
      return data || [];
    },

    async create(lineItem: {
      invoice_id: string;
      description: string;
      quantity: number;
      unit_price: number;
      time_entry_id?: string;
      project_id?: string;
      work_type_id?: string;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const amount = lineItem.quantity * lineItem.unit_price;
      const { data, error } = await supabase
        .from('invoice_line_items')
        .insert({ ...lineItem, amount })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<{
      description: string;
      quantity: number;
      unit_price: number;
    }>) {
      if (!supabase) throw new Error('Supabase not configured');
      if (updates.quantity !== undefined && updates.unit_price !== undefined) {
        updates = { ...updates, amount: updates.quantity * updates.unit_price } as any;
      }
      const { data, error } = await supabase
        .from('invoice_line_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('invoice_line_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  contracts: {
    async getAll(filters?: { status?: string; type?: string; customerId?: string }) {
      if (!supabase) return [];
      let query = supabase
        .from('contracts')
        .select(`
          *,
          customer:customers(id, company_name),
          template:contract_templates(id, template_name),
          created_by_user:admin_users!contracts_created_by_fkey(id, email)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.type) query = query.eq('contract_type', filters.type);
      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getById(id: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          customer:customers(*),
          template:contract_templates(*),
          created_by_user:admin_users!contracts_created_by_fkey(id, email),
          parent_contract:contracts!contracts_parent_contract_id_fkey(id, contract_number, contract_type)
        `)
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async getByCustomer(customerId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('customer_id', customerId)
        .order('start_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(contract: {
      customer_id: string;
      contract_type: 'msa' | 'sow' | 'nda' | 'amendment' | 'other';
      template_id?: string;
      title: string;
      start_date: string;
      end_date?: string;
      value?: number;
      content?: string;
      variables?: any;
      auto_renew?: boolean;
      notice_period_days?: number;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          ...contract,
          created_by: user?.id,
          status: 'draft',
          version: 1,
        })
        .select(`
          *,
          customer:customers(*),
          template:contract_templates(*)
        `)
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<{
      title: string;
      start_date: string;
      end_date: string;
      value: number;
      content: string;
      variables: any;
      auto_renew: boolean;
      notice_period_days: number;
      notes: string;
    }>) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async updateStatus(id: string, status: 'draft' | 'review' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated') {
      if (!supabase) throw new Error('Supabase not configured');
      const updates: any = { status };

      if (status === 'signed') {
        updates.signed_date = new Date().toISOString();
      } else if (status === 'active' && !updates.start_date) {
        updates.start_date = new Date().toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async generateFromTemplate(params: {
      customerId: string;
      templateId: string;
      variables: Record<string, string>;
      startDate: string;
      endDate?: string;
      value?: number;
    }) {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: template, error: templateError } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', params.templateId)
        .single();

      if (templateError) throw templateError;

      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', params.customerId)
        .single();

      let content = template.template_content;
      const allVariables = {
        ...params.variables,
        customer_name: customer?.company_name || '',
        customer_org_number: customer?.org_number || '',
        start_date: params.startDate,
        end_date: params.endDate || '',
        contract_value: params.value?.toString() || '',
      };

      Object.entries(allVariables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return this.create({
        customer_id: params.customerId,
        template_id: params.templateId,
        contract_type: template.default_contract_type,
        title: template.template_name.replace('Template', customer?.company_name || 'Customer'),
        start_date: params.startDate,
        end_date: params.endDate,
        value: params.value,
        content,
        variables: allVariables,
      });
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    async getVersionHistory(contractId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('contract_version_history')
        .select(`
          *,
          created_by_user:admin_users(id, email, name)
        `)
        .eq('contract_id', contractId)
        .order('version_number', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async createVersion(contractId: string, reason?: string, summary?: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase.rpc('create_contract_version', {
        p_contract_id: contractId,
        p_change_reason: reason || null,
        p_change_summary: summary || null,
      });
      if (error) throw error;
      return data;
    },
  },

  contractTemplates: {
    async getAll() {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_name');
      if (error) throw error;
      return data || [];
    },

    async getById(id: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },

    async create(template: {
      template_name: string;
      template_content: string;
      default_contract_type: 'msa' | 'sow' | 'nda' | 'amendment' | 'other';
      required_variables?: string[];
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('contract_templates')
        .insert({
          ...template,
          created_by: user?.id,
          is_active: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<{
      template_name: string;
      template_content: string;
      required_variables: string[];
      is_active: boolean;
    }>) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('contract_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('contract_templates')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
  },

  currencies: {
    async getAll() {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true)
        .order('code');
      if (error) throw error;
      return data || [];
    },

    async getRate(fromCurrency: string, toCurrency: string) {
      if (!supabase) return 1.0;
      const { data, error } = await supabase
        .rpc('convert_currency', {
          amount: 1,
          from_currency: fromCurrency,
          to_currency: toCurrency,
        });
      if (error) throw error;
      return data || 1.0;
    },

    async updateRate(code: string, rateToEur: number) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('currencies')
        .update({ rate_to_eur: rateToEur, updated_at: new Date().toISOString() })
        .eq('code', code)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  capacityCalendar: {
    async getAll(filters?: { partnerId?: string; customerId?: string; projectId?: string; startDate?: string; endDate?: string }) {
      if (!supabase) return [];
      let query = supabase
        .from('capacity_calendar')
        .select(`
          *,
          partner:partners(id, partner_name),
          customer:customers(id, company_name),
          project:projects(id, project_name)
        `)
        .order('start_date');

      if (filters?.partnerId) query = query.eq('partner_id', filters.partnerId);
      if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters?.projectId) query = query.eq('project_id', filters.projectId);
      if (filters?.startDate) query = query.gte('start_date', filters.startDate);
      if (filters?.endDate) query = query.lte('end_date', filters.endDate);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(entry: {
      partner_id?: string;
      customer_id?: string;
      project_id?: string;
      start_date: string;
      end_date: string;
      allocated_hours: number;
      allocated_credits: number;
      recurrence_pattern?: 'none' | 'weekly' | 'biweekly' | 'monthly';
      recurrence_end_date?: string;
      notes?: string;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('capacity_calendar')
        .insert({
          ...entry,
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<{
      start_date: string;
      end_date: string;
      allocated_hours: number;
      allocated_credits: number;
      recurrence_pattern: 'none' | 'weekly' | 'biweekly' | 'monthly';
      recurrence_end_date: string;
      notes: string;
    }>) {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('capacity_calendar')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('capacity_calendar')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },
};
