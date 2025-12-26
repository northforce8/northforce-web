/**
 * AI Service - Business Intelligence & Decision Support
 *
 * CRITICAL RULES:
 * 1. AI only for: forecast, anomaly detection, validation, prioritization, recommendations
 * 2. Every output must include: reason, data points, recommended action, risk level, confidence
 * 3. NO marketing text, NO generic insights without action
 * 4. All decisions logged to decision_log
 */

import { supabase } from './supabase';
import type { Customer, Project, TimeEntry, Invoice, Contract, Partner, CreditsTransaction, WorkType } from './partner-portal-types';

// ============================================================================
// TYPES
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AIDecision {
  id: string;
  timestamp: Date;
  module: string;
  entity_type: string;
  entity_id: string;
  decision_type: string;
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  reasoning: string;
  data_points: Record<string, any>;
  recommended_actions: AIAction[];
  created_at: Date;
}

export interface AIAction {
  action_id: string;
  action_type: string;
  title: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CustomerHealthSummary {
  customer_id: string;
  health_score: number; // 0-100
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  reasoning: string;
  data_points: {
    credits_balance: number;
    credits_burn_rate: number;
    days_remaining: number;
    margin_percentage: number;
    sla_breach_count: number;
    overdue_invoices: number;
    blocked_projects: number;
  };
  flags: AIFlag[];
  next_actions: AIAction[];
}

export interface AIFlag {
  flag_type: 'overdelivery' | 'scope_creep' | 'low_margin' | 'high_blocking' | 'credits_depleting' | 'sla_breach';
  severity: RiskLevel;
  message: string;
  triggered_by: string;
  threshold_value: number;
  actual_value: number;
}

export interface BurnRateForecast {
  customer_id: string;
  current_burn_rate: number; // credits per day
  forecasted_depletion_date: string | null;
  days_remaining: number;
  confidence: ConfidenceLevel;
  confidence_band: {
    best_case_days: number;
    worst_case_days: number;
  };
  reasoning: string;
  data_points: {
    credits_balance: number;
    avg_daily_consumption_7d: number;
    avg_daily_consumption_30d: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  recommended_actions: AIAction[];
}

export interface CapacityConflict {
  conflict_id: string;
  conflict_type: 'partner_overload' | 'customer_overload' | 'skill_mismatch';
  severity: RiskLevel;
  partner_id?: string;
  partner_name?: string;
  customer_id?: string;
  customer_name?: string;
  date: string;
  allocated_hours: number;
  capacity_hours: number;
  overload_percentage: number;
  reasoning: string;
  recommended_actions: AIAction[];
}

export interface InvoiceValidation {
  invoice_id: string;
  is_valid: boolean;
  can_send: boolean;
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  checks: InvoiceCheck[];
  anomalies: InvoiceAnomaly[];
  recommended_corrections: AIAction[];
}

export interface InvoiceCheck {
  check_name: string;
  passed: boolean;
  expected_value: any;
  actual_value: any;
  deviation_percentage?: number;
}

export interface InvoiceAnomaly {
  anomaly_type: 'extreme_deviation' | 'rate_mismatch' | 'hours_spike' | 'work_type_anomaly';
  severity: RiskLevel;
  description: string;
  data_points: Record<string, any>;
}

export interface ContractValidation {
  contract_id: string;
  completeness_score: number; // 0-100
  risk_level: RiskLevel;
  missing_fields: string[];
  risk_flags: ContractRiskFlag[];
  can_progress: boolean;
  recommended_actions: AIAction[];
}

export interface ContractRiskFlag {
  flag_type: 'missing_critical_field' | 'inconsistent_pricing' | 'unclear_scope' | 'missing_sla' | 'date_conflict';
  severity: RiskLevel;
  description: string;
  field_name?: string;
}

export interface ReportInsight {
  insight_id: string;
  insight_type: 'anomaly' | 'trend' | 'risk' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_entities: {
    customer_ids?: string[];
    partner_ids?: string[];
    project_ids?: string[];
  };
  data_points: Record<string, any>;
  recommended_actions: AIAction[];
}

export interface FXAlert {
  alert_id: string;
  alert_type: 'extreme_movement' | 'inconsistency' | 'plan_change_impact';
  severity: RiskLevel;
  currency_code: string;
  description: string;
  data_points: {
    current_rate?: number;
    previous_rate?: number;
    change_percentage?: number;
    expected_mrr?: number;
    calculated_mrr?: number;
  };
  recommended_actions: AIAction[];
}

// ============================================================================
// CORE AI SERVICE CLASS
// ============================================================================

class AIService {
  /**
   * Log AI decision to database
   */
  private async logDecision(decision: Omit<AIDecision, 'id' | 'created_at'>): Promise<void> {
    try {
      await supabase.from('decision_log').insert({
        customer_id: decision.entity_type === 'customer' ? decision.entity_id : null,
        project_id: decision.entity_type === 'project' ? decision.entity_id : null,
        decision_title: `${decision.module}: ${decision.decision_type}`,
        decision_description: decision.reasoning,
        decision_maker: 'AI System',
        decision_date: new Date().toISOString().split('T')[0],
        impact_assessment: `Risk: ${decision.risk_level}, Confidence: ${decision.confidence}`,
        options_considered: JSON.stringify(decision.data_points),
        rationale: JSON.stringify(decision.recommended_actions),
      });
    } catch (error) {
      console.error('Failed to log AI decision:', error);
    }
  }

