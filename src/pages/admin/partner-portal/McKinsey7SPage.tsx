import React, { useState, useEffect } from 'react';
import { Network, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function McKinsey7SPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    assessment_date: new Date().toISOString().split('T')[0],
    key_findings: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assessmentsResult, customersResult] = await Promise.all([
        supabase.from('mckinsey_7s_assessments').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setAssessments(assessmentsResult.data || []);
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
      await supabase.from('mckinsey_7s_assessments').insert([formData]);
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const elements = ['Strategy', 'Structure', 'Systems', 'Shared Values', 'Skills', 'Style', 'Staff'];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="McKinsey 7S Framework"
        description="Align seven organizational elements - Strategy, Structure, Systems, Shared Values, Skills, Style, and Staff."
        action={{ label: 'Create Assessment', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-7 gap-2">
        {elements.map((element) => (
          <Card key={element} className="p-3 bg-pink-50">
            <p className="text-xs font-medium text-pink-900 text-center">{element}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Customer: {assessment.customers?.name} | Date: {assessment.assessment_date}
                </p>
                <p className="text-sm text-gray-500">{assessment.key_findings}</p>
              </div>
              {assessment.overall_alignment_score && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Alignment</p>
                  <p className="text-3xl font-bold text-pink-600">{assessment.overall_alignment_score}/10</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create McKinsey 7S Assessment">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
            <input type="date" value={formData.assessment_date} onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Findings</label>
            <textarea value={formData.key_findings} onChange={(e) => setFormData({ ...formData, key_findings: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
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
