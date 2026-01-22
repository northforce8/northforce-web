import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface ADKARAssessment {
  id: string;
  customer_id: string;
  assessment_name: string;
  awareness_score: number;
  desire_score: number;
  knowledge_score: number;
  ability_score: number;
  reinforcement_score: number;
  notes: string;
  created_at: string;
  customer_name?: string;
}

export default function ADKARDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<ADKARAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('adkar_assessments')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setAssessment({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'ADKARDetailPage.loadAssessment' });
      console.error('Error loading ADKAR assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ADKAR assessment?')) return;

    try {
      const { error } = await supabase.from('adkar_assessments').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/adkar');
    } catch (error) {
      logAdminError(error as Error, { context: 'ADKARDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment not found</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/adkar')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to ADKAR
          </button>
        </div>
      </div>
    );
  }

  const elements = [
    { name: 'Awareness', score: assessment.awareness_score, color: 'bg-blue-500' },
    { name: 'Desire', score: assessment.desire_score, color: 'bg-green-500' },
    { name: 'Knowledge', score: assessment.knowledge_score, color: 'bg-yellow-500' },
    { name: 'Ability', score: assessment.ability_score, color: 'bg-orange-500' },
    { name: 'Reinforcement', score: assessment.reinforcement_score, color: 'bg-red-500' }
  ];

  const averageScore = elements.reduce((sum, el) => sum + el.score, 0) / elements.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/adkar')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={assessment.assessment_name}
          description={assessment.customer_name || 'ADKAR Assessment'}
        />
      </div>

      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Overall ADKAR Score</h3>
          <div className="text-4xl font-bold text-blue-600">{averageScore.toFixed(1)}/10</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full"
            style={{ width: `${(averageScore / 10) * 100}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elements.map((element) => (
          <Card key={element.name} className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{element.name}</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${element.color}`}
                  style={{ width: `${element.score * 10}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gray-900">{element.score}/10</span>
            </div>
          </Card>
        ))}
      </div>

      {assessment.notes && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Assessment Notes</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{assessment.notes}</p>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Assessment
        </button>
      </div>
    </div>
  );
}
