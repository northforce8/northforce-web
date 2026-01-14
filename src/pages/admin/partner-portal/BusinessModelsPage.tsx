import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { BusinessModel } from '../../../lib/enterprise-types';

export default function BusinessModelsPage() {
  const { t } = useLanguage();
  const [models, setModels] = useState<BusinessModel[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModel, setEditingModel] = useState<BusinessModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    model_name: '',
    value_proposition: '',
    customer_segments: '',
    channels: '',
    customer_relationships: '',
    revenue_streams: '',
    key_resources: '',
    key_activities: '',
    key_partnerships: '',
    cost_structure: '',
    version: 1,
    is_current: true,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [customersData, allCustomers] = await Promise.all([
        partnerPortalApi.getCustomers(),
        partnerPortalApi.getCustomers()
      ]);
      setCustomers(customersData);

      const allModels: BusinessModel[] = [];
      for (const customer of allCustomers) {
        try {
          const customerModels = await enterpriseAPI.getBusinessModels(customer.id);
          allModels.push(...customerModels);
        } catch (err) {
          console.error(`Error loading models for customer ${customer.id}:`, err);
        }
      }
      setModels(allModels);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load business models');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterpriseAPI.createBusinessModel(formData);
      setShowCreateModal(false);
      setFormData({
        customer_id: '',
        model_name: '',
        value_proposition: '',
        customer_segments: '',
        channels: '',
        customer_relationships: '',
        revenue_streams: '',
        key_resources: '',
        key_activities: '',
        key_partnerships: '',
        cost_structure: '',
        version: 1,
        is_current: true,
        notes: ''
      });
      setSuccess('Business model created successfully');
      await loadData();
    } catch (err) {
      console.error('Error creating business model:', err);
      setError('Failed to create business model');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    try {
      await enterpriseAPI.updateBusinessModel(editingModel.id, editingModel);
      setShowEditModal(false);
      setEditingModel(null);
      setSuccess('Business model updated successfully');
      await loadData();
    } catch (err) {
      console.error('Error updating business model:', err);
      setError('Failed to update business model');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await enterpriseAPI.deleteBusinessModel(id);
      setSuccess('Business model deleted successfully');
      await loadData();
    } catch (err) {
      console.error('Error deleting business model:', err);
      setError('Failed to delete business model');
    }
  };

  const openEditModal = (model: BusinessModel) => {
    setEditingModel({ ...model });
    setShowEditModal(true);
    setError(null);
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.model_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.value_proposition?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustomer = filterCustomer === 'all' || model.customer_id === filterCustomer;
    return matchesSearch && matchesCustomer;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Models"
        description="Design, document, and iterate on business models using the Business Model Canvas framework"
        icon={<Briefcase className="w-8 h-8" />}
        help={{
          purpose: 'Business Models provides a structured approach to designing and documenting business strategies using the proven Business Model Canvas framework. Track multiple versions, collaborate with customers, and ensure strategic alignment.',
          usage: [
            'Document business models for customer engagements',
            'Create and manage multiple versions of business models',
            'Analyze all nine building blocks of the canvas',
            'Track current vs. historical versions',
            'Collaborate on business model iterations with customers',
            'Export models for presentations and strategic planning'
          ],
          concepts: [
            {
              term: 'Business Model Canvas',
              definition: 'A strategic management template for developing new business models or documenting existing ones, covering 9 key areas: Value Proposition, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure.'
            },
            {
              term: 'Version Management',
              definition: 'Track iterations of business models over time. Mark the current version and maintain historical records of strategic evolution.'
            },
            {
              term: 'Strategic Alignment',
              definition: 'Ensure all elements of the business model work together cohesively to deliver value and achieve sustainable competitive advantage.'
            }
          ]
        }}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Business Model
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Models</p>
              <p className="text-2xl font-bold text-gray-900">{models.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Versions</p>
              <p className="text-2xl font-bold text-gray-900">
                {models.filter(m => m.is_current).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(models.map(m => m.customer_id)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search business models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div>
            <select
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="all">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">All Business Models</h2>
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No business models found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Create your first business model
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModels.map((model) => {
              const customer = customers.find(c => c.id === model.customer_id);
              return (
                <div key={model.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{model.model_name}</h3>
                        {model.is_current && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            Current
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          v{model.version}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {customer?.company_name || 'Unknown Customer'}
                      </p>
                      {model.value_proposition && (
                        <p className="text-sm text-gray-700 mb-3">{model.value_proposition}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {model.customer_segments && (
                          <div className="p-2 bg-blue-50 rounded">
                            <p className="font-medium text-blue-900">Customer Segments</p>
                            <p className="text-blue-700 text-xs mt-1 truncate">{model.customer_segments}</p>
                          </div>
                        )}
                        {model.revenue_streams && (
                          <div className="p-2 bg-green-50 rounded">
                            <p className="font-medium text-green-900">Revenue Streams</p>
                            <p className="text-green-700 text-xs mt-1 truncate">{model.revenue_streams}</p>
                          </div>
                        )}
                        {model.channels && (
                          <div className="p-2 bg-purple-50 rounded">
                            <p className="font-medium text-purple-900">Channels</p>
                            <p className="text-purple-700 text-xs mt-1 truncate">{model.channels}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(model)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(model.id, model.model_name)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Business Model">
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
              <input
                type="text"
                required
                value={formData.model_name}
                onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                placeholder="e.g., Q1 2024 Business Model"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Proposition *</label>
              <textarea
                required
                value={formData.value_proposition}
                onChange={(e) => setFormData({ ...formData, value_proposition: e.target.value })}
                placeholder="What value do you deliver to the customer?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segments</label>
                <textarea
                  value={formData.customer_segments}
                  onChange={(e) => setFormData({ ...formData, customer_segments: e.target.value })}
                  placeholder="Who are your customers?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <textarea
                  value={formData.channels}
                  onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                  placeholder="How do you reach customers?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Streams</label>
                <textarea
                  value={formData.revenue_streams}
                  onChange={(e) => setFormData({ ...formData, revenue_streams: e.target.value })}
                  placeholder="How do you generate revenue?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Resources</label>
                <textarea
                  value={formData.key_resources}
                  onChange={(e) => setFormData({ ...formData, key_resources: e.target.value })}
                  placeholder="What resources are required?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_current"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_current" className="text-sm text-gray-700">
                Mark as current version
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Model
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && editingModel && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Business Model">
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
              <input
                type="text"
                required
                value={editingModel.model_name}
                onChange={(e) => setEditingModel({ ...editingModel, model_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Proposition *</label>
              <textarea
                required
                value={editingModel.value_proposition || ''}
                onChange={(e) => setEditingModel({ ...editingModel, value_proposition: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segments</label>
                <textarea
                  value={editingModel.customer_segments || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, customer_segments: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <textarea
                  value={editingModel.channels || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, channels: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Streams</label>
                <textarea
                  value={editingModel.revenue_streams || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, revenue_streams: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Resources</label>
                <textarea
                  value={editingModel.key_resources || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, key_resources: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_current_edit"
                checked={editingModel.is_current}
                onChange={(e) => setEditingModel({ ...editingModel, is_current: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_current_edit" className="text-sm text-gray-700">
                Mark as current version
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingModel(null);
                  setError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
