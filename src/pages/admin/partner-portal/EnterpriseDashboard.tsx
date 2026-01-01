import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingUp,
  Coins,
  ArrowRight,
  DollarSign,
  PieChart,
  Users,
  Target,
  Clock,
  TrendingDown,
  Activity,
  AlertCircle,
} from 'lucide-react';
import StatusIndicator from '../../../components/admin/StatusIndicator';
import CreditsDisplay from '../../../components/admin/CreditsDisplay';
import RecommendationCard from '../../../components/admin/RecommendationCard';
import { Card, CardHeader, CardBody } from '../../../components/admin/ui/Card';
import { StatCard } from '../../../components/admin/ui/StatCard';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { getCurrentUser } from '../../../lib/auth';
import { logAdminError } from '../../../lib/admin-error-logger';
import { safeNumber, safeDivide, safeString } from '../../../lib/data-validators';
import type {
  Customer,
  Recommendation,
  CreditsForecast,
  DashboardMetrics,
} from '../../../lib/partner-portal-types';

const EnterpriseDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [forecasts, setForecasts] = useState<CreditsForecast[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [totalMRR, setTotalMRR] = useState(0);
  const [totalCreditsValue, setTotalCreditsValue] = useState(0);
  const [totalCreditsCount, setTotalCreditsCount] = useState(0);
  const [totalCreditsAllocation, setTotalCreditsAllocation] = useState(0);
  const [avgMargin, setAvgMargin] = useState(0);
  const [totalInternalCost, setTotalInternalCost] = useState(0);
  const [totalCreditsConsumedValue, setTotalCreditsConsumedValue] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [customersData, recommendationsData] = await Promise.all([
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.recommendations.getAll({ status: 'active' }),
      ]);
      const metricsData = null;

      const safeCustomers = (customersData || []).map(c => ({
        ...c,
        company_name: safeString(c.company_name, 'Unknown'),
        industry: safeString(c.industry, '—'),
        credits_balance: safeNumber(c.credits_balance, 0),
        credits_monthly_allocation: safeNumber(c.credits_monthly_allocation, 0),
        credits_consumed_this_month: safeNumber(c.credits_consumed_this_month, 0),
        monthly_recurring_revenue: safeNumber(c.monthly_recurring_revenue, 0),
        credits_price_per_credit: safeNumber(c.credits_price_per_credit, 1500),
        delivery_status: safeString(c.delivery_status, 'on_track'),
        strategic_status: safeString(c.strategic_status, 'on_track'),
        commercial_status: safeString(c.commercial_status, 'on_track'),
        collaboration_status: safeString(c.collaboration_status, 'good'),
        impact_status: safeString(c.impact_status, 'on_track'),
      }));

      setCustomers(safeCustomers);
      setRecommendations(recommendationsData);
      setDashboardMetrics(metricsData);

      const mrr = safeCustomers.reduce((sum, c) => sum + c.monthly_recurring_revenue, 0);
      setTotalMRR(mrr);

      const creditsBalance = safeCustomers.reduce((sum, c) => sum + c.credits_balance, 0);
      const creditsAllocation = safeCustomers.reduce((sum, c) => sum + c.credits_monthly_allocation, 0);
      setTotalCreditsCount(creditsBalance);
      setTotalCreditsAllocation(creditsAllocation);

      const creditsValue = safeCustomers.reduce((sum, c) => {
        return sum + (c.credits_balance * c.credits_price_per_credit);
      }, 0);
      setTotalCreditsValue(creditsValue);

      const creditsConsumedValue = safeCustomers.reduce((sum, c) => {
        return sum + (c.credits_consumed_this_month * c.credits_price_per_credit);
      }, 0);
      setTotalCreditsConsumedValue(creditsConsumedValue);

      const monthStart = new Date();
      monthStart.setDate(1);
      const margins = await Promise.all(
        safeCustomers.slice(0, 10).map(c =>
          partnerPortalApi.marginAnalysis.calculate(
            c.id,
            monthStart.toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          ).catch(() => null)
        )
      );
      const validMargins = margins.filter(m => m !== null);
      const avgMarginValue = validMargins.length > 0
        ? validMargins.reduce((sum, m) => sum + safeNumber(m!.margin_percentage, 0), 0) / validMargins.length
        : 0;
      setAvgMargin(avgMarginValue);

      const totalInternalCostValue = validMargins.reduce((sum, m) => sum + safeNumber(m!.internal_cost, 0), 0);
      setTotalInternalCost(totalInternalCostValue);

      const forecastsData = await Promise.all(
        safeCustomers.slice(0, 10).map(c =>
          partnerPortalApi.creditsForecast.generateForecast(c.id, 30).catch(() => null)
        )
      );
      const validForecasts = forecastsData.filter(f => f !== null) as CreditsForecast[];
      setForecasts(validForecasts);
    } catch (error) {
      const errorId = logAdminError(error as Error, {
        route: '/admin/partner-portal/enterprise',
        action: 'loadDashboard',
      });
      console.error(`[${errorId}] Error loading dashboard:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissRecommendation = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await partnerPortalApi.recommendations.dismiss(id, user.id);
        await loadDashboard();
      }
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    }
  };

  const handleActionRecommendation = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await partnerPortalApi.recommendations.action(id, user.id);
        await loadDashboard();
      }
    } catch (error) {
      console.error('Error actioning recommendation:', error);
    }
  };

  const getAlertsCount = () => {
    return {
      atRisk: customers.filter(c => c.delivery_status === 'at_risk' || c.delivery_status === 'delayed').length,
      lowCredits: customers.filter(c => safeDivide(c.credits_balance, c.credits_monthly_allocation, 1) < 0.2).length,
      blocked: customers.filter(c => c.collaboration_status === 'blockerad').length,
      criticalRecommendations: recommendations.filter(r => r?.priority === 'critical').length,
    };
  };

  const alerts = getAlertsCount();

  const filteredRecommendations = recommendations.filter(r => {
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    return true;
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading intelligence dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Dashboard</h1>
          <p className="text-gray-600 leading-relaxed">
            Operational intelligence for strategic control and decision-making
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Credits</p>
              <p className="text-3xl font-bold text-gray-900">{safeNumber(totalCreditsCount, 0).toFixed(0)}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-2">
                {totalCreditsAllocation > 0 ? `${(safeDivide(totalCreditsCount, totalCreditsAllocation, 0) * 100).toFixed(1)}% of ${safeNumber(totalCreditsAllocation, 0).toFixed(0)} allocated` : 'Credits remaining'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    safeDivide(totalCreditsCount, totalCreditsAllocation, 0) * 100 < 20 ? 'bg-red-600' :
                    safeDivide(totalCreditsCount, totalCreditsAllocation, 0) * 100 < 40 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(safeDivide(totalCreditsCount, totalCreditsAllocation, 0) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Cost vs Credits</p>
              <p className={`text-3xl font-bold ${
                totalCreditsConsumedValue - totalInternalCost >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalCreditsConsumedValue > 0 ? (safeDivide(totalCreditsConsumedValue - totalInternalCost, totalCreditsConsumedValue, 0) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cost:</span>
                <span className="font-semibold text-red-600">{(safeNumber(totalInternalCost, 0) / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="font-semibold text-green-600">{(safeNumber(totalCreditsConsumedValue, 0) / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>

          <StatCard
            title="Total MRR"
            value={`${(safeNumber(totalMRR, 0) / 1000).toFixed(0)}k`}
            icon={DollarSign}
            iconColor="green"
          />

          <StatCard
            title="High Risk"
            value={alerts.atRisk + alerts.blocked}
            icon={AlertTriangle}
            iconColor="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="w-5 h-5 text-yellow-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-yellow-800 mb-1">At Risk</p>
            <p className="text-2xl font-bold text-yellow-900 mb-2">{alerts.atRisk}</p>
            <p className="text-xs text-yellow-700">Delivery issues</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Coins className="w-5 h-5 text-red-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-red-800 mb-1">Low Credits</p>
            <p className="text-2xl font-bold text-red-900 mb-2">{alerts.lowCredits}</p>
            <p className="text-xs text-red-700">Below 20% threshold</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-red-800 mb-1">Blocked</p>
            <p className="text-2xl font-bold text-red-900 mb-2">{alerts.blocked}</p>
            <p className="text-xs text-red-700">Collaboration issues</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingUp className="w-5 h-5 text-orange-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-orange-800 mb-1">Critical Actions</p>
            <p className="text-2xl font-bold text-orange-900 mb-2">{alerts.criticalRecommendations}</p>
            <p className="text-xs text-orange-700">Need immediate action</p>
          </div>
        </div>

        <Card>
          <CardHeader title="Credits Forecast" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forecasts.slice(0, 3).map((forecast) => {
              const customer = customers.find(c => c.id === forecast.customer_id);
              if (!customer) return null;

              const riskColor =
                forecast.risk_level === 'critical' ? 'bg-red-50 border-red-200' :
                forecast.risk_level === 'high' ? 'bg-orange-50 border-orange-200' :
                forecast.risk_level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200';

              return (
                <div key={forecast.id} className={`border rounded-lg p-4 ${riskColor}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.company_name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{forecast.forecast_days} day forecast</p>
                    </div>
                    <AlertCircle className={`w-5 h-5 ${
                      forecast.risk_level === 'critical' ? 'text-red-600' :
                      forecast.risk_level === 'high' ? 'text-orange-600' :
                      forecast.risk_level === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Balance:</span>
                      <span className="font-semibold text-gray-900">{safeNumber(forecast.current_balance, 0).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Projected Usage:</span>
                      <span className="font-semibold text-gray-900">{safeNumber(forecast.projected_usage, 0).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">End Balance:</span>
                      <span className="font-semibold text-gray-900">{safeNumber(forecast.projected_end_balance, 0).toFixed(1)}</span>
                    </div>
                    {forecast.days_until_depletion && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-red-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{forecast.days_until_depletion} days until depleted</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
            {forecasts.length > 3 && (
              <div className="mt-6 text-center">
                <Link
                  to="/admin/partner-portal/reports"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  View all forecasts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1.5">Intelligent Recommendations</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    AI-ranked by business impact, urgency, and customer value
                  </p>
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <CardBody>
              <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <span className="font-semibold">AI Prioritization:</span> Actions are ranked by business criticality considering customer MRR, credits urgency, delivery risk, and collaboration status. Higher priority scores demand immediate attention.
                  </div>
                </div>
              </div>

              {filteredRecommendations.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-base font-medium text-gray-600 mb-1">No active recommendations</p>
                  <p className="text-sm text-gray-500">System is monitoring for issues</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredRecommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onDismiss={handleDismissRecommendation}
                      onAction={handleActionRecommendation}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick Filters" />
            <CardBody className="space-y-3">
              <Link
                to="/admin/partner-portal/customers?filter=at_risk"
                className="block p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Delivery At Risk</div>
                    <div className="text-sm text-gray-600">{alerts.atRisk} customers</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                </div>
              </Link>

              <Link
                to="/admin/partner-portal/customers?filter=low_credits"
                className="block p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Credits Running Low</div>
                    <div className="text-sm text-gray-600">{alerts.lowCredits} customers</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-red-600 flex-shrink-0" />
                </div>
              </Link>

              <Link
                to="/admin/partner-portal/customers?filter=blocked"
                className="block p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Collaboration Blocked</div>
                    <div className="text-sm text-gray-600">{alerts.blocked} customers</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-red-600 flex-shrink-0" />
                </div>
              </Link>
            </CardBody>
          </Card>
        </div>

        <Card>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Customer Overview</h2>
            <Link
              to="/admin/partner-portal/customers"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CardBody noPadding>
            <div className="divide-y divide-gray-200">
            {customers.slice(0, 5).map((customer) => {
              const daysElapsed = new Date().getDate();
              const dailyBurnRate = safeDivide(customer.credits_consumed_this_month, daysElapsed || 1, 0);
              const daysRemaining = dailyBurnRate > 0 ? Math.floor(safeDivide(customer.credits_balance, dailyBurnRate, 999)) : 999;
              const creditsPercent = safeDivide(customer.credits_balance, customer.credits_monthly_allocation, 1) * 100;

              return (
                <Link
                  key={customer.id}
                  to={`/admin/partner-portal/customers/${customer.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{customer.company_name || 'Unknown'}</h3>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {safeNumber(customer.credits_balance, 0).toFixed(0)} credits
                            </div>
                            <div className={`text-xs font-medium ${
                              creditsPercent < 20 ? 'text-red-600' :
                              creditsPercent < 40 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {safeNumber(creditsPercent, 0).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{customer.industry || '—'}</span>
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-medium">{safeNumber(dailyBurnRate, 0).toFixed(1)}</span> credits/day
                        </span>
                        <span className={`font-medium ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-600'}`}>
                          {daysRemaining < 999 ? `${daysRemaining} days left` : '∞ days'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Delivery</div>
                      <StatusIndicator type="delivery" status={customer.delivery_status} showLabel={false} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Strategic</div>
                      <StatusIndicator type="strategic" status={customer.strategic_status} showLabel={false} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Commercial</div>
                      <StatusIndicator type="commercial" status={customer.commercial_status} showLabel={false} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Collaboration</div>
                      <StatusIndicator type="collaboration" status={customer.collaboration_status} showLabel={false} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Impact</div>
                      <StatusIndicator type="impact" status={customer.impact_status} showLabel={false} />
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;