import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'green',
  trend = null,
  onClick
}) => {
  return (
    <div 
      className={`stat-card ${colorScheme} ${onClick ? 'card-hover' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={24} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            marginTop: '4px',
            color: trend.isPositive ? 'var(--color-status-success)' : 'var(--color-status-danger)'
          }}>
            {trend.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
