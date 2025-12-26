import React from 'react';

interface ContractStatusBadgeProps {
  status: 'draft' | 'review' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated';
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    review: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-300',
    signed: 'bg-purple-100 text-purple-700 border-purple-300',
    active: 'bg-green-100 text-green-700 border-green-300',
    expired: 'bg-red-100 text-red-700 border-red-300',
    terminated: 'bg-gray-100 text-gray-500 border-gray-300',
  };

  const labels = {
    draft: 'Draft',
    review: 'In Review',
    sent: 'Sent',
    signed: 'Signed',
    active: 'Active',
    expired: 'Expired',
    terminated: 'Terminated',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
