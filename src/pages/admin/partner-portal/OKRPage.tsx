import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plus, TrendingUp, AlertTriangle, CheckCircle2, Edit2, Trash2, Search, ExternalLink, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';

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
  key_results?: KeyResult[];
}

interface KeyResult {
  id: string;
  objective_id: string;
  title: string;
  metric_type: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

export default function OKRPage() {
  const navigate = useNavigate();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    time_period: 'Q1 2026',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [objectivesResult, customersResult] = await Promise.all([
        supabase
          .from('okr_objectives')
          .select(`
            *,
            customers!inner(name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('customers')
          .select('id, name, status')
          .eq('status', 'active')
          .order('name')
      ]);

      if (objectivesResult.error) throw objectivesResult.error;
      if (customersResult.error) throw customersResult.error;

      const objectivesWithKeyResults = await Promise.all(
        (objectivesResult.data || []).map(async (obj) => {
          const { data: keyResults } = await supabase
            .from('okr_key_results')
            .select('*')
            .eq('objective_id', obj.id);

          return {
            ...obj,
            customer_name: obj.customers?.name,
            key_results: keyResults || []
          };
        })
      );

      setObjectives(objectivesWithKeyResults);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'OKRPage.loadData',
        action: 'Laddar OKR-mål'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda OKR-mål. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedObjective) {
        const { error } = await supabase
          .from('okr_objectives')
          .update(formData)
          .eq('id', selectedObjective.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('okr_objectives')
          .insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedObjective(null);
      setFormData({
        customer_id: '',
        title: '',
        description: '',
        time_period: 'Q1 2026',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active'
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'OKRPage.handleSubmit',
        action: selectedObjective ? 'Updating OKR objective' : 'Creating OKR objective'
      });
      console.error(`[${errorId}] Error saving objective:`, err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera detta OKR-mål? Detta kommer även att radera alla associerade nyckelresultat. Denna åtgärd kan inte ångras.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('okr_objectives')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'OKRPage.handleDelete',
        action: 'Deleting OKR objective'
      });
      console.error(`[${errorId}] Error deleting objective:`, err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-600 bg-green-50';
      case 'at_risk':
        return 'text-yellow-600 bg-yellow-50';
      case 'behind':
        return 'text-red-600 bg-red-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'at_risk':
        return <AlertTriangle className="w-4 h-4" />;
      case 'behind':
        return <AlertTriangle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const calculateOverallProgress = (keyResults: KeyResult[]) => {
    if (!keyResults || keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      const progress = kr.target_value > 0
        ? (kr.current_value / kr.target_value) * 100
        : 0;
      return sum + Math.min(progress, 100);
    }, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  const filteredObjectives = objectives.filter(objective => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      objective.title?.toLowerCase().includes(search) ||
      objective.customer_name?.toLowerCase().includes(search) ||
      objective.description?.toLowerCase().includes(search) ||
      objective.time_period?.toLowerCase().includes(search)
    );
  });

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
                onClick={loadData}
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="OKR - Mål & Nyckelresultat"
        description="Sätt mätbara mål och följ framsteg med nyckelresultat. Samordna insatser, säkerställ transparens och driv ansvarighet."
        icon={Target}
        action={{
          label: 'Skapa mål',
          onClick: () => {
            setSelectedObjective(null);
            setShowModal(true);
          },
          icon: Plus
        }}
        help={PAGE_HELP_CONTENT.okr}
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Sök..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totalt antal mål</p>
              <p className="text-2xl font-bold text-gray-900">{objectives.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">På rätt spår</p>
              <p className="text-2xl font-bold text-gray-900">
                {objectives.filter(o => {
                  const progress = calculateOverallProgress(o.key_results || []);
                  return progress >= 70;
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {objectives.filter(o => {
                  const progress = calculateOverallProgress(o.key_results || []);
                  return progress >= 40 && progress < 70;
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-cyan/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Genomsnittlig framsteg</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  objectives.reduce((sum, o) => sum + calculateOverallProgress(o.key_results || []), 0) /
                  (objectives.length || 1)
                )}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredObjectives.length === 0 ? (
          searchQuery ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga resultat hittades</h3>
              <p className="text-gray-600 mb-4">
                Inga objekt matchar "{searchQuery}". Prova ett annat sökord.
              </p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga mål ännu</h3>
              <p className="text-gray-600 mb-4">Skapa ditt första OKR för att börja spåra mål och nyckelresultat.</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skapa första målet
              </button>
            </Card>
          )
        ) : (
          filteredObjectives.map((objective) => {
            const overallProgress = calculateOverallProgress(objective.key_results || []);
            return (
              <Card key={objective.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        objective.status === 'active' ? 'bg-green-100 text-green-700' :
                        objective.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {objective.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{objective.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Kund: {objective.customer_name}</span>
                      <span>•</span>
                      <span>Period: {objective.time_period}</span>
                      <span>•</span>
                      <span>{objective.start_date} - {objective.end_date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/partner-portal/okr/${objective.id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visa detaljer och AI-insikter"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Visa detaljer</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedObjective(objective);
                        setFormData({
                          customer_id: objective.customer_id,
                          title: objective.title,
                          description: objective.description || '',
                          time_period: objective.time_period,
                          start_date: objective.start_date,
                          end_date: objective.end_date,
                          status: objective.status
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Redigera mål"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(objective.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Radera mål"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Totalt framsteg</span>
                    <span className="font-semibold text-gray-900">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        overallProgress >= 70 ? 'bg-green-600' :
                        overallProgress >= 40 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                {objective.key_results && objective.key_results.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Nyckelresultat</p>
                    {objective.key_results.map((kr) => {
                      const krProgress = kr.target_value > 0
                        ? Math.min((kr.current_value / kr.target_value) * 100, 100)
                        : 0;
                      return (
                        <div key={kr.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(kr.status)}`}>
                                {getStatusIcon(kr.status)}
                                {kr.status.replace('_', ' ')}
                              </span>
                              <span className="text-sm font-medium text-gray-900">{kr.title}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {kr.current_value} / {kr.target_value} {kr.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                krProgress >= 70 ? 'bg-green-500' :
                                krProgress >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${krProgress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedObjective(null);
        }}
        title={selectedObjective ? 'Redigera mål' : 'Skapa mål'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kund
            </label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Välj kund</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Måltitel
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
              Beskrivning
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
                Tidsperiod
              </label>
              <input
                type="text"
                value={formData.time_period}
                onChange={(e) => setFormData({ ...formData, time_period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="t.ex. Q1 2026"
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
                <option value="draft">Utkast</option>
                <option value="active">Aktiv</option>
                <option value="completed">Slutförd</option>
                <option value="cancelled">Avbruten</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startdatum
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
                Slutdatum
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
              onClick={() => {
                setShowModal(false);
                setSelectedObjective(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedObjective ? 'Uppdatera' : 'Skapa'} mål
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
