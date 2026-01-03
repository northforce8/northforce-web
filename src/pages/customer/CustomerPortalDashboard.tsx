import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, TrendingUp, Coins } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardStats {
  activeProjects: number;
  completedDeliveries: number;
  creditsUsed: number;
  creditsRemaining: number;
  utilizationPercent: number;
}

interface RecentActivity {
  id: string;
  description: string;
  date: string;
  type: 'delivery' | 'milestone' | 'update';
}

const CustomerPortalDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    completedDeliveries: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    utilizationPercent: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id, credits_balance')
        .eq('email', session.user.email)
        .maybeSingle();

      if (!customer) return;

      const { data: projects } = await supabase
        .from('projects')
        .select('id, status')
        .eq('customer_id', customer.id);

      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select('credits_consumed')
        .in('project_id', projects?.map(p => p.id) || []);

      const creditsUsed = timeEntries?.reduce((sum, entry) => sum + (entry.credits_consumed || 0), 0) || 0;
      const creditsBalance = customer.credits_balance || 0;
      const utilizationPercent = creditsBalance > 0 ? Math.round((creditsUsed / (creditsUsed + creditsBalance)) * 100) : 0;

      setStats({
        activeProjects,
        completedDeliveries: completedProjects,
        creditsUsed,
        creditsRemaining: creditsBalance,
        utilizationPercent,
      });

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          description: t('customer.dashboard.activity_delivery'),
          date: new Date().toISOString(),
          type: 'delivery',
        },
        {
          id: '2',
          description: t('customer.dashboard.activity_milestone'),
          date: new Date(Date.now() - 86400000).toISOString(),
          type: 'milestone',
        },
      ];

      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('customer.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('customer.dashboard.title')}</h1>
        <p className="text-gray-500 mt-2">{t('customer.dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
          <p className="text-sm text-gray-600 mt-1">{t('customer.dashboard.active_projects')}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</p>
          <p className="text-sm text-gray-600 mt-1">{t('customer.dashboard.completed_deliveries')}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Coins className="h-5 w-5 text-purple-600" />
            {stats.creditsRemaining.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 mt-1">{t('customer.dashboard.capacity_remaining')}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.utilizationPercent}%</p>
          <p className="text-sm text-gray-600 mt-1">{t('customer.dashboard.capacity_used')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('customer.dashboard.recent_activity')}
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`mt-1 rounded-full p-2 ${
                    activity.type === 'delivery' ? 'bg-green-100' :
                    activity.type === 'milestone' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle2 className={`h-4 w-4 ${
                      activity.type === 'delivery' ? 'text-green-600' :
                      activity.type === 'milestone' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                {t('customer.dashboard.no_activity')}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('customer.dashboard.capacity_overview')}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('customer.dashboard.capacity_consumed')}</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  <Coins className="h-4 w-4 text-gray-400" />
                  {stats.creditsUsed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('customer.dashboard.capacity_available')}</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  <Coins className="h-4 w-4 text-gray-400" />
                  {stats.creditsRemaining.toLocaleString()}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${stats.utilizationPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {stats.utilizationPercent}% {t('customer.dashboard.utilized')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalDashboard;
