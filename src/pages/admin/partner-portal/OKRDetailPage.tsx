import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { OKRTimeline } from '../../../components/admin/okr/OKRTimeline';
import { OKRProgressChart } from '../../../components/admin/okr/OKRProgressChart';
import { OKRAIInsights } from '../../../components/admin/okr/OKRAIInsights';
import { KeyResultCard } from '../../../components/admin/okr/KeyResultCard';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Objective {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  time_period: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  progress_percentage: number;
  start_date: string;
  end_date: string;
  customer_name?: string;
  key_results?: any[];
}

export default function OKRDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [objective, setObjective] = useState<Objective | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_period: '',
    start_date: '',
    end_date: '',
    status: 'active' as const
  });

  useEffect(() => {
    if (id) {
      loadObjective();
    }
  }, [id]);

  const loadObjective = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          customers!inner(name),
          okr_key_results(*)
        `)
        .eq('id', id)
        .single();

      if (dbError) throw dbError;

      if (data) {
        const objWithCustomer = {
          ...data,
          customer_name: data.customers?.name,
          key_results: data.okr_key_results || []
        };
        setObjective(objWithCustomer);
        setFormData({
          title: data.title,
          description: data.description || '',
          time_period: data.time_period,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status
        });
      }
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'OKRDetailPage.loadObjective',
        action: 'Loading OKR objective detail'
      });
      console.error(`[${errorId}] Error loading objective:`, err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda OKR-mål. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('okr_objectives')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      setShowEditModal(false);
      await loadObjective();
    } catch (error) {
      const errorId = logAdminError(error as Error, {
        context: 'OKRDetailPage.handleUpdate',
        action: 'Updating OKR objective'
      });
      console.error(`[${errorId}] Error updating objective:`, error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this OKR objective? This will also delete all associated key results. This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('okr_objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate('/admin/partner-portal/okr');
    } catch (error) {
      const errorId = logAdminError(error as Error, {
        context: 'OKRDetailPage.handleDelete',
        action: 'Deleting OKR objective'
      });
      console.error(`[${errorId}] Error deleting objective:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar OKR-mål...</p>
        </div>
      </div>
    );
  }


  if (!objective) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Target className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">OKR-mål hittades inte</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/okr')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tillbaka till OKR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/okr')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <PageHeader
          title={objective.title}
          description={`${objective.customer_name} • ${objective.time_period}`}
          action={{
            label: 'Edit Objective',
            onClick: () => setShowEditModal(true),
            icon: Edit2
          }}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                objective.status === 'active' ? 'bg-green-100 text-green-700' :
                objective.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                objective.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {objective.status}
              </span>
            </div>
            {objective.description && (
              <p className="text-gray-600 mb-4">{objective.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Start:</span> {objective.start_date}
              </div>
              <div>
                <span className="font-medium">End:</span> {objective.end_date}
              </div>
              <div>
                <span className="font-medium">Progress:</span> {objective.progress_percentage}%
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete objective"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OKRTimeline
          objective={objective}
          keyResults={objective.key_results}
        />
        <OKRProgressChart objective={objective} />
      </div>

      <OKRAIInsights objectiveId={objective.id} objective={objective} />

      <KeyResultCard
        objectiveId={objective.id}
        keyResults={objective.key_results || []}
        onUpdate={loadObjective}
      />

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Objective"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objective Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <input
                type="text"
                value={formData.time_period}
                onChange={(e) => setFormData({ ...formData, time_period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Q1 2026"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Objective
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
