import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No records found",
  description = "There are no matching items for the selected criteria.",
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-surface-white)',
      border: '1px dashed var(--color-border)',
      borderRadius: 'var(--radius-md)',
      margin: 'var(--space-md) 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-sage-light)',
        color: 'var(--color-forest-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-md)'
      }}>
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', fontSize: '0.9rem', marginBottom: actionLabel ? 'var(--space-lg)' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
