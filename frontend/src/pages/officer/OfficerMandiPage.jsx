import React from 'react';
import MandiPricesPage from '../farmer/MandiPricesPage';

export const OfficerMandiPage = () => {
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
          Accessing APMC agricultural price telemetry for claim yield loss valuation and crop cut comparisons.
        </span>
      </div>
      <MandiPricesPage />
    </div>
  );
};

export default OfficerMandiPage;
