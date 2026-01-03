import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function LeanStartupPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      const [experimentsResult, customersResult] = await Promise.all([
        supabase.from('lean_experiments').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setExperiments(experimentsResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('lean_experiments').insert([formData]);
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lean Startup Methodology"
        description="Create MVPs and test hypotheses quickly through iterative learning and customer feedback."
        action={{ label: 'Create Experiment', onClick: () => setShowModal(true), icon: Plus }}
      />

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
        {experiments.map((experiment) => (
          <Card key={experiment.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{experiment.experiment_name}</h3>
                <p className="text-sm text-gray-600 mb-2">MVP: {experiment.mvp_description}</p>
                <p className="text-sm text-gray-500">Problem: {experiment.problem_statement}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>Customer: {experiment.customers?.name}</span>
                  <span>•</span>
                  <span>Segment: {experiment.target_segment}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded ${
                experiment.status === 'running' ? 'bg-blue-100 text-blue-700' :
                experiment.status === 'completed' ? 'bg-green-100 text-green-700' :
                experiment.status === 'pivoted' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {experiment.status}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Lean Experiment">
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
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
