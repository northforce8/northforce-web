import React, { useState, useEffect } from 'react';
import { PieChart, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function BSCPage() {
  const [scorecards, setScorecards] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', title: '', time_period: 'Q1 2026', vision: '', strategy: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scorecardsResult, customersResult] = await Promise.all([
        supabase.from('balanced_scorecards').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setScorecards(scorecardsResult.data || []);
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
      await supabase.from('balanced_scorecards').insert([formData]);
      setShowModal(false);
      setFormData({ customer_id: '', title: '', time_period: 'Q1 2026', vision: '', strategy: '' });
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const perspectives = [
    { name: 'Financial', color: 'bg-blue-100 text-blue-700' },
    { name: 'Customer', color: 'bg-green-100 text-green-700' },
    { name: 'Internal Processes', color: 'bg-purple-100 text-purple-700' },
    { name: 'Learning & Growth', color: 'bg-orange-100 text-orange-700' }
  ];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balanced Scorecard"
        description="Measure organizational performance across financial, customer, internal processes, and learning perspectives."
        action={{ label: 'Create Scorecard', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {perspectives.map((p) => (
          <Card key={p.name} className={`p-4 ${p.color}`}>
            <p className="text-sm font-medium">{p.name}</p>
            <p className="text-2xl font-bold mt-2">{scorecards.length}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {scorecards.map((scorecard) => (
          <Card key={scorecard.id} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{scorecard.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Customer: {scorecard.customers?.name} | {scorecard.time_period}</p>
            <p className="text-sm text-gray-500">{scorecard.vision}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Balanced Scorecard">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <input type="text" value={formData.time_period} onChange={(e) => setFormData({ ...formData, time_period: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
            <textarea value={formData.vision} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
            <textarea value={formData.strategy} onChange={(e) => setFormData({ ...formData, strategy: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
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
