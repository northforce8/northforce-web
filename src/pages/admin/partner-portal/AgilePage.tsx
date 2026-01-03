import React, { useState, useEffect } from 'react';
import { Zap, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

export default function AgilePage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
      setError(null);
      const [teamsResult, customersResult] = await Promise.all([
        supabase.from('agile_teams').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (teamsResult.error) throw teamsResult.error;
      if (customersResult.error) throw customersResult.error;

      setTeams(teamsResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.loadData',
        action: 'Loading agile teams'
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
      if (selectedTeam) {
        const { error } = await supabase
          .from('agile_teams')
          .update(formData)
          .eq('id', selectedTeam.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('agile_teams').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedTeam(null);
      setFormData({
        customer_id: '',
        team_name: '',
        framework: 'scrum',
        team_size: 0,
        velocity_target: 0
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.handleSubmit',
        action: selectedTeam ? 'Updating agile team' : 'Creating agile team'
      });
      console.error(`[${errorId}] Error saving team:`, err);
      setError('Failed to save team. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('agile_teams').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'AgilePage.handleDelete',
        action: 'Deleting agile team'
      });
      console.error(`[${errorId}] Error deleting team:`, err);
      setError('Failed to delete team. Please try again.');
    }
  };

  const filteredTeams = teams.filter(team => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      team.team_name?.toLowerCase().includes(search) ||
      team.customers?.name?.toLowerCase().includes(search) ||
      team.framework?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Agile Teams...</div>
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
        title="Agile Transformation"
        description="Implement agile practices to increase adaptability, innovation, and team collaboration."
        action={{
          label: 'Create Team',
          onClick: () => {
            setSelectedTeam(null);
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
        {filteredTeams.length === 0 ? (
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
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Agile Teams Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first team to implement agile practices and increase adaptability.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Team
              </button>
            </Card>
          )
        ) : (
          filteredTeams.map((team) => (
            <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.team_name}</h3>
                  <p className="text-sm text-gray-600">
                    Customer: {team.customers?.name} | Framework: {team.framework} | Size: {team.team_size} members
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Current Velocity</p>
                    <p className="text-2xl font-bold text-gray-900">{team.current_velocity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setFormData({
                          customer_id: team.customer_id,
                          team_name: team.team_name,
                          framework: team.framework,
                          team_size: team.team_size,
                          velocity_target: team.velocity_target
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit team"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
          setSelectedTeam(null);
        }}
        title={selectedTeam ? 'Edit Agile Team' : 'Create Agile Team'}
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
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedTeam(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedTeam ? 'Update' : 'Create'} Team
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
