import React, { useRef } from 'react';
import { X, Download, Send, Printer } from 'lucide-react';
import { CurrencyDisplay } from './CurrencyDisplay';

interface InvoicePDFPreviewProps {
  invoice: any;
  onClose: () => void;
  onSendEmail?: () => void;
}

/**
 * Professional Invoice PDF Preview
 * Can be printed to PDF or sent via email
 */
export const InvoicePDFPreview: React.FC<InvoicePDFPreviewProps> = ({
  invoice,
  onClose,
  onSendEmail,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Trigger browser print dialog with PDF as default
    window.print();
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
          {/* Header Actions - Hidden in print */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
            <div className="flex items-center gap-2">
              {onSendEmail && (
                <button
                  onClick={onSendEmail}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              )}
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Invoice Content - Optimized for print */}
          <div
            ref={printRef}
            className="p-8 bg-white print:p-0"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Company Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">Northforce AB</p>
                  <p>Org.nr: 559123-4567</p>
                  <p>Drottninggatan 33</p>
                  <p>111 51 Stockholm, Sweden</p>
                  <p>contact@northforce.com</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-900">Invoice #:</span>{' '}
                    {invoice.invoice_number}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{' '}
                    {new Date(invoice.invoice_date).toLocaleDateString('sv-SE')}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Due Date:</span>{' '}
                    {new Date(invoice.due_date).toLocaleDateString('sv-SE')}
                  </p>
                  {invoice.billing_period_start && (
                    <p>
                      <span className="font-medium text-gray-900">Period:</span>{' '}
                      {new Date(invoice.billing_period_start).toLocaleDateString('sv-SE')} -{' '}
                      {new Date(invoice.billing_period_end).toLocaleDateString('sv-SE')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{invoice.customer?.company_name}</p>
                {invoice.customer?.org_number && <p>Org.nr: {invoice.customer.org_number}</p>}
                {invoice.customer?.billing_address && <p>{invoice.customer.billing_address}</p>}
                {invoice.customer?.contact_email && <p>{invoice.customer.contact_email}</p>}
                {invoice.customer?.contact_phone && <p>{invoice.customer.contact_phone}</p>}
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-20">
                    Qty
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-32">
                    Unit Price
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm text-gray-700">
                      <div className="font-medium text-gray-900">{item.description}</div>
                      {item.project && (
                        <div className="text-xs text-gray-500 mt-1">
                          Project: {item.project.project_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-right text-sm text-gray-700">
                      <CurrencyDisplay amount={item.unit_price} currency={invoice.currency_code} />
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      <CurrencyDisplay amount={item.amount} currency={invoice.currency_code} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      <CurrencyDisplay amount={invoice.subtotal} currency={invoice.currency_code} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                    <span className="font-medium text-gray-900">
                      <CurrencyDisplay amount={invoice.tax_amount} currency={invoice.currency_code} />
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-900">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">
                      <CurrencyDisplay amount={invoice.total_amount} currency={invoice.currency_code} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Instructions:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Bank: Nordea Bank AB</p>
                <p>Account: 1234 56 78901</p>
                <p>IBAN: SE45 5000 0000 0583 9825 7466</p>
                <p>BIC/SWIFT: NDEASESS</p>
                <p className="mt-2 text-gray-600">
                  Please reference invoice number {invoice.invoice_number} in your payment.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Thank you for your business!</p>
              <p className="mt-1">
                Questions? Contact us at contact@northforce.com or +46 8 123 456 78
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0 * {
            visibility: visible;
          }
          .fixed.inset-0 {
            position: static;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};
