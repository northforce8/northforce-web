import React, { useState, useEffect } from 'react';
import { Plus, FileText, Eye, Edit2, Trash2, X, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { NoteWithRelations, Customer, Project } from '../../../lib/partner-portal-types';

interface NoteFormData {
  customer_id: string;
  project_id?: string;
  note_type: string;
  visibility: 'admin_only' | 'shared';
  content: string;
}

const NotesPage: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<NoteWithRelations[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithRelations | null>(null);
  const [viewingNote, setViewingNote] = useState<NoteWithRelations | null>(null);
  const [formData, setFormData] = useState<NoteFormData>({
    customer_id: '',
    project_id: '',
    note_type: 'general',
    visibility: 'shared',
    content: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notesData, customersData, projectsData] = await Promise.all([
        partnerPortalApi.notes.getAll(),
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.projects.getAll()
      ]);
      setNotes(notesData);
      setCustomers(customersData);
      setProjects(projectsData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setNotes([]);
      setCustomers([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingNote(null);
    setFormData({
      customer_id: customers.length > 0 ? customers[0].id : '',
      project_id: '',
      note_type: 'general',
      visibility: 'shared',
      content: ''
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (note: NoteWithRelations) => {
    setEditingNote(note);
    setFormData({
      customer_id: note.customer_id,
      project_id: note.project_id || '',
      note_type: note.note_type,
      visibility: note.visibility,
      content: note.content
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormError('');
  };

  const validateForm = (): boolean => {
    if (!formData.content.trim()) {
      setFormError('Content is required');
      return false;
    }

    if (!formData.customer_id && customers.length > 0) {
      setFormError('Please select a customer');
      return false;
    }

    if (!formData.note_type.trim()) {
      setFormError('Note type is required');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    setFormError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const noteData = {
        customer_id: formData.customer_id,
        project_id: formData.project_id || undefined,
        note_type: formData.note_type,
        visibility: formData.visibility,
        content: formData.content
      };

      if (editingNote) {
        await partnerPortalApi.notes.update(editingNote.id, noteData);
        setSuccessMessage('Note updated successfully');
      } else {
        await partnerPortalApi.notes.create(noteData);
        setSuccessMessage('Note created successfully');
      }

      await loadData();
      closeModal();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving note:', error);
      setFormError(error.message || 'Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeleting(true);
    try {
      await partnerPortalApi.notes.delete(noteId);
      setSuccessMessage('Note deleted successfully');
      await loadData();
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setFormError(error.message || 'Failed to delete note. Please try again.');
      setTimeout(() => setFormError(''), 5000);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProjectsByCustomer = (customerId: string) => {
    return projects.filter(p => p.customer_id === customerId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar anteckningar...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {formError && !showModal && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-sm font-medium text-red-800">{formError}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t('notes.title')}
        description={t('notes.description')}
        icon={FileText}
        action={{
          label: t('notes.add'),
          onClick: openAddModal,
          icon: Plus,
        }}
        help={PAGE_HELP_CONTENT.notes}
      />

      {customers.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>No customers available.</strong> Create a customer first before adding notes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No notes yet</p>
              {customers.length > 0 && (
                <button
                  onClick={openAddModal}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div key={note.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {note.note_type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {note.visibility}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{formatDate(note.created_at)}</span>
                      <button
                        onClick={() => setViewingNote(note)}
                        className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(note)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(note.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-900 mb-3 line-clamp-2">{note.content}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{note.customer?.company_name || 'Unknown Customer'}</span>
                    {note.project && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{note.project.name}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={saving}
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {formError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                    <p className="text-sm font-medium text-red-800">{formError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => {
                      setFormData({ ...formData, customer_id: e.target.value, project_id: '' });
                      setFormError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={saving}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project (optional)
                  </label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => {
                      setFormData({ ...formData, project_id: e.target.value });
                      setFormError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={saving || !formData.customer_id}
                  >
                    <option value="">No project</option>
                    {formData.customer_id &&
                      getProjectsByCustomer(formData.customer_id).map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.note_type}
                    onChange={(e) => {
                      setFormData({ ...formData, note_type: e.target.value });
                      setFormError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={saving}
                  >
                    <option value="general">General</option>
                    <option value="meeting">Meeting</option>
                    <option value="decision">Decision</option>
                    <option value="action_item">Action Item</option>
                    <option value="risk">Risk</option>
                    <option value="issue">Issue</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => {
                      setFormData({ ...formData, visibility: e.target.value as 'admin_only' | 'shared' });
                      setFormError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={saving}
                  >
                    <option value="shared">Shared</option>
                    <option value="admin_only">Admin Only</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Shared notes are visible to partners. Admin only notes are internal.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      setFormError('');
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Enter note content..."
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingNote ? 'Update Note' : 'Create Note'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Note Details</h2>
              <button
                onClick={() => setViewingNote(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer</label>
                  <p className="text-gray-900">{viewingNote.customer?.company_name || 'Unknown'}</p>
                </div>

                {viewingNote.project && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Project</label>
                    <p className="text-gray-900">{viewingNote.project.name}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {viewingNote.note_type}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Visibility</label>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {viewingNote.visibility}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Content</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingNote.content}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(viewingNote.created_at)}</p>
                </div>

                {viewingNote.updated_at && viewingNote.updated_at !== viewingNote.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                    <p className="text-gray-900">{formatDate(viewingNote.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setViewingNote(null);
                  openEditModal(viewingNote);
                }}
                className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setViewingNote(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Delete Note</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Build marker for deployment verification */}
      <div className="mt-8 text-center pb-4">
        <p className="text-xs text-gray-400">
          {t('notes.build_marker')}: 589-{new Date().toISOString().slice(0, 16).replace('T', ' ')}
        </p>
      </div>
    </div>
  );
};

export default NotesPage;
