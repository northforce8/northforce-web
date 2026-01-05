import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Activity,
  DollarSign,
  Clock,
  Target,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import type { Customer } from '../../../lib/partner-portal-types';
import { CreditsWithMoneyDisplay, PlanPricingCard } from '../../../components/admin/CreditsWithMoneyDisplay';
import { creditsToMoney, formatCurrency } from '../../../lib/credits-pricing-config';
import BurnRateForecastAI from '../../../components/admin/BurnRateForecastAI';

interface CustomerCreditsStatus {
  customer: Customer;
  creditsUsedThisMonth: number;
  creditsRemaining: number;
  burnRate: number;
  daysRemaining: number;
  utilizationPercent: number;
  internalCostThisMonth: number;
  marginPercent: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

const CreditsDashboardPage: React.FC = () => {
  const [customersStatus, setCustomersStatus] = useState<CustomerCreditsStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'Auth' | 'RLS' | 'Network' | 'Mapping' | 'Unknown'>('Unknown');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [totalStats, setTotalStats] = useState({
    totalCreditsBalance: 0,
    totalMRR: 0,
    avgUtilization: 0,
    criticalCount: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorType('Unknown');
      const customers = await partnerPortalApi.customers.getAll();

      const statusPromises = customers.map(async (customer) => {
        const creditsUsed = Number(customer.credits_consumed_this_month) || 0;
        const creditsRemaining = Number(customer.credits_balance) || 0;
        const monthlyAllocation = Number(customer.credits_monthly_allocation) || 1;

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysPassed = now.getDate();
        const daysRemainingInMonth = daysInMonth - daysPassed;

        const burnRate = daysPassed > 0 ? creditsUsed / daysPassed : 0;
        const daysRemaining = burnRate > 0 ? creditsRemaining / burnRate : 999;
        const utilizationPercent = (creditsUsed / monthlyAllocation) * 100;

        const timeEntries = await partnerPortalApi.timeEntries.getAll({
          customerId: customer.id,
          startDate: monthStart.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        });

        const internalCostThisMonth = timeEntries.reduce(
          (sum, entry) => sum + (Number(entry.internal_cost) || 0),
          0
        );

        const revenueThisMonth = creditsUsed * (Number(customer.credits_price_per_credit) || 1500);
        const marginPercent =
          revenueThisMonth > 0 ? ((revenueThisMonth - internalCostThisMonth) / revenueThisMonth) * 100 : 0;

        let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
        const balancePercent = (creditsRemaining / monthlyAllocation) * 100;
        if (balancePercent < 10 || daysRemaining < 5) {
          riskLevel = 'critical';
        } else if (balancePercent < 20 || daysRemaining < 10) {
          riskLevel = 'high';
        } else if (balancePercent < 30) {
          riskLevel = 'medium';
        }

        return {
          customer,
          creditsUsedThisMonth: creditsUsed,
          creditsRemaining,
          burnRate,
          daysRemaining: Math.floor(daysRemaining),
          utilizationPercent,
          internalCostThisMonth,
          marginPercent,
          riskLevel,
        };
      });

      const statuses = await Promise.all(statusPromises);
      statuses.sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      });

      setCustomersStatus(statuses);

      const stats = {
        totalCreditsBalance: statuses.reduce((sum, s) => sum + s.creditsRemaining, 0),
        totalMRR: statuses.reduce((sum, s) => sum + Number(s.customer.monthly_recurring_revenue || 0), 0),
        avgUtilization:
          statuses.length > 0
            ? statuses.reduce((sum, s) => sum + s.utilizationPercent, 0) / statuses.length
            : 0,
        criticalCount: statuses.filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high').length,
      };
      setTotalStats(stats);
    } catch (err) {
      console.error('Error loading credits dashboard:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (errorMsg.includes('RLS') || errorMsg.includes('permission') || errorMsg.includes('policy')) {
        setErrorType('RLS');
        setError('Åtkomst nekad. Ditt konto kanske inte har rätt behörigheter.');
      } else if (errorMsg.includes('JWT') || errorMsg.includes('auth') || errorMsg.includes('session')) {
        setErrorType('Auth');
        setError('Sessionen har gått ut. Logga in igen.');
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        setErrorType('Network');
        setError('Nätverksfel. Kontrollera din anslutning och försök igen.');
      } else if (errorMsg.includes('undefined') || errorMsg.includes('null')) {
        setErrorType('Mapping');
        setError('Datastrukturfel. Kontakta support.');
      } else {
        setErrorType('Unknown');
        setError('Kunde inte ladda kreditdashboard. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskIcon = (level: string) => {
    if (level === 'critical' || level === 'high') {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <Activity className="w-5 h-5" />;
  };

  const filteredStatuses =
    filterRisk === 'all'
      ? customersStatus
      : customersStatus.filter((s) => s.riskLevel === filterRisk);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar kreditdashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = errorType === 'Auth';
    const isRLSError = errorType === 'RLS';

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                {errorType === 'Auth' ? 'Autentiseringsfel' :
                 errorType === 'RLS' ? 'Åtkomstfel' :
                 errorType === 'Network' ? 'Nätverksfel' :
                 errorType === 'Mapping' ? 'Datafel' :
                 'Laddningsfel'}
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="flex gap-3">
                {isAuthError ? (
                  <button
                    onClick={() => window.location.href = '/admin-login'}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logga in igen
                  </button>
                ) : (
                  <button
                    onClick={loadDashboard}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Försök igen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Krediter & Prognoser"
        description="Övervaka kreditkonsumtion, förbrukningshastighet och kapacitetsutnyttjande"
        icon={Coins}
        action={{
          label: 'Uppdatera',
          onClick: loadDashboard,
          icon: RefreshCw,
        }}
        help={PAGE_HELP_CONTENT.forecast}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Totalt Kreditsaldo</span>
            <Coins className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalStats.totalCreditsBalance.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Över alla kunder</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total MRR</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(totalStats.totalMRR / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">SEK per månad</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Genomsnittligt Utnyttjande</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalStats.avgUtilization.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Denna månad</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">I Riskzonen</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.criticalCount}</div>
          <div className="text-xs text-gray-500 mt-1">Kritisk eller hög risk</div>
        </div>
      </div>

      {/* AI Burn Rate Forecasts for Critical Customers */}
      {filteredStatuses.slice(0, 3).filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI-prognoser för förbrukningshastighet (Högriskkunder)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredStatuses
              .slice(0, 3)
              .filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high')
              .map(status => (
                <BurnRateForecastAI key={status.customer.id} customerId={status.customer.id} />
              ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Kundöversikt</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-3 py-1 text-sm rounded ${
                filterRisk === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alla
            </button>
            <button
              onClick={() => setFilterRisk('critical')}
              className={`px-3 py-1 text-sm rounded ${
                filterRisk === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kritisk
            </button>
            <button
              onClick={() => setFilterRisk('high')}
              className={`px-3 py-1 text-sm rounded ${
                filterRisk === 'high'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hög
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredStatuses.map((status) => {
            const revenueThisMonth = creditsToMoney(
              status.creditsUsedThisMonth,
              Number(status.customer.credits_price_per_credit) || 150,
              status.customer.currency_code || 'EUR'
            );

            return (
            <div key={status.customer.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {status.customer.company_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(status.riskLevel)}`}>
                      {getRiskIcon(status.riskLevel)}
                      <span className="ml-1 capitalize">{status.riskLevel}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Återstående Krediter</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Coins className="w-4 h-4 text-primary-600" />
                        {status.creditsRemaining.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        of {Number(status.customer.credits_monthly_allocation).toFixed(0)}
                      </div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        {formatCurrency(
                          creditsToMoney(
                            status.creditsRemaining,
                            Number(status.customer.credits_price_per_credit) || 150,
                            status.customer.currency_code || 'EUR'
                          ),
                          status.customer.currency_code || 'EUR'
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Förbrukningshastighet</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <TrendingDown className="w-4 h-4 text-amber-600" />
                        {status.burnRate.toFixed(1)}/day
                      </div>
                      <div className="text-xs text-gray-500">{status.daysRemaining} dagar kvar</div>
                      <div className="text-xs text-amber-600 font-medium mt-1">
                        {formatCurrency(
                          creditsToMoney(
                            status.burnRate,
                            Number(status.customer.credits_price_per_credit) || 150,
                            status.customer.currency_code || 'EUR'
                          ),
                          status.customer.currency_code || 'EUR'
                        )}/day
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Utnyttjande</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Target className="w-4 h-4 text-blue-600" />
                        {status.utilizationPercent.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">This month</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        {formatCurrency(
                          Number(status.customer.credits_price_per_credit) || 150,
                          'EUR'
                        )}/credit
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Marginal</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {status.marginPercent.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">This month</div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        {formatCurrency(
                          revenueThisMonth - status.internalCostThisMonth,
                          status.customer.currency_code || 'EUR'
                        )} vinst
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Intäkt vs Kostnad</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(
                          creditsToMoney(
                            status.creditsUsedThisMonth,
                            Number(status.customer.credits_price_per_credit) || 150,
                            status.customer.currency_code || 'EUR'
                          ),
                          status.customer.currency_code || 'EUR'
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Kostnad: {formatCurrency(status.internalCostThisMonth, status.customer.currency_code || 'EUR')}
                      </div>
                    </div>
                  </div>

                  {(status.riskLevel === 'critical' || status.riskLevel === 'high') && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-900">Risklarm</div>
                          <div className="text-red-700">
                            {status.creditsRemaining < status.burnRate * 5
                              ? `Krediterna tar snabbt slut. Endast ${status.daysRemaining} dagar kvar vid nuvarande förbrukningshastighet.`
                              : `Högt utnyttjande (${status.utilizationPercent.toFixed(0)}%). Övervaka noga för att undvika överleverans.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to={`/admin/partner-portal/customers/${status.customer.id}`}
                  className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 flex-shrink-0"
                >
                  Detaljer
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            );
          })}

          {filteredStatuses.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Inga kunder hittades med {filterRisk === 'critical' ? 'kritisk' : filterRisk === 'high' ? 'hög' : filterRisk} risknivå</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditsDashboardPage;
