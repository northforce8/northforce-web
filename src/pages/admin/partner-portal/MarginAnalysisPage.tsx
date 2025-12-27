import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';

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
  const [periodFilter, setPeriodFilter] = useState<string>('current_month');

  useEffect(() => {
    loadMarginAnalysis();
  }, [periodFilter]);

  const loadMarginAnalysis = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('margin_analysis')
        .select(`
          *,
          customer:customers(company_name, currency_code),
          project:projects(name)
        `)
        .order('analysis_period_start', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading margin analysis:', error);
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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Margin Analysis</h1>
        <p className="text-gray-600 mt-1">Track profitability across customers and projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalRevenue} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Cost</h3>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalCost} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Margin</h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            <CurrencyDisplay amount={totalMargin} currencyCode="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Margin %</h3>
            <Target className="h-5 w-5 text-purple-500" />
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
            Top Margin Customers
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
            Low Margin Customers
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
          <h2 className="text-lg font-semibold text-gray-900">Detailed Analysis</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hours / Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Margin %
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
                      to {new Date(analysis.analysis_period_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {Number(analysis.partner_hours).toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(analysis.credits_consumed).toFixed(1)} credits
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
            <p className="text-gray-500">No margin analysis data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarginAnalysisPage;
