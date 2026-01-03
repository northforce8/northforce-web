import React, { useState, useEffect } from 'react';
import { Layout, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function BMCPage() {
  const [canvases, setCanvases] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', title: '', version: 1 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [canvasesResult, customersResult] = await Promise.all([
        supabase.from('business_model_canvases').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setCanvases(canvasesResult.data || []);
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
      await supabase.from('business_model_canvases').insert([formData]);
      setShowModal(false);
      setFormData({ customer_id: '', title: '', version: 1 });
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const blocks = [
    'Customer Segments', 'Value Propositions', 'Channels', 'Customer Relationships',
    'Revenue Streams', 'Key Resources', 'Key Activities', 'Key Partnerships', 'Cost Structure'
  ];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Model Canvas"
        description="Design and iterate your business model across nine building blocks to ensure a robust and adaptable strategy."
        action={{ label: 'Create Canvas', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-3 gap-4">
        {blocks.slice(0, 3).map((block) => (
          <Card key={block} className="p-4 bg-blue-50">
            <p className="text-sm font-medium text-blue-900">{block}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {canvases.map((canvas) => (
          <Card key={canvas.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{canvas.title}</h3>
                <p className="text-sm text-gray-600">Customer: {canvas.customers?.name} | Version {canvas.version}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded ${canvas.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {canvas.status}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Business Model Canvas">
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
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
