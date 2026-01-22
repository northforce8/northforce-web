import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface DesignThinkingProject {
  id: string;
  customer_id: string;
  project_name: string;
  empathize: string;
  define: string;
  ideate: string;
  prototype: string;
  test: string;
  created_at: string;
  customer_name?: string;
}

export default function DesignThinkingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<DesignThinkingProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('design_thinking_projects')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setProject({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'DesignThinkingDetailPage.loadProject' });
      console.error('Error loading Design Thinking project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Design Thinking project?')) return;

    try {
      const { error } = await supabase.from('design_thinking_projects').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/design-thinking');
    } catch (error) {
      logAdminError(error as Error, { context: 'DesignThinkingDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Lightbulb className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project not found</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/design-thinking')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Design Thinking
          </button>
        </div>
      </div>
    );
  }

  const phases = [
    { title: 'Empathize', content: project.empathize, icon: '❤️', color: 'border-red-300 bg-red-50' },
    { title: 'Define', content: project.define, icon: '🎯', color: 'border-orange-300 bg-orange-50' },
    { title: 'Ideate', content: project.ideate, icon: '💡', color: 'border-yellow-300 bg-yellow-50' },
    { title: 'Prototype', content: project.prototype, icon: '🔨', color: 'border-green-300 bg-green-50' },
    { title: 'Test', content: project.test, icon: '🧪', color: 'border-blue-300 bg-blue-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/design-thinking')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={project.project_name}
          description={project.customer_name || 'Design Thinking Project'}
        />
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={phase.title} className={`p-6 border-l-4 ${phase.color}`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{phase.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{phase.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{phase.content || 'Not defined'}</p>
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
          Delete Project
        </button>
      </div>
    </div>
  );
}
