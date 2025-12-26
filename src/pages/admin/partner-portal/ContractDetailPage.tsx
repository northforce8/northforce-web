import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, FileText, Download, History, GitBranch, Edit } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { ContractStatusBadge } from '../../../components/admin/ContractStatusBadge';
import ContractValidationAI from '../../../components/admin/ContractValidationAI';
import { CurrencyDisplay } from '../../../components/admin/CurrencyDisplay';
import { generateContractPDF, downloadPDF } from '../../../lib/pdf-service';

export default function ContractDetailPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  async function loadContract() {
    try {
      setLoading(true);
      const [contractData, versionsData] = await Promise.all([
        partnerPortalApi.contracts.getById(contractId!),
        partnerPortalApi.contracts.getVersionHistory(contractId!),
      ]);
      setContract(contractData);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!confirm(`Change status to ${newStatus}?`)) return;
    try {
      // If sending contract, send email first
      if (newStatus === 'sent' && contract?.customer?.contact_email) {
        const pdfBlob = generateContractPDF(contract);
        const reader = new FileReader();

        const pdfBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(pdfBlob);
        });

        const emailResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contract-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              contractNumber: contract.contract_number,
              customerEmail: contract.customer.contact_email,
              customerName: contract.customer.company_name,
              contractType: contract.contract_type,
              title: contract.title,
              startDate: new Date(contract.start_date).toLocaleDateString('sv-SE'),
              endDate: contract.end_date ? new Date(contract.end_date).toLocaleDateString('sv-SE') : undefined,
              value: contract.value,
              currency: contract.currency_code || 'SEK',
              pdfBase64,
            }),
          }
        );

        const emailResult = await emailResponse.json();

        if (emailResult.requiresConfiguration) {
          // Email service not configured - show helpful message
          alert(
            'Email service needs configuration.\n\n' +
            emailResult.configurationSteps.join('\n') +
            '\n\nContract status will be updated, but email was not sent.'
          );
        } else if (!emailResult.success) {
          console.error('Failed to send contract email:', emailResult);
          alert('Warning: Failed to send email. Contract status will still be updated.');
        } else {
          alert(`Contract sent successfully to ${contract.customer.contact_email}`);
        }
      }

      // Update contract status
      await partnerPortalApi.contracts.updateStatus(contractId!, newStatus as any);
      loadContract();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading contract...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Contract not found</p>
          <Link to="/admin/partner-portal/contracts" className="text-blue-600 hover:text-blue-900 mt-2 inline-block">
            ← Back to contracts
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = contract.status === 'draft' || contract.status === 'review';
  const canSend = contract.status === 'draft' || contract.status === 'review';
  const canSign = contract.status === 'sent';
  const canActivate = contract.status === 'signed';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/partner-portal/contracts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to contracts
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{contract.contract_number}</h1>
          <ContractStatusBadge status={contract.status} />
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <History className="h-4 w-4 mr-2" />
            Version History ({versions.length})
          </button>
          {canSend && (
            <button
              onClick={() => handleStatusChange('sent')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </button>
          )}
          {canSign && (
            <button
              onClick={() => handleStatusChange('signed')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Signed
            </button>
          )}
          {canActivate && (
            <button
              onClick={() => handleStatusChange('active')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Activate Contract
            </button>
          )}
          <button
            onClick={async () => {
              try {
                setGeneratingPDF(true);
                const pdfBlob = await generateContractPDF(contract);
                downloadPDF(pdfBlob, `contract-${contract.contract_number}.pdf`);
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

      {/* AI Contract Validation - Compliance & Risk Check */}
      {(canEdit || canSend || canSign || canActivate) && (
        <div className="mb-6">
          <ContractValidationAI contractId={contractId!} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Contract Type</dt>
                <dd className="mt-1 text-sm text-gray-900 uppercase">{contract.contract_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(contract.start_date).toLocaleDateString('sv-SE')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {contract.end_date ? new Date(contract.end_date).toLocaleDateString('sv-SE') : 'No end date'}
                </dd>
              </div>
              {contract.value && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contract Value</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    <CurrencyDisplay amount={contract.value} currency={contract.currency_code || 'SEK'} />
                  </dd>
                </div>
              )}
              {contract.auto_renew !== null && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Auto-Renew</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.auto_renew ? 'Yes' : 'No'}</dd>
                </div>
              )}
              {contract.notice_period_days && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notice Period</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.notice_period_days} days</dd>
                </div>
              )}
              {contract.template && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Based on Template</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.template.template_name}</dd>
                </div>
              )}
            </dl>
          </div>

          {contract.content && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Content</h2>
              <div className="prose max-w-none text-sm text-gray-700 whitespace-pre-wrap">
                {contract.content}
              </div>
            </div>
          )}

          {contract.notes && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700">{contract.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
            <Link
              to={`/admin/partner-portal/customers/${contract.customer.id}`}
              className="block hover:bg-gray-50 -m-2 p-2 rounded"
            >
              <div className="font-medium text-gray-900">{contract.customer.company_name}</div>
              {contract.customer.org_number && (
                <div className="text-sm text-gray-500 mt-1">Org: {contract.customer.org_number}</div>
              )}
              {contract.customer.contact_email && (
                <div className="text-sm text-gray-500 mt-1">{contract.customer.contact_email}</div>
              )}
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Created</div>
                <div className="text-sm text-gray-900">
                  {new Date(contract.created_at).toLocaleDateString('sv-SE')}
                </div>
                {contract.created_by_user && (
                  <div className="text-xs text-gray-500">{contract.created_by_user.email}</div>
                )}
              </div>

              {contract.sent_date && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Sent</div>
                  <div className="text-sm text-gray-900">
                    {new Date(contract.sent_date).toLocaleDateString('sv-SE')}
                  </div>
                </div>
              )}

              {contract.signed_date && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Signed</div>
                  <div className="text-sm text-gray-900">
                    {new Date(contract.signed_date).toLocaleDateString('sv-SE')}
                  </div>
                  {contract.customer_signatory_name && (
                    <div className="text-xs text-gray-500 mt-1">
                      by {contract.customer_signatory_name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {contract.status === 'active' && contract.end_date && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Contract Period</h3>
              <div className="text-sm text-blue-700">
                {(() => {
                  const today = new Date();
                  const endDate = new Date(contract.end_date);
                  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  if (daysRemaining < 0) {
                    return 'Contract has expired';
                  } else if (daysRemaining === 0) {
                    return 'Contract expires today';
                  } else if (daysRemaining <= 30) {
                    return `${daysRemaining} days remaining`;
                  } else {
                    return `${Math.floor(daysRemaining / 30)} months remaining`;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {showVersions && versions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GitBranch className="h-5 w-5 mr-2 text-gray-500" />
              Version History
            </h2>
          </div>
          <div className="space-y-3">
            {versions.map((version) => (
              <div key={version.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Version {version.version_number}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(version.created_at).toLocaleDateString('sv-SE')} at{' '}
                        {new Date(version.created_at).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {version.created_by_user && (
                        <span className="text-sm text-gray-500">
                          by {version.created_by_user.name || version.created_by_user.email}
                        </span>
                      )}
                    </div>
                    {version.change_summary && (
                      <p className="text-sm text-gray-700 mb-1">{version.change_summary}</p>
                    )}
                    {version.change_reason && (
                      <p className="text-xs text-gray-500">{version.change_reason}</p>
                    )}
                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Status:</span> {version.status}
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>{' '}
                        {new Date(version.start_date).toLocaleDateString('sv-SE')}
                      </div>
                      {version.contract_value && (
                        <div>
                          <span className="font-medium">Value:</span>{' '}
                          <CurrencyDisplay amount={version.contract_value} currency={version.currency_code || 'SEK'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEditModal && <EditContractModal contract={contract} onClose={() => setShowEditModal(false)} onSuccess={() => { setShowEditModal(false); loadContract(); }} />}
    </div>
  );
}

function EditContractModal({ contract, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: contract.title || '',
    start_date: contract.start_date || '',
    end_date: contract.end_date || '',
    value: contract.contract_value || '',
    content: contract.content || '',
    notes: contract.notes || '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await partnerPortalApi.contracts.update(contract.id, {
        title: formData.title,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        value: formData.value ? Number(formData.value) : undefined,
        content: formData.content,
        notes: formData.notes,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating contract:', error);
      alert('Failed to update contract');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Contract</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-64 font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
