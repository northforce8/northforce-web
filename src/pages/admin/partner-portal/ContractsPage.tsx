import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSignature, Plus, Search, FileText, AlertTriangle } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { ContractStatusBadge } from '../../../components/admin/ContractStatusBadge';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { PageHeader } from '../../../components/admin/PageHeader';
import { useToast } from '../../../contexts/ToastContext';
import { logAdminError } from '../../../lib/admin-error-logger';
import { safeString } from '../../../lib/data-validators';
import { Modal } from '../../../components/admin/ui/Modal';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ContractsPage() {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (typeFilter !== 'all') filters.type = typeFilter;

      const [contractsData, customersData, templatesData] = await Promise.all([
        partnerPortalApi.contracts.getAll(filters),
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.contractTemplates.getAll(),
      ]);

      const safeContracts = (contractsData || []).map(c => ({
        ...c,
        contract_number: safeString(c.contract_number, '—'),
        title: safeString(c.title, '—'),
        contract_type: safeString(c.contract_type, 'other'),
        start_date: c.start_date || new Date().toISOString(),
        status: safeString(c.status, 'draft'),
      }));

      setContracts(safeContracts);
      setCustomers(customersData || []);
      setTemplates(templatesData || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/contracts',
        action: 'loadData',
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda kontrakt. Försök igen.');
      setContracts([]);
      setCustomers([]);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loading.contracts')}</p>
        </div>
      </div>
    );
  }


  const filteredContracts = contracts.filter(contract => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      contract.contract_number?.toLowerCase().includes(search) ||
      contract.title?.toLowerCase().includes(search) ||
      contract.customer?.company_name?.toLowerCase().includes(search)
    );
  });

  const activeContracts = filteredContracts.filter(c => c.status === 'active').length;
  const expiringContracts = filteredContracts.filter(c => {
    if (!c.end_date || c.status !== 'active') return false;
    const daysUntilExpiry = Math.ceil((new Date(c.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title={t('admin.contracts.title')}
        description={t('admin.contracts.description')}
        action={{
          label: t('admin.contracts.add'),
          onClick: () => setShowCreateModal(true),
          icon: Plus,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Contracts</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{filteredContracts.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</h3>
            <FileText className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{activeContracts}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expiring Soon</h3>
            <FileText className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{expiringContracts}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="sent">Sent</option>
                <option value="signed">Signed</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-600"
              >
                <option value="all">All Types</option>
                <option value="msa">MSA</option>
                <option value="sow">SOW</option>
                <option value="nda">NDA</option>
                <option value="amendment">Amendment</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading contracts...</div>
        ) : filteredContracts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new contract.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/partner-portal/contracts/${contract.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {contract.contract_number || '—'}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">{contract.title || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.customer?.company_name || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 uppercase">{(contract.contract_type || 'other').toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.start_date ? new Date(contract.start_date).toLocaleDateString('sv-SE') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.end_date ? new Date(contract.end_date).toLocaleDateString('sv-SE') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.contract_value ? (
                        <CurrencyDisplay amount={contract.contract_value} currency={contract.currency || 'SEK'} />
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ContractStatusBadge status={contract.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/partner-portal/contracts/${contract.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateContractModal
          customers={customers}
          templates={templates}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function CreateContractModal({ customers, templates, onClose, onSuccess }: any) {
  const toast = useToast();
  const [useTemplate, setUseTemplate] = useState(true);
  const [formData, setFormData] = useState({
    customer_id: '',
    template_id: '',
    contract_type: 'msa',
    title: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    value: '',
    variables: {},
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      if (useTemplate && formData.template_id) {
        await partnerPortalApi.contracts.generateFromTemplate({
          customerId: formData.customer_id,
          templateId: formData.template_id,
          variables: formData.variables,
          startDate: formData.start_date,
          endDate: formData.end_date || undefined,
          value: formData.value ? Number(formData.value) : undefined,
        });
      } else {
        await partnerPortalApi.contracts.create({
          customer_id: formData.customer_id,
          contract_type: formData.contract_type as any,
          title: formData.title,
          start_date: formData.start_date,
          end_date: formData.end_date || undefined,
          value: formData.value ? Number(formData.value) : undefined,
        });
      }
      toast.success('Contract created successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating contract:', error);
      toast.error(error.message || 'Failed to create contract');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Contract">
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setUseTemplate(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                useTemplate
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              From Template
            </button>
            <button
              type="button"
              onClick={() => setUseTemplate(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                !useTemplate
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manual
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select customer...</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.company_name || 'Unknown'}</option>
              ))}
            </select>
          </div>

          {useTemplate ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                value={formData.template_id}
                onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select template...</option>
                {templates.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.template_name || 'Unnamed Template'}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="msa">Master Service Agreement (MSA)</option>
                  <option value="sow">Statement of Work (SOW)</option>
                  <option value="nda">Non-Disclosure Agreement (NDA)</option>
                  <option value="amendment">Amendment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (Optional)</label>
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Contract'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
