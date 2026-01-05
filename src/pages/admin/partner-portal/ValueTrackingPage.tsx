import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Target, DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { supabase } from '../../../lib/supabase';
import { partnerPortalApi } from '../../../lib/partner-portal-api';

interface Initiative {
  id: string;
  customer_id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: 'hypothesis' | 'in_progress' | 'realized' | 'cancelled';
  expected_value_sek?: number;
  realized_value_sek?: number;
  value_realization_date?: string;
  priority: string;
  owner?: string;
  target_date?: string;
  customer?: { company_name: string };
  project?: { name: string };
}

const ValueTrackingPage: React.FC = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    project_id: '',
    title: '',
    description: '',
    status: 'hypothesis' as const,
    expected_value_sek: '',
    realized_value_sek: '',
    priority: 'medium',
    owner: '',
    target_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      const [initiativesRes, customersData, projectsData] = await Promise.all([
        supabase.from('strategic_initiatives').select(`
          *,
          customer:customers(company_name),
          project:projects(name)
        `).order('created_at', { ascending: false }),
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.projects.getAll()
      ]);

      setInitiatives(initiativesRes.data || []);
      setCustomers(customersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading initiatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const data = {
        customer_id: formData.customer_id,
        project_id: formData.project_id || null,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        expected_value_sek: formData.expected_value_sek ? Number(formData.expected_value_sek) : null,
        realized_value_sek: formData.realized_value_sek ? Number(formData.realized_value_sek) : null,
        priority: formData.priority,
        owner: formData.owner,
        target_date: formData.target_date || null
      };

      if (editingInitiative) {
        await supabase.from('strategic_initiatives').update(data).eq('id', editingInitiative.id);
      } else {
        await supabase.from('strategic_initiatives').insert(data);
      }

      setShowModal(false);
      setEditingInitiative(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving initiative:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this initiative?')) return;
    if (!supabase) return;

    try {
      await supabase.from('strategic_initiatives').delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Error deleting initiative:', error);
    }
  };

  const openEditModal = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setFormData({
      customer_id: initiative.customer_id,
      project_id: initiative.project_id || '',
      title: initiative.title,
      description: initiative.description || '',
      status: initiative.status,
      expected_value_sek: initiative.expected_value_sek?.toString() || '',
      realized_value_sek: initiative.realized_value_sek?.toString() || '',
      priority: initiative.priority,
      owner: initiative.owner || '',
      target_date: initiative.target_date || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      project_id: '',
      title: '',
      description: '',
      status: 'hypothesis',
      expected_value_sek: '',
      realized_value_sek: '',
      priority: 'medium',
      owner: '',
      target_date: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hypothesis': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'realized': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpected = initiatives.reduce((sum, i) => sum + (Number(i.expected_value_sek) || 0), 0);
  const totalRealized = initiatives.reduce((sum, i) => sum + (Number(i.realized_value_sek) || 0), 0);
  const inProgress = initiatives.filter(i => i.status === 'in_progress').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Value Tracking"
        description="Track expected and realized value from strategic initiatives"
        action={{
          label: 'Add Initiative',
          onClick: () => {
            setEditingInitiative(null);
            resetForm();
            setShowModal(true);
          },
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Expected Value</span>
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(totalExpected / 1000).toFixed(0)}k SEK
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Realized Value</span>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {(totalRealized / 1000).toFixed(0)}k SEK
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">In Progress</span>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{inProgress}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Initiative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Realized Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initiatives.map(initiative => (
                <tr key={initiative.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{initiative.title}</p>
                      {initiative.project && (
                        <p className="text-sm text-gray-500">{initiative.project.name}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {initiative.customer?.company_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(initiative.status)}`}>
                      {initiative.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {initiative.expected_value_sek ? `${(initiative.expected_value_sek / 1000).toFixed(0)}k SEK` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {initiative.realized_value_sek ? `${(initiative.realized_value_sek / 1000).toFixed(0)}k SEK` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(initiative)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(initiative.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingInitiative ? 'Edit Initiative' : 'Add Initiative'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value, project_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.company_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                    disabled={!formData.customer_id}
                  >
                    <option value="">No project</option>
                    {projects.filter(p => p.customer_id === formData.customer_id).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="hypothesis">Hypothesis</option>
                    <option value="in_progress">In Progress</option>
                    <option value="realized">Realized</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Value (SEK)</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.expected_value_sek}
                    onChange={(e) => setFormData({ ...formData, expected_value_sek: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Realized Value (SEK)</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.realized_value_sek}
                    onChange={(e) => setFormData({ ...formData, realized_value_sek: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInitiative(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingInitiative ? 'Save Changes' : 'Create Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValueTrackingPage;
