import { apiCache } from './api-cache';
import { supabase } from './supabase';

export interface QueryCacheConfig {
  duration?: number;
  tags?: string[];
  key?: string;
}

class QueryCacheService {
  private generateKey(table: string, query: any): string {
    const queryStr = JSON.stringify(query);
    return `query:${table}:${queryStr}`;
  }

  async cachedQuery<T>(
    queryFn: () => Promise<T>,
    config: QueryCacheConfig = {}
  ): Promise<T> {
    const { duration = 5 * 60 * 1000, key } = config;
    const cacheKey = key || `query:${Date.now()}:${Math.random()}`;

    return apiCache.get(cacheKey, queryFn, duration);
  }

  invalidateTable(tableName: string): void {
    apiCache.invalidatePattern(`query:${tableName}:.*`);
  }

  invalidateTags(tags: string[]): void {
    apiCache.invalidateByTags(tags);
  }

  invalidateCustomer(customerId: string): void {
    apiCache.invalidatePattern(`.*customer.*${customerId}.*`);
  }

  invalidatePartner(partnerId: string): void {
    apiCache.invalidatePattern(`.*partner.*${partnerId}.*`);
  }

  invalidateProject(projectId: string): void {
    apiCache.invalidatePattern(`.*project.*${projectId}.*`);
  }

  async getCustomers(config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: 'query:customers:all', tags: ['customers'] }
    );
  }

  async getCustomer(id: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:customers:${id}`, tags: ['customers', id] }
    );
  }

  async getPartners(config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: 'query:partners:all', tags: ['partners'] }
    );
  }

  async getProjects(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:projects:customer:${customerId}`, tags: ['projects', customerId] }
    );
  }

  async getOKRObjectives(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('okr_objectives')
          .select(`
            *,
            okr_key_results (*)
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:okr:${customerId}`, tags: ['okr', customerId] }
    );
  }

  async getSWOTAnalyses(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('swot_analyses')
          .select(`
            *,
            swot_items (*)
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:swot:${customerId}`, tags: ['swot', customerId] }
    );
  }

  async getBalancedScorecards(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('balanced_scorecards')
          .select(`
            *,
            bsc_perspectives (
              *,
              bsc_metrics (*)
            )
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:bsc:${customerId}`, tags: ['bsc', customerId] }
    );
  }

  async getBusinessModelCanvases(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('business_model_canvases')
          .select(`
            *,
            bmc_blocks (*)
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:bmc:${customerId}`, tags: ['bmc', customerId] }
    );
  }

  async getTimeEntries(params: {
    customerId?: string;
    partnerId?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
  }, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        let query = supabase
          .from('time_entries')
          .select(`
            *,
            partner:partners (*),
            project:projects (*),
            work_type:work_types (*)
          `);

        if (params.customerId) query = query.eq('customer_id', params.customerId);
        if (params.partnerId) query = query.eq('partner_id', params.partnerId);
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.startDate) query = query.gte('date', params.startDate);
        if (params.endDate) query = query.lte('date', params.endDate);

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;
        return data;
      },
      {
        ...config,
        key: `query:time_entries:${JSON.stringify(params)}`,
        tags: ['time_entries', params.customerId, params.partnerId, params.projectId].filter(Boolean) as string[]
      }
    );
  }

  async getInvoices(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            customer:customers (*),
            invoice_line_items (*)
          `)
          .eq('customer_id', customerId)
          .order('issue_date', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:invoices:${customerId}`, tags: ['invoices', customerId] }
    );
  }

  async getGrowthPlans(customerId: string, config?: QueryCacheConfig) {
    return this.cachedQuery(
      async () => {
        const { data, error } = await supabase
          .from('growth_plans')
          .select(`
            *,
            strategic_goals (
              *,
              goal_metrics (*)
            ),
            growth_objectives (
              *,
              growth_initiatives (*)
            )
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ...config, key: `query:growth_plans:${customerId}`, tags: ['growth_plans', customerId] }
    );
  }

  getCacheStats() {
    return {
      ...apiCache.getStats(),
      hitRate: apiCache.getHitRate(),
    };
  }

  clearAllCache(): void {
    apiCache.clear();
  }
}

export const queryCacheService = new QueryCacheService();
