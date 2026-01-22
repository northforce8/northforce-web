import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

interface AgileTransformation {
  id: string;
  customer_id: string;
  transformation_name: string;
  sprint_length: number;
  team_velocity: number;
  current_phase: string;
  notes: string;
  created_at: string;
  customer_name?: string;
}

export default function AgileDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transformation, setTransformation] = useState<AgileTransformation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadTransformation();
  }, [id]);

  const loadTransformation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agile_transformations')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTransformation({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'AgileDetailPage.loadTransformation' });
      console.error('Error loading Agile transformation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('admin.detail.confirm_delete_agile'))) return;

    try {
      const { error } = await supabase.from('agile_transformations').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/agile');
    } catch (error) {
      logAdminError(error as Error, { context: 'AgileDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.detail.loading_agile')}</p>
        </div>
      </div>
    );
  }

  if (!transformation) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.detail.agile_not_found')}</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/agile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('admin.detail.back_to_agile')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/agile')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={transformation.transformation_name}
          description={transformation.customer_name || t('admin.detail.agile_transformation')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('admin.detail.current_phase')}</h3>
          <p className="text-2xl font-bold text-blue-900">{transformation.current_phase}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('admin.detail.sprint_length')}</h3>
          <p className="text-2xl font-bold text-green-900">{transformation.sprint_length} {t('admin.detail.weeks')}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('admin.detail.team_velocity')}</h3>
          <p className="text-2xl font-bold text-purple-900">{transformation.team_velocity} {t('admin.detail.points')}</p>
        </Card>
      </div>

      {transformation.notes && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">{t('admin.detail.transformation_notes')}</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{transformation.notes}</p>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('admin.detail.delete_transformation')}
        </button>
      </div>
    </div>
  );
}
