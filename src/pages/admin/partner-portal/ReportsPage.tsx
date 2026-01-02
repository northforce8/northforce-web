import React, { useState, useEffect } from 'react';
import {
  Download,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Coins,
  PieChart,
  Calendar,
  Filter,
} from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { safeNumber } from '../../../lib/data-validators';
import ReportsInsightsAI from '../../../components/admin/ReportsInsightsAI';
import type {
  MarginAnalysis,
  PartnerPerformance,
  Customer,
  Partner,
} from '../../../lib/partner-portal-types';

const ReportsPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [marginReports, setMarginReports] = useState<MarginAnalysis[]>([]);
  const [partnerPerformance, setPartnerPerformance] = useState<PartnerPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedCustomer, selectedPartner]);

  const getPeriodDates = (period: string) => {
    const now = new Date();
    let startDate = new Date();
    const endDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - now.getDay());
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, partnersData] = await Promise.all([
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.partners.getAll(),
      ]);
      setCustomers(customersData);
      setPartners(partnersData);

      const { startDate, endDate } = getPeriodDates(selectedPeriod);

      const customersToAnalyze = selectedCustomer === 'all' ? customersData : customersData.filter(c => c.id === selectedCustomer);
      const margins = await Promise.all(
        customersToAnalyze.map(c =>
          partnerPortalApi.marginAnalysis.calculate(c.id, startDate, endDate).catch(() => null)
        )
      );
      setMarginReports(margins.filter(m => m !== null) as MarginAnalysis[]);

      const partnersToAnalyze = selectedPartner === 'all' ? partnersData : partnersData.filter(p => p.id === selectedPartner);
      const performance = await Promise.all(
        partnersToAnalyze.map(p =>
          partnerPortalApi.dashboard.getPartnerPerformance(p.id, startDate, endDate).catch(() => null)
        )
      );
      setPartnerPerformance(performance.filter(p => p !== null) as PartnerPerformance[]);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportMarginReport = () => {
    const data = marginReports.map(m => {
      const customer = customers.find(c => c.id === m.customer_id);
      return {
        customer: customer?.company_name || 'Unknown',
        period_start: m.period_start,
        period_end: m.period_end,
        revenue_sek: m.revenue_sek,
        internal_cost_sek: m.internal_cost_sek,
        margin_sek: m.margin_sek,
        margin_percentage: m.margin_percentage,
        hours_delivered: m.hours_delivered,
      };
    });
    exportToCSV(data, 'margin_report');
  };

  const exportPartnerPerformance = () => {
    const data = partnerPerformance.map(p => {
      const partner = partners.find(pt => pt.id === p.partner_id);
      return {
        partner: partner?.partner_name || 'Unknown',
        period_start: p.period_start,
        period_end: p.period_end,
        total_hours: p.total_hours,
        billable_hours: p.billable_hours,
        billable_percentage: p.billable_percentage,
        credits_generated: p.credits_generated,
        internal_cost: p.internal_cost,
        customer_count: p.customer_count,
        project_count: p.project_count,
      };
    });
    exportToCSV(data, 'partner_performance');
  };

  const totalMargin = marginReports.reduce((sum, m) => sum + Number(m.margin_sek), 0);
  const totalRevenue = marginReports.reduce((sum, m) => sum + Number(m.revenue_sek), 0);
  const avgMarginPercentage = marginReports.length > 0
    ? marginReports.reduce((sum, m) => sum + Number(m.margin_percentage), 0) / marginReports.length
    : 0;
  const totalHours = partnerPerformance.reduce((sum, p) => sum + Number(p.total_hours), 0);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive business intelligence and data exports</p>
        </div>

        {/* AI Intelligence - Top Actionable Insights */}
        <div className="mb-6">
          <ReportsInsightsAI />
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Customers</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Partners</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.partner_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900">{(safeNumber(totalRevenue, 0) / 1000).toFixed(0)}k</div>
            <div className="text-xs text-green-700 mt-1">SEK</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Total Margin</span>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900">{(safeNumber(totalMargin, 0) / 1000).toFixed(0)}k</div>
            <div className="text-xs text-blue-700 mt-1">{safeNumber(avgMarginPercentage, 0).toFixed(1)}% avg</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Total Hours</span>
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-900">{safeNumber(totalHours, 0).toFixed(0)}</div>
            <div className="text-xs text-orange-700 mt-1">delivered</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-cyan-800">Active Partners</span>
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-cyan-900">{partnerPerformance.length}</div>
            <div className="text-xs text-cyan-700 mt-1">in period</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Margin Analysis</h2>
              <button
                onClick={exportMarginReport}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            {marginReports.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No margin data for selected filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {marginReports.slice(0, 5).map((report) => {
                  const customer = customers.find(c => c.id === report.customer_id);
                  const marginColor =
                    Number(report.margin_percentage) >= 50 ? 'text-green-600' :
                    Number(report.margin_percentage) >= 30 ? 'text-yellow-600' :
                    'text-red-600';

                  return (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer?.company_name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-lg font-bold ${marginColor}`}>
                          {safeNumber(Number(report.margin_percentage), 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-semibold text-gray-900">{(safeNumber(Number(report.revenue_sek), 0) / 1000).toFixed(0)}k</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cost</p>
                          <p className="font-semibold text-gray-900">{(safeNumber(Number(report.internal_cost_sek), 0) / 1000).toFixed(0)}k</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Margin</p>
                          <p className="font-semibold text-green-600">{(safeNumber(Number(report.margin_sek), 0) / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Partner Performance</h2>
              <button
                onClick={exportPartnerPerformance}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            {partnerPerformance.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No performance data for selected filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {partnerPerformance.slice(0, 5).map((perf) => {
                  const partner = partners.find(p => p.id === perf.partner_id);
                  const billablePercentage = Number(perf.billable_percentage);
                  const billableColor =
                    billablePercentage >= 80 ? 'text-green-600' :
                    billablePercentage >= 60 ? 'text-yellow-600' :
                    'text-red-600';

                  return (
                    <div key={perf.partner_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{partner?.partner_name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(perf.period_start).toLocaleDateString()} - {new Date(perf.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-lg font-bold ${billableColor}`}>
                          {safeNumber(billablePercentage, 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Hours</p>
                          <p className="font-semibold text-gray-900">{safeNumber(Number(perf.total_hours), 0).toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Credits</p>
                          <p className="font-semibold text-primary-600">{safeNumber(Number(perf.credits_generated), 0).toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Customers</p>
                          <p className="font-semibold text-gray-900">{perf.customer_count}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Profitability</h2>
          {marginReports.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No profitability data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cost</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Margin</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Margin %</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {marginReports
                    .sort((a, b) => Number(b.margin_sek) - Number(a.margin_sek))
                    .map((report) => {
                      const customer = customers.find(c => c.id === report.customer_id);
                      const marginPercentage = Number(report.margin_percentage);
                      const marginColor =
                        marginPercentage >= 50 ? 'text-green-600' :
                        marginPercentage >= 30 ? 'text-yellow-600' :
                        'text-red-600';

                      return (
                        <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">{customer?.company_name}</span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-900">
                            {(safeNumber(Number(report.revenue_sek), 0) / 1000).toFixed(0)}k SEK
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-900">
                            {(safeNumber(Number(report.internal_cost_sek), 0) / 1000).toFixed(0)}k SEK
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-semibold text-green-600">
                            {(safeNumber(Number(report.margin_sek), 0) / 1000).toFixed(0)}k SEK
                          </td>
                          <td className={`py-3 px-4 text-right text-sm font-bold ${marginColor}`}>
                            {safeNumber(marginPercentage, 0).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-900">
                            {safeNumber(Number(report.hours_delivered), 0).toFixed(0)}h
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
