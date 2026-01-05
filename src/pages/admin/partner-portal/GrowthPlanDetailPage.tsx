import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { GrowthPlanWithObjectives, GrowthObjective } from '../../../lib/enterprise-types';

export default function GrowthPlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [plan, setPlan] = useState<GrowthPlanWithObjectives | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [objectiveData, setObjectiveData] = useState({
    objective_title: '',
    description: '',
    category: 'revenue' as const,
    priority: 3,
    target_metric: '',
    baseline_value: '',
    target_value: '',
    unit: '',
    target_date: '',
    status: 'not_started' as const
  });

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
  }, [planId]);

  const loadPlan = async () => {
    if (!planId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await enterpriseAPI.getGrowthPlanById(planId);
      setPlan(data);
    } catch (err) {
      console.error('Error loading plan:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda tillväxtplan. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId) return;

    try {
      await enterpriseAPI.createGrowthObjective({
        growth_plan_id: planId,
        ...objectiveData,
        baseline_value: objectiveData.baseline_value ? parseFloat(objectiveData.baseline_value) : undefined,
        target_value: objectiveData.target_value ? parseFloat(objectiveData.target_value) : undefined,
        progress_percentage: 0
      });

      setShowObjectiveModal(false);
      setObjectiveData({
        objective_title: '',
        description: '',
        category: 'revenue',
        priority: 3,
        target_metric: '',
        baseline_value: '',
        target_value: '',
        unit: '',
        target_date: '',
        status: 'not_started'
      });
      await loadPlan();
    } catch (err) {
      console.error('Error creating objective:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar tillväxtplan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadPlan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Tillväxtplan hittades inte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/partner-portal/growth-plans')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={plan.plan_name}
          subtitle={(plan as any).customer?.company_name || ''}
          icon={<TrendingUp className="w-8 h-8" />}
        >
          <button
            onClick={() => setShowObjectiveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Lägg till mål
          </button>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
          <p className="text-2xl font-bold capitalize">{plan.status.replace('_', ' ')}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Framsteg</h3>
          <p className="text-2xl font-bold">{plan.overall_progress}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Mål</h3>
          <p className="text-2xl font-bold">{plan.objectives?.length || 0}</p>
        </Card>
      </div>

      {plan.vision_statement && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Vision</h3>
          <p className="text-gray-700">{plan.vision_statement}</p>
        </Card>
      )}

      {plan.mission_statement && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Mission</h3>
          <p className="text-gray-700">{plan.mission_statement}</p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mål</h2>
        {plan.objectives && plan.objectives.length > 0 ? (
          <div className="space-y-4">
            {plan.objectives.map((objective) => (
              <div key={objective.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{objective.objective_title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-gray-600">
                        Kategori: <span className="font-medium capitalize">{objective.category.replace('_', ' ')}</span>
                      </span>
                      <span className="text-gray-600">
                        Framsteg: <span className="font-medium">{objective.progress_percentage}%</span>
                      </span>
                      <span className="text-gray-600">
                        Status: <span className="font-medium capitalize">{objective.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Inga mål ännu. Klicka på "Lägg till mål" för att skapa ditt första.
          </p>
        )}
      </Card>

      {showObjectiveModal && (
        <Modal
          isOpen={showObjectiveModal}
          onClose={() => setShowObjectiveModal(false)}
          title="Skapa nytt mål"
        >
          <form onSubmit={handleCreateObjective} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Måltitel *</label>
              <input
                type="text"
                required
                value={objectiveData.objective_title}
                onChange={(e) => setObjectiveData({ ...objectiveData, objective_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning</label>
              <textarea
                value={objectiveData.description}
                onChange={(e) => setObjectiveData({ ...objectiveData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={objectiveData.category}
                  onChange={(e) => setObjectiveData({ ...objectiveData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Intäkt</option>
                  <option value="market_share">Marknadsandel</option>
                  <option value="customer_acquisition">Kundanskaffning</option>
                  <option value="operational_efficiency">Operationell effektivitet</option>
                  <option value="innovation">Innovation</option>
                  <option value="people">Personal</option>
                  <option value="other">Annat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioritet (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={objectiveData.priority}
                  onChange={(e) => setObjectiveData({ ...objectiveData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowObjectiveModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skapa mål
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
