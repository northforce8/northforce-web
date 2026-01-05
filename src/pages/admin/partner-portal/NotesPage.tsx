import React, { useState, useEffect } from 'react';
import { Plus, FileText, Eye, Edit2, Trash2, X, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import type { NoteWithRelations, Customer, Project } from '../../../lib/partner-portal-types';

interface NoteFormData {
  customer_id: string;
  project_id?: string;
  note_type: string;
  visibility: 'admin_only' | 'shared';
  content: string;
}

const NotesPage: React.FC = () => {
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
      setError(err instanceof Error ? err.message : 'Kunde inte ladda anteckningar. Försök igen.');
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
      setFormError('Innehåll krävs');
      return false;
    }

    if (!formData.customer_id && customers.length > 0) {
      setFormError('Välj en kund');
      return false;
    }

    if (!formData.note_type.trim()) {
      setFormError('Anteckningstyp krävs');
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
        setSuccessMessage('Anteckning uppdaterad');
      } else {
        await partnerPortalApi.notes.create(noteData);
        setSuccessMessage('Anteckning skapad');
      }

      await loadData();
      closeModal();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving note:', error);
      setFormError(error.message || 'Kunde inte spara anteckning. Försök igen.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeleting(true);
    try {
      await partnerPortalApi.notes.delete(noteId);
      setSuccessMessage('Anteckning raderad');
      await loadData();
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setFormError(error.message || 'Kunde inte radera anteckning. Försök igen.');
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Försök igen
              </button>
            </div>
          </div>
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
        title="Anteckningar"
        description="Samarbete och dokumentation"
        icon={FileText}
        action={{
          label: 'Lägg till anteckning',
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
                <strong>Inga kunder tillgängliga.</strong> Skapa en kund först innan du lägger till anteckningar.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Inga anteckningar ännu</p>
              {customers.length > 0 && (
                <button
                  onClick={openAddModal}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Skapa din första anteckning
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
                        title="Visa detaljer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(note)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Redigera anteckning"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(note.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Radera anteckning"
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
                {editingNote ? 'Redigera anteckning' : 'Lägg till ny anteckning'}
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
                    Kund <span className="text-red-500">*</span>
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
                    <option value="">Välj en kund</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projekt (valfritt)
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
                    <option value="">Inget projekt</option>
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
                    Anteckningstyp <span className="text-red-500">*</span>
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
                    <option value="general">Allmänt</option>
                    <option value="meeting">Möte</option>
                    <option value="decision">Beslut</option>
                    <option value="action_item">Åtgärdspunkt</option>
                    <option value="risk">Risk</option>
                    <option value="issue">Problem</option>
                    <option value="update">Uppdatering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Synlighet <span className="text-red-500">*</span>
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
                    <option value="shared">Delad</option>
                    <option value="admin_only">Endast admin</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Delade anteckningar är synliga för partners. Endast admin-anteckningar är interna.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Innehåll <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      setFormError('');
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Ange anteckningens innehåll..."
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
                Avbryt
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sparar...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingNote ? 'Uppdatera anteckning' : 'Skapa anteckning'}
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
              <h2 className="text-2xl font-bold text-gray-900">Anteckningsdetaljer</h2>
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">Kund</label>
                  <p className="text-gray-900">{viewingNote.customer?.company_name || 'Okänd'}</p>
                </div>

                {viewingNote.project && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Projekt</label>
                    <p className="text-gray-900">{viewingNote.project.name}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Typ</label>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {viewingNote.note_type}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Synlighet</label>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {viewingNote.visibility}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Innehåll</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingNote.content}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Skapad</label>
                  <p className="text-gray-900">{formatDate(viewingNote.created_at)}</p>
                </div>

                {viewingNote.updated_at && viewingNote.updated_at !== viewingNote.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Senast uppdaterad</label>
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
                Redigera
              </button>
              <button
                onClick={() => setViewingNote(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Stäng
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
                <h3 className="ml-3 text-lg font-medium text-gray-900">Radera anteckning</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Är du säker på att du vill radera denna anteckning? Detta kan inte ångras.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Avbryt
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Raderar...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Radera
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