  // ========================================================================
  // A) CUSTOMER HEALTH & RISK DETECTION
  // ========================================================================

  async analyzeCustomerHealth(customerId: string): Promise<CustomerHealthSummary> {
    try {
      // Fetch customer data
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Fetch related data
      const [timeEntriesResult, projectsResult, invoicesResult] = await Promise.all([
        supabase.from('time_entries').select('*').eq('customer_id', customerId),
        supabase.from('projects').select('*').eq('customer_id', customerId),
        supabase.from('invoices').select('*').eq('customer_id', customerId),
      ]);

      const timeEntries = timeEntriesResult.data || [];
      const projects = projectsResult.data || [];
      const invoices = invoicesResult.data || [];

      // Calculate metrics
      const creditsBalance = customer.credits_balance || 0;
      const monthlyAllocation = customer.credits_monthly_allocation || 50;
      const creditsConsumedThisMonth = customer.credits_consumed_this_month || 0;

      // Calculate burn rate (credits per day based on last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentTimeEntries = timeEntries.filter(
        te => new Date(te.date) >= thirtyDaysAgo
      );
      const totalCreditsConsumed = recentTimeEntries.reduce(
        (sum, te) => sum + (te.credits_consumed || 0),
        0
      );
      const creditsBurnRate = totalCreditsConsumed / 30;
      const daysRemaining = creditsBurnRate > 0 ? Math.floor(creditsBalance / creditsBurnRate) : 999;

      // Calculate margin (mock - should come from margin_analysis)
      const totalCost = recentTimeEntries.reduce(
        (sum, te) => sum + (te.internal_cost || 0),
        0
      );
      const totalRevenue = creditsConsumedThisMonth * (customer.credits_price_per_credit || 1500);
      const marginPercentage = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

      // Count blocked projects
      const blockedProjects = projects.filter(p => p.requires_customer_decision).length;

      // Count overdue invoices
      const overdueInvoices = invoices.filter(
        inv => inv.status === 'overdue'
      ).length;

      // SLA breaches - using database function
      const { data: slaData } = await supabase.rpc('get_sla_breach_count', {
        customer_uuid: customerId,
        days_back: 30
      });
      const slaBreachCount = slaData || 0;

      // Build data points
      const dataPoints = {
        credits_balance: creditsBalance,
        credits_burn_rate: creditsBurnRate,
        days_remaining: daysRemaining,
        margin_percentage: marginPercentage,
        sla_breach_count: slaBreachCount,
        overdue_invoices: overdueInvoices,
        blocked_projects: blockedProjects,
      };

      // Detect flags
      const flags: AIFlag[] = [];

      if (daysRemaining < 10 && daysRemaining > 0) {
        flags.push({
          flag_type: 'credits_depleting',
          severity: daysRemaining < 5 ? 'critical' : 'high',
          message: `Credits depleting in ${daysRemaining} days`,
          triggered_by: 'burn_rate_analysis',
          threshold_value: 10,
          actual_value: daysRemaining,
        });
      }

      if (marginPercentage < 20) {
        flags.push({
          flag_type: 'low_margin',
          severity: marginPercentage < 10 ? 'critical' : 'high',
          message: `Low margin: ${marginPercentage.toFixed(1)}%`,
          triggered_by: 'margin_analysis',
          threshold_value: 20,
          actual_value: marginPercentage,
        });
      }

      if (blockedProjects > 0) {
        flags.push({
          flag_type: 'high_blocking',
          severity: blockedProjects > 2 ? 'high' : 'medium',
          message: `${blockedProjects} projects blocked awaiting customer decision`,
          triggered_by: 'project_status_check',
          threshold_value: 0,
          actual_value: blockedProjects,
        });
      }

      if (overdueInvoices > 0) {
        flags.push({
          flag_type: 'overdelivery',
          severity: overdueInvoices > 2 ? 'high' : 'medium',
          message: `${overdueInvoices} overdue invoices`,
          triggered_by: 'invoice_status_check',
          threshold_value: 0,
          actual_value: overdueInvoices,
        });
      }

      // Calculate health score (0-100)
      let healthScore = 100;
      healthScore -= Math.min(30, (10 - Math.min(daysRemaining, 10)) * 3); // Credits depletion
      healthScore -= Math.min(20, (20 - Math.min(marginPercentage, 20)) * 1); // Margin
      healthScore -= blockedProjects * 10; // Blocked projects
      healthScore -= overdueInvoices * 5; // Overdue invoices
      healthScore = Math.max(0, healthScore);

      // Determine risk level
      let riskLevel: RiskLevel = 'low';
      if (healthScore < 40) riskLevel = 'critical';
      else if (healthScore < 60) riskLevel = 'high';
      else if (healthScore < 80) riskLevel = 'medium';

      // Generate next actions
      const nextActions: AIAction[] = [];

      if (daysRemaining < 10 && daysRemaining > 0) {
        nextActions.push({
          action_id: `credits_topup_${customerId}`,
          action_type: 'credits_topup',
          title: 'Top up credits',
          description: `Add credits to avoid depletion in ${daysRemaining} days`,
          link: `/admin/partner-portal/customers/${customerId}`,
          priority: daysRemaining < 5 ? 'critical' : 'high',
        });
      }

      if (blockedProjects > 0) {
        nextActions.push({
          action_id: `unblock_projects_${customerId}`,
          action_type: 'unblock_projects',
          title: 'Unblock projects',
          description: `${blockedProjects} projects awaiting customer decision`,
          link: `/admin/partner-portal/projects?customer=${customerId}`,
          priority: 'high',
        });
      }

      if (marginPercentage < 20) {
        nextActions.push({
          action_id: `review_scope_${customerId}`,
          action_type: 'scope_review',
          title: 'Review scope & pricing',
          description: `Margin at ${marginPercentage.toFixed(1)}% - consider scope adjustment`,
          link: `/admin/partner-portal/customers/${customerId}`,
          priority: marginPercentage < 10 ? 'critical' : 'high',
        });
      }

      // Build reasoning
      const reasoning = [
        `Health score: ${healthScore}/100`,
        daysRemaining < 999 ? `Credits depleting in ${daysRemaining} days at current burn rate` : '',
        marginPercentage > 0 ? `Current margin: ${marginPercentage.toFixed(1)}%` : '',
        blockedProjects > 0 ? `${blockedProjects} projects blocked` : '',
        overdueInvoices > 0 ? `${overdueInvoices} overdue invoices` : '',
      ].filter(Boolean).join('. ');

      const summary: CustomerHealthSummary = {
        customer_id: customerId,
        health_score: healthScore,
        risk_level: riskLevel,
        confidence: 'high',
        reasoning,
        data_points: dataPoints,
        flags,
        next_actions: nextActions,
      };

      // Log decision
      await this.logDecision({
        timestamp: new Date(),
        module: 'customer_health',
        entity_type: 'customer',
        entity_id: customerId,
        decision_type: 'health_analysis',
        risk_level: riskLevel,
        confidence: 'high',
        reasoning,
        data_points: dataPoints,
        recommended_actions: nextActions,
      });

      return summary;
    } catch (error) {
      console.error('Error analyzing customer health:', error);
      throw error;
    }
  }

