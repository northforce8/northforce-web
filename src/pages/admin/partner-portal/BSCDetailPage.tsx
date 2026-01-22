import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

interface BSCScorecard {
  id: string;
  customer_id: string;
  scorecard_name: string;
  financial_objectives: string;
  customer_objectives: string;
  internal_process_objectives: string;
  learning_growth_objectives: string;
  created_at: string;
  customer_name?: string;
}

export default function BSCDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scorecard, setScorecard] = useState<BSCScorecard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadScorecard();
  }, [id]);

  const loadScorecard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bsc_scorecards')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setScorecard({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'BSCDetailPage.loadScorecard' });
      console.error('Error loading BSC scorecard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('admin.detail.confirm_delete_bsc'))) return;

    try {
      const { error } = await supabase.from('bsc_scorecards').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/bsc');
    } catch (error) {
      logAdminError(error as Error, { context: 'BSCDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.detail.loading_bsc')}</p>
        </div>
      </div>
    );
  }

  if (!scorecard) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Target className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.detail.bsc_not_found')}</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/bsc')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('admin.detail.back_to_bsc')}
          </button>
        </div>
      </div>
    );
  }

  const perspectives = [
    {
      title: t('admin.detail.financial_perspective'),
      content: scorecard.financial_objectives,
      icon: '💰',
      color: 'border-green-300 bg-green-50'
    },
    {
      title: t('admin.detail.customer_perspective'),
      content: scorecard.customer_objectives,
      icon: '👥',
      color: 'border-blue-300 bg-blue-50'
    },
    {
      title: t('admin.detail.internal_process_perspective'),
      content: scorecard.internal_process_objectives,
      icon: '⚙️',
      color: 'border-orange-300 bg-orange-50'
    },
    {
      title: t('admin.detail.learning_growth_perspective'),
      content: scorecard.learning_growth_objectives,
      icon: '📚',
      color: 'border-purple-300 bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/bsc')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={scorecard.scorecard_name}
          description={scorecard.customer_name || t('admin.detail.balanced_scorecard')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {perspectives.map((perspective) => (
          <Card key={perspective.title} className={`p-6 border-2 ${perspective.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{perspective.icon}</span>
              <h3 className="font-semibold text-gray-900">{perspective.title}</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{perspective.content || t('admin.detail.no_objectives_defined')}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('admin.detail.delete_scorecard')}
        </button>
      </div>
    </div>
  );
}
