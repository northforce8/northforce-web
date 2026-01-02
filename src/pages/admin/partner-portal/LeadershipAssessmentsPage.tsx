import React, { useState, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import InfoIcon from '../../../components/admin/InfoIcon';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { LeadershipAssessment } from '../../../lib/enterprise-types';

export default function LeadershipAssessmentsPage() {
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<LeadershipAssessment[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentsData, customersData] = await Promise.all([
        enterpriseAPI.getLeadershipAssessments(),
        partnerPortalApi.getCustomers()
      ]);
      setAssessments(assessmentsData);
      setCustomers(customersData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterpriseAPI.createLeadershipAssessment({
        ...formData,
        participants_count: 0,
        completed_count: 0
      });
      setShowCreateModal(false);
      setFormData({
        customer_id: '',
        assessment_name: '',
        description: '',
        assessment_type: '360',
        launch_date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'draft'
      });
      await loadData();
    } catch (err) {
      console.error('Error creating assessment:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('leadership.assessments.title', 'Leadership Assessments')}
        subtitle={t('leadership.assessments.subtitle', '360-degree leadership development')}
        icon={<Users className="w-8 h-8" />}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          {t('leadership.assessments.create', 'Launch Assessment')}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
          <p className="text-3xl font-bold">{assessments.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">
            {assessments.filter(a => a.status === 'active').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-600">
            {assessments.filter(a => a.status === 'completed').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Participants</p>
          <p className="text-3xl font-bold">
            {assessments.reduce((sum, a) => sum + a.participants_count, 0)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">All Assessments</h2>
            <InfoIcon helpId="leadership_assessments" />
          </div>
        </div>

        {assessments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assessments yet. Launch your first 360-degree assessment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{assessment.assessment_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {(assessment as any).customer?.company_name || 'Unknown Customer'}
                    </p>
                    {assessment.description && (
                      <p className="text-sm text-gray-700 mt-2">{assessment.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span>Type: <strong>{assessment.assessment_type}</strong></span>
                      <span>Participants: <strong>{assessment.participants_count}</strong></span>
                      <span>Completed: <strong>{assessment.completed_count}</strong></span>
                      <span className="capitalize">Status: <strong>{assessment.status}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Launch New Assessment">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Name *</label>
              <input
                type="text"
                required
                value={formData.assessment_name}
                onChange={(e) => setFormData({ ...formData, assessment_name: e.target.value })}
                placeholder="e.g., Q1 2024 Leadership Assessment"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
              <select
                value={formData.assessment_type}
                onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="self">Self Assessment</option>
                <option value="180">180° (Self + Manager)</option>
                <option value="360">360° (Multi-rater)</option>
                <option value="team">Team Assessment</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Launch Assessment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