  // ========================================================================
  // B) BURN RATE FORECAST & CAPACITY CONFLICTS
  // ========================================================================

  async forecastBurnRate(customerId: string): Promise<BurnRateForecast> {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Get time entries for last 30 days and last 7 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select('*')
        .eq('customer_id', customerId)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      const entries = timeEntries || [];

      // Calculate consumption
      const last30Days = entries.filter(te => new Date(te.date) >= thirtyDaysAgo);
      const last7Days = entries.filter(te => new Date(te.date) >= sevenDaysAgo);

      const consumption30d = last30Days.reduce((sum, te) => sum + (te.credits_consumed || 0), 0);
      const consumption7d = last7Days.reduce((sum, te) => sum + (te.credits_consumed || 0), 0);

      const avgDaily30d = consumption30d / 30;
      const avgDaily7d = consumption7d / 7;

      // Determine trend
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      const trendRatio = avgDaily7d / (avgDaily30d || 1);
      if (trendRatio > 1.2) trend = 'increasing';
      else if (trendRatio < 0.8) trend = 'decreasing';

      // Use 7-day average as primary burn rate (more recent)
      const currentBurnRate = avgDaily7d;

      const creditsBalance = customer.credits_balance || 0;
      const daysRemaining = currentBurnRate > 0 ? Math.floor(creditsBalance / currentBurnRate) : 999;

      // Calculate confidence band
      const bestCaseBurnRate = Math.min(avgDaily7d, avgDaily30d) * 0.8;
      const worstCaseBurnRate = Math.max(avgDaily7d, avgDaily30d) * 1.2;
      const bestCaseDays = bestCaseBurnRate > 0 ? Math.floor(creditsBalance / bestCaseBurnRate) : 999;
      const worstCaseDays = worstCaseBurnRate > 0 ? Math.floor(creditsBalance / worstCaseBurnRate) : 999;

      // Forecasted depletion date
      let depletionDate: string | null = null;
      if (daysRemaining < 999) {
        const depletionDateObj = new Date();
        depletionDateObj.setDate(depletionDateObj.getDate() + daysRemaining);
        depletionDate = depletionDateObj.toISOString().split('T')[0];
      }

      // Confidence level
      const confidence: ConfidenceLevel = last7Days.length >= 5 ? 'high' : last7Days.length >= 2 ? 'medium' : 'low';

      // Recommended actions
      const actions: AIAction[] = [];
      if (daysRemaining < 30 && daysRemaining > 0) {
        actions.push({
          action_id: `credits_topup_${customerId}`,
          action_type: 'credits_topup',
          title: 'Schedule credits top-up',
          description: `Credits depleting in ${daysRemaining} days`,
          link: `/admin/partner-portal/customers/${customerId}`,
          priority: daysRemaining < 10 ? 'critical' : 'high',
        });
      }

      if (trend === 'increasing') {
        actions.push({
          action_id: `scope_review_${customerId}`,
          action_type: 'scope_review',
          title: 'Review scope',
          description: 'Burn rate increasing - validate project scope',
          link: `/admin/partner-portal/projects?customer=${customerId}`,
          priority: 'medium',
        });
      }

      const reasoning = [
        `Current burn rate: ${currentBurnRate.toFixed(1)} credits/day`,
        daysRemaining < 999 ? `Depletion in ${daysRemaining} days` : 'Sufficient credits',
        `Trend: ${trend}`,
        `Confidence: ${confidence} (based on ${last7Days.length} recent entries)`,
      ].join('. ');

      return {
        customer_id: customerId,
        current_burn_rate: currentBurnRate,
        forecasted_depletion_date: depletionDate,
        days_remaining: daysRemaining,
        confidence,
        confidence_band: {
          best_case_days: bestCaseDays,
          worst_case_days: worstCaseDays,
        },
        reasoning,
        data_points: {
          credits_balance: creditsBalance,
          avg_daily_consumption_7d: avgDaily7d,
          avg_daily_consumption_30d: avgDaily30d,
          trend,
        },
        recommended_actions: actions,
      };
    } catch (error) {
      console.error('Error forecasting burn rate:', error);
      throw error;
    }
  }

