import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Search, Edit2, Trash2, Eye, ThumbsUp } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { BestPractice } from '../../../lib/enterprise-types';

export default function BestPracticesPage() {
  const { t } = useLanguage();
  const [practices, setPractices] = useState<BestPractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPractice, setEditingPractice] = useState<BestPractice | null>(null);
  const [viewingPractice, setViewingPractice] = useState<BestPractice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    practice_title: '',
    category: 'strategy',
    description: '',
    detailed_guidance: '',
    when_to_use: '',
    expected_outcomes: '',
    related_frameworks: '',
    difficulty_level: 'intermediate' as const,
    is_published: true,
    view_count: 0,
    likes_count: 0
  });

  const categories = [
    'strategy',
    'operations',
    'marketing',
    'sales',
    'finance',
    'hr',
    'technology',
    'leadership',
    'innovation',
    'customer_success'
  ];

  const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

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
      const data = await enterpriseAPI.getBestPractices();
      setPractices(data);
    } catch (err) {
      console.error('Error loading best practices:', err);
      setError('Failed to load best practices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterpriseAPI.createBestPractice(formData);
      setShowCreateModal(false);
      setFormData({
        practice_title: '',
        category: 'strategy',
        description: '',
        detailed_guidance: '',
        when_to_use: '',
        expected_outcomes: '',
        related_frameworks: '',
        difficulty_level: 'intermediate',
        is_published: true,
        view_count: 0,
        likes_count: 0
      });
      setSuccess('Best practice created successfully');
      await loadData();
    } catch (err) {
      console.error('Error creating best practice:', err);
      setError('Failed to create best practice');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPractice) return;

    try {
      await enterpriseAPI.updateBestPractice(editingPractice.id, editingPractice);
      setShowEditModal(false);
      setEditingPractice(null);
      setSuccess('Best practice updated successfully');
      await loadData();
    } catch (err) {
      console.error('Error updating best practice:', err);
      setError('Failed to update best practice');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await enterpriseAPI.deleteBestPractice(id);
      setSuccess('Best practice deleted successfully');
      await loadData();
    } catch (err) {
      console.error('Error deleting best practice:', err);
      setError('Failed to delete best practice');
    }
  };

  const handleView = async (practice: BestPractice) => {
    setViewingPractice(practice);
    setShowViewModal(true);

    try {
      await enterpriseAPI.updateBestPractice(practice.id, {
        ...practice,
        view_count: practice.view_count + 1
      });
      await loadData();
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  const openEditModal = (practice: BestPractice) => {
    setEditingPractice({ ...practice });
    setShowEditModal(true);
    setError(null);
  };

  const filteredPractices = practices.filter(practice => {
    const matchesSearch = practice.practice_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         practice.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || practice.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading best practices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Best Practices"
        description="Knowledge base of proven methodologies, guidelines, and lessons learned from successful engagements"
        icon={<Lightbulb className="w-8 h-8" />}
        help={{
          purpose: 'Best Practices serves as your organizational knowledge base, documenting proven approaches, lessons learned, and expert guidance. Build institutional knowledge and accelerate team learning.',
          usage: [
            'Document successful approaches and methodologies',
            'Share lessons learned across the organization',
            'Provide guidance for common scenarios and challenges',
            'Track which practices are most valued by the team',
            'Organize knowledge by category and difficulty level',
            'Build a searchable repository of expertise'
          ],
          concepts: [
            {
              term: 'Best Practice',
              definition: 'A documented approach or methodology that has proven effective through practical application. Includes when to use it, expected outcomes, and step-by-step guidance.'
            },
            {
              term: 'Difficulty Level',
              definition: 'Indicates the complexity and experience required: Beginner (new practitioners), Intermediate (regular use), Advanced (specialized scenarios), Expert (complex edge cases).'
            },
            {
              term: 'Knowledge Sharing',
              definition: 'Transform individual expertise into organizational knowledge that can be accessed, learned from, and built upon by the entire team.'
            }
          ]
        }}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Best Practice
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
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Practices</p>
              <p className="text-2xl font-bold text-gray-900">{practices.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {practices.filter(p => p.is_published).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {practices.reduce((sum, p) => sum + p.view_count, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {practices.reduce((sum, p) => sum + (p.likes_count || 0), 0)}
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
              placeholder="Search best practices..."
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
                <option key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
        {filteredPractices.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No best practices found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Add your first best practice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPractices.map((practice) => (
              <div key={practice.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{practice.practice_title}</h3>
                      {!practice.is_published && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Draft
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                        practice.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                        practice.difficulty_level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        practice.difficulty_level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {practice.difficulty_level}
                      </span>
                    </div>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded capitalize mb-3">
                      {practice.category.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-gray-700 mb-3">{practice.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {practice.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {practice.likes_count || 0} likes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleView(practice)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(practice)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(practice.id, practice.practice_title)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add Best Practice">
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice Title *</label>
              <input
                type="text"
                required
                value={formData.practice_title}
                onChange={(e) => setFormData({ ...formData, practice_title: e.target.value })}
                placeholder="e.g., Conducting Effective Discovery Workshops"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                <select
                  required
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level} className="capitalize">{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief overview of this best practice..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Guidance</label>
              <textarea
                value={formData.detailed_guidance}
                onChange={(e) => setFormData({ ...formData, detailed_guidance: e.target.value })}
                placeholder="Step-by-step guidance..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">When to Use</label>
              <textarea
                value={formData.when_to_use}
                onChange={(e) => setFormData({ ...formData, when_to_use: e.target.value })}
                placeholder="Scenarios where this practice is most effective..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcomes</label>
              <textarea
                value={formData.expected_outcomes}
                onChange={(e) => setFormData({ ...formData, expected_outcomes: e.target.value })}
                placeholder="What results should this practice deliver..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_published" className="text-sm text-gray-700">
                Publish immediately
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
                Add Practice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && editingPractice && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Best Practice">
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice Title *</label>
              <input
                type="text"
                required
                value={editingPractice.practice_title}
                onChange={(e) => setEditingPractice({ ...editingPractice, practice_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={editingPractice.category}
                  onChange={(e) => setEditingPractice({ ...editingPractice, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                <select
                  required
                  value={editingPractice.difficulty_level}
                  onChange={(e) => setEditingPractice({ ...editingPractice, difficulty_level: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level} className="capitalize">{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={editingPractice.description || ''}
                onChange={(e) => setEditingPractice({ ...editingPractice, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published_edit"
                checked={editingPractice.is_published}
                onChange={(e) => setEditingPractice({ ...editingPractice, is_published: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_published_edit" className="text-sm text-gray-700">
                Published
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPractice(null);
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

      {showViewModal && viewingPractice && (
        <Modal isOpen={showViewModal} onClose={() => {setShowViewModal(false); setViewingPractice(null);}} title="Best Practice Details">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewingPractice.practice_title}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded capitalize">
                  {viewingPractice.category.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                  viewingPractice.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                  viewingPractice.difficulty_level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                  viewingPractice.difficulty_level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {viewingPractice.difficulty_level}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
              <p className="text-gray-700">{viewingPractice.description}</p>
            </div>

            {viewingPractice.detailed_guidance && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Detailed Guidance</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{viewingPractice.detailed_guidance}</p>
              </div>
            )}

            {viewingPractice.when_to_use && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">When to Use</h3>
                <p className="text-gray-700">{viewingPractice.when_to_use}</p>
              </div>
            )}

            {viewingPractice.expected_outcomes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Expected Outcomes</h3>
                <p className="text-gray-700">{viewingPractice.expected_outcomes}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {viewingPractice.view_count} views
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {viewingPractice.likes_count || 0} likes
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {setShowViewModal(false); setViewingPractice(null);}}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
