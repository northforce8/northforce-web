import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';

interface BMCCanvas {
  id: string;
  customer_id: string;
  canvas_name: string;
  key_partners: string;
  key_activities: string;
  key_resources: string;
  value_propositions: string;
  customer_relationships: string;
  channels: string;
  customer_segments: string;
  cost_structure: string;
  revenue_streams: string;
  created_at: string;
  customer_name?: string;
}

export default function BMCDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<BMCCanvas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCanvas();
  }, [id]);

  const loadCanvas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bmc_canvases')
        .select('*, customers!inner(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCanvas({ ...data, customer_name: data.customers?.name });
      }
    } catch (err) {
      logAdminError(err as Error, { context: 'BMCDetailPage.loadCanvas' });
      console.error('Error loading BMC canvas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Business Model Canvas?')) return;

    try {
      const { error } = await supabase.from('bmc_canvases').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/partner-portal/strategic-frameworks/bmc');
    } catch (error) {
      logAdminError(error as Error, { context: 'BMCDetailPage.handleDelete' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Layers className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Canvas not found</h3>
          <button
            onClick={() => navigate('/admin/partner-portal/strategic-frameworks/bmc')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Business Model Canvas
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { title: 'Key Partners', content: canvas.key_partners, color: 'border-blue-200 bg-blue-50' },
    { title: 'Key Activities', content: canvas.key_activities, color: 'border-green-200 bg-green-50' },
    { title: 'Key Resources', content: canvas.key_resources, color: 'border-purple-200 bg-purple-50' },
    { title: 'Value Propositions', content: canvas.value_propositions, color: 'border-red-200 bg-red-50' },
    { title: 'Customer Relationships', content: canvas.customer_relationships, color: 'border-yellow-200 bg-yellow-50' },
    { title: 'Channels', content: canvas.channels, color: 'border-indigo-200 bg-indigo-50' },
    { title: 'Customer Segments', content: canvas.customer_segments, color: 'border-pink-200 bg-pink-50' },
    { title: 'Cost Structure', content: canvas.cost_structure, color: 'border-gray-200 bg-gray-50' },
    { title: 'Revenue Streams', content: canvas.revenue_streams, color: 'border-emerald-200 bg-emerald-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/partner-portal/strategic-frameworks/bmc')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={canvas.canvas_name}
          description={canvas.customer_name || 'Business Model Canvas'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className={`p-4 border-2 ${section.color}`}>
            <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{section.content || 'Not defined'}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Canvas
        </button>
      </div>
    </div>
  );
}
