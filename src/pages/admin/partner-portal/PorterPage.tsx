import React, { useState, useEffect } from 'react';
import { Compass, Plus, AlertTriangle, Edit2, Trash2, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface Analysis {
  id: string;
  customer_id: string;
  title: string;
  industry: string;
  market_description: string;
  customers?: { name: string };
  competitive_rivalry_score?: number;
  threat_new_entrants_score?: number;
  threat_substitutes_score?: number;
  supplier_power_score?: number;
  customer_power_score?: number;
}

export default function PorterPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    industry: '',
    market_description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [analysesResult, customersResult] = await Promise.all([
        supabase.from('porter_analyses').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (analysesResult.error) throw analysesResult.error;
      if (customersResult.error) throw customersResult.error;

      setAnalyses(analysesResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'PorterPage.loadData',
        action: 'Loading Porter analyses'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Kunde inte ladda data. Vänligen försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const getForceCount = (forceType: string): number => {
    // This would ideally count items from a related table
    // For now, show the count of analyses
    return analyses.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedAnalysis) {
        const { error } = await supabase
          .from('porter_analyses')
          .update(formData)
          .eq('id', selectedAnalysis.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('porter_analyses').insert([formData]);
        if (error) throw error;
      }

      setShowModal(false);
      setSelectedAnalysis(null);
      setFormData({ customer_id: '', title: '', industry: '', market_description: '' });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'PorterPage.handleSubmit',
        action: selectedAnalysis ? 'Updating Porter analysis' : 'Creating Porter analysis'
      });
      console.error(`[${errorId}] Error saving analysis:`, err);
      setError('Kunde inte spara analys. Vänligen försök igen.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera denna analys? Detta kan inte ångras.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('porter_analyses').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'PorterPage.handleDelete',
        action: 'Deleting Porter analysis'
      });
      console.error(`[${errorId}] Error deleting analysis:`, err);
      setError('Kunde inte radera analys. Vänligen försök igen.');
    }
  };

  const forces = [
    { type: 'competitive_rivalry', label: 'Konkurrensrivalitet', color: 'text-red-600 bg-red-50' },
    { type: 'threat_of_new_entrants', label: 'Hot från nyetablerare', color: 'text-orange-600 bg-orange-50' },
    { type: 'threat_of_substitutes', label: 'Hot från substitut', color: 'text-yellow-600 bg-yellow-50' },
    { type: 'bargaining_power_suppliers', label: 'Leverantörsmakt', color: 'text-blue-600 bg-blue-50' },
    { type: 'bargaining_power_customers', label: 'Kundmakt', color: 'text-green-600 bg-green-50' }
  ];

  const filteredAnalyses = analyses.filter(analysis => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      analysis.title?.toLowerCase().includes(search) ||
      analysis.customers?.name?.toLowerCase().includes(search) ||
      analysis.industry?.toLowerCase().includes(search) ||
      analysis.market_description?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laddar Porters femkraftsanalyser...</div>
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
        title="Porter's Five Forces"
        description="Analysera konkurrensmässiga krafter i din bransch för att utveckla strategier som skyddar och förbättrar din marknadsposition."
        action={{
          label: 'Skapa analys',
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {forces.map((force) => (
          <Card key={force.type} className={`p-4 ${force.color}`}>
            <p className="text-xs font-medium mb-2">{force.label}</p>
            <p className="text-2xl font-bold">{getForceCount(force.type)}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAnalyses.length === 0 ? (
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
              <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga Porters femkraftsanalyser än</h3>
              <p className="text-gray-600 mb-4">
                Skapa din första analys för att förstå konkurrensmässiga krafter och utveckla vinnande strategier.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skapa första analys
              </button>
            </Card>
          )
        ) : (
          filteredAnalyses.map((analysis) => (
            <Card key={analysis.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{analysis.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Kund: {analysis.customers?.name}</span>
                    <span>•</span>
                    <span>Bransch: {analysis.industry}</span>
                  </div>
                  {analysis.market_description && (
                    <p className="text-sm text-gray-500">{analysis.market_description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAnalysis(analysis);
                      setFormData({
                        customer_id: analysis.customer_id,
                        title: analysis.title,
                        industry: analysis.industry,
                        market_description: analysis.market_description
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
        title={selectedAnalysis ? "Redigera Porters femkraftsanalys" : "Skapa Porters femkraftsanalys"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kund</label>
            <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Välj kund</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bransch</label>
            <input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marknadsbeskrivning</label>
            <textarea value={formData.market_description} onChange={(e) => setFormData({ ...formData, market_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedAnalysis ? 'Uppdatera' : 'Skapa'} Analys
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
