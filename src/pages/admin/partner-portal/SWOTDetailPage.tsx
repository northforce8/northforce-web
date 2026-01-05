import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Save,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Edit2,
  Trash2,
  BarChart3,
  Download,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { swotAIService } from '../../../lib/swot-ai-service';
import type { SwotAnalysisWithItems, SwotItem, SwotAIInsight, SwotCrossAnalysis } from '../../../lib/enterprise-types';
import { useToast } from '../../../contexts/ToastContext';

export default function SWOTDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analysis, setAnalysis] = useState<SwotAnalysisWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'strength' | 'weakness' | 'opportunity' | 'threat' | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SwotItem | null>(null);
  const [aiInsights, setAiInsights] = useState<SwotAIInsight[]>([]);
  const [crossAnalysis, setCrossAnalysis] = useState<SwotCrossAnalysis | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (id) {
      loadAnalysis();
    }
  }, [id]);

  const loadAnalysis = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await enterpriseAPI.getSwotAnalysisById(id);
      setAnalysis(data);
    } catch (err) {
      console.error('Error loading SWOT analysis:', err);
      setError(err instanceof Error ? err.message : t('admin.error.load_swot'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (data: {
    category: 'strength' | 'weakness' | 'opportunity' | 'threat';
    title: string;
    description: string;
    impact_level: 'low' | 'medium' | 'high' | 'critical';
    actionable: boolean;
    action_plan?: string;
  }) => {
    if (!id) return;

    try {
      setSaving(true);
      await enterpriseAPI.createSwotItem({
        swot_analysis_id: id,
        ...data
      });
      showToast('SWOT-element tillagt!', 'success');
      setShowItemModal(false);
      setEditingItem(null);
      await loadAnalysis();
    } catch (error) {
      console.error('Error adding SWOT item:', error);
      showToast('Kunde inte lägga till element', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (
    itemId: string,
    updates: Partial<SwotItem>
  ) => {
    try {
      setSaving(true);
      await enterpriseAPI.updateSwotItem(itemId, updates);
      showToast('Element uppdaterat!', 'success');
      setShowItemModal(false);
      setEditingItem(null);
      await loadAnalysis();
    } catch (error) {
      console.error('Error updating SWOT item:', error);
      showToast('Kunde inte uppdatera element', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Är du säker på att du vill radera detta element?')) {
      return;
    }

    try {
      await enterpriseAPI.deleteSwotItem(itemId);
      showToast('Element raderat', 'success');
      await loadAnalysis();
    } catch (error) {
      console.error('Error deleting SWOT item:', error);
      showToast('Kunde inte radera element', 'error');
    }
  };

  const generateAIInsights = async () => {
    if (!analysis?.customer_id) {
      showToast('Ingen kund kopplad till analysen', 'warning');
      return;
    }

    setGeneratingAI(true);
    try {
      const insights = await swotAIService.generateSwotInsights(
        analysis.customer_id,
        analysis.context
      );
      setAiInsights(insights);
      setShowAIPanel(true);
      showToast('AI-insikter genererade!', 'success');
    } catch (error) {
      console.error('Error generating AI insights:', error);
      showToast('Kunde inte generera AI-insikter', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const generateCrossAnalysis = async () => {
    if (!analysis) return;

    setGeneratingAI(true);
    try {
      const crossData = await swotAIService.generateCrossAnalysis(analysis);
      setCrossAnalysis(crossData);
      showToast('Korsanalys genererad!', 'success');
    } catch (error) {
      console.error('Error generating cross analysis:', error);
      showToast('Kunde inte generera korsanalys', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const addAIInsightAsItem = async (insight: SwotAIInsight) => {
    if (!id) return;

    try {
      await enterpriseAPI.createSwotItem({
        swot_analysis_id: id,
        category: insight.category,
        title: insight.title,
        description: insight.description,
        impact_level: insight.impact_score > 75 ? 'high' : insight.impact_score > 50 ? 'medium' : 'low',
        actionable: true,
        action_plan: insight.recommended_actions.join('\n')
      });
      showToast('AI-insikt tillagd!', 'success');
      await loadAnalysis();
    } catch (error) {
      console.error('Error adding AI insight:', error);
      showToast('Kunde inte lägga till AI-insikt', 'error');
    }
  };

  const updateAnalysisStatus = async (status: string) => {
    if (!id) return;

    try {
      await enterpriseAPI.updateSwotAnalysis(id, { status });
      showToast('Status uppdaterad!', 'success');
      await loadAnalysis();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Kunde inte uppdatera status', 'error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Laddar SWOT-analys...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={loadAnalysis}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-2"
                >
                  Försök igen
                </button>
                <button
                  onClick={() => navigate('/admin/partner-portal/swot')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tillbaka till översikt
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analysis) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">SWOT-analys hittades inte.</p>
            <button
              onClick={() => navigate('/admin/partner-portal/swot')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Tillbaka till översikt
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      strength: TrendingUp,
      weakness: TrendingDown,
      opportunity: Target,
      threat: AlertTriangle
    };
    return icons[category] || Target;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      strength: 'bg-green-50 border-green-200 text-green-700',
      weakness: 'bg-red-50 border-red-200 text-red-700',
      opportunity: 'bg-blue-50 border-blue-200 text-blue-700',
      threat: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      strength: 'Styrkor',
      weakness: 'Svagheter',
      opportunity: 'Möjligheter',
      threat: 'Hot'
    };
    return names[category] || category;
  };

  const getImpactColor = (level?: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[level || 'medium'];
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/partner-portal/swot"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till SWOT-analyser
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{analysis.title}</h1>
            {analysis.description && (
              <p className="text-gray-600 mb-2">{analysis.description}</p>
            )}
            {analysis.customer && (
              <p className="text-sm text-gray-500">
                Kund: <span className="font-medium">{analysis.customer.company_name}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={generateAIInsights}
              disabled={generatingAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              {generatingAI ? 'Genererar...' : 'AI-Insikter'}
            </button>

            <button
              onClick={generateCrossAnalysis}
              disabled={generatingAI}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Korsanalys
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <select
            value={analysis.status}
            onChange={(e) => updateAnalysisStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Utkast</option>
            <option value="in_progress">Pågående</option>
            <option value="completed">Slutförd</option>
            <option value="archived">Arkiverad</option>
          </select>

          <span className="text-sm text-gray-500">
            Skapad: {new Date(analysis.created_at).toLocaleDateString('sv-SE')}
          </span>
        </div>
      </div>

      {aiInsights.length > 0 && showAIPanel && (
        <Card title="🤖 AI-Genererade Insikter" className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = getCategoryIcon(insight.category);
              return (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getCategoryColor(insight.category)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        </div>
                        <button
                          onClick={() => addAIInsightAsItem(insight)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Lägg till
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          Påverkan: {insight.impact_score}/100
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          Säkerhet: {insight.confidence}%
                        </span>
                        <span className="text-gray-500 capitalize">
                          {insight.source.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-sm">
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Resonemang:</span> {insight.reasoning}
                        </p>
                        <div>
                          <span className="font-medium text-gray-700">Rekommenderade åtgärder:</span>
                          <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                            {insight.recommended_actions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {crossAnalysis && (
        <Card title="📊 Strategisk Korsanalys (TOWS Matrix)" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">SO-Strategier (Styrkor + Möjligheter)</h4>
              <ul className="space-y-2">
                {crossAnalysis.so_strategies.map((strategy, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">WO-Strategier (Svagheter + Möjligheter)</h4>
              <ul className="space-y-2">
                {crossAnalysis.wo_strategies.map((strategy, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3">ST-Strategier (Styrkor + Hot)</h4>
              <ul className="space-y-2">
                {crossAnalysis.st_strategies.map((strategy, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <h4 className="font-semibold text-red-900 mb-3">WT-Strategier (Svagheter + Hot)</h4>
              <ul className="space-y-2">
                {crossAnalysis.wt_strategies.map((strategy, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['strength', 'weakness', 'opportunity', 'threat'] as const).map((category) => {
          const Icon = getCategoryIcon(category);
          const items = analysis[`${category === 'strength' ? 'strengths' : category === 'weakness' ? 'weaknesses' : category === 'opportunity' ? 'opportunities' : 'threats'}`] || [];

          return (
            <Card
              key={category}
              className={`${getCategoryColor(category)} border-2`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{getCategoryName(category)}</h3>
                    <p className="text-sm opacity-75">{items.length} element</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory(category);
                    setEditingItem(null);
                    setShowItemModal(true);
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-sm opacity-75">
                    Inga element ännu. Tryck på + för att lägga till.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">{item.title}</h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setActiveCategory(category);
                              setShowItemModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {item.impact_level && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getImpactColor(item.impact_level)}`}>
                            {item.impact_level === 'low' ? 'LÅG' : item.impact_level === 'medium' ? 'MEDEL' : item.impact_level === 'high' ? 'HÖG' : 'KRITISK'}
                          </span>
                        )}
                        {item.actionable && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                            KRÄVER ÅTGÄRD
                          </span>
                        )}
                      </div>

                      {item.action_plan && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-1">Handlingsplan:</p>
                          <p className="text-xs text-gray-600">{item.action_plan}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showItemModal && activeCategory && (
        <SwotItemModal
          category={activeCategory}
          item={editingItem}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
            setActiveCategory(null);
          }}
          onSave={(data) => {
            if (editingItem) {
              handleUpdateItem(editingItem.id, data);
            } else {
              handleAddItem({ ...data, category: activeCategory });
            }
          }}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}

function SwotItemModal({
  category,
  item,
  onClose,
  onSave,
  saving
}: {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  item: SwotItem | null;
  onClose: () => void;
  onSave: (data: any) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    impact_level: (item?.impact_level as any) || 'medium',
    actionable: item?.actionable || false,
    action_plan: item?.action_plan || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getCategoryName = (cat: string) => {
    const names: Record<string, string> = {
      strength: 'Styrka',
      weakness: 'Svaghet',
      opportunity: 'Möjlighet',
      threat: 'Hot'
    };
    return names[cat];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Redigera' : 'Lägg till'} {getCategoryName(category)}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kort beskrivande titel"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beskrivning
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Detaljerad beskrivning..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Påverkansnivå
            </label>
            <select
              value={formData.impact_level}
              onChange={(e) => setFormData({ ...formData, impact_level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Låg</option>
              <option value="medium">Medel</option>
              <option value="high">Hög</option>
              <option value="critical">Kritisk</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="actionable"
              checked={formData.actionable}
              onChange={(e) => setFormData({ ...formData, actionable: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="actionable" className="text-sm font-medium text-gray-700">
              Kräver åtgärder
            </label>
          </div>

          {formData.actionable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Handlingsplan
              </label>
              <textarea
                value={formData.action_plan}
                onChange={(e) => setFormData({ ...formData, action_plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Beskriv konkreta åtgärder..."
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Sparar...' : item ? 'Uppdatera' : 'Lägg till'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