  async detectCapacityConflicts(startDate: string, endDate: string): Promise<CapacityConflict[]> {
    try {
      // Get all capacity calendar entries in date range
      const { data: capacityEntries } = await supabase
        .from('capacity_calendar')
        .select('*, partners(*), customers(*)')
        .gte('start_date', startDate)
        .lte('end_date', endDate);

      if (!capacityEntries || capacityEntries.length === 0) {
        return [];
      }

      // Group by partner and date
      const partnerDailyAllocations = new Map<string, Map<string, number>>();

      capacityEntries.forEach(entry => {
        if (!entry.partner_id) return;

        const partnerId = entry.partner_id;
        const startDateObj = new Date(entry.start_date);
        const endDateObj = new Date(entry.end_date);

        // Calculate days between start and end
        const daysDiff = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const hoursPerDay = entry.allocated_hours / daysDiff;

        // Allocate hours to each day
        for (let i = 0; i < daysDiff; i++) {
          const currentDate = new Date(startDateObj);
          currentDate.setDate(currentDate.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0];

          if (!partnerDailyAllocations.has(partnerId)) {
            partnerDailyAllocations.set(partnerId, new Map());
          }

          const dailyMap = partnerDailyAllocations.get(partnerId)!;
          const current = dailyMap.get(dateStr) || 0;
          dailyMap.set(dateStr, current + hoursPerDay);
        }
      });

      // Detect conflicts
      const conflicts: CapacityConflict[] = [];
      const MAX_HOURS_PER_DAY = 8;

      partnerDailyAllocations.forEach((dailyMap, partnerId) => {
        dailyMap.forEach((allocatedHours, date) => {
          if (allocatedHours > MAX_HOURS_PER_DAY) {
            const overloadPercentage = ((allocatedHours - MAX_HOURS_PER_DAY) / MAX_HOURS_PER_DAY) * 100;

            let severity: RiskLevel = 'medium';
            if (overloadPercentage > 50) severity = 'critical';
            else if (overloadPercentage > 25) severity = 'high';

            // Find partner name
            const partnerEntry = capacityEntries.find(e => e.partner_id === partnerId);
            const partnerName = partnerEntry?.partners?.partner_name || 'Unknown';

            conflicts.push({
              conflict_id: `${partnerId}_${date}`,
              conflict_type: 'partner_overload',
              severity,
              partner_id: partnerId,
              partner_name: partnerName,
              date,
              allocated_hours: allocatedHours,
              capacity_hours: MAX_HOURS_PER_DAY,
              overload_percentage: overloadPercentage,
              reasoning: `Partner ${partnerName} overallocated by ${overloadPercentage.toFixed(0)}% on ${date}`,
              recommended_actions: [
                {
                  action_id: `realloc_${partnerId}_${date}`,
                  action_type: 'reallocate_capacity',
                  title: 'Reallocate capacity',
                  description: `Reduce allocation by ${(allocatedHours - MAX_HOURS_PER_DAY).toFixed(1)} hours`,
                  link: `/admin/partner-portal/planning`,
                  priority: severity === 'critical' ? 'critical' : 'high',
                },
              ],
            });
          }
        });
      });

      // Sort by severity and date
      conflicts.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.date.localeCompare(b.date);
      });

