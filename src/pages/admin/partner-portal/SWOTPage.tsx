import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';

interface SWOTAnalysis {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  context: string;
  status: string;
  customer_name?: string;
  items?: SWOTItem[];
}

interface SWOTItem {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact_level: string;
}

export default function SWOTPage() {
  const [analyses, setAnalyses] = useState<SWOTAnalysis[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    context: '',
    status: 'in_progress' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analysesResult, customersResult] = await Promise.all([
        supabase
          .from('swot_analyses')
          .select('*, customers!inner(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('customers')
          .select('id, name')
          .eq('status', 'active')
          .order('name')
      ]);

      const analysesWithItems = await Promise.all(
        (analysesResult.data || []).map(async (analysis) => {
          const { data: items } = await supabase
            .from('swot_items')
            .select('*')
            .eq('swot_analysis_id', analysis.id);

          return {
            ...analysis,
            customer_name: analysis.customers?.name,
            items: items || []
          };
        })
      );

      setAnalyses(analysesWithItems);
      setCustomers(customersResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('swot_analyses')
        .insert([formData]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ customer_id: '', title: '', description: '', context: '', status: 'in_progress' });
      await loadData();
    } catch (error) {
      console.error('Error creating analysis:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-green-100 text-green-700';
      case 'weakness': return 'bg-red-100 text-red-700';
      case 'opportunity': return 'bg-blue-100 text-blue-700';
      case 'threat': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryCount = (items: SWOTItem[] = [], category: string) => {
    return items.filter(i => i.category === category).length;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SWOT Analysis"
        description="Assess internal strengths and weaknesses, external opportunities and threats to inform strategic decisions."
        action={{
          label: 'Create SWOT Analysis',
          onClick: () => setShowModal(true),
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {['strength', 'weakness', 'opportunity', 'threat'].map((category) => (
          <Card key={category} className="p-6">
            <p className="text-sm text-gray-600 capitalize mb-2">{category}s</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyses.reduce((sum, a) => sum + getCategoryCount(a.items, category), 0)}
            </p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {analyses.map((analysis) => (
          <Card key={analysis.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{analysis.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{analysis.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Customer: {analysis.customer_name}</span>
                  <span>•</span>
                  <span>Context: {analysis.context}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {['strength', 'weakness', 'opportunity', 'threat'].map((category) => (
                <div key={category} className={`p-3 rounded-lg ${getCategoryColor(category)}`}>
                  <p className="text-xs font-medium uppercase mb-1">{category}s</p>
                  <p className="text-2xl font-bold">{getCategoryCount(analysis.items, category)}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create SWOT Analysis">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
            <input
              type="text"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Market expansion, Product launch"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Analysis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
