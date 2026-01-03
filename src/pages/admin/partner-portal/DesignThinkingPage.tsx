import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function DesignThinkingPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    project_name: '',
    challenge_statement: '',
    target_users: '',
    current_phase: 'empathize' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsResult, customersResult] = await Promise.all([
        supabase.from('design_thinking_projects').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setProjects(projectsResult.data || []);
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
      await supabase.from('design_thinking_projects').insert([formData]);
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const phases = [
    { name: 'Empathize', color: 'bg-blue-100 text-blue-700' },
    { name: 'Define', color: 'bg-green-100 text-green-700' },
    { name: 'Ideate', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Prototype', color: 'bg-purple-100 text-purple-700' },
    { name: 'Test', color: 'bg-pink-100 text-pink-700' }
  ];

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Design Thinking"
        description="Use empathy, ideation, and prototyping to create user-centered, innovative solutions."
        action={{ label: 'Create Project', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-5 gap-4">
        {phases.map((phase) => (
          <Card key={phase.name} className={`p-4 ${phase.color}`}>
            <p className="text-sm font-medium mb-2">{phase.name}</p>
            <p className="text-2xl font-bold">
              {projects.filter(p => p.current_phase === phase.name.toLowerCase()).length}
            </p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.project_name}</h3>
                <p className="text-sm text-gray-600 mb-2">Challenge: {project.challenge_statement}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Customer: {project.customers?.name}</span>
                  <span>•</span>
                  <span>Target Users: {project.target_users}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded capitalize ${
                phases.find(p => p.name.toLowerCase() === project.current_phase)?.color || 'bg-gray-100 text-gray-700'
              }`}>
                {project.current_phase}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Design Thinking Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input type="text" value={formData.project_name} onChange={(e) => setFormData({ ...formData, project_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Statement</label>
            <textarea value={formData.challenge_statement} onChange={(e) => setFormData({ ...formData, challenge_statement: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Users</label>
            <input type="text" value={formData.target_users} onChange={(e) => setFormData({ ...formData, target_users: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
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
