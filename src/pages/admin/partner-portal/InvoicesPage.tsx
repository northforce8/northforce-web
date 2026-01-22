import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Download, Send, DollarSign, AlertTriangle } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { InvoiceStatusBadge } from '../../../components/admin/InvoiceStatusBadge';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { useToast } from '../../../contexts/ToastContext';
import { logAdminError } from '../../../lib/admin-error-logger';
import { safeString, safeNumber } from '../../../lib/data-validators';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Modal } from '../../../components/admin/ui/Modal';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function InvoicesPage() {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, customerFilter]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (customerFilter !== 'all') filters.customerId = customerFilter;

      const [invoicesData, customersData] = await Promise.all([
        partnerPortalApi.invoices.getAll(filters),
        partnerPortalApi.customers.getAll(),
      ]);

      const safeInvoices = (invoicesData || []).map(i => ({
        ...i,
        invoice_number: safeString(i.invoice_number, '—'),
        total_amount: safeNumber(i.total_amount, 0),
        status: safeString(i.status, 'draft'),
        invoice_date: i.invoice_date || new Date().toISOString(),
        due_date: i.due_date || new Date().toISOString(),
        currency_code: safeString(i.currency_code, 'SEK'),
      }));

      setInvoices(safeInvoices);
      setCustomers(customersData || []);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        route: '/admin/partner-portal/invoices',
        action: 'loadData',
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError(err instanceof Error ? err.message : t('admin.error.failed_load_invoices'));
      setInvoices([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loading.invoices')}</p>
        </div>
      </div>
    );
  }


  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      invoice.invoice_number?.toLowerCase().includes(search) ||
      invoice.customer?.company_name?.toLowerCase().includes(search)
    );
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const paidAmount = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const overdueAmount = filteredInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title={t('admin.invoices.title')}
        description={t('admin.invoices.description')}
        icon={FileText}
        action={{
          label: t('admin.invoices.add'),
          onClick: () => setShowCreateModal(true),
          icon: Plus
        }}
        help={PAGE_HELP_CONTENT.invoices}
      />

      <div className="mb-6">
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <DollarSign className="h-5 w-5" />
          {t('admin.invoices.generate_from_time')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.invoices.total_invoiced')}</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            <CurrencyDisplay amount={totalAmount} currency="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.invoices.paid')}</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            <CurrencyDisplay amount={paidAmount} currency="SEK" />
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.invoices.overdue')}</h3>
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            <CurrencyDisplay amount={overdueAmount} currency="SEK" />
          </p>
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
                  placeholder={t('admin.invoices.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('admin.invoices.status_all')}</option>
                <option value="draft">{t('admin.invoices.status_draft')}</option>
                <option value="sent">{t('admin.invoices.status_sent')}</option>
                <option value="paid">{t('admin.invoices.status_paid')}</option>
                <option value="overdue">{t('admin.invoices.status_overdue')}</option>
                <option value="cancelled">{t('admin.invoices.status_cancelled')}</option>
              </select>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('admin.invoices.all_customers')}</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">{t('admin.loading.invoices')}</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new invoice.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/partner-portal/invoices/${invoice.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {invoice.invoice_number || '—'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customer?.company_name || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('sv-SE') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('sv-SE') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <CurrencyDisplay
                        amount={invoice.total_amount}
                        currency={invoice.currency_code}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/partner-portal/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      {invoice.status === 'draft' && (
                        <button
                          onClick={async () => {
                            if (confirm('Send this invoice?')) {
                              try {
                                await partnerPortalApi.invoices.updateStatus(invoice.id, 'sent');
                                await loadData();
                              } catch (err) {
                                console.error('Failed to send invoice:', err);
                                alert('Failed to send invoice. Please try again.');
                              }
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          customers={customers}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {showGenerateModal && (
        <GenerateInvoiceModal
          customers={customers}
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function CreateInvoiceModal({ customers, onClose, onSuccess }: any) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 25,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await partnerPortalApi.invoices.create(formData);
      toast.success('Invoice created successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Failed to create invoice');
    } finally{
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Invoice">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              value={formData.tax_rate}
              onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
          </div>
        <div className="flex gap-3 justify-end pt-4">
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
            {saving ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function GenerateInvoiceModal({ customers, onClose, onSuccess }: any) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    customerId: '',
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 25,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await partnerPortalApi.invoices.generateFromTimeEntries(formData);
      toast.success('Invoice generated successfully from time entries');
      onSuccess();
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast.error(error.message || 'Failed to generate invoice');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Generate Invoice from Time Entries">
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select customer...</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.company_name || 'Unknown'}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period Start</label>
              <input
                type="date"
                value={formData.periodStart}
                onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period End</label>
              <input
                type="date"
                value={formData.periodEnd}
                onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
          </div>
        <div className="flex gap-3 justify-end pt-4">
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
            {saving ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
