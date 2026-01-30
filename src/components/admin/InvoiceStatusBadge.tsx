import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface InvoiceStatusBadgeProps {
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void';
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const { t } = useLanguage();

  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-300',
    paid: 'bg-green-100 text-green-700 border-green-300',
    overdue: 'bg-red-100 text-red-700 border-red-300',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
    void: 'bg-gray-100 text-gray-400 border-gray-200',
  };

  const labelKeys: Record<string, string> = {
    draft: 'admin.invoice_status.draft',
    sent: 'admin.invoice_status.sent',
    paid: 'admin.invoice_status.paid',
    overdue: 'admin.invoice_status.overdue',
    cancelled: 'admin.invoice_status.cancelled',
    void: 'admin.invoice_status.void',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {t(labelKeys[status])}
    </span>
  );
}
