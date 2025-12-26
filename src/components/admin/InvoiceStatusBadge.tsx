import React from 'react';

interface InvoiceStatusBadgeProps {
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void';
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-300',
    paid: 'bg-green-100 text-green-700 border-green-300',
    overdue: 'bg-red-100 text-red-700 border-red-300',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
    void: 'bg-gray-100 text-gray-400 border-gray-200',
  };

  const labels = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    void: 'Void',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
