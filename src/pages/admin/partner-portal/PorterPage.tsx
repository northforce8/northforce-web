import React, { useState, useEffect } from 'react';
import { Compass, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function PorterPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      const [analysesResult, customersResult] = await Promise.all([
        supabase.from('porter_analyses').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setAnalyses(analysesResult.data || []);
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
      await supabase.from('porter_analyses').insert([formData]);
      setShowModal(false);
      setFormData({ customer_id: '', title: '', industry: '', market_description: '' });
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const forces = [
    { type: 'competitive_rivalry', label: 'Competitive Rivalry', color: 'text-red-600 bg-red-50' },
    { type: 'threat_of_new_entrants', label: 'Threat of New Entrants', color: 'text-orange-600 bg-orange-50' },
    { type: 'threat_of_substitutes', label: 'Threat of Substitutes', color: 'text-yellow-600 bg-yellow-50' },
    { type: 'bargaining_power_suppliers', label: 'Supplier Power', color: 'text-blue-600 bg-blue-50' },
    { type: 'bargaining_power_customers', label: 'Customer Power', color: 'text-green-600 bg-green-50' }
  ];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Porter's Five Forces"
        description="Analyze competitive forces in your industry to develop strategies that protect and enhance market position."
        action={{ label: 'Create Analysis', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {forces.map((force) => (
          <Card key={force.type} className={`p-4 ${force.color}`}>
            <p className="text-xs font-medium mb-2">{force.label}</p>
            <p className="text-2xl font-bold">{analyses.length}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {analyses.map((analysis) => (
          <Card key={analysis.id} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{analysis.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Industry: {analysis.industry}</p>
            <p className="text-sm text-gray-500">{analysis.market_description}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Porter's Five Forces Analysis">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Description</label>
            <textarea value={formData.market_description} onChange={(e) => setFormData({ ...formData, market_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
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
