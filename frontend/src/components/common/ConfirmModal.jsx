import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
  children,
  isSubmitting = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isSubmitting]);

  if (!isOpen) return null;

  const btnClass = variant === 'danger' ? 'btn-danger' : variant === 'gold' ? 'btn-gold' : 'btn-primary';

  return (
    <div className="modal-overlay" onClick={isSubmitting ? undefined : onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {variant === 'danger' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-status-danger-bg)',
                color: 'var(--color-status-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={20} />
              </div>
            )}
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>{title}</h3>
          </div>
          <button 
            className="btn-icon" 
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {description && (
          <p style={{ fontSize: '0.92rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        )}

        {children && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            {children}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button 
            type="button" 
            className={`btn ${btnClass}`} 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
