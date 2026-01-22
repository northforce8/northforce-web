import React, { useState, useEffect } from 'react';
import { Layout, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function BMCPage() {
  const { t } = useLanguage();
  const [canvases, setCanvases] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCanvas, setSelectedCanvas] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ customer_id: '', title: '', version: 1 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [canvasesResult, customersResult] = await Promise.all([
        supabase.from('business_model_canvases').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (canvasesResult.error) throw canvasesResult.error;
      if (customersResult.error) throw customersResult.error;

      setCanvases(canvasesResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BMCPage.loadData',
        action: 'Loading business model canvases'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedCanvas) {
        const { error } = await supabase
          .from('business_model_canvases')
          .update(formData)
          .eq('id', selectedCanvas.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('business_model_canvases').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedCanvas(null);
      setFormData({ customer_id: '', title: '', version: 1 });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BMCPage.handleSubmit',
        action: selectedCanvas ? 'Updating business model canvas' : 'Creating business model canvas'
      });
      console.error(`[${errorId}] Error saving canvas:`, err);
      setError('Failed to save canvas. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this canvas? This action cannot be undone.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('business_model_canvases').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BMCPage.handleDelete',
        action: 'Deleting business model canvas'
      });
      console.error(`[${errorId}] Error deleting canvas:`, err);
      setError('Failed to delete canvas. Please try again.');
    }
  };

  const blocks = [
    'Customer Segments', 'Value Propositions', 'Channels', 'Customer Relationships',
    'Revenue Streams', 'Key Resources', 'Key Activities', 'Key Partnerships', 'Cost Structure'
  ];

  const filteredCanvases = canvases.filter(canvas => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      canvas.title?.toLowerCase().includes(search) ||
      canvas.customers?.name?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Business Model Canvases...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!import.meta.env.PROD && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t('admin.nav.business_model_canvas')}
        description="Design and iterate your business model across nine building blocks to ensure a robust and adaptable strategy."
        action={{
          label: 'Create Canvas',
          onClick: () => {
            setSelectedCanvas(null);
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
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {blocks.slice(0, 3).map((block) => (
          <Card key={block} className="p-4 bg-blue-50">
            <p className="text-sm font-medium text-blue-900">{block}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCanvases.length === 0 ? (
          searchQuery ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">
                No items match "{searchQuery}". Try a different search term.
              </p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Business Model Canvases Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first canvas to design and iterate your business model across nine building blocks.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Canvas
              </button>
            </Card>
          )
        ) : (
          filteredCanvases.map((canvas) => (
            <Card key={canvas.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{canvas.title}</h3>
                  <p className="text-sm text-gray-600">Customer: {canvas.customers?.name} | Version {canvas.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded ${canvas.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {canvas.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCanvas(canvas);
                      setFormData({
                        customer_id: canvas.customer_id,
                        title: canvas.title,
                        version: canvas.version
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit canvas"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(canvas.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete canvas"
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
          setSelectedCanvas(null);
        }}
        title={selectedCanvas ? 'Edit Business Model Canvas' : 'Create Business Model Canvas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input type="number" value={formData.version} onChange={(e) => setFormData({ ...formData, version: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedCanvas(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedCanvas ? 'Update' : 'Create'} Canvas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
