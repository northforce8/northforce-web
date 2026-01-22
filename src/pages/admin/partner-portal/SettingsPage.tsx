import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, AlertTriangle, Check, Clock, History, Info, Trash2, DollarSign, Building2, Settings as SettingsIcon, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { getCurrentUser } from '../../../lib/auth';
import { PageHeader } from '../../../components/admin/PageHeader';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { WorkType, SystemSettings, SettingsAuditLog, PlanLevel, WorkTypeUsageInfo } from '../../../lib/partner-portal-types';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<SystemSettings | null>(null);
  const [auditLog, setAuditLog] = useState<SettingsAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showWorkTypeModal, setShowWorkTypeModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState<'work_types' | 'time_entry_rules' | null>(null);
  const [editingWorkType, setEditingWorkType] = useState<WorkType | null>(null);
  const [workTypeUsageInfo, setWorkTypeUsageInfo] = useState<Map<string, WorkTypeUsageInfo>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  const [newWorkType, setNewWorkType] = useState<Partial<WorkType>>({
    name: '',
    description: '',
    credits_per_hour: 1.0,
    internal_cost_factor: 1.0,
    requires_plan_level: 'starter' as PlanLevel,
    billable: true,
    allowed_plan_levels: ['starter', 'growth', 'scale', 'custom'] as PlanLevel[],
    category: 'operational',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [workTypesData, settingsData] = await Promise.all([
        partnerPortalApi.workTypes.getAllIncludingInactive(),
        partnerPortalApi.settings.getSystemSettings(),
      ]);

      setWorkTypes(workTypesData);
      setSystemSettings(settingsData);
      setOriginalSettings(settingsData);

      const usageMap = new Map<string, WorkTypeUsageInfo>();
      await Promise.all(
        workTypesData.map(async (wt) => {
          const usage = await partnerPortalApi.workTypes.checkUsage(wt.id);
          usageMap.set(wt.id, usage);
        })
      );
      setWorkTypeUsageInfo(usageMap);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : t('admin.error.failed_load_settings'));
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLog = async (entityType: 'work_type' | 'time_entry_rules') => {
    try {
      const logs = await partnerPortalApi.settings.getAuditLog({
        entityType,
        limit: 50,
      });
      setAuditLog(logs);
      setShowAuditLog(entityType === 'work_type' ? 'work_types' : 'time_entry_rules');
    } catch (error) {
      console.error('Error loading audit log:', error);
    }
  };

  const handleCreateWorkType = async () => {
    if (!newWorkType.name || !newWorkType.credits_per_hour) {
      alert('Name and Credits per Hour are required');
      return;
    }

    try {
      setSaving(true);
      await partnerPortalApi.workTypes.create(newWorkType as Omit<WorkType, 'id' | 'created_at'>);
      await loadData();
      setShowWorkTypeModal(false);
      resetNewWorkType();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating work type:', error);
      alert(t('admin.error.failed_work_type_create'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateWorkType = async (id: string, updates: Partial<WorkType>) => {
    const workType = workTypes.find(wt => wt.id === id);
    if (!workType) return;

    const usage = workTypeUsageInfo.get(id);
    if (updates.is_active === false && usage?.is_used) {
      setShowConfirmDialog({
        show: true,
        title: 'Deactivate Work Type in Use',
        message: `This work type has been used in ${usage.usage_count} time entries. Last used: ${new Date(usage.last_used_date || '').toLocaleDateString()}. Are you sure you want to deactivate it? It will no longer appear in time entry forms.`,
        onConfirm: async () => {
          await performWorkTypeUpdate(id, updates);
          setShowConfirmDialog({ ...showConfirmDialog, show: false });
        },
      });
      return;
    }

    await performWorkTypeUpdate(id, updates);
  };

  const performWorkTypeUpdate = async (id: string, updates: Partial<WorkType>) => {
    try {
      setSaving(true);
      await partnerPortalApi.workTypes.update(id, updates);
      await loadData();
      setShowWorkTypeModal(false);
      setEditingWorkType(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating work type:', error);
      alert(t('admin.error.failed_work_type_update'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTimeEntryRules = async () => {
    if (!systemSettings) return;

    try {
      setSaving(true);
      await partnerPortalApi.settings.updateSystemSettings({
        time_entry_edit_window_days: systemSettings.time_entry_edit_window_days,
        time_entry_require_project: systemSettings.time_entry_require_project,
        time_entry_enable_billable_tracking: systemSettings.time_entry_enable_billable_tracking,
        time_entry_max_hours_per_day: systemSettings.time_entry_max_hours_per_day,
        time_entry_allow_future_dates: systemSettings.time_entry_allow_future_dates,
        default_currency_code: systemSettings.default_currency_code,
        allowed_currencies: systemSettings.allowed_currencies,
        date_format: systemSettings.date_format,
        time_zone: systemSettings.time_zone,
        company_name: systemSettings.company_name,
        company_org_number: systemSettings.company_org_number,
        company_email: systemSettings.company_email,
        company_phone: systemSettings.company_phone,
      });

      const updatedSettings = await partnerPortalApi.settings.getSystemSettings();
      setSystemSettings(updatedSettings);
      setOriginalSettings(updatedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('admin.error.failed_save_settings'));
    } finally {
      setSaving(false);
    }
  };

  const handleResetTimeEntryRules = () => {
    if (originalSettings) {
      setSystemSettings({ ...originalSettings });
    }
  };

  const resetNewWorkType = () => {
    setNewWorkType({
      name: '',
      description: '',
      credits_per_hour: 1.0,
      internal_cost_factor: 1.0,
      requires_plan_level: 'starter' as PlanLevel,
      billable: true,
      allowed_plan_levels: ['starter', 'growth', 'scale', 'custom'] as PlanLevel[],
      category: 'operational',
      is_active: true,
    });
  };

  const openEditModal = (workType: WorkType) => {
    setEditingWorkType(workType);
    setNewWorkType(workType);
    setShowWorkTypeModal(true);
  };

  const closeModal = () => {
    setShowWorkTypeModal(false);
    setEditingWorkType(null);
    resetNewWorkType();
  };

  const hasUnsavedChanges = () => {
    if (!systemSettings || !originalSettings) return false;
    return JSON.stringify(systemSettings) !== JSON.stringify(originalSettings);
  };

  const getPlanLevelBadgeColor = (level: PlanLevel) => {
    switch (level) {
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'scale': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'strategic': return 'bg-purple-100 text-purple-800';
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-cyan-100 text-cyan-800';
      case 'administrative': return 'bg-gray-100 text-gray-800';
      case 'leadership': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar inställningar...</p>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title={t('admin.settings.title')}
          description="Configure Partner Portal system settings and work types"
        />

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">{t('admin.success.settings_saved')}</span>
          </div>
        )}

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-600" />
                  Account Security
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your account password and security settings
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-xs text-gray-500 mt-1">Update your account password</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/password-reset')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                {t('admin.password.title')}
              </button>
            </div>
          </div>
        </div>

        {/* Currency & Company Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  Currency & Company Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure default currency, company information, and display preferences
                </p>
              </div>
            </div>
          </div>

          {systemSettings && (
            <div className="p-6 space-y-6">
              {/* Currency Settings */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Currency Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={systemSettings.default_currency_code}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        default_currency_code: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                    >
                      <option value="SEK">SEK (Swedish Krona)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="NOK">NOK (Norwegian Krone)</option>
                      <option value="DKK">DKK (Danish Krone)</option>
                    </select>
                    <div className="flex items-start mt-2">
                      <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        Default currency used for invoices, contracts, and pricing displays
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select
                      value={systemSettings.time_zone}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        time_zone: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                    >
                      <option value="Europe/Stockholm">Europe/Stockholm (Sweden)</option>
                      <option value="Europe/Oslo">Europe/Oslo (Norway)</option>
                      <option value="Europe/Copenhagen">Europe/Copenhagen (Denmark)</option>
                      <option value="Europe/London">Europe/London (UK)</option>
                      <option value="Europe/Berlin">Europe/Berlin (Germany)</option>
                      <option value="UTC">UTC (Universal)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={systemSettings.company_name}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        company_name: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Number
                    </label>
                    <input
                      type="text"
                      value={systemSettings.company_org_number || ''}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        company_org_number: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="556123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email
                    </label>
                    <input
                      type="email"
                      value={systemSettings.company_email}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        company_email: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="admin@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Phone
                    </label>
                    <input
                      type="tel"
                      value={systemSettings.company_phone || ''}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        company_phone: e.target.value,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="+46 70 123 45 67"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button for Currency & Company */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleResetTimeEntryRules}
                  disabled={!hasUnsavedChanges() || saving}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4 mr-2 inline" />
                  Reset Changes
                </button>
                <button
                  onClick={handleSaveTimeEntryRules}
                  disabled={!hasUnsavedChanges() || saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Currency & Company Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Work Types Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Work Types</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage work type definitions that control credits calculation and time reporting
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadAuditLog('work_type')}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </button>
                <button
                  onClick={() => setShowWorkTypeModal(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Type
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {workTypes.map((type) => {
                const usage = workTypeUsageInfo.get(type.id);
                return (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg transition-all ${
                      type.is_active
                        ? 'border-gray-200 bg-white hover:border-primary-300'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{type.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            type.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {type.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {type.category && (
                            <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getCategoryBadgeColor(type.category)}`}>
                              {type.category}
                            </span>
                          )}
                          {type.billable && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                              Billable
                            </span>
                          )}
                          {usage?.is_used && (
                            <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">
                              In Use ({usage.usage_count} entries)
                            </span>
                          )}
                        </div>
                        {type.description && (
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Credits Weight</span>
                            <p className="text-sm font-semibold text-gray-900">{type.credits_per_hour}x</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Cost Factor</span>
                            <p className="text-sm font-semibold text-gray-900">{type.internal_cost_factor}x</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Min. Plan Level</span>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getPlanLevelBadgeColor(type.requires_plan_level)}`}>
                              {type.requires_plan_level}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Allowed Plans</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {type.allowed_plan_levels.map(level => (
                                <span key={level} className={`px-1.5 py-0.5 text-xs font-medium rounded capitalize ${getPlanLevelBadgeColor(level)}`}>
                                  {level}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {type.updated_at && (
                          <p className="text-xs text-gray-500 mt-3">
                            Last updated: {new Date(type.updated_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openEditModal(type)}
                        className="ml-4 p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {workTypes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No work types configured</p>
                  <button
                    onClick={() => setShowWorkTypeModal(true)}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Add your first work type
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Time Entry Rules</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure validation rules and constraints for time reporting
                </p>
              </div>
              <button
                onClick={() => loadAuditLog('time_entry_rules')}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <History className="h-4 w-4 mr-2" />
                View History
              </button>
            </div>
          </div>

          {systemSettings && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edit Window (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={systemSettings.time_entry_edit_window_days}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    time_entry_edit_window_days: parseInt(e.target.value) || 0,
                  })}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                <div className="flex items-start mt-2">
                  <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Partners can edit time entries within this many days after creation. Set to 0 to allow editing anytime.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Hours Per Day
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={systemSettings.time_entry_max_hours_per_day}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    time_entry_max_hours_per_day: parseFloat(e.target.value) || 24,
                  })}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                <div className="flex items-start mt-2">
                  <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Maximum hours that can be logged in a single day per partner.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={systemSettings.time_entry_require_project}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      time_entry_require_project: e.target.checked,
                    })}
                    className="mt-1 h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Require project for all time entries
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      When enabled, partners must select a project when logging time. Prevents time entries without project assignment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={systemSettings.time_entry_enable_billable_tracking}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      time_entry_enable_billable_tracking: e.target.checked,
                    })}
                    className="mt-1 h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Enable billable/non-billable tracking
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Shows billable toggle in time entry form. Affects credits calculation and margin reporting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={systemSettings.time_entry_allow_future_dates}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      time_entry_allow_future_dates: e.target.checked,
                    })}
                    className="mt-1 h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Allow future dates
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      When enabled, partners can log time for future dates (e.g., planned work).
                    </p>
                  </div>
                </div>
              </div>

              {systemSettings.updated_at && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Last saved: {new Date(systemSettings.updated_at).toLocaleString()}
                    {systemSettings.settings_version && ` (Version ${systemSettings.settings_version})`}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveTimeEntryRules}
                  disabled={saving || !hasUnsavedChanges()}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                {hasUnsavedChanges() && (
                  <button
                    onClick={handleResetTimeEntryRules}
                    className="flex items-center px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showWorkTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingWorkType ? 'Edit Work Type' : 'Create Work Type'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newWorkType.name}
                  onChange={(e) => setNewWorkType({ ...newWorkType, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="e.g., Strategic Planning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newWorkType.description || ''}
                  onChange={(e) => setNewWorkType({ ...newWorkType, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Describe what this work type includes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits Weight (Multiplier) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={newWorkType.credits_per_hour}
                    onChange={(e) => setNewWorkType({ ...newWorkType, credits_per_hour: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">1 hour = X credits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Cost Factor
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={newWorkType.internal_cost_factor}
                    onChange={(e) => setNewWorkType({ ...newWorkType, internal_cost_factor: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Partner cost multiplier</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newWorkType.category || 'operational'}
                    onChange={(e) => setNewWorkType({ ...newWorkType, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="strategic">Strategic</option>
                    <option value="operational">Operational</option>
                    <option value="technical">Technical</option>
                    <option value="administrative">Administrative</option>
                    <option value="leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Plan Level
                  </label>
                  <select
                    value={newWorkType.requires_plan_level}
                    onChange={(e) => setNewWorkType({ ...newWorkType, requires_plan_level: e.target.value as PlanLevel })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Plan Levels
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['starter', 'growth', 'scale', 'custom'] as PlanLevel[]).map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newWorkType.allowed_plan_levels?.includes(level)}
                        onChange={(e) => {
                          const current = newWorkType.allowed_plan_levels || [];
                          if (e.target.checked) {
                            setNewWorkType({
                              ...newWorkType,
                              allowed_plan_levels: [...current, level],
                            });
                          } else {
                            setNewWorkType({
                              ...newWorkType,
                              allowed_plan_levels: current.filter(l => l !== level),
                            });
                          }
                        }}
                        className="h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newWorkType.billable}
                    onChange={(e) => setNewWorkType({ ...newWorkType, billable: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Billable by default</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newWorkType.is_active}
                    onChange={(e) => setNewWorkType({ ...newWorkType, is_active: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              {editingWorkType && workTypeUsageInfo.get(editingWorkType.id)?.is_used && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Work Type In Use</p>
                      <p className="text-sm text-amber-700 mt-1">
                        This work type has been used in {workTypeUsageInfo.get(editingWorkType.id)?.usage_count} time entries.
                        Changes will affect credits calculation and reporting.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editingWorkType ? handleUpdateWorkType(editingWorkType.id, newWorkType) : handleCreateWorkType()}
                disabled={saving || !newWorkType.name || !newWorkType.credits_per_hour}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingWorkType ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuditLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {showAuditLog === 'work_types' ? 'Work Types' : 'Time Entry Rules'} Change History
              </h3>
              <button
                onClick={() => setShowAuditLog(null)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {auditLog.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No changes recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLog.map((log) => (
                    <div key={log.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{log.change_description || log.field_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {log.old_value ? (
                              <>
                                <span className="text-red-600">{log.old_value}</span>
                                {' → '}
                                <span className="text-green-600">{log.new_value}</span>
                              </>
                            ) : (
                              <span className="text-green-600">{log.new_value}</span>
                            )}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.changed_at).toLocaleString()}
                        </span>
                      </div>
                      {log.changed_by_email && (
                        <p className="text-xs text-gray-500">
                          Changed by: {log.changed_by_email}
                        </p>
                      )}
                      {log.change_reason && (
                        <p className="text-xs text-gray-600 mt-1">
                          Reason: {log.change_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{showConfirmDialog.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{showConfirmDialog.message}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog({ ...showConfirmDialog, show: false })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showConfirmDialog.onConfirm}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
