import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Building2, FolderKanban, TrendingUp, Calendar, Plus, FileText,
  AlertTriangle, AlertCircle, Zap, CheckCircle, Info, TrendingDown
} from 'lucide-react';
import { getCurrentUser, isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { safeNumber } from '../../../lib/data-validators';
import type { TimeEntryWithRelations, NoteWithRelations, Partner, Customer, Recommendation } from '../../../lib/partner-portal-types';

const PartnerDashboard: React.FC = () => {
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
          title: `Critical: ${customer.company_name} - Credits Depleted`,
          description: `Only ${safeNumber(customer.credits_balance, 0).toFixed(1)} credits remaining (${safeNumber(creditsPercentage, 0).toFixed(0)}%). Immediate action required.`,
          action: { label: 'Add Credits', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <AlertTriangle className="h-5 w-5" />,
        });
      } else if (creditsPercentage < 20) {
        alerts.push({
          id: `credits-low-${customer.id}`,
          type: 'warning',
          title: `${customer.company_name} - Low Credits`,
          description: `${safeNumber(customer.credits_balance, 0).toFixed(1)} credits remaining (${safeNumber(creditsPercentage, 0).toFixed(0)}%). Consider refilling.`,
          action: { label: 'Manage Credits', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }

      if (customer.overdelivery_risk_level === 'critical' || customer.overdelivery_risk_level === 'high') {
        alerts.push({
          id: `overdelivery-${customer.id}`,
          type: customer.overdelivery_risk_level === 'critical' ? 'critical' : 'warning',
          title: `${customer.company_name} - High Overdelivery Risk`,
          description: `Current burn rate exceeds allocation. Scope review recommended.`,
          action: { label: 'View Details', link: `/admin/partner-portal/customers/${customer.id}` },
          icon: <TrendingDown className="h-5 w-5" />,
        });
      }

      if (customer.collaboration_status === 'blockerad') {
        alerts.push({
          id: `blocked-${customer.id}`,
          type: 'critical',
          title: `${customer.company_name} - Project Blocked`,
          description: `Collaboration is blocked. Immediate attention required to unblock progress.`,
          action: { label: 'View Details', link: `/admin/partner-portal/customers/${customer.id}` },
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
          action: rec.customer ? { label: 'View Customer', link: `/admin/partner-portal/customers/${rec.customer_id}` } : undefined,
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
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdminUser ? 'Partner Portal Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdminUser ? 'Overview of all partner activities' : 'Your activity overview'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
            <p className="text-sm text-gray-600 mt-1">Total Hours</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-cyan/10 rounded-lg">
                <Building2 className="h-6 w-6 text-accent-cyan" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
            <p className="text-sm text-gray-600 mt-1">Active Customers</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-emerald/10 rounded-lg">
                <FolderKanban className="h-6 w-6 text-accent-emerald" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
            <p className="text-sm text-gray-600 mt-1">Active Projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-amber/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-amber" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.thisWeekHours}</p>
            <p className="text-sm text-gray-600 mt-1">This Week</p>
          </div>
        </div>

        {isAdminUser && alerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-600" />
                  Business Intelligence & Alerts
                </h2>
                <p className="text-sm text-gray-600 mt-1">Rule-based recommendations requiring attention</p>
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
                <h2 className="text-lg font-semibold text-gray-900">Recent Time Entries</h2>
                <Link
                  to="/admin/partner-portal/time"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentTimeEntries.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No time entries yet</p>
                  <Link
                    to="/admin/partner-portal/time"
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-2 inline-block"
                  >
                    Report your first hours
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
                <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
                <Link
                  to="/admin/partner-portal/notes"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentNotes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notes yet</p>
                  <Link
                    to="/admin/partner-portal/notes"
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-2 inline-block"
                  >
                    Create your first note
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customers</h3>
            <p className="text-sm text-gray-600">View and manage customer relationships</p>
          </Link>

          <Link
            to="/admin/partner-portal/projects"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <FolderKanban className="h-8 w-8 text-accent-emerald mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
            <p className="text-sm text-gray-600">Track active projects and deliverables</p>
          </Link>

          <Link
            to="/admin/partner-portal/time"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Clock className="h-8 w-8 text-accent-cyan mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Reporting</h3>
            <p className="text-sm text-gray-600">Log and track your hours</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
