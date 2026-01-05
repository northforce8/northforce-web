import React, { useState, useEffect } from 'react';
import { Plus, FolderKanban, Search, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import type { Project, Customer, Partner } from '../../../lib/partner-portal-types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    customer_id: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    start_date: '',
    target_end_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userIsAdmin = await isAdmin();
      setIsAdminUser(userIsAdmin);

      const [projectsData, customersData, partnersData] = await Promise.all([
        partnerPortalApi.projects.getAll(),
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.partners.getAll(),
      ]);

      setProjects(projectsData);
      setCustomers(customersData);
      setPartners(partnersData);
    } catch (error) {
      console.error('Error loading projects:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('JWT') || errorMsg.includes('session')) {
        setError('Session utgången. Logga in igen.');
        setTimeout(() => window.location.href = '/admin-login', 2000);
      } else {
        setError('Kunde inte ladda projekt. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.customer_id) {
      setError('Välj en kund');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.projects.create({
        ...newProject,
        start_date: newProject.start_date || undefined,
        target_end_date: newProject.target_end_date || undefined,
      });

      setShowCreateModal(false);
      setNewProject({
        name: '',
        description: '',
        customer_id: '',
        status: 'planning',
        priority: 'medium',
        start_date: '',
        target_end_date: '',
      });
      setSuccess('Projekt skapat');
      await loadData();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Kunde inte skapa projekt. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.projects.update(editingProject.id, editingProject);
      setShowEditModal(false);
      setEditingProject(null);
      setSuccess('Projekt uppdaterat');
      await loadData();
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Kunde inte uppdatera projekt. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Är du säker på att du vill radera projektet "${name}"? Åtgärden kan inte ångras.`)) {
      return;
    }

    setError(null);
    try {
      await partnerPortalApi.projects.delete(id);
      setSuccess('Projekt raderat');
      await loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Kunde inte radera projekt. Försök igen.');
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
    setError(null);
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.company_name || 'Okänd';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      critical: 'bg-red-100 text-red-600',
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || project.customer_id === filterCustomer;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar projekt...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Projekt"
          description="Hantera kundprojekt och leveranser"
          icon={FolderKanban}
          action={isAdminUser ? {
            label: 'Lägg till projekt',
            onClick: () => setShowCreateModal(true),
            icon: Plus
          } : undefined}
          help={PAGE_HELP_CONTENT.projects}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sök projekt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">Alla statusar</option>
                <option value="planning">Planering</option>
                <option value="active">Aktiv</option>
                <option value="on_hold">Pausad</option>
                <option value="completed">Avslutad</option>
                <option value="cancelled">Avbruten</option>
              </select>

              <select
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">Alla kunder</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Inga projekt hittades</p>
                {isAdminUser && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Skapa ditt första projekt
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projekt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tidslinje</th>
                    {isAdminUser && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FolderKanban className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{project.name}</p>
                            {project.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getCustomerName(project.customer_id)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority || 'medium')}`}>
                          {project.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {project.start_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{new Date(project.start_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {!project.start_date && <span className="text-gray-400">Inget datum satt</span>}
                        </div>
                      </td>
                      {isAdminUser && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(project)}
                              className="p-1 text-primary-600 hover:text-primary-900"
                              title="Redigera projekt"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id, project.name)}
                              className="p-1 text-red-600 hover:text-red-900"
                              title="Radera projekt"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Skapa nytt projekt</h2>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projektnamn *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Ange projektnamn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kund *
                </label>
                <select
                  required
                  value={newProject.customer_id}
                  onChange={(e) => setNewProject({ ...newProject, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Välj en kund</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beskrivning
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Projektbeskrivning och mål"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="planning">Planering</option>
                    <option value="active">Aktiv</option>
                    <option value="on_hold">Pausad</option>
                    <option value="completed">Avslutad</option>
                    <option value="cancelled">Avbruten</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioritet
                  </label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="low">Låg</option>
                    <option value="medium">Medium</option>
                    <option value="high">Hög</option>
                    <option value="critical">Kritisk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Måldatum
                  </label>
                  <input
                    type="date"
                    value={newProject.target_end_date}
                    onChange={(e) => setNewProject({ ...newProject, target_end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  {submitting ? 'Skapar...' : 'Skapa projekt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Redigera projekt</h2>
            </div>
            <form onSubmit={handleUpdateProject} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="planning">Planering</option>
                    <option value="active">Aktiv</option>
                    <option value="on_hold">Pausad</option>
                    <option value="completed">Avslutad</option>
                    <option value="cancelled">Avbruten</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingProject.priority || 'medium'}
                    onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={editingProject.start_date || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Måldatum
                  </label>
                  <input
                    type="date"
                    value={editingProject.target_end_date || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, target_end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                    setError(null);
                  }}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  {submitting ? 'Sparar...' : 'Spara ändringar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
