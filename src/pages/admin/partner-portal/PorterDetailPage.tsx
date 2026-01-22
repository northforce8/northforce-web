import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Edit2, Trash2, Shield } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface PorterAnalysis {
  id: string;
  customer_id: string;
  analysis_name: string;
  industry: string;
  competitive_rivalry: number;
  supplier_power: number;
  buyer_power: number;
  threat_of_substitutes: number;
  threat_of_new_entrants: number;
  notes: string;
  created_at: string;
  customer_name?: string;
}

export default function PorterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<PorterAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('porter_analyses')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setAnalysis({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'PorterDetailPage.loadAnalysis' });
      console.error('Error loading Porter analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Porter analysis?')) return;

    try {
      const { error } = await supabase.from('porter_analyses').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/porter');
    } catch (error) {
      logAdminError(error as Error, { context: 'PorterDetailPage.handleDelete' });
      console.error('Error deleting analysis:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis not found</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/porter')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Porter Analyses
          </button>
        </div>
      </div>
    );
  }

  const forceData = [
    { name: 'Competitive Rivalry', score: analysis.competitive_rivalry, color: 'bg-red-500' },
    { name: 'Supplier Power', score: analysis.supplier_power, color: 'bg-orange-500' },
    { name: 'Buyer Power', score: analysis.buyer_power, color: 'bg-yellow-500' },
    { name: 'Threat of Substitutes', score: analysis.threat_of_substitutes, color: 'bg-green-500' },
    { name: 'Threat of New Entrants', score: analysis.threat_of_new_entrants, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/porter')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={analysis.analysis_name}
          description={`${analysis.customer_name} • ${analysis.industry}`}
          action={{
            label: 'Edit',
            onClick: () => setShowEditModal(true),
            icon: Edit2
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {forceData.map((force) => (
          <Card key={force.name} className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{force.name}</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${force.color}`}
                  style={{ width: `${force.score * 10}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gray-900">{force.score}/10</span>
            </div>
          </Card>
        ))}
      </div>

      {analysis.notes && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Analysis Notes</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{analysis.notes}</p>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Analysis
        </button>
      </div>
    </div>
  );
}
