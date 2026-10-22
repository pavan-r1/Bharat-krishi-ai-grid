import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Loading agricultural intelligence data..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-3xl) var(--space-md)',
      gap: 'var(--space-md)'
    }}>
      <Loader2 
        size={36} 
        color="var(--color-forest-green)" 
        style={{ animation: 'spin 1s linear infinite' }} 
      />
      <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
