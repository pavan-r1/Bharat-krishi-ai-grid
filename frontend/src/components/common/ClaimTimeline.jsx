import React from 'react';
import { CircleDot, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const ClaimTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No audit events logged.</p>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={16} color="var(--color-status-success)" />;
      case 'rejected':
        return <AlertCircle size={16} color="var(--color-status-danger)" />;
      case 'under_review':
        return <Clock size={16} color="var(--color-status-warning)" />;
      default:
        return <CircleDot size={16} color="var(--color-forest-green)" />;
    }
  };

  return (
    <div style={{ position: 'relative', paddingLeft: '24px', margin: 'var(--space-md) 0' }}>
      {/* Timeline spine line */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          bottom: '10px',
          left: '7px',
          width: '2px',
          backgroundColor: 'var(--color-border)'
        }}
      />

      {events.map((event, index) => (
        <div 
          key={index} 
          style={{
            position: 'relative',
            marginBottom: index === events.length - 1 ? 0 : 'var(--space-lg)'
          }}
        >
          {/* Node Icon */}
          <div 
            style={{
              position: 'absolute',
              left: '-24px',
              top: '2px',
              backgroundColor: 'var(--color-surface-white)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px'
            }}
          >
            {getStatusIcon(event.status)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                {event.title}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {event.date}
              </span>
            </div>
            {event.note && (
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {event.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClaimTimeline;
