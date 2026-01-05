import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logAdminError } from '../../../lib/admin-error-logger';
import type { LeadershipAssessment } from '../../../lib/enterprise-types';

export default function LeadershipAssessmentsPage() {
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<LeadershipAssessment[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<LeadershipAssessment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    customer_id: '',
    assessment_name: '',
    description: '',
    assessment_type: '360' as const,
    launch_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft' as const
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
      const [assessmentsData, customersData] = await Promise.all([
        enterpriseAPI.getLeadershipAssessments(),
        partnerPortalApi.getCustomers()
      ]);
      setAssessments(assessmentsData);
      setCustomers(customersData);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeadershipAssessmentsPage.loadData',
        action: 'Loading assessments and customers'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Kunde inte ladda bedömningar. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      assessment_name: '',
      description: '',
      assessment_type: '360',
      launch_date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'draft'
    });
    setSelectedAssessment(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await enterpriseAPI.createLeadershipAssessment({
        ...formData,
        participants_count: 0,
        completed_count: 0
      });
      setShowCreateModal(false);
      resetForm();
      setSuccess('Ledarskaps bedömning skapad!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeadershipAssessmentsPage.handleCreate',
        action: 'Creating leadership assessment'
      });
      console.error(`[${errorId}] Error creating assessment:`, err);
      setError('Kunde inte skapa bedömning. Försök igen.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;

    try {
      setError(null);
      await enterpriseAPI.updateLeadershipAssessment(selectedAssessment.id, formData);
      setShowCreateModal(false);
      resetForm();
      setSuccess('Ledarskaps bedömning uppdaterad!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeadershipAssessmentsPage.handleUpdate',
        action: 'Updating leadership assessment'
      });
      console.error(`[${errorId}] Error updating assessment:`, err);
      setError('Kunde inte uppdatera bedömning. Försök igen.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera denna bedömning? Denna åtgärd kan inte ångras.')) {
      return;
    }

    try {
      setError(null);
      await enterpriseAPI.deleteLeadershipAssessment(id);
      setSuccess('Ledarskaps bedömning raderad!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'LeadershipAssessmentsPage.handleDelete',
        action: 'Deleting leadership assessment'
      });
      console.error(`[${errorId}] Error deleting assessment:`, err);
      setError('Kunde inte radera bedömning. Försök igen.');
    }
  };

  const handleEdit = (assessment: LeadershipAssessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      customer_id: assessment.customer_id,
      assessment_name: assessment.assessment_name,
      description: assessment.description || '',
      assessment_type: assessment.assessment_type,
      launch_date: assessment.launch_date,
      due_date: assessment.due_date || '',
      status: assessment.status
    });
    setShowCreateModal(true);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = !searchQuery ||
      assessment.assessment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-primary-600 animate-spin" />
          <span className="text-gray-600">Laddar bedömningar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Fel</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Klar</p>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t('leadership.assessments.title', 'Leadership Assessments')}
        description={t('leadership.assessments.subtitle', 'Comprehensive 360-degree leadership development and evaluation')}
        action={{
          label: t('leadership.assessments.create', 'Launch Assessment'),
          onClick: () => {
            resetForm();
            setShowCreateModal(true);
          },
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Totalt antal bedömningar</p>
          <p className="text-3xl font-bold">{assessments.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Aktiva</p>
          <p className="text-3xl font-bold text-green-600">
            {assessments.filter(a => a.status === 'active').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Slutförda</p>
          <p className="text-3xl font-bold text-blue-600">
            {assessments.filter(a => a.status === 'completed').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Totalt antal deltagare</p>
          <p className="text-3xl font-bold">
            {assessments.reduce((sum, a) => sum + a.participants_count, 0)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Alla bedömningar</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Sök bedömningar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Alla status</option>
              <option value="draft">Utkast</option>
              <option value="active">Aktiv</option>
              <option value="completed">Slutförd</option>
              <option value="cancelled">Avbruten</option>
            </select>
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Inga bedömningar hittades' : 'Inga bedömningar ännu'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Prova att justera din sökning eller filter.'
                : 'Starta din första 360-graders ledarskaps bedömning för att komma igång.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Starta första bedömningen
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assessment.assessment_name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        assessment.status === 'active' ? 'bg-green-100 text-green-700' :
                        assessment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        assessment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {(assessment as any).customer?.company_name || 'Unknown Customer'}
                    </p>
                    {assessment.description && (
                      <p className="text-sm text-gray-700 mb-3">{assessment.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span><strong>Typ:</strong> {assessment.assessment_type}</span>
                      <span><strong>Deltagare:</strong> {assessment.participants_count}</span>
                      <span><strong>Slutförda:</strong> {assessment.completed_count}</span>
                      <span><strong>Startdatum:</strong> {new Date(assessment.launch_date).toLocaleDateString()}</span>
                      {assessment.due_date && (
                        <span><strong>Förfallodatum:</strong> {new Date(assessment.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(assessment)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Redigera bedömning"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Radera bedömning"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          title={selectedAssessment ? 'Redigera bedömning' : 'Starta ny bedömning'}
        >
          <form onSubmit={selectedAssessment ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kund *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Välj kund...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedömningsnamn *</label>
              <input
                type="text"
                required
                value={formData.assessment_name}
                onChange={(e) => setFormData({ ...formData, assessment_name: e.target.value })}
                placeholder="t.ex. Q1 2024 Ledarskaps bedömning"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Kort beskrivning av bedömningsmål..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedömningstyp</label>
              <select
                value={formData.assessment_type}
                onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="self">Självbedömning</option>
                <option value="180">180° (Själv + Chef)</option>
                <option value="360">360° (Flerpartsbedömning)</option>
                <option value="team">Teamsbedömning</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Startdatum *</label>
                <input
                  type="date"
                  required
                  value={formData.launch_date}
                  onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Förfallodatum</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Utkast</option>
                <option value="active">Aktiv</option>
                <option value="completed">Slutförd</option>
                <option value="cancelled">Avbruten</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {selectedAssessment ? 'Uppdatera bedömning' : 'Starta bedömning'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
