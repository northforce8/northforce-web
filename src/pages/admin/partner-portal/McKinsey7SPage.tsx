import { useEffect, useState } from 'react';
import { Plus, TrendingUp, AlertTriangle, Target, Network, Settings, Heart, Award, Users, UserCheck, Lightbulb } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type {
  McKinsey7SAssessment,
  McKinsey7SElement,
} from '../../../lib/mckinsey-types';
import { generateMcKinsey7SInsights } from '../../../lib/mckinsey-ai-service';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';

const ELEMENT_ICONS = {
  strategy: Target,
  structure: Network,
  systems: Settings,
  shared_values: Heart,
  skills: Award,
  style: Users,
  staff: UserCheck,
};

export default function McKinsey7SPage() {
  const [assessments, setAssessments] = useState<McKinsey7SAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<McKinsey7SAssessment | null>(null);
  const [elements, setElements] = useState<McKinsey7SElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    loadAssessments();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedAssessment) {
      loadElements();
    }
  }, [selectedAssessment]);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name')
        .eq('status', 'active')
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('mckinsey_7s_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setAssessments(data || []);
      if (data && data.length > 0 && !selectedAssessment) {
        setSelectedAssessment(data[0]);
      }
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda McKinsey 7S-analyser. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const loadElements = async () => {
    if (!selectedAssessment) return;

    try {
      const { data, error } = await supabase
        .from('mckinsey_7s_elements')
        .select('*')
        .eq('assessment_id', selectedAssessment.id)
        .order('element_type');

      if (error) throw error;
      setElements(data || []);
    } catch (error) {
      console.error('Error loading elements:', error);
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase
        .from('mckinsey_7s_assessments')
        .insert([
          {
            customer_id: formData.get('customer_id') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setAssessments([data, ...assessments]);
      setSelectedAssessment(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };

  const handleGenerateInsights = async () => {
    if (!selectedAssessment || elements.length === 0) return;

    setGeneratingInsights(true);
    try {
      const insights = await generateMcKinsey7SInsights(selectedAssessment, elements);
      setAiInsights(insights);

      await supabase
        .from('mckinsey_7s_assessments')
        .update({
          ai_overall_analysis: insights.overall_assessment,
          ai_recommendations: insights.strategic_priorities.join('\n'),
          ai_risk_areas: insights.risk_areas.join('\n'),
          ai_last_analyzed: new Date().toISOString(),
        })
        .eq('id', selectedAssessment.id);

      await loadAssessments();
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      aligned: 'bg-green-100 text-green-800',
      partially_aligned: 'bg-yellow-100 text-yellow-800',
      needs_attention: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar McKinsey 7S-analyser...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadAssessments}
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
        title="McKinsey 7S Framework"
        description="Analysera organisatorisk anpassning över sju beroende element"
        icon={Network}
        help={PAGE_HELP_CONTENT.frameworks}
        action={{
          label: 'Ny analys',
          onClick: () => setShowCreateModal(true),
          icon: Plus,
        }}
      />

      {assessments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga analyser än</h3>
          <p className="text-gray-500 mb-4">
            Skapa din första McKinsey 7S-analys för att analysera organisatorisk anpassning
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Skapa analys
          </button>
        </div>
      ) : (
        <>
          {assessments.length > 1 && (
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Välj analys
              </label>
              <select
                value={selectedAssessment?.id || ''}
                onChange={(e) => {
                  const assessment = assessments.find((a) => a.id === e.target.value);
                  setSelectedAssessment(assessment || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {assessments.map((assessment) => (
                  <option key={assessment.id} value={assessment.id}>
                    {assessment.title} - {new Date(assessment.assessment_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedAssessment && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total anpassning</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.overall_alignment_score || 0)}`}>
                        {selectedAssessment.overall_alignment_score || 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Genomsnittlig anpassning över alla sju element
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hårda element</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.hard_elements_score || 0)}`}>
                        {selectedAssessment.hard_elements_score || 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Strategi, Struktur, System
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mjuka element</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.soft_elements_score || 0)}`}>
                        {selectedAssessment.soft_elements_score || 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Delade värderingar, Kompetenser, Stil, Personal
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">De 7 S-elementen</h2>
                  <button
                    onClick={handleGenerateInsights}
                    disabled={generatingInsights || elements.length === 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {generatingInsights ? 'Genererar...' : 'Generera AI-insikter'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {elements.map((element) => {
                    const Icon = ELEMENT_ICONS[element.element_type as keyof typeof ELEMENT_ICONS];
                    return (
                      <div
                        key={element.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <h3 className="font-medium text-gray-900 capitalize">
                              {element.element_type.replace('_', ' ')}
                            </h3>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(element.status)}`}>
                            {element.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Anpassning</span>
                            <span className={`font-semibold ${getScoreColor(element.alignment_score || 0)}`}>
                              {element.alignment_score || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                (element.alignment_score || 0) >= 75
                                  ? 'bg-green-500'
                                  : (element.alignment_score || 0) >= 50
                                  ? 'bg-yellow-500'
                                  : (element.alignment_score || 0) >= 25
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${element.alignment_score || 0}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2">
                          {element.current_state || 'Ingen beskrivning än'}
                        </p>

                        {element.improvement_priority !== 'low' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <span className={`inline-flex items-center gap-1 text-xs ${
                              element.improvement_priority === 'critical' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              <AlertTriangle className="w-3 h-3" />
                              {element.improvement_priority === 'critical' ? 'Kritisk' : element.improvement_priority === 'high' ? 'Hög' : element.improvement_priority === 'medium' ? 'Medel' : 'Låg'} prioritet
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skapa McKinsey 7S-analys</h2>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kund
                </label>
                <select
                  name="customer_id"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Välj kund</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Analystitel
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Q1 2024 Organisationsanalys"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beskrivning
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Omfattande bedömning av organisatorisk anpassning..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Skapa analys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
