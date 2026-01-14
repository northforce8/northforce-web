import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import type {
  PartnerAvailabilitySummary,
  PartnerWorkloadRecommendationWithRelations,
} from '../../../lib/partner-portal-types';

const CapacityOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<PartnerAvailabilitySummary[]>([]);
  const [recommendations, setRecommendations] = useState<PartnerWorkloadRecommendationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUtilization, setFilterUtilization] = useState<string>('all');
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [partnersData, recommendationsData] = await Promise.all([
        partnerPortalApi.partners.getAvailabilitySummary(),
        partnerPortalApi.partnerWorkloadRecommendations.getAll({ status: 'active' }),
      ]);

      setPartners(partnersData);
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error('Error loading capacity data:', err);
      setError('Failed to load capacity data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      setGeneratingRecommendations(true);
      await partnerPortalApi.partnerWorkloadRecommendations.generateRecommendations();
      await loadData();
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations');
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  const filteredPartners = partners.filter((partner) => {
    if (filterUtilization === 'all') return true;
    if (filterUtilization === 'overloaded') return partner.utilization_percentage > 90;
    if (filterUtilization === 'optimal') return partner.utilization_percentage >= 60 && partner.utilization_percentage <= 90;
    if (filterUtilization === 'underutilized') return partner.utilization_percentage < 60;
    return true;
  });

  const stats = {
    total: partners.length,
    overloaded: partners.filter((p) => p.utilization_percentage > 90).length,
    optimal: partners.filter((p) => p.utilization_percentage >= 60 && p.utilization_percentage <= 90).length,
    underutilized: partners.filter((p) => p.utilization_percentage < 60).length,
    avgUtilization:
      partners.length > 0
        ? partners.reduce((sum, p) => sum + p.utilization_percentage, 0) / partners.length
        : 0,
    totalCapacity: partners.reduce((sum, p) => sum + p.capacity_hours_per_month, 0),
    totalUsed: partners.reduce((sum, p) => sum + p.current_month_hours, 0),
    totalRemaining: partners.reduce((sum, p) => sum + p.remaining_capacity, 0),
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-600 bg-red-50 border-red-200';
    if (utilization >= 60) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getUtilizationIcon = (utilization: number) => {
    if (utilization > 90) return <AlertTriangle className="h-5 w-5" />;
    if (utilization >= 60) return <CheckCircle className="h-5 w-5" />;
    return <TrendingDown className="h-5 w-5" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading capacity overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <PageHeader
        title="Kapacitetsplanering"
        description="Övervaka partnertillgänglighet och arbetsbelastning över projekt"
        icon={Gauge}
        action={{
          label: generatingRecommendations ? 'Genererar...' : 'Generera rekommendationer',
          onClick: handleGenerateRecommendations,
          icon: <RefreshCw className={`h-5 w-5 ${generatingRecommendations ? 'animate-spin' : ''}`} />,
          disabled: generatingRecommendations
        }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Partners</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">{stats.totalCapacity}h total capacity</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Utilization</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgUtilization.toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {stats.totalUsed.toFixed(0)}h / {stats.totalCapacity}h
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Optimal Load</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.optimal}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">60-90% utilization</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Needs Attention</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.overloaded + stats.underutilized}
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {stats.overloaded} overloaded, {stats.underutilized} underutilized
          </p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            AI-Powered Recommendations ({recommendations.length})
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`p-4 rounded-lg border ${getSeverityColor(rec.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-white rounded uppercase font-medium">
                        {rec.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{rec.description}</p>
                    {rec.current_utilization !== null && rec.current_utilization !== undefined && (
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span>
                          Current: <strong>{rec.current_utilization.toFixed(0)}%</strong>
                        </span>
                        {rec.target_utilization !== null && rec.target_utilization !== undefined && (
                          <span>
                            Target: <strong>{rec.target_utilization.toFixed(0)}%</strong>
                          </span>
                        )}
                      </div>
                    )}
                    {rec.suggested_action && (
                      <p className="text-sm font-medium text-blue-600">
                        Suggested: {rec.suggested_action}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => rec.partner_id && navigate(`/admin/partner-portal/partners/${rec.partner_id}`)}
                    className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    View Partner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Partner Capacity Status</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterUtilization('all')}
              className={`px-3 py-1 text-sm rounded ${
                filterUtilization === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterUtilization('overloaded')}
              className={`px-3 py-1 text-sm rounded ${
                filterUtilization === 'overloaded'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overloaded ({stats.overloaded})
            </button>
            <button
              onClick={() => setFilterUtilization('optimal')}
              className={`px-3 py-1 text-sm rounded ${
                filterUtilization === 'optimal'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Optimal ({stats.optimal})
            </button>
            <button
              onClick={() => setFilterUtilization('underutilized')}
              className={`px-3 py-1 text-sm rounded ${
                filterUtilization === 'underutilized'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Underutilized ({stats.underutilized})
            </button>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No partners match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPartners.map((partner) => {
              const utilization = partner.utilization_percentage;
              return (
                <div
                  key={partner.partner_id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/partner-portal/partners/${partner.partner_id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{partner.partner_name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded border ${getUtilizationColor(utilization)}`}>
                          {getUtilizationIcon(utilization)}
                          <span className="ml-1 font-medium">{utilization.toFixed(0)}%</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {partner.role_name || 'Partner'} • {partner.capacity_hours_per_month}h/month capacity
                      </p>
                      {partner.work_types && partner.work_types.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {partner.work_types.slice(0, 3).map((wt, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                              {wt}
                            </span>
                          ))}
                          {partner.work_types.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              +{partner.work_types.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {partner.current_month_hours.toFixed(1)}h / {partner.capacity_hours_per_month}h
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {partner.remaining_capacity.toFixed(1)}h available
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          utilization > 90
                            ? 'bg-red-500'
                            : utilization >= 60
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(100, utilization)}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{partner.active_customers} customers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{partner.active_projects} projects</span>
                      </div>
                      {partner.hourly_cost_rate && (
                        <div className="flex items-center gap-1">
                          <span>{partner.hourly_cost_rate} SEK/h</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapacityOverviewPage;
