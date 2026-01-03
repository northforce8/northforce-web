import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Edit2, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { supabase } from '../../../lib/supabase';

interface KeyResult {
  id: string;
  objective_id: string;
  title: string;
  metric_type: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

interface KeyResultCardProps {
  objectiveId: string;
  keyResults: KeyResult[];
  onUpdate: () => void;
}

export function KeyResultCard({ objectiveId, keyResults, onUpdate }: KeyResultCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingKR, setEditingKR] = useState<KeyResult | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    metric_type: 'numeric',
    target_value: 0,
    current_value: 0,
    unit: '',
    status: 'on_track' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKR) {
        const { error } = await supabase
          .from('okr_key_results')
          .update(formData)
          .eq('id', editingKR.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('okr_key_results')
          .insert([{ ...formData, objective_id: objectiveId }]);
        if (error) throw error;
      }
      setShowModal(false);
      setEditingKR(null);
      setFormData({
        title: '',
        metric_type: 'numeric',
        target_value: 0,
        current_value: 0,
        unit: '',
        status: 'on_track'
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving key result:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this key result?')) return;

    try {
      const { error } = await supabase
        .from('okr_key_results')
        .delete()
        .eq('id', id);
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error deleting key result:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'at_risk': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'behind': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key Results</h3>
              <p className="text-sm text-gray-600">Measurable outcomes that define success</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingKR(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Key Result
          </button>
        </div>
      </div>

      <div className="p-6">
        {keyResults.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Key Results Yet</h4>
            <p className="text-gray-600 mb-4">Add measurable key results to track objective progress</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Key Result
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {keyResults.map((kr) => {
              const progress = calculateProgress(kr.current_value, kr.target_value);
              return (
                <div key={kr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(kr.status)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{kr.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(kr.status)}`}>
                            {kr.status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {kr.metric_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingKR(kr);
                        setFormData({
                          title: kr.title,
                          metric_type: kr.metric_type,
                          target_value: kr.target_value,
                          current_value: kr.current_value,
                          unit: kr.unit,
                          status: kr.status
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {kr.current_value} / {kr.target_value} {kr.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          progress >= 100 ? 'bg-blue-600' :
                          progress >= 70 ? 'bg-green-600' :
                          progress >= 40 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">0</span>
                      <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                      <span className="text-xs text-gray-500">{kr.target_value}</span>
                    </div>
                  </div>

                  {progress < 100 && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {kr.target_value - kr.current_value} {kr.unit} remaining
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingKR(null);
        }}
        title={editingKR ? 'Edit Key Result' : 'Add Key Result'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Increase monthly active users"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric Type
              </label>
              <select
                value={formData.metric_type}
                onChange={(e) => setFormData({ ...formData, metric_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="numeric">Numeric</option>
                <option value="percentage">Percentage</option>
                <option value="currency">Currency</option>
                <option value="boolean">Yes/No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., users, %, SEK"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Value
              </label>
              <input
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Value
              </label>
              <input
                type="number"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="behind">Behind</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            {editingKR && (
              <button
                type="button"
                onClick={() => handleDelete(editingKR.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingKR(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingKR ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
