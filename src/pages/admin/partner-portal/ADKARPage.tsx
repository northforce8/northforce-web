import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';

export default function ADKARPage() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    change_type: '',
    scope: '',
    start_date: new Date().toISOString().split('T')[0],
    target_completion_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [initiativesResult, customersResult] = await Promise.all([
        supabase.from('change_initiatives').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (initiativesResult.error) throw initiativesResult.error;
      if (customersResult.error) throw customersResult.error;

      setInitiatives(initiativesResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'ADKARPage.loadData',
        action: 'Loading change initiatives'
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
      if (selectedInitiative) {
        const { error } = await supabase
          .from('change_initiatives')
          .update(formData)
          .eq('id', selectedInitiative.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('change_initiatives').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedInitiative(null);
      setFormData({
        customer_id: '',
        title: '',
        description: '',
        change_type: '',
        scope: '',
        start_date: new Date().toISOString().split('T')[0],
        target_completion_date: ''
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'ADKARPage.handleSubmit',
        action: selectedInitiative ? 'Updating change initiative' : 'Creating change initiative'
      });
      console.error(`[${errorId}] Error saving initiative:`, err);
      setError('Failed to save initiative. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this initiative? This action cannot be undone.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('change_initiatives').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'ADKARPage.handleDelete',
        action: 'Deleting change initiative'
      });
      console.error(`[${errorId}] Error deleting initiative:`, err);
      setError('Failed to delete initiative. Please try again.');
    }
  };

  const stages = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];

  const stageGradients = [
    'bg-gradient-to-br from-blue-400 to-blue-500',
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-blue-600 to-blue-700',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-indigo-600 to-indigo-700'
  ];

  const filteredInitiatives = initiatives.filter(initiative => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      initiative.title?.toLowerCase().includes(search) ||
      initiative.customers?.name?.toLowerCase().includes(search) ||
      initiative.description?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-primary-600 animate-spin" />
          <span className="text-gray-600">Loading Change Initiatives...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="Change Management (ADKAR)"
        description="Build awareness, desire, knowledge, ability, and reinforcement to drive successful organizational change."
        icon={RefreshCw}
        action={{
          label: 'Create Initiative',
          onClick: () => {
            setSelectedInitiative(null);
            setShowModal(true);
          },
          icon: Plus
        }}
        help={PAGE_HELP_CONTENT.adkar}
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search initiatives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage, idx) => (
          <Card key={stage} className={`p-4 ${stageGradients[idx]}`}>
            <p className="text-xs font-medium text-white mb-2">{stage}</p>
            <p className="text-2xl font-bold text-white">{initiatives.length}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredInitiatives.length === 0 ? (
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
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Change Initiatives Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first initiative to drive successful organizational change using the ADKAR framework.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Initiative
              </button>
            </Card>
          )
        ) : (
          filteredInitiatives.map((initiative) => (
            <Card key={initiative.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{initiative.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{initiative.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Customer: {initiative.customers?.name}</span>
                    <span>•</span>
                    <span>Type: {initiative.change_type}</span>
                    <span>•</span>
                    <span>Progress: {initiative.overall_progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded ${
                    initiative.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    initiative.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {initiative.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedInitiative(initiative);
                      setFormData({
                        customer_id: initiative.customer_id,
                        title: initiative.title,
                        description: initiative.description,
                        change_type: initiative.change_type,
                        scope: initiative.scope,
                        start_date: initiative.start_date,
                        target_completion_date: initiative.target_completion_date
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit initiative"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(initiative.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete initiative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${initiative.overall_progress}%` }} />
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedInitiative(null);
        }}
        title={selectedInitiative ? 'Edit Change Initiative' : 'Create Change Initiative'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
            <input type="text" value={formData.change_type} onChange={(e) => setFormData({ ...formData, change_type: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Digital Transformation" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Completion</label>
              <input type="date" value={formData.target_completion_date} onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedInitiative(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedInitiative ? 'Update' : 'Create'} Initiative
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
