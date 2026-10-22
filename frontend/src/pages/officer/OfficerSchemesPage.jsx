import React from 'react';
import GovernmentSchemesPage from '../farmer/GovernmentSchemesPage';

export const OfficerSchemesPage = () => {
  return (
    <div>
      <div 
        style={{
          backgroundColor: 'var(--color-sage-light)',
          border: '1px solid var(--color-sage-green)',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: 'var(--color-forest-green)',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span className="demo-pill">Officer Terminal</span>
        <span>
          Official agriculture scheme links and current-source guidance.
        </span>
      </div>
      <GovernmentSchemesPage />
    </div>
  );
};

export default OfficerSchemesPage;
