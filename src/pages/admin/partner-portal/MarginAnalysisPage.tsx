import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';

interface MarginAnalysis {
  id: string;
  customer: {
    company_name: string;
    currency_code: string;
  };
  project?: {
    name: string;
  };
  analysis_period_start: string;
  analysis_period_end: string;
  credits_consumed: number;
  credits_value_sek: number;
  internal_cost_sek: number;
  partner_hours: number;
  margin_sek: number;
  margin_percentage: number;
  avg_credit_cost: number | null;
  avg_hourly_rate: number | null;
}

const MarginAnalysisPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<MarginAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>('current_month');

  useEffect(() => {
    loadMarginAnalysis();
  }, [periodFilter]);

  const loadMarginAnalysis = async () => {
    if (!supabase) {
      setError('Databas ej tillgänglig');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('margin_analysis')
        .select(`
          *,
          customer:customers(company_name, currency_code),
          project:projects(name)
        `)
        .order('analysis_period_start', { ascending: false })
        .limit(50);

      if (dbError) throw dbError;
      setAnalyses(data || []);
    } catch (err) {
      console.error('Error loading margin analysis:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda marginalanalys. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = analyses.reduce((sum, a) => sum + Number(a.credits_value_sek), 0);
  const totalCost = analyses.reduce((sum, a) => sum + Number(a.internal_cost_sek), 0);
  const totalMargin = totalRevenue - totalCost;
  const avgMarginPercentage = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;

  const topMarginCustomers = [...analyses]
    .sort((a, b) => Number(b.margin_sek) - Number(a.margin_sek))
    .slice(0, 5);

  const lowMarginCustomers = [...analyses]
    .sort((a, b) => Number(a.margin_percentage) - Number(b.margin_percentage))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar marginalanalys...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadMarginAnalysis}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Marginalanalys"
        description="Spåra lönsamhet per kund och projekt"
        icon={BarChart3}
        help={PAGE_HELP_CONTENT.marginAnalysis}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total intäkt</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalRevenue} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total kostnad</h3>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalCost} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total marginal</h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            <CurrencyDisplay amount={totalMargin} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Snitt marginal %</h3>
            <Target className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {avgMarginPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Kunder med högst marginal
          </h3>
          <div className="space-y-3">
            {topMarginCustomers.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.customer.company_name}
                  </p>
                  {analysis.project && (
                    <p className="text-xs text-gray-500">{analysis.project.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    <CurrencyDisplay
                      amount={Number(analysis.margin_sek)}
                      currencyCode={analysis.customer.currency_code}
                    />
                  </p>
                  <p className="text-xs text-gray-500">
                    {Number(analysis.margin_percentage).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
            Kunder med lägst marginal
          </h3>
          <div className="space-y-3">
            {lowMarginCustomers.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.customer.company_name}
                  </p>
                  {analysis.project && (
                    <p className="text-xs text-gray-500">{analysis.project.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-600">
                    <CurrencyDisplay
                      amount={Number(analysis.margin_sek)}
                      currencyCode={analysis.customer.currency_code}
                    />
                  </p>
                  <p className="text-xs text-gray-500">
                    {Number(analysis.margin_percentage).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detaljerad analys</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timmar / Krediter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Intäkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kostnad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marginal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marginal %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyses.map((analysis) => (
                <tr key={analysis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.customer.company_name}
                    </div>
                    {analysis.project && (
                      <div className="text-xs text-gray-500">{analysis.project.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(analysis.analysis_period_start).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      till {new Date(analysis.analysis_period_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {Number(analysis.partner_hours).toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(analysis.credits_consumed).toFixed(1)} krediter
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      <CurrencyDisplay
                        amount={Number(analysis.credits_value_sek)}
                        currencyCode={analysis.customer.currency_code}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <CurrencyDisplay
                        amount={Number(analysis.internal_cost_sek)}
                        currencyCode={analysis.customer.currency_code}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-green-600">
                      <CurrencyDisplay
                        amount={Number(analysis.margin_sek)}
                        currencyCode={analysis.customer.currency_code}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold ${
                      Number(analysis.margin_percentage) >= 30 ? 'text-green-600' :
                      Number(analysis.margin_percentage) >= 15 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {Number(analysis.margin_percentage).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analyses.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Ingen marginalanalysdata tillgänglig</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarginAnalysisPage;
