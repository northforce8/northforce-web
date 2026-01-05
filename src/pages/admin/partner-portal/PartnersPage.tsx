import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Mail, Phone, Building, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import type { Partner } from '../../../lib/partner-portal-types';

const PartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newPartner, setNewPartner] = useState({
    partner_name: '',
    partner_company: '',
    email: '',
    phone: '',
    title: '',
    expertise_areas: [] as string[],
    is_active: true,
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
      const data = await partnerPortalApi.partners.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
      setError('Kunde inte ladda partners. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.partners.create(newPartner);
      setShowCreateModal(false);
      setNewPartner({
        partner_name: '',
        partner_company: '',
        email: '',
        phone: '',
        title: '',
        expertise_areas: [],
        is_active: true,
      });
      setSuccess('Partner skapad');
      await loadData();
    } catch (error) {
      console.error('Error creating partner:', error);
      setError('Kunde inte skapa partner. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.partners.update(editingPartner.id, editingPartner);
      setShowEditModal(false);
      setEditingPartner(null);
      setSuccess('Partner uppdaterad');
      await loadData();
    } catch (error) {
      console.error('Error updating partner:', error);
      setError('Kunde inte uppdatera partner. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Är du säker på att du vill radera partner "${name}"? Detta går inte att ångra.`)) {
      return;
    }

    setError(null);
    try {
      await partnerPortalApi.partners.delete(id);
      setSuccess('Partner raderad');
      await loadData();
    } catch (error) {
      console.error('Error deleting partner:', error);
      setError('Kunde inte radera partner. Försök igen.');
    }
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setShowEditModal(true);
    setError(null);
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch =
      partner.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.partner_company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && partner.is_active) ||
      (filterStatus === 'inactive' && !partner.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        description="Hantera partnerprofiler och uppdrag"
        action={isAdminUser ? {
          label: 'Lägg till Partner',
          onClick: () => setShowCreateModal(true),
          icon: Plus,
        } : undefined}
      />

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

      <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sök partners..."
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
                <option value="all">Alla Partners</option>
                <option value="active">Aktiva</option>
                <option value="inactive">Inaktiva</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredPartners.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Inga partners hittades</p>
                {isAdminUser && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Lägg till din första partner
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    {isAdminUser && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{partner.partner_name}</p>
                            {partner.partner_company && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {partner.partner_company}
                              </p>
                            )}
                            {partner.title && (
                              <p className="text-xs text-gray-500">{partner.title}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {partner.email && (
                            <p className="text-sm text-gray-900 flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {partner.email}
                            </p>
                          )}
                          {partner.phone && (
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {partner.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          partner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {partner.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      {isAdminUser && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/partner-portal/partners/${partner.id}`);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-900"
                              title="Visa detaljer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(partner);
                              }}
                              className="p-1 text-primary-600 hover:text-primary-900"
                              title="Redigera partner"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePartner(partner.id, partner.partner_name);
                              }}
                              className="p-1 text-red-600 hover:text-red-900"
                              title="Radera partner"
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Lägg till Ny Partner</h2>
            </div>
            <form onSubmit={handleCreatePartner} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fullständigt Namn *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPartner.partner_name}
                    onChange={(e) => setNewPartner({ ...newPartner, partner_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Anna Andersson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Företag
                  </label>
                  <input
                    type="text"
                    value={newPartner.partner_company}
                    onChange={(e) => setNewPartner({ ...newPartner, partner_company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Företagsnamn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="partner@exempel.se"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="+46 70 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={newPartner.title}
                    onChange={(e) => setNewPartner({ ...newPartner, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Seniorkonsult"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newPartner.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setNewPartner({ ...newPartner, is_active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
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
                  {submitting ? 'Skapar...' : 'Skapa Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Redigera Partner</h2>
            </div>
            <form onSubmit={handleUpdatePartner} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fullständigt Namn *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPartner.partner_name}
                    onChange={(e) => setEditingPartner({ ...editingPartner, partner_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Företag
                  </label>
                  <input
                    type="text"
                    value={editingPartner.partner_company || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, partner_company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={editingPartner.email || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={editingPartner.phone || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={editingPartner.title || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPartner.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setEditingPartner({ ...editingPartner, is_active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPartner(null);
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
                  {submitting ? 'Sparar...' : 'Spara Ändringar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;
