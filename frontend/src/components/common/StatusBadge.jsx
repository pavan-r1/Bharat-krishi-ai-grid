import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normStatus = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configMap = {
    submitted: {
      label: 'Submitted',
      className: 'badge-submitted',
      icon: Clock
    },
    under_review: {
      label: 'Under Review',
      className: 'badge-under_review',
      icon: Clock
    },
    approved: {
      label: 'Approved',
      className: 'badge-approved',
      icon: CheckCircle2
    },
    rejected: {
      label: 'Rejected',
      className: 'badge-rejected',
      icon: XCircle
    },
    needs_more_information: {
      label: 'Needs Info',
      className: 'badge-warning',
      icon: AlertCircle
    }
  };

  const current = configMap[normStatus] || {
    label: status || 'Unknown',
    className: 'badge-info',
    icon: Clock
  };

  const Icon = current.icon;

  return (
    <span className={`badge ${current.className}`}>
      <Icon size={12} strokeWidth={2.2} />
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
