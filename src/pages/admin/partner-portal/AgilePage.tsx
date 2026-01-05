import React, { useState, useEffect } from 'react';
import { Zap, Plus, Edit2, Trash2, AlertTriangle, Search, Target } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import type { AgileTransformation } from '../../../lib/agile-types';
import { AGILE_FRAMEWORKS, TRANSFORMATION_SCOPES } from '../../../lib/agile-types';

export default function AgilePage() {
  const [transformations, setTransformations] = useState<AgileTransformation[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransformation, setSelectedTransformation] = useState<AgileTransformation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    vision: '',
    description: '',
    framework_type: 'Scrum' as const,
    scope: 'Team' as const,
    start_date: new Date().toISOString().split('T')[0],
    target_completion_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [transformationsResult, customersResult] = await Promise.all([
        supabase
          .from('agile_transformations')
          .select('*, customers!inner(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('customers')
          .select('id, name')
          .eq('status', 'active')
          .order('name')
      ]);

      if (transformationsResult.error) throw transformationsResult.error;
      if (customersResult.error) throw customersResult.error;

      const transformationsWithCustomer = (transformationsResult.data || []).map(t => ({
        ...t,
        customer_name: t.customers?.name
      }));

      setTransformations(transformationsWithCustomer);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.loadData',
        action: 'Laddar agila transformationer'
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
      if (selectedTransformation) {
        const { error } = await supabase
          .from('agile_transformations')
          .update(formData)
          .eq('id', selectedTransformation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agile_transformations')
          .insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedTransformation(null);
      setFormData({
        customer_id: '',
        title: '',
        vision: '',
        description: '',
        framework_type: 'Scrum',
        scope: 'Team',
        start_date: new Date().toISOString().split('T')[0],
        target_completion_date: ''
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.handleSubmit',
        action: selectedTransformation ? 'Updating agile transformation' : 'Creating agile transformation'
      });
      console.error(`[${errorId}] Error saving transformation:`, err);
      setError('Kunde inte spara transformation. Försök igen.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna transformation? Denna åtgärd kan inte ångras.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase
        .from('agile_transformations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.handleDelete',
        action: 'Deleting agile transformation'
      });
      console.error(`[${errorId}] Error deleting transformation:`, err);
      setError('Kunde inte ta bort transformation. Försök igen.');
    }
  };

  const filteredTransformations = transformations.filter(transformation => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      transformation.title?.toLowerCase().includes(search) ||
      transformation.customer_name?.toLowerCase().includes(search) ||
      transformation.framework_type?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laddar agila transformationer...</div>
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
        title="Agil transformation"
        description="Hantera och följ din organisations agila transformationsresa"
        action={{
          label: 'Skapa transformation',
          onClick: () => {
            setSelectedTransformation(null);
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
            placeholder="Sök transformationer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransformations.length === 0 ? (
          searchQuery ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga resultat hittades</h3>
              <p className="text-gray-600 mb-4">
                Inga transformationer matchar "{searchQuery}". Prova en annan sökterm.
              </p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga agila transformationer än</h3>
              <p className="text-gray-600 mb-4">
                Börja spåra din agila transformationsresa. Skapa din första transformation för att komma igång.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skapa första transformationen
              </button>
            </Card>
          )
        ) : (
          filteredTransformations.map((transformation) => (
            <Card key={transformation.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{transformation.title}</h3>
                  </div>
                  {transformation.vision && (
                    <p className="text-sm text-gray-600 mb-2 italic">"{transformation.vision}"</p>
                  )}
                  {transformation.description && (
                    <p className="text-sm text-gray-600 mb-3">{transformation.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {transformation.customer_name}
                    </span>
                    <span>•</span>
                    <span>{transformation.framework_type}</span>
                    <span>•</span>
                    <span>{transformation.scope}</span>
                    <span>•</span>
                    <span>Startad: {new Date(transformation.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded font-medium ${getStatusColor(transformation.status)}`}>
                    {transformation.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTransformation(transformation);
                      setFormData({
                        customer_id: transformation.customer_id,
                        title: transformation.title,
                        vision: transformation.vision || '',
                        description: transformation.description || '',
                        framework_type: transformation.framework_type as any,
                        scope: transformation.scope as any,
                        start_date: transformation.start_date,
                        target_completion_date: transformation.target_completion_date || ''
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Redigera transformation"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transformation.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ta bort transformation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Total framsteg</span>
                  <span className="font-medium">{transformation.overall_progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${transformation.overall_progress}%` }}
                  />
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
          setSelectedTransformation(null);
        }}
        title={selectedTransformation ? 'Redigera agil transformation' : 'Skapa agil transformation'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kund</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
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
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visionsbeskrivning</label>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
              placeholder="Varför gör vi denna transformation?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beskrivning</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ramverk</label>
              <select
                value={formData.framework_type}
                onChange={(e) => setFormData({ ...formData, framework_type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {AGILE_FRAMEWORKS.map((fw) => (
                  <option key={fw.value} value={fw.value}>{fw.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Omfattning</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {TRANSFORMATION_SCOPES.map((scope) => (
                  <option key={scope.value} value={scope.value}>{scope.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Startdatum</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Målsättning slutdatum</label>
              <input
                type="date"
                value={formData.target_completion_date}
                onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedTransformation(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Avbryt
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedTransformation ? 'Uppdatera' : 'Skapa'} transformation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
