import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, Award, DollarSign, Users, Zap } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import type { EnterprisePlan, PlanLevel } from '../../../lib/partner-portal-types';
import { normalizeArray, normalizeEnterprisePlan } from '../../../lib/data-validators';
import { logAdminError } from '../../../lib/admin-error-logger';

const EnterprisePlansPage: React.FC = () => {
  const [plans, setPlans] = useState<EnterprisePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EnterprisePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    plan_name: '',
    plan_level: 'starter' as PlanLevel,
    credits_per_month: 40,
    price_per_month: 60000,
    credits_price_per_credit: 1500,
    overage_price_per_credit: 1800,
    partner_cost_per_credit: 850,
    max_users: 5,
    max_projects: 10,
    features: [] as string[],
    is_active: true,
  });

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await partnerPortalApi.enterprisePlans.getAll();
      const normalizedPlans = normalizeArray(rawData, normalizeEnterprisePlan);
      setPlans(normalizedPlans);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/enterprise-plans',
        action: 'loadPlans',
      });
      setError(`Failed to load enterprise plans (Error ID: ${errorId})`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleCreatePlan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partnerPortalApi.enterprisePlans.create(newPlan);
      setShowCreateModal(false);
      setNewPlan({
        plan_name: '',
        plan_level: 'starter',
        credits_per_month: 40,
        price_per_month: 60000,
        credits_price_per_credit: 1500,
        overage_price_per_credit: 1800,
        partner_cost_per_credit: 850,
        max_users: 5,
        max_projects: 10,
        features: [],
        is_active: true,
      });
      setSuccess('Plan created successfully');
      await loadPlans();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/enterprise-plans',
        action: 'createPlan',
      });
      setError(`Failed to create plan (Error ID: ${errorId})`);
    }
  }, [newPlan, loadPlans]);

  const handleUpdatePlan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await partnerPortalApi.enterprisePlans.update(editingPlan.id, editingPlan);
      setShowEditModal(false);
      setEditingPlan(null);
      setSuccess('Plan updated successfully');
      await loadPlans();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/enterprise-plans',
        action: 'updatePlan',
      });
      setError(`Failed to update plan (Error ID: ${errorId})`);
    }
  }, [editingPlan, loadPlans]);

  const handleDeletePlan = useCallback(async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await partnerPortalApi.enterprisePlans.delete(planId);
      setSuccess('Plan deleted successfully');
      await loadPlans();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/enterprise-plans',
        action: 'deletePlan',
      });
      setError(`Failed to delete plan (Error ID: ${errorId})`);
    }
  }, [loadPlans]);

  const getPlanLevelColor = useMemo(() => (level: PlanLevel) => {
    switch (level) {
      case 'starter':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'growth':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scale':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'custom':
        return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  }, []);

  const formatCurrency = useMemo(() => (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enterprise Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Create Plan
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Award className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg border-2 p-6 ${
              !plan.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.plan_name}</h3>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getPlanLevelColor(
                    plan.plan_level
                  )}`}
                >
                  {plan.plan_level?.toUpperCase() || '—'}
                </span>
              </div>
              {!plan.is_active && (
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                  Inactive
                </span>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(plan.price_per_month)}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">
                  {plan.credits_per_month} credits/month
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  {formatCurrency(plan.credits_price_per_credit)} per credit
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">
                  Up to {plan.max_users || '∞'} users
                </span>
              </div>
            </div>

            {plan.features && plan.features.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-600 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.features.length > 3 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{plan.features.length - 3} more features
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setShowEditModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No enterprise plans found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Create your first plan
          </button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Enterprise Plan</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={newPlan.plan_name}
                    onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Level
                  </label>
                  <select
                    value={newPlan.plan_level}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, plan_level: e.target.value as PlanLevel })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits/Month
                    </label>
                    <input
                      type="number"
                      value={newPlan.credits_per_month}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, credits_per_month: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price/Month (SEK)
                    </label>
                    <input
                      type="number"
                      value={newPlan.price_per_month}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, price_per_month: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Users
                    </label>
                    <input
                      type="number"
                      value={newPlan.max_users || ''}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, max_users: Number(e.target.value) || null })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Projects
                    </label>
                    <input
                      type="number"
                      value={newPlan.max_projects || ''}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, max_projects: Number(e.target.value) || null })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newPlan.is_active}
                    onChange={(e) => setNewPlan({ ...newPlan, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Create Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Enterprise Plan</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPlan(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={editingPlan.plan_name}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, plan_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits/Month
                    </label>
                    <input
                      type="number"
                      value={editingPlan.credits_per_month}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          credits_per_month: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price/Month (SEK)
                    </label>
                    <input
                      type="number"
                      value={editingPlan.price_per_month}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          price_per_month: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    checked={editingPlan.is_active}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, is_active: e.target.checked })
                    }
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="edit_is_active" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPlan(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterprisePlansPage;
