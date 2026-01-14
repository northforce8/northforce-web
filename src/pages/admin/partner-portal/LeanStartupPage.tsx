import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

export default function LeanStartupPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    experiment_name: '',
    mvp_description: '',
    problem_statement: '',
    target_segment: '',
    start_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [experimentsResult, customersResult] = await Promise.all([
        supabase.from('lean_experiments').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (experimentsResult.error) throw experimentsResult.error;
      if (customersResult.error) throw customersResult.error;

      setExperiments(experimentsResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeanStartupPage.loadData',
        action: 'Loading lean experiments'
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
      if (selectedExperiment) {
        const { error } = await supabase
          .from('lean_experiments')
          .update(formData)
          .eq('id', selectedExperiment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lean_experiments').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedExperiment(null);
      setFormData({
        customer_id: '',
        experiment_name: '',
        mvp_description: '',
        problem_statement: '',
        target_segment: '',
        start_date: new Date().toISOString().split('T')[0]
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeanStartupPage.handleSubmit',
        action: selectedExperiment ? 'Updating lean experiment' : 'Creating lean experiment'
      });
      console.error(`[${errorId}] Error saving experiment:`, err);
      setError('Failed to save experiment. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('lean_experiments').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeanStartupPage.handleDelete',
        action: 'Deleting lean experiment'
      });
      console.error(`[${errorId}] Error deleting experiment:`, err);
      setError('Failed to delete experiment. Please try again.');
    }
  };

  const filteredExperiments = experiments.filter(experiment => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      experiment.experiment_name?.toLowerCase().includes(search) ||
      experiment.customers?.name?.toLowerCase().includes(search) ||
      experiment.problem_statement?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Lean Experiments...</div>
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
        title="Lean Startup Methodology"
        description="Create MVPs and test hypotheses quickly through iterative learning and customer feedback."
        action={{
          label: 'Create Experiment',
          onClick: () => {
            setSelectedExperiment(null);
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {['planning', 'running', 'completed', 'pivoted'].map((status) => (
          <Card key={status} className="p-6">
            <p className="text-sm text-gray-600 capitalize mb-2">{status}</p>
            <p className="text-2xl font-bold text-gray-900">
              {experiments.filter(e => e.status === status).length}
            </p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredExperiments.length === 0 ? (
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
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lean Experiments Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first experiment to test MVPs and hypotheses through iterative learning.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Experiment
              </button>
            </Card>
          )
        ) : (
          filteredExperiments.map((experiment) => (
            <Card key={experiment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{experiment.experiment_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">MVP: {experiment.mvp_description}</p>
                  <p className="text-sm text-gray-500">Problem: {experiment.problem_statement}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>Customer: {experiment.customers?.name}</span>
                    <span>•</span>
                    <span>Segment: {experiment.target_segment}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded ${
                    experiment.status === 'running' ? 'bg-blue-100 text-blue-700' :
                    experiment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    experiment.status === 'pivoted' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {experiment.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedExperiment(experiment);
                      setFormData({
                        customer_id: experiment.customer_id,
                        experiment_name: experiment.experiment_name,
                        mvp_description: experiment.mvp_description,
                        problem_statement: experiment.problem_statement,
                        target_segment: experiment.target_segment,
                        start_date: experiment.start_date
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit experiment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experiment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete experiment"
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
          setSelectedExperiment(null);
        }}
        title={selectedExperiment ? 'Edit Lean Experiment' : 'Create Lean Experiment'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Experiment Name</label>
            <input type="text" value={formData.experiment_name} onChange={(e) => setFormData({ ...formData, experiment_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">MVP Description</label>
            <textarea value={formData.mvp_description} onChange={(e) => setFormData({ ...formData, mvp_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
            <textarea value={formData.problem_statement} onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Segment</label>
            <input type="text" value={formData.target_segment} onChange={(e) => setFormData({ ...formData, target_segment: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedExperiment(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedExperiment ? 'Update' : 'Create'} Experiment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
