import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Coins } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimeEntry {
  id: string;
  date: string;
  description: string;
  hours: number;
  credits_consumed: number;
  project_name: string;
  work_type: string;
}

const CustomerActivityPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'all'>('month');
  const { t } = useLanguage();

  useEffect(() => {
    loadActivity();
  }, [filterPeriod]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();

      if (!customer) return;

      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('customer_id', customer.id);

      const projectIds = projects?.map(p => p.id) || [];

      let query = supabase
        .from('time_entries')
        .select(`
          id,
          date,
          description,
          hours,
          credits_consumed,
          projects!inner(name),
          work_types!inner(name)
        `)
        .in('project_id', projectIds)
        .order('date', { ascending: false });

      const now = new Date();
      if (filterPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query = query.gte('date', weekAgo.toISOString());
      } else if (filterPeriod === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query = query.gte('date', monthAgo.toISOString());
      }

      const { data: entries } = await query;

      const formattedEntries: TimeEntry[] = (entries || []).map((entry: any) => ({
        id: entry.id,
        date: entry.date,
        description: entry.description || '',
        hours: entry.hours || 0,
        credits_consumed: entry.credits_consumed || 0,
        project_name: entry.projects?.name || '',
        work_type: entry.work_types?.name || '',
      }));

      setTimeEntries(formattedEntries);
    } catch (error) {
      console.error('Failed to load activity:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">{t('customer.activity.title')}</h1>
        <p className="text-gray-500 mt-2">{t('customer.activity.subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">{t('customer.activity.filter')}:</span>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterPeriod === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`customer.activity.filter_${period}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {timeEntries.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary-100 rounded-lg p-2">
                        <Clock className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{entry.project_name}</h3>
                        <p className="text-xs text-gray-500">{entry.work_type}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-14">{entry.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1 justify-end">
                      <Coins className="h-4 w-4 text-gray-400" />
                      {entry.credits_consumed.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.hours}h
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('customer.activity.no_data')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerActivityPage;
