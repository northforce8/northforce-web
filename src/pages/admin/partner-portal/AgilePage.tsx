import React, { useState, useEffect } from 'react';
import { Zap, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

export default function AgilePage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    team_name: '',
    framework: 'scrum' as const,
    team_size: 0,
    velocity_target: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsResult, customersResult] = await Promise.all([
        supabase.from('agile_teams').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);
      setTeams(teamsResult.data || []);
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
      await supabase.from('agile_teams').insert([formData]);
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
        title="Agile Transformation"
        description="Implement agile practices to increase adaptability, innovation, and team collaboration."
        action={{ label: 'Create Team', onClick: () => setShowModal(true), icon: Plus }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Active Teams</p>
          <p className="text-2xl font-bold text-gray-900">{teams.filter(t => t.status === 'active').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Avg Velocity</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(teams.reduce((sum, t) => sum + (t.current_velocity || 0), 0) / (teams.length || 1))}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Members</p>
          <p className="text-2xl font-bold text-gray-900">
            {teams.reduce((sum, t) => sum + (t.team_size || 0), 0)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Frameworks</p>
          <p className="text-2xl font-bold text-gray-900">{new Set(teams.map(t => t.framework)).size}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {teams.map((team) => (
          <Card key={team.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.team_name}</h3>
                <p className="text-sm text-gray-600">
                  Customer: {team.customers?.name} | Framework: {team.framework} | Size: {team.team_size} members
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Velocity</p>
                <p className="text-2xl font-bold text-gray-900">{team.current_velocity}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Agile Team">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input type="text" value={formData.team_name} onChange={(e) => setFormData({ ...formData, team_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
            <select value={formData.framework} onChange={(e) => setFormData({ ...formData, framework: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg">
              <option value="scrum">Scrum</option>
              <option value="kanban">Kanban</option>
              <option value="scrumban">Scrumban</option>
              <option value="safe">SAFe</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
              <input type="number" value={formData.team_size} onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Velocity Target</label>
              <input type="number" value={formData.velocity_target} onChange={(e) => setFormData({ ...formData, velocity_target: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
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
