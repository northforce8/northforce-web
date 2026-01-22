import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface LeanStartupCycle {
  id: string;
  customer_id: string;
  cycle_name: string;
  hypothesis: string;
  experiment: string;
  metrics: string;
  learning: string;
  next_action: string;
  created_at: string;
  customer_name?: string;
}

export default function LeanStartupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<LeanStartupCycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCycle();
  }, [id]);

  const loadCycle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lean_startup_cycles')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCycle({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'LeanStartupDetailPage.loadCycle' });
      console.error('Error loading Lean Startup cycle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Lean Startup cycle?')) return;

    try {
      const { error } = await supabase.from('lean_startup_cycles').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/lean-startup');
    } catch (error) {
      logAdminError(error as Error, { context: 'LeanStartupDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Rocket className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cycle not found</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/lean-startup')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Lean Startup
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { title: 'Build: Hypothesis', content: cycle.hypothesis, color: 'border-blue-300 bg-blue-50', number: '1' },
    { title: 'Measure: Experiment', content: cycle.experiment, color: 'border-green-300 bg-green-50', number: '2' },
    { title: 'Learn: Metrics', content: cycle.metrics, color: 'border-yellow-300 bg-yellow-50', number: '3' },
    { title: 'Learning Outcome', content: cycle.learning, color: 'border-purple-300 bg-purple-50', number: '4' },
    { title: 'Next Action', content: cycle.next_action, color: 'border-red-300 bg-red-50', number: '5' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/lean-startup')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={cycle.cycle_name}
          description={cycle.customer_name || 'Lean Startup Cycle'}
        />
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.title} className={`p-6 border-l-4 ${step.color}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{step.content || 'Not defined'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Cycle
        </button>
      </div>
    </div>
  );
}
