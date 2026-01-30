import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContractStatusBadgeProps {
  status: 'draft' | 'review' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated';
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const { t } = useLanguage();

  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    review: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-300',
    signed: 'bg-blue-100 text-blue-700 border-blue-300',
    active: 'bg-green-100 text-green-700 border-green-300',
    expired: 'bg-red-100 text-red-700 border-red-300',
    terminated: 'bg-gray-100 text-gray-500 border-gray-300',
  };

  const labelKeys: Record<string, string> = {
    draft: 'admin.contract_status.draft',
    review: 'admin.contract_status.in_review',
    sent: 'admin.contract_status.sent',
    signed: 'admin.contract_status.signed',
    active: 'admin.contract_status.active',
    expired: 'admin.contract_status.expired',
    terminated: 'admin.contract_status.terminated',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {t(labelKeys[status])}
    </span>
  );
}
