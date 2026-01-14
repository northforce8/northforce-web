import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, X, Plus, Trash2, Edit2, Download, Mail, AlertTriangle } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { InvoiceStatusBadge } from '../../../components/admin/InvoiceStatusBadge';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { InvoicePDFPreview } from '../../../components/admin/InvoicePDFPreview';
import InvoiceValidationAI from '../../../components/admin/InvoiceValidationAI';
import { generateInvoicePDF, downloadPDF } from '../../../lib/pdf-service';
import { useToast } from '../../../contexts/ToastContext';

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [invoice, setInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLineItem, setShowAddLineItem] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  async function loadInvoice() {
    try {
      setLoading(true);
      setError(null);
      const data = await partnerPortalApi.invoices.getById(invoiceId!);
      setInvoice(data);
      setLineItems(data?.line_items || []);
    } catch (err) {
      console.error('Error loading invoice:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda faktura. Försök igen.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!confirm(`Change status to ${newStatus}?`)) return;
    try {
      await partnerPortalApi.invoices.updateStatus(invoiceId!, newStatus as any);
      loadInvoice();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  }

  async function handleDeleteLineItem(itemId: string) {
    if (!confirm('Delete this line item?')) return;
    try {
      await partnerPortalApi.invoiceLineItems.delete(itemId);
      loadInvoice();
    } catch (error) {
      console.error('Error deleting line item:', error);
      alert('Failed to delete line item');
    }
  }

  async function handleSendEmail() {
    if (!invoice?.customer?.contact_email) {
      alert('Customer has no email address');
      return;
    }

    if (!confirm(`Send invoice to ${invoice.customer.contact_email}?`)) return;

    try {
      setSendingEmail(true);

      const pdfBlob = generateInvoicePDF(invoice);
      const reader = new FileReader();

      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            invoiceNumber: invoice.invoice_number,
            customerEmail: invoice.customer.contact_email,
            customerName: invoice.customer.company_name,
            invoiceDate: new Date(invoice.invoice_date).toLocaleDateString('sv-SE'),
            dueDate: new Date(invoice.due_date).toLocaleDateString('sv-SE'),
            totalAmount: invoice.total_amount,
            currency: invoice.currency_code,
            pdfBase64,
            lineItems: lineItems.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              amount: item.amount,
            })),
          }),
        }
      );

      const result = await response.json();

      if (result.requiresConfiguration) {
        // Email service not configured - show helpful message
        alert(
          'Email service needs configuration.\n\n' +
          result.configurationSteps.join('\n') +
          '\n\nInvoice status will be updated, but email was not sent.'
        );
      } else if (!result.success) {
        throw new Error(result.message || 'Failed to send email');
      }

      // Update invoice status to "sent"
      await partnerPortalApi.invoices.updateStatus(invoiceId!, 'sent');

      if (result.success) {
        alert(`Invoice sent successfully to ${invoice.customer.contact_email}`);
      }

      setShowPDFPreview(false);
      loadInvoice();
    } catch (error: any) {
      console.error('Error sending invoice:', error);
      alert(`Failed to send invoice: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar faktura...</p>
        </div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadInvoice}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
          <Link
            to="/admin/partner-portal/invoices"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = invoice.status === 'draft';
  const canSend = invoice.status === 'draft';
  const canMarkPaid = invoice.status === 'sent' || invoice.status === 'overdue';

  return (
    <>
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/partner-portal/invoices"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h1>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        <div className="flex gap-2">
          {canSend && (
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              {sendingEmail ? 'Sending...' : 'Send Invoice via Email'}
            </button>
          )}
          {canMarkPaid && (
            <button
              onClick={() => handleStatusChange('paid')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Paid
            </button>
          )}
          <button
            onClick={async () => {
              try {
                setGeneratingPDF(true);
                const pdfBlob = await generateInvoicePDF(invoice);
                downloadPDF(pdfBlob, `invoice-${invoice.invoice_number}.pdf`);
              } catch (error: any) {
                console.error('Error generating PDF:', error);
                alert(`Failed to generate PDF: ${error.message}`);
              } finally {
                setGeneratingPDF(false);
              }
            }}
            disabled={generatingPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {canSend && (
        <div className="mb-8">
          <InvoiceValidationAI invoiceId={invoiceId!} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Invoice Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(invoice.invoice_date).toLocaleDateString('sv-SE')}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(invoice.due_date).toLocaleDateString('sv-SE')}
                </dd>
              </div>
              {invoice.billing_period_start && (
                <>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Period Start</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(invoice.billing_period_start).toLocaleDateString('sv-SE')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Period End</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(invoice.billing_period_end).toLocaleDateString('sv-SE')}
                    </dd>
                  </div>
                </>
              )}
              {invoice.notes && (
                <div className="col-span-2">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
              {canEdit && (
                <button
                  onClick={() => setShowAddLineItem(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    {canEdit && <th className="px-6 py-3"></th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
                        {item.project && (
                          <div className="text-xs text-gray-500 mt-1 font-medium">
                            Project: {item.project.project_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        <CurrencyDisplay amount={item.unit_price} currency={invoice.currency_code} />
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        <CurrencyDisplay amount={item.amount} currency={invoice.currency_code} />
                      </td>
                      {canEdit && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteLineItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer</h2>
            <Link
              to={`/admin/partner-portal/customers/${invoice.customer.id}`}
              className="block hover:bg-gray-50 -m-2 p-2 rounded"
            >
              <div className="font-semibold text-gray-900">{invoice.customer.company_name}</div>
              {invoice.customer.org_number && (
                <div className="text-sm text-gray-500 mt-1 font-medium">Org: {invoice.customer.org_number}</div>
              )}
              {invoice.customer.contact_email && (
                <div className="text-sm text-gray-500 mt-1 font-medium">{invoice.customer.contact_email}</div>
              )}
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Summary</h2>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">Subtotal</dt>
                <dd className="font-semibold text-gray-900">
                  <CurrencyDisplay amount={invoice.subtotal} currency={invoice.currency_code} />
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">Tax ({invoice.tax_rate}%)</dt>
                <dd className="font-semibold text-gray-900">
                  <CurrencyDisplay amount={invoice.tax_amount} currency={invoice.currency_code} />
                </dd>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <dt className="text-gray-900">Total</dt>
                <dd className="text-gray-900">
                  <CurrencyDisplay amount={invoice.total_amount} currency={invoice.currency_code} />
                </dd>
              </div>
            </dl>
          </div>

          {invoice.sent_date && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Sent Information</h3>
              <div className="text-sm text-blue-700 font-medium">
                Sent on {new Date(invoice.sent_date).toLocaleDateString('sv-SE')}
              </div>
              {invoice.sent_by_user && (
                <div className="text-sm text-blue-600 mt-1 font-medium">
                  by {invoice.sent_by_user.email}
                </div>
              )}
            </div>
          )}

          {invoice.paid_date && (
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Payment Information</h3>
              <div className="text-sm text-green-700 font-medium">
                Paid on {new Date(invoice.paid_date).toLocaleDateString('sv-SE')}
              </div>
              {invoice.payment_method && (
                <div className="text-sm text-green-600 mt-1 font-medium">
                  Method: {invoice.payment_method}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {showAddLineItem && (
      <AddLineItemModal
        invoiceId={invoiceId!}
        currency={invoice.currency_code}
        onClose={() => setShowAddLineItem(false)}
        onSuccess={() => {
          setShowAddLineItem(false);
          loadInvoice();
        }}
      />
    )}

    {showPDFPreview && (
      <InvoicePDFPreview
        invoice={invoice}
        onClose={() => setShowPDFPreview(false)}
        onSendEmail={canSend ? handleSendEmail : undefined}
      />
    )}
    </>
  );
}

function AddLineItemModal({ invoiceId, currency, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    description: '',
    quantity: 1,
    unit_price: 0,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await partnerPortalApi.invoiceLineItems.create({
        invoice_id: invoiceId,
        ...formData,
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding line item:', error);
      alert('Failed to add line item');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Line Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ({currency})</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium text-gray-900">
                <CurrencyDisplay
                  amount={formData.quantity * formData.unit_price}
                  currency={currency}
                />
              </span>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
