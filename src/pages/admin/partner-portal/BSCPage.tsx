import React, { useState, useEffect } from 'react';
import { PieChart, Plus, AlertTriangle, Edit2, Trash2, Search } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { supabase } from '../../../lib/supabase';
import { logAdminError } from '../../../lib/admin-error-logger';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function BSCPage() {
  const { t } = useLanguage();
  const [scorecards, setScorecards] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedScorecard, setSelectedScorecard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ customer_id: '', title: '', time_period: 'Q1 2026', vision: '', strategy: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [scorecardsResult, customersResult] = await Promise.all([
        supabase.from('balanced_scorecards').select('*, customers!inner(name)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').eq('status', 'active').order('name')
      ]);

      if (scorecardsResult.error) throw scorecardsResult.error;
      if (customersResult.error) throw customersResult.error;

      setScorecards(scorecardsResult.data || []);
      setCustomers(customersResult.data || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BSCPage.loadData',
        action: 'Loading Balanced Scorecards'
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
      if (selectedScorecard) {
        const { error } = await supabase
          .from('balanced_scorecards')
          .update(formData)
          .eq('id', selectedScorecard.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('balanced_scorecards').insert([formData]);
        if (error) throw error;
      }

      setShowModal(false);
      setSelectedScorecard(null);
      setFormData({ customer_id: '', title: '', time_period: 'Q1 2026', vision: '', strategy: '' });
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BSCPage.handleSubmit',
        action: selectedScorecard ? 'Updating Balanced Scorecard' : 'Creating Balanced Scorecard'
      });
      console.error(`[${errorId}] Error saving scorecard:`, err);
      setError('Failed to save scorecard. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Balanced Scorecard? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      const { error } = await supabase
        .from('balanced_scorecards')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'BSCPage.handleDelete',
        action: 'Deleting Balanced Scorecard'
      });
      console.error(`[${errorId}] Error deleting scorecard:`, err);
      setError('Failed to delete scorecard. Please try again.');
    }
  };

  const perspectives = [
    { name: 'Financial', color: 'bg-blue-100 text-blue-700' },
    { name: 'Customer', color: 'bg-green-100 text-green-700' },
    { name: 'Internal Processes', color: 'bg-purple-100 text-purple-700' },
    { name: 'Learning & Growth', color: 'bg-orange-100 text-orange-700' }
  ];

  const filteredScorecards = scorecards.filter(scorecard => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      scorecard.title?.toLowerCase().includes(search) ||
      scorecard.customers?.name?.toLowerCase().includes(search) ||
      scorecard.vision?.toLowerCase().includes(search) ||
      scorecard.strategy?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Balanced Scorecards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!import.meta.env.PROD && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t('admin.nav.balanced_scorecard')}
        description="Measure organizational performance across financial, customer, internal processes, and learning perspectives."
        action={{
          label: 'Create Scorecard',
          onClick: () => {
            setSelectedScorecard(null);
            setShowModal(true);
          },
          icon: Plus
        }}
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {perspectives.map((p) => (
          <Card key={p.name} className={`p-4 ${p.color}`}>
            <p className="text-sm font-medium">{p.name}</p>
            <p className="text-2xl font-bold mt-2">{scorecards.length}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredScorecards.length === 0 ? (
          searchQuery ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">
                No items match "{searchQuery}". Try a different search term.
              </p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Balanced Scorecards Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first scorecard to measure performance across all key perspectives.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Scorecard
              </button>
            </Card>
          )
        ) : (
          filteredScorecards.map((scorecard) => (
            <Card key={scorecard.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{scorecard.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Customer: {scorecard.customers?.name} | {scorecard.time_period}</p>
                  {scorecard.vision && <p className="text-sm text-gray-500">{scorecard.vision}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedScorecard(scorecard);
                      setFormData({
                        customer_id: scorecard.customer_id,
                        title: scorecard.title,
                        time_period: scorecard.time_period,
                        vision: scorecard.vision || '',
                        strategy: scorecard.strategy || ''
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit scorecard"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(scorecard.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete scorecard"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
          setSelectedScorecard(null);
        }}
        title={selectedScorecard ? 'Edit Balanced Scorecard' : 'Create Balanced Scorecard'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <input type="text" value={formData.time_period} onChange={(e) => setFormData({ ...formData, time_period: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
            <textarea value={formData.vision} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
            <textarea value={formData.strategy} onChange={(e) => setFormData({ ...formData, strategy: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedScorecard(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {selectedScorecard ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
