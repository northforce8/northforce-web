import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Network, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

interface McKinsey7SAnalysis {
  id: string;
  customer_id: string;
  analysis_name: string;
  strategy: string;
  structure: string;
  systems: string;
  shared_values: string;
  style: string;
  staff: string;
  skills: string;
  created_at: string;
  customer_name?: string;
}

export default function McKinsey7SDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<McKinsey7SAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mckinsey_7s_analyses')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setAnalysis({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'McKinsey7SDetailPage.loadAnalysis' });
      console.error('Error loading McKinsey 7S analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('admin.detail.confirm_delete_mckinsey'))) return;

    try {
      const { error } = await supabase.from('mckinsey_7s_analyses').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/mckinsey-7s');
    } catch (error) {
      logAdminError(error as Error, { context: 'McKinsey7SDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.detail.loading_mckinsey')}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Network className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.detail.mckinsey_not_found')}</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/mckinsey-7s')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('admin.detail.back_to_mckinsey')}
          </button>
        </div>
      </div>
    );
  }

  const elements = [
    { title: t('admin.detail.strategy'), content: analysis.strategy, icon: '🎯', color: 'border-blue-300 bg-blue-50' },
    { title: t('admin.detail.structure'), content: analysis.structure, icon: '🏗️', color: 'border-green-300 bg-green-50' },
    { title: t('admin.detail.systems'), content: analysis.systems, icon: '⚙️', color: 'border-yellow-300 bg-yellow-50' },
    { title: t('admin.detail.shared_values'), content: analysis.shared_values, icon: '💎', color: 'border-red-300 bg-red-50' },
    { title: t('admin.detail.style'), content: analysis.style, icon: '👔', color: 'border-purple-300 bg-purple-50' },
    { title: t('admin.detail.staff'), content: analysis.staff, icon: '👥', color: 'border-orange-300 bg-orange-50' },
    { title: t('admin.detail.skills'), content: analysis.skills, icon: '🎓', color: 'border-pink-300 bg-pink-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/mckinsey-7s')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={analysis.analysis_name}
          description={analysis.customer_name || t('admin.detail.mckinsey_framework')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elements.map((element) => (
          <Card key={element.title} className={`p-6 border-2 ${element.color}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{element.icon}</span>
              <h3 className="font-semibold text-gray-900">{element.title}</h3>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{element.content || t('admin.detail.not_defined')}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('admin.detail.delete_analysis')}
        </button>
      </div>
    </div>
  );
}
