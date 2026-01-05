import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Building2, FolderKanban, TrendingUp, Calendar, Plus, FileText,
  AlertTriangle, AlertCircle, Zap, CheckCircle, Info, TrendingDown,
  Target, Compass, RefreshCw, Lightbulb, LayoutDashboard
} from 'lucide-react';
import { getCurrentUser, isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { safeNumber } from '../../../lib/data-validators';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import type { TimeEntryWithRelations, NoteWithRelations, Partner, Customer, Recommendation } from '../../../lib/partner-portal-types';

const PartnerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [stats, setStats] = useState({
    totalHours: 0,
    activeCustomers: 0,
    activeProjects: 0,
    thisWeekHours: 0,
  });
  const [recentTimeEntries, setRecentTimeEntries] = useState<TimeEntryWithRelations[]>([]);
  const [recentNotes, setRecentNotes] = useState<NoteWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    action?: { label: string; link: string };
    icon: React.ReactNode;
  }>>([]);
  const [frameworkStats, setFrameworkStats] = useState({
    totalOKRs: 0,
    okrsOnTrack: 0,
    activeSWOTs: 0,
    activeChangeInitiatives: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        const userIsAdmin = await isAdmin();
        setIsAdminUser(userIsAdmin);

        if (userIsAdmin) {
          const adminStats = await partnerPortalApi.stats.getAdminStats();
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekStats = await partnerPortalApi.stats.getAdminStats(
            weekStart.toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          );

          setStats({
            totalHours: adminStats.totalHours,
            activeCustomers: adminStats.activeCustomers,
            activeProjects: adminStats.activeProjects,
            thisWeekHours: weekStats.totalHours,
          });

          const timeEntries = await partnerPortalApi.timeEntries.getAll();
          setRecentTimeEntries(timeEntries.slice(0, 5));

          const notes = await partnerPortalApi.notes.getAll();
          setRecentNotes(notes.slice(0, 5));

          const customers = await partnerPortalApi.customers.getAll();
          const recommendations = await partnerPortalApi.recommendations.getAll({ status: 'active' });

          // Load framework data
          const [okrsResult, swotsResult, changesResult] = await Promise.all([
            supabase.from('okr_objectives').select('id, status', { count: 'exact' }),
            supabase.from('swot_analyses').select('id, status', { count: 'exact' }).eq('status', 'in_progress'),
            supabase.from('change_initiatives').select('id, status', { count: 'exact' }).eq('status', 'in_progress')
          ]);

          setFrameworkStats({
            totalOKRs: okrsResult.count || 0,
            okrsOnTrack: (okrsResult.data || []).filter(o => o.status === 'active').length,
            activeSWOTs: swotsResult.count || 0,
            activeChangeInitiatives: changesResult.count || 0,
          });

          const generatedAlerts = generateAlerts(customers, recommendations);
          setAlerts(generatedAlerts);
        } else {
          if (!user) return;

          const partner = await partnerPortalApi.partners.getByUserId(user.id);
          if (partner) {
            setCurrentPartner(partner);
            const partnerStats = await partnerPortalApi.stats.getPartnerStats(partner.id);
            setStats(partnerStats);

            const timeEntries = await partnerPortalApi.timeEntries.getAll({ partnerId: partner.id });
            setRecentTimeEntries(timeEntries.slice(0, 5));

            const notes = await partnerPortalApi.notes.getAll({ partnerId: partner.id });
            setRecentNotes(notes.slice(0, 5));
          }
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const generateAlerts = (customers: Customer[], recommendations: Recommendation[]) => {
    const alerts: Array<{
      id: string;
      type: 'critical' | 'warning' | 'info' | 'success';
      title: string;
      description: string;
      action?: { label: string; link: string };
      icon: React.ReactNode;
    }> = [];

    customers.forEach((customer) => {
      const creditsPercentage = customer.credits_monthly_allocation
        ? (customer.credits_balance / customer.credits_monthly_allocation) * 100
        : 0;

      if (creditsPercentage < 10 && customer.credits_balance < 10) {
        alerts.push({
          id: `credits-critical-${customer.id}`,
          type: 'critical',
          title: `Kritiskt: ${customer.company_name} - Krediter slut`,
          description: `Endast ${safeNumber(customer.credits_balance, 0).toFixed(1)} krediter kvar (${safeNumber(creditsPercentage, 0).toFixed(0)}%). Omedelbar åtgärd krävs.`,
          action: { label: 'Lägg till krediter', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <AlertTriangle className="h-5 w-5" />,
        });
      } else if (creditsPercentage < 20) {
        alerts.push({
          id: `credits-low-${customer.id}`,
          type: 'warning',
          title: `${customer.company_name} - Lågt kreditsaldo`,
          description: `${safeNumber(customer.credits_balance, 0).toFixed(1)} krediter kvar (${safeNumber(creditsPercentage, 0).toFixed(0)}%). Överväg påfyllning.`,
          action: { label: 'Hantera krediter', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }

      if (customer.overdelivery_risk_level === 'critical' || customer.overdelivery_risk_level === 'high') {
        alerts.push({
          id: `overdelivery-${customer.id}`,
          type: customer.overdelivery_risk_level === 'critical' ? 'critical' : 'warning',
          title: `${customer.company_name} - Hög överleveransrisk`,
          description: `Nuvarande förbrukningshastighet överstiger allokering. Omfattningsgranskning rekommenderas.`,
          action: { label: 'Visa detaljer', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <TrendingDown className="h-5 w-5" />,
        });
      }

      if (customer.collaboration_status === 'blockerad') {
        alerts.push({
          id: `blocked-${customer.id}`,
          type: 'critical',
          title: `${customer.company_name} - Projekt blockerat`,
          description: `Samarbetet är blockerat. Omedelbar uppmärksamhet krävs för att låsa upp framsteg.`,
          action: { label: 'Visa detaljer', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <AlertTriangle className="h-5 w-5" />,
        });
      }
    });

    recommendations.forEach((rec) => {
      if (rec.priority === 'critical' || rec.priority === 'high') {
        alerts.push({
          id: `rec-${rec.id}`,
          type: rec.priority === 'critical' ? 'critical' : 'warning',
          title: rec.title,
          description: rec.description || '',
          action: rec.customer ? { label: 'Visa kund', link: `/admin/partner-portal/customers/${rec.customer_id}` } : undefined,
          icon: <Zap className="h-5 w-5" />,
        });
      }
    });

    alerts.sort((a, b) => {
      const priority = { critical: 0, warning: 1, info: 2, success: 3 };
      return priority[a.type] - priority[b.type];
    });

    return alerts.slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('dashboard.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title={isAdminUser ? t('dashboard.title_admin') : t('dashboard.title_partner')}
          description={isAdminUser ? t('dashboard.subtitle_admin') : t('dashboard.subtitle_partner')}
          icon={LayoutDashboard}
          help={PAGE_HELP_CONTENT.dashboard}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{t('dashboard.kpi.total_hours')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.kpi.total_hours_desc')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-cyan/10 rounded-lg">
                <Building2 className="h-6 w-6 text-accent-cyan" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{t('dashboard.kpi.active_customers')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.kpi.active_customers_desc')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-emerald/10 rounded-lg">
                <FolderKanban className="h-6 w-6 text-accent-emerald" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{t('dashboard.kpi.active_projects')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.kpi.active_projects_desc')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-amber/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-amber" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.thisWeekHours}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{t('dashboard.kpi.this_week')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.kpi.this_week_desc')}</p>
          </div>
        </div>

        {isAdminUser && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-600" />
                  {t('dashboard.frameworks.title')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('dashboard.frameworks.subtitle')}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link to="/admin/partner-portal/strategic-frameworks/okr" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{t('dashboard.frameworks.okr')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{frameworkStats.totalOKRs}</p>
                    <p className="text-xs text-gray-600 mt-1">{frameworkStats.okrsOnTrack} {t('dashboard.frameworks.okr_status')}</p>
                  </Link>

                  <Link to="/admin/partner-portal/strategic-frameworks/swot" className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-900">{t('dashboard.frameworks.swot')}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{frameworkStats.activeSWOTs}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('dashboard.frameworks.swot_status')}</p>
                  </Link>

                  <Link to="/admin/partner-portal/strategic-frameworks/adkar" className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <RefreshCw className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">{t('dashboard.frameworks.change')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{t('dashboard.frameworks.change_subtitle')}</p>
                    <p className="text-2xl font-bold text-gray-900">{frameworkStats.activeChangeInitiatives}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('dashboard.frameworks.change_status')}</p>
                  </Link>

                  <Link to="/admin/partner-portal/strategic-frameworks" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center">
                    <div className="text-center">
                      <Lightbulb className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">{t('dashboard.frameworks.view_all')}</p>
                      <p className="text-xs text-gray-500">{t('dashboard.frameworks.view_all_count')}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdminUser && alerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-600" />
                  {t('dashboard.alerts.title')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('dashboard.alerts.subtitle')}</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const bgColors = {
                      critical: 'bg-red-50 border-red-200',
                      warning: 'bg-yellow-50 border-yellow-200',
                      info: 'bg-blue-50 border-blue-200',
                      success: 'bg-green-50 border-green-200',
                    };
                    const textColors = {
                      critical: 'text-red-800',
                      warning: 'text-yellow-800',
                      info: 'text-blue-800',
                      success: 'text-green-800',
                    };
                    const iconColors = {
                      critical: 'text-red-600',
                      warning: 'text-yellow-600',
                      info: 'text-blue-600',
                      success: 'text-green-600',
                    };

                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${bgColors[alert.type]} flex items-start gap-4`}
                      >
                        <div className={iconColors[alert.type]}>{alert.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold ${textColors[alert.type]} mb-1`}>
                            {alert.title}
                          </h3>
                          <p className={`text-sm ${textColors[alert.type]} opacity-90`}>
                            {alert.description}
                          </p>
                        </div>
                        {alert.action && (
                          <Link
                            to={alert.action.link}
                            className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              alert.type === 'critical'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : alert.type === 'warning'
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {alert.action.label}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.time.title')}</h2>
                <Link
                  to="/admin/partner-portal/time"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('dashboard.time.add')}
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentTimeEntries.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-2">{t('dashboard.time.empty_title')}</p>
                  <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">{t('dashboard.time.empty_desc')}</p>
                  <Link
                    to="/admin/partner-portal/time"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    {t('dashboard.time.empty_action')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTimeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.customer?.company_name}</p>
                        <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(entry.date)}
                          <span className="mx-2">•</span>
                          {entry.work_type?.name}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 ml-4">{entry.hours}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.notes.title')}</h2>
                <Link
                  to="/admin/partner-portal/notes"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('dashboard.notes.add')}
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentNotes.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-2">{t('dashboard.notes.empty_title')}</p>
                  <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">{t('dashboard.notes.empty_desc')}</p>
                  <Link
                    to="/admin/partner-portal/notes"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    {t('dashboard.notes.empty_action')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentNotes.map((note) => (
                    <div key={note.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {note.note_type}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                      <p className="text-xs font-medium text-gray-900">{note.customer?.company_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/partner-portal/customers"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Building2 className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.links.customers')}</h3>
            <p className="text-sm text-gray-600">{t('dashboard.links.customers_desc')}</p>
          </Link>

          <Link
            to="/admin/partner-portal/projects"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <FolderKanban className="h-8 w-8 text-accent-emerald mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.links.projects')}</h3>
            <p className="text-sm text-gray-600">{t('dashboard.links.projects_desc')}</p>
          </Link>

          <Link
            to="/admin/partner-portal/time"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Clock className="h-8 w-8 text-accent-cyan mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.links.time')}</h3>
            <p className="text-sm text-gray-600">{t('dashboard.links.time_desc')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
