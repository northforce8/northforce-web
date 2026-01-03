import React, { useState, useEffect } from 'react';
import { Network, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

export default function McKinsey7SPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    assessment_date: new Date().toISOString().split('T')[0],
    key_findings: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [assessmentsResult, customersResult] = await Promise.all([
        supabase.from('mckinsey_7s_assessments').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (assessmentsResult.error) throw assessmentsResult.error;
      if (customersResult.error) throw customersResult.error;

      setAssessments(assessmentsResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'McKinsey7SPage.loadData',
        action: 'Loading McKinsey 7S assessments'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedAssessment) {
        const { error } = await supabase
          .from('mckinsey_7s_assessments')
          .update(formData)
          .eq('id', selectedAssessment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('mckinsey_7s_assessments').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setSelectedAssessment(null);
      setFormData({
        customer_id: '',
        title: '',
        assessment_date: new Date().toISOString().split('T')[0],
        key_findings: ''
      });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'McKinsey7SPage.handleSubmit',
        action: selectedAssessment ? 'Updating McKinsey 7S assessment' : 'Creating McKinsey 7S assessment'
      });
      console.error(`[${errorId}] Error saving assessment:`, err);
      setError('Failed to save assessment. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return;
    }
    try {
      setError(null);
      const { error } = await supabase.from('mckinsey_7s_assessments').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'McKinsey7SPage.handleDelete',
        action: 'Deleting McKinsey 7S assessment'
      });
      console.error(`[${errorId}] Error deleting assessment:`, err);
      setError('Failed to delete assessment. Please try again.');
    }
  };

  const elements = ['Strategy', 'Structure', 'Systems', 'Shared Values', 'Skills', 'Style', 'Staff'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading McKinsey 7S Assessments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="McKinsey 7S Framework"
        description="Align seven organizational elements - Strategy, Structure, Systems, Shared Values, Skills, Style, and Staff."
        action={{
          label: 'Create Assessment',
          onClick: () => {
            setSelectedAssessment(null);
            setShowModal(true);
          },
          icon: Plus
        }}
      />

      <div className="grid grid-cols-7 gap-2">
        {elements.map((element) => (
          <Card key={element} className="p-3 bg-pink-50">
            <p className="text-xs font-medium text-pink-900 text-center">{element}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {assessments.length === 0 ? (
          <Card className="p-12 text-center">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No McKinsey 7S Assessments Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first assessment to align organizational elements for maximum effectiveness.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Assessment
            </button>
          </Card>
        ) : (
          assessments.map((assessment) => (
            <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Customer: {assessment.customers?.name} | Date: {assessment.assessment_date}
                  </p>
                  <p className="text-sm text-gray-500">{assessment.key_findings}</p>
                </div>
                <div className="flex items-center gap-4">
                  {assessment.overall_alignment_score && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Alignment</p>
                      <p className="text-3xl font-bold text-pink-600">{assessment.overall_alignment_score}/10</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setFormData({
                          customer_id: assessment.customer_id,
                          title: assessment.title,
                          assessment_date: assessment.assessment_date,
                          key_findings: assessment.key_findings
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit assessment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete assessment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAssessment(null);
        }}
        title={selectedAssessment ? 'Edit McKinsey 7S Assessment' : 'Create McKinsey 7S Assessment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
            <input type="date" value={formData.assessment_date} onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Findings</label>
            <textarea value={formData.key_findings} onChange={(e) => setFormData({ ...formData, key_findings: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedAssessment(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedAssessment ? 'Update' : 'Create'} Assessment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
