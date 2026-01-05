import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit2, Trash2, Copy } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { MethodologyTemplate } from '../../../lib/enterprise-types';

export default function MethodologyTemplatesPage() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<MethodologyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MethodologyTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    template_name: '',
    category: 'growth' as const,
    description: '',
    typical_duration_weeks: 0,
    typical_credits: 0,
    deliverables: [] as string[],
    phases: [] as Array<{ name: string; description?: string; duration_weeks?: number; deliverables?: string[] }>,
    required_competencies: [] as string[],
    is_public: true,
    usage_count: 0
  });

  const categories = [
    'growth',
    'leadership',
    'marketing',
    'operations',
    'strategy',
    'transformation',
    'general'
  ] as const;

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
      const data = await enterpriseAPI.getMethodologyTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load methodology templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterpriseAPI.createMethodologyTemplate(formData);
      setShowCreateModal(false);
      setFormData({
        template_name: '',
        category: 'growth' as const,
        description: '',
        typical_duration_weeks: 0,
        typical_credits: 0,
        deliverables: [] as string[],
        phases: [] as Array<{ name: string; description?: string; duration_weeks?: number; deliverables?: string[] }>,
        required_competencies: [] as string[],
        is_public: true,
        usage_count: 0
      });
      setSuccess('Methodology template created successfully');
      await loadData();
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Failed to create methodology template');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      await enterpriseAPI.updateMethodologyTemplate(editingTemplate.id, editingTemplate);
      setShowEditModal(false);
      setEditingTemplate(null);
      setSuccess('Methodology template updated successfully');
      await loadData();
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Failed to update methodology template');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await enterpriseAPI.deleteMethodologyTemplate(id);
      setSuccess('Methodology template deleted successfully');
      await loadData();
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete methodology template');
    }
  };

  const handleDuplicate = async (template: MethodologyTemplate) => {
    try {
      await enterpriseAPI.createMethodologyTemplate({
        ...template,
        template_name: `${template.template_name} (Copy)`,
        usage_count: 0
      });
      setSuccess('Methodology template duplicated successfully');
      await loadData();
    } catch (err) {
      console.error('Error duplicating template:', err);
      setError('Failed to duplicate methodology template');
    }
  };

  const openEditModal = (template: MethodologyTemplate) => {
    setEditingTemplate({ ...template });
    setShowEditModal(true);
    setError(null);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.template_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading methodology templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Methodology Templates"
        description="Reusable project templates and proven methodologies for consistent, high-quality delivery"
        icon={<FileText className="w-8 h-8" />}
        help={{
          purpose: 'Methodology Templates provides a library of reusable project templates that standardize delivery approaches, ensure consistency, and accelerate project setup. Build once, use many times.',
          usage: [
            'Create reusable templates for common project types',
            'Define typical duration, credits, and deliverables',
            'Document phases, success criteria, and risks',
            'Track usage across projects and customers',
            'Duplicate and customize templates for specific needs',
            'Maintain a knowledge base of proven methodologies'
          ],
          concepts: [
            {
              term: 'Project Template',
              definition: 'A pre-defined project structure including phases, deliverables, duration estimates, and success criteria. Templates accelerate project setup and ensure consistency.'
            },
            {
              term: 'Category',
              definition: 'Templates are organized by type: consulting, implementation, training, assessment, transformation, and optimization.'
            },
            {
              term: 'Usage Tracking',
              definition: 'Track how often each template is used to identify the most valuable methodologies and refine approaches over time.'
            }
          ]
        }}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Template
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.is_active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Uses</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + t.usage_count, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length > 0
                  ? Math.round(templates.reduce((sum, t) => sum + t.typical_credits, 0) / templates.length)
                  : 0}
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">All Templates</h2>
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No methodology templates found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Create your first template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{template.template_name}</h3>
                      {!template.is_active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded capitalize">
                      {template.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(template)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id, template.template_name)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-700 mb-3">{template.description}</p>
                )}

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600 text-xs">Duration</p>
                    <p className="font-semibold text-gray-900">{template.typical_duration_weeks || 0} weeks</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600 text-xs">Credits</p>
                    <p className="font-semibold text-gray-900">{template.typical_credits || 0}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600 text-xs">Uses</p>
                    <p className="font-semibold text-gray-900">{template.usage_count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Methodology Template">
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
              <input
                type="text"
                required
                value={formData.template_name}
                onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                placeholder="e.g., Digital Transformation Roadmap"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief overview of this methodology..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typical Duration (weeks)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.typical_duration_weeks}
                  onChange={(e) => setFormData({ ...formData, typical_duration_weeks: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typical Credits</label>
                <input
                  type="number"
                  min="0"
                  value={formData.typical_credits}
                  onChange={(e) => setFormData({ ...formData, typical_credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (comma-separated)</label>
              <textarea
                value={formData.deliverables.join(', ')}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Deliverable 1, Deliverable 2, Deliverable 3"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Competencies (comma-separated)</label>
              <textarea
                value={formData.required_competencies.join(', ')}
                onChange={(e) => setFormData({ ...formData, required_competencies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Strategy, Leadership, Project Management"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                Public template
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
                Create Template
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && editingTemplate && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Methodology Template">
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
              <input
                type="text"
                required
                value={editingTemplate.template_name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, template_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={editingTemplate.category}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={editingTemplate.description || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typical Duration (weeks)</label>
                <input
                  type="number"
                  min="0"
                  value={editingTemplate.typical_duration_weeks || 0}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, typical_duration_weeks: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typical Credits</label>
                <input
                  type="number"
                  min="0"
                  value={editingTemplate.typical_credits || 0}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, typical_credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (comma-separated)</label>
              <textarea
                value={editingTemplate.deliverables?.join(', ') || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, deliverables: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Deliverable 1, Deliverable 2, Deliverable 3"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Competencies (comma-separated)</label>
              <textarea
                value={editingTemplate.required_competencies?.join(', ') || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, required_competencies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Strategy, Leadership, Project Management"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_public_edit"
                checked={editingTemplate.is_public}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, is_public: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_public_edit" className="text-sm text-gray-700">
                Public template
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTemplate(null);
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
