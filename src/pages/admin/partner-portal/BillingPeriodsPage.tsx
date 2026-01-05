import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, AlertCircle, Download, Plus, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { PageHeader } from '../../../components/admin/PageHeader';

interface BillingPeriod {
  id: string;
  customer: {
    company_name: string;
    currency_code: string;
  };
  period_start: string;
  period_end: string;
  period_name: string;
  credits_allocated: number;
  credits_consumed: number;
  credits_remaining: number;
  base_price_sek: number;
  additional_credits_price_sek: number;
  total_amount_sek: number;
  internal_cost_sek: number;
  margin_sek: number;
  margin_percentage: number;
  status: string;
  invoice_number: string | null;
}

const BillingPeriodsPage: React.FC = () => {
  const [periods, setPeriods] = useState<BillingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadBillingPeriods();
  }, [statusFilter]);

  const loadBillingPeriods = async () => {
    if (!supabase) {
      setLoading(false);
      setError('Supabase är inte konfigurerat.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('billing_periods')
        .select(`
          *,
          customer:customers(company_name, currency_code)
        `)
        .order('period_start', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: dbError } = await query;
      if (dbError) throw dbError;
      setPeriods(data || []);
    } catch (err) {
      console.error('Error loading billing periods:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda faktureringsperioder. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'invoiced': return 'bg-primary-100 text-primary-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = periods
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.total_amount_sek), 0);

  const totalMargin = periods
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.margin_sek), 0);

  const avgMarginPercentage = periods.length > 0
    ? periods.reduce((sum, p) => sum + Number(p.margin_percentage), 0) / periods.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar faktureringsperioder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadBillingPeriods}
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
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Faktureringsperioder"
        description="Hantera faktureringscykler och intäktsspårning"
        action={{
          label: 'Ny period',
          onClick: () => {},
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total intäkt</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalRevenue} currencyCode="SEK" />
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Från betalda perioder</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total marginal</h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalMargin} currencyCode="SEK" />
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Snitt {avgMarginPercentage.toFixed(1)}% marginal
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktiva perioder</h3>
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{periods.length}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {periods.filter(p => p.status === 'approved').length} godkända
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Faktureringsperioder</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Alla statusar</option>
              <option value="draft">Utkast</option>
              <option value="approved">Godkänd</option>
              <option value="invoiced">Fakturerad</option>
              <option value="paid">Betald</option>
              <option value="cancelled">Avbruten</option>
            </select>
          </div>
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
                  Krediter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Intäkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marginal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Faktura
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periods.map((period) => (
                <tr key={period.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {period.customer.company_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{period.period_name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(period.period_start).toLocaleDateString()} - {new Date(period.period_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {Number(period.credits_consumed).toFixed(1)} / {Number(period.credits_allocated).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(period.credits_remaining).toFixed(1)} återstående
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      <CurrencyDisplay
                        amount={Number(period.total_amount_sek)}
                        currencyCode={period.customer.currency_code}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Kostnad: <CurrencyDisplay
                        amount={Number(period.internal_cost_sek)}
                        currencyCode={period.customer.currency_code}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-green-600">
                      <CurrencyDisplay
                        amount={Number(period.margin_sek)}
                        currencyCode={period.customer.currency_code}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(period.margin_percentage).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(period.status)}`}>
                      {period.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {period.invoice_number ? (
                      <div className="text-sm text-primary-600">{period.invoice_number}</div>
                    ) : (
                      <span className="text-xs text-gray-400">Ej fakturerad</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {periods.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Inga faktureringsperioder hittades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPeriodsPage;