      return conflicts;
    } catch (error) {
      console.error('Error detecting capacity conflicts:', error);
      throw error;
    }
  }

  // ========================================================================
  // C) INVOICE VALIDATION
  // ========================================================================

  async validateInvoice(invoiceId: string): Promise<InvoiceValidation> {
    try {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('*, customers(*), invoice_line_items(*)')
        .eq('id', invoiceId)
        .single();

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const checks: InvoiceCheck[] = [];
      const anomalies: InvoiceAnomaly[] = [];
      const corrections: AIAction[] = [];

      // CHECK 1: Line items sum matches subtotal
      const lineItemsTotal = (invoice.invoice_line_items || []).reduce(
        (sum: number, item: any) => sum + Number(item.amount || 0),
        0
      );
      const subtotalMatch = Math.abs(lineItemsTotal - Number(invoice.subtotal)) < 0.01;

      checks.push({
        check_name: 'Line items sum',
        passed: subtotalMatch,
        expected_value: invoice.subtotal,
        actual_value: lineItemsTotal,
        deviation_percentage: subtotalMatch ? 0 : Math.abs((lineItemsTotal - invoice.subtotal) / invoice.subtotal) * 100,
      });

      if (!subtotalMatch) {
        corrections.push({
          action_id: `fix_subtotal_${invoiceId}`,
          action_type: 'recalculate_invoice',
          title: 'Recalculate subtotal',
          description: `Subtotal mismatch: expected ${invoice.subtotal}, calculated ${lineItemsTotal.toFixed(2)}`,
          link: `/admin/partner-portal/invoices/${invoiceId}`,
          priority: 'high',
        });
      }

      // CHECK 2: Tax calculation
      const expectedTax = Number(invoice.subtotal) * (Number(invoice.tax_rate) / 100);
      const taxMatch = Math.abs(expectedTax - Number(invoice.tax_amount)) < 0.01;

      checks.push({
        check_name: 'Tax calculation',
        passed: taxMatch,
        expected_value: expectedTax,
        actual_value: invoice.tax_amount,
        deviation_percentage: taxMatch ? 0 : Math.abs((invoice.tax_amount - expectedTax) / expectedTax) * 100,
      });

      // CHECK 3: Total calculation
      const expectedTotal = Number(invoice.subtotal) + Number(invoice.tax_amount);
      const totalMatch = Math.abs(expectedTotal - Number(invoice.total_amount)) < 0.01;

      checks.push({
        check_name: 'Total calculation',
        passed: totalMatch,
        expected_value: expectedTotal,
        actual_value: invoice.total_amount,
      });

      // CHECK 4: Period dates
      const hasPeriod = invoice.period_start && invoice.period_end;
      checks.push({
        check_name: 'Period dates set',
        passed: hasPeriod,
        expected_value: 'Both dates required',
        actual_value: hasPeriod ? 'Set' : 'Missing',
      });

      if (!hasPeriod) {
        corrections.push({
          action_id: `set_period_${invoiceId}`,
          action_type: 'set_period',
          title: 'Set invoice period',
          description: 'Period start/end dates are required',
          link: `/admin/partner-portal/invoices/${invoiceId}`,
          priority: 'high',
        });
      }

      // CHECK 5: Line items exist
      const hasLineItems = (invoice.invoice_line_items || []).length > 0;
      checks.push({
        check_name: 'Has line items',
        passed: hasLineItems,
        expected_value: 'At least 1',
        actual_value: (invoice.invoice_line_items || []).length,
      });

      // ANOMALY CHECK: Extreme amounts
      if (invoice.total_amount > 1000000) {
        anomalies.push({
          anomaly_type: 'extreme_deviation',
          severity: 'high',
          description: `Total amount exceeds 1M SEK: ${invoice.total_amount}`,
          data_points: { total_amount: invoice.total_amount, threshold: 1000000 },
        });
      }

      // Determine validation status
      const allChecksPassed = checks.every(c => c.passed);
      const hasHighSeverityAnomalies = anomalies.some(a => a.severity === 'high' || a.severity === 'critical');

      const canSend = allChecksPassed && !hasHighSeverityAnomalies;
      const isValid = allChecksPassed;

      let riskLevel: RiskLevel = 'low';
      if (!canSend) riskLevel = hasHighSeverityAnomalies ? 'high' : 'medium';

      return {
        invoice_id: invoiceId,
        is_valid: isValid,
        can_send: canSend,
        risk_level: riskLevel,
        confidence: 'high',
        checks,
        anomalies,
        recommended_corrections: corrections,
      };
    } catch (error) {
      console.error('Error validating invoice:', error);
      throw error;
    }
  }

  // ========================================================================
  // D) CONTRACT VALIDATION
  // ========================================================================

  async validateContract(contractId: string): Promise<ContractValidation> {
    try {
      const { data: contract } = await supabase
        .from('contracts')
        .select('*, customers(*)')
        .eq('id', contractId)
        .single();

      if (!contract) {
        throw new Error('Contract not found');
      }

      const missingFields: string[] = [];
      const riskFlags: ContractRiskFlag[] = [];
      const actions: AIAction[] = [];

      // Check critical fields
      if (!contract.title || contract.title.trim() === '') {
        missingFields.push('title');
        riskFlags.push({
          flag_type: 'missing_critical_field',
          severity: 'high',
          description: 'Contract title is required',
          field_name: 'title',
        });
      }

      if (!contract.start_date) {
        missingFields.push('start_date');
        riskFlags.push({
          flag_type: 'missing_critical_field',
          severity: 'high',
          description: 'Start date is required',
          field_name: 'start_date',
        });
      }

      if (!contract.content || contract.content.trim() === '') {
        missingFields.push('content');
        riskFlags.push({
          flag_type: 'unclear_scope',
          severity: 'critical',
          description: 'Contract content is empty',
          field_name: 'content',
        });
      }

      if (!contract.contract_value || contract.contract_value === 0) {
        missingFields.push('contract_value');
        riskFlags.push({
          flag_type: 'inconsistent_pricing',
          severity: 'medium',
          description: 'Contract value not set',
          field_name: 'contract_value',
        });
      }

      // Check date consistency
      if (contract.start_date && contract.end_date) {
        const startDate = new Date(contract.start_date);
        const endDate = new Date(contract.end_date);
        if (endDate < startDate) {
          riskFlags.push({
            flag_type: 'date_conflict',
            severity: 'high',
            description: 'End date is before start date',
          });
        }
      }

      // Calculate completeness score
      const totalFields = 8; // title, start_date, end_date, content, contract_value, currency, payment_terms, customer_id
      const completedFields = totalFields - missingFields.length;
      const completenessScore = Math.round((completedFields / totalFields) * 100);

      // Determine risk level
      let riskLevel: RiskLevel = 'low';
      if (completenessScore < 50) riskLevel = 'critical';
      else if (completenessScore < 70) riskLevel = 'high';
      else if (completenessScore < 90) riskLevel = 'medium';

      // Can progress?
      const canProgress = riskFlags.filter(f => f.severity === 'critical' || f.severity === 'high').length === 0;

      // Generate actions
      missingFields.forEach(field => {
        actions.push({
          action_id: `fix_${field}_${contractId}`,
          action_type: 'complete_field',
          title: `Set ${field}`,
          description: `Required field "${field}" is missing`,
          link: `/admin/partner-portal/contracts/${contractId}`,
          priority: 'high',
        });
      });

      return {
        contract_id: contractId,
        completeness_score: completenessScore,
        risk_level: riskLevel,
        missing_fields: missingFields,
        risk_flags: riskFlags,
        can_progress: canProgress,
        recommended_actions: actions,
      };
    } catch (error) {
      console.error('Error validating contract:', error);
      throw error;
    }
  }

  // ========================================================================
  // E) REPORTS INTELLIGENCE
  // ========================================================================

  async generateTopInsights(limit: number = 5): Promise<ReportInsight[]> {
    try {
      const insights: ReportInsight[] = [];

      // Get all customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      if (!customers) return [];

      // Insight 1: Customers with critical credits depletion
      const criticalCustomers = customers.filter(c => {
        const balance = c.credits_balance || 0;
        const burnRate = c.credits_consumed_this_month / 30;
        const daysRemaining = burnRate > 0 ? balance / burnRate : 999;
        return daysRemaining < 7 && daysRemaining > 0;
      });

      if (criticalCustomers.length > 0) {
        insights.push({
          insight_id: 'critical_credits_depletion',
          insight_type: 'risk',
          priority: 'critical',
          title: `${criticalCustomers.length} customers with <7 days of credits`,
          description: 'Immediate action required to avoid service disruption',
          affected_entities: {
            customer_ids: criticalCustomers.map(c => c.id),
          },
          data_points: {
            count: criticalCustomers.length,
            customers: criticalCustomers.map(c => ({
              id: c.id,
              name: c.company_name,
              days_remaining: Math.floor((c.credits_balance / (c.credits_consumed_this_month / 30))),
            })),
          },
          recommended_actions: [{
            action_id: 'review_critical_customers',
            action_type: 'bulk_credits_review',
            title: 'Review and top-up credits',
            description: 'Process credits top-up for critical customers',
            link: '/admin/partner-portal/credits',
            priority: 'critical',
          }],
        });
      }

      // Insight 2: Low margin customers
      const lowMarginCustomers = customers.filter(c => {
        const mrr = c.monthly_recurring_revenue || 0;
        // This would ideally come from margin_analysis table
        return mrr > 0 && c.overdelivery_risk_level === 'high';
      });

      if (lowMarginCustomers.length > 0) {
        insights.push({
          insight_id: 'low_margin_alert',
          insight_type: 'risk',
          priority: 'high',
          title: `${lowMarginCustomers.length} customers with overdelivery risk`,
          description: 'Review scope and pricing to improve margins',
          affected_entities: {
            customer_ids: lowMarginCustomers.map(c => c.id),
          },
          data_points: {
            count: lowMarginCustomers.length,
          },
          recommended_actions: [{
            action_id: 'review_margins',
            action_type: 'margin_review',
            title: 'Review margins & scope',
            description: 'Analyze margin and adjust scope or pricing',
            link: '/admin/partner-portal/reports',
            priority: 'high',
          }],
        });
      }

      // Sort by priority and limit
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      return insights.slice(0, limit);
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  // ========================================================================
  // F) FX CONTROL
  // ========================================================================

  async checkFXAlerts(): Promise<FXAlert[]> {
    try {
      const alerts: FXAlert[] = [];

      // Get all currencies
      const { data: currencies } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true);

      if (!currencies) return [];

      // Check for extreme movements (placeholder - would need historical rates)
      // This is a simplified check
      currencies.forEach(currency => {
        if (currency.code === 'SEK') return; // Base currency

        const rateToEur = currency.rate_to_eur;

        // Mock check: flag if rate is outside normal range
        // In production, compare against historical average
        if (rateToEur > 1.5 || rateToEur < 0.5) {
          alerts.push({
            alert_id: `fx_extreme_${currency.code}`,
            alert_type: 'extreme_movement',
            severity: 'medium',
            currency_code: currency.code,
            description: `${currency.code} exchange rate may be incorrect: ${rateToEur}`,
            data_points: {
              current_rate: rateToEur,
            },
            recommended_actions: [{
              action_id: `update_fx_${currency.code}`,
              action_type: 'update_fx_rate',
              title: 'Verify exchange rate',
              description: `Check ${currency.code} rate against market data`,
              link: '/admin/partner-portal/settings',
              priority: 'medium',
            }],
          });
        }
      });

      return alerts;
    } catch (error) {
      console.error('Error checking FX alerts:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
