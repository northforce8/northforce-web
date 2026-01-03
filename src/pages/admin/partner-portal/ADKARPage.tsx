import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function ADKARPage() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      const [initiativesResult, customersResult] = await Promise.all([
        supabase.from('change_initiatives').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setInitiatives(initiativesResult.data || []);
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
      await supabase.from('change_initiatives').insert([formData]);
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stages = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Management (ADKAR)"
        description="Build awareness, desire, knowledge, ability, and reinforcement to drive successful organizational change."
        action={{ label: 'Create Initiative', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-5 gap-4">
        {stages.map((stage, idx) => (
          <Card key={stage} className={`p-4 bg-gradient-to-br from-blue-${idx + 4}00 to-blue-${idx + 5}00`}>
            <p className="text-xs font-medium text-blue-900 mb-2">{stage}</p>
            <p className="text-2xl font-bold text-blue-900">{initiatives.length}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
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
              <span className={`px-3 py-1 text-xs rounded ${
                initiative.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                initiative.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {initiative.status}
              </span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${initiative.overall_progress}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Change Initiative">
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
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
