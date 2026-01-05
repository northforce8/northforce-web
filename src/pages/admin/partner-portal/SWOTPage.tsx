import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface SWOTAnalysis {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  context: string;
  status: string;
  customer_name?: string;
  items?: SWOTItem[];
}

interface SWOTItem {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact_level: string;
}

export default function SWOTPage() {
  const [analyses, setAnalyses] = useState<SWOTAnalysis[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SWOTAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    context: '',
    status: 'in_progress' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [analysesResult, customersResult] = await Promise.all([
        supabase
          .from('swot_analyses')
          .select('*, customers!inner(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('customers')
          .select('id, name')
          .eq('status', 'active')
          .order('name')
      ]);

      if (analysesResult.error) throw analysesResult.error;
      if (customersResult.error) throw customersResult.error;

      const analysesWithItems = await Promise.all(
        (analysesResult.data || []).map(async (analysis) => {
          const { data: items } = await supabase
            .from('swot_items')
            .select('*')
            .eq('swot_analysis_id', analysis.id);

          return {
            ...analysis,
            customer_name: analysis.customers?.name,
            items: items || []
          };
        })
      );

      setAnalyses(analysesWithItems);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'SWOTPage.loadData',
        action: 'Laddar SWOT-analyser'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Kunde inte ladda data. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedAnalysis) {
        const { error } = await supabase
          .from('swot_analyses')
          .update(formData)
          .eq('id', selectedAnalysis.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('swot_analyses')
          .insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedAnalysis(null);
      setFormData({ customer_id: '', title: '', description: '', context: '', status: 'in_progress' });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'SWOTPage.handleSubmit',
        action: selectedAnalysis ? 'Updating SWOT analysis' : 'Creating SWOT analysis'
      });
      console.error(`[${errorId}] Error saving analysis:`, err);
      setError('Kunde inte spara analys. Försök igen.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera denna SWOT-analys? Åtgärden kan inte ångras.')) {
      return;
    }

    try {
      setError(null);
      const { error } = await supabase
        .from('swot_analyses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'SWOTPage.handleDelete',
        action: 'Deleting SWOT analysis'
      });
      console.error(`[${errorId}] Error deleting analysis:`, err);
      setError('Kunde inte radera analys. Försök igen.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-green-100 text-green-700';
      case 'weakness': return 'bg-red-100 text-red-700';
      case 'opportunity': return 'bg-blue-100 text-blue-700';
      case 'threat': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryCount = (items: SWOTItem[] = [], category: string) => {
    return items.filter(i => i.category === category).length;
  };

  const filteredAnalyses = analyses.filter(analysis => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      analysis.title?.toLowerCase().includes(search) ||
      analysis.customer_name?.toLowerCase().includes(search) ||
      analysis.description?.toLowerCase().includes(search) ||
      analysis.context?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laddar SWOT-analyser...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Fel</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="SWOT-analys"
        description="Bedöm interna styrkor och svagheter, externa möjligheter och hot för att informera strategiska beslut."
        action={{
          label: 'Skapa SWOT-analys',
          onClick: () => {
            setSelectedAnalysis(null);
            setShowModal(true);
          },
          icon: Plus
        }}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {['strength', 'weakness', 'opportunity', 'threat'].map((category) => {
          const categoryNames: Record<string, string> = {
            strength: 'Styrkor',
            weakness: 'Svagheter',
            opportunity: 'Möjligheter',
            threat: 'Hot'
          };
          return (
            <Card key={category} className="p-6">
              <p className="text-sm text-gray-600 mb-2">{categoryNames[category]}</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyses.reduce((sum, a) => sum + getCategoryCount(a.items, category), 0)}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredAnalyses.length === 0 ? (
          searchQuery ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga resultat hittades</h3>
              <p className="text-gray-600 mb-4">
                Inga element matchar "{searchQuery}". Prova en annan sökterm.
              </p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga SWOT-analyser ännu</h3>
              <p className="text-gray-600 mb-4">
                Skapa din första SWOT-analys för att bedöma styrkor, svagheter, möjligheter och hot.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skapa första analysen
              </button>
            </Card>
          )
        ) : (
          filteredAnalyses.map((analysis) => (
            <Card key={analysis.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{analysis.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{analysis.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Kund: {analysis.customer_name}</span>
                    <span>•</span>
                    <span>Kontext: {analysis.context}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAnalysis(analysis);
                      setFormData({
                        customer_id: analysis.customer_id,
                        title: analysis.title,
                        description: analysis.description || '',
                        context: analysis.context || '',
                        status: analysis.status as any
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Redigera analys"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(analysis.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Radera analys"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {['strength', 'weakness', 'opportunity', 'threat'].map((category) => {
                  const categoryNames: Record<string, string> = {
                    strength: 'Styrkor',
                    weakness: 'Svagheter',
                    opportunity: 'Möjligheter',
                    threat: 'Hot'
                  };
                  return (
                    <div key={category} className={`p-3 rounded-lg ${getCategoryColor(category)}`}>
                      <p className="text-xs font-medium uppercase mb-1">{categoryNames[category]}</p>
                      <p className="text-2xl font-bold">{getCategoryCount(analysis.items, category)}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAnalysis(null);
        }}
        title={selectedAnalysis ? 'Redigera SWOT-analys' : 'Skapa SWOT-analys'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kund</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Välj kund</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beskrivning</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontext</label>
            <input
              type="text"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="t.ex. Marknadsexpansion, Produktlansering"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedAnalysis(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedAnalysis ? 'Uppdatera' : 'Skapa'} analys
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
