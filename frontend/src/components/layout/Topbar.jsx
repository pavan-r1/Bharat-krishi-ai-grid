import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  CheckCheck, 
  ChevronDown, 
  User, 
  LogOut,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_NOTIFICATIONS, MOCK_OFFICER_NOTIFICATIONS } from '../../data/mockDashboard';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ onToggleSidebar }) => {
  const { currentUser, role, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const isOfficer = role === 'officer';
  const notifications = isOfficer ? MOCK_OFFICER_NOTIFICATIONS : MOCK_NOTIFICATIONS;
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--color-surface-white)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-xl)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Left: Mobile Toggle & Welcome Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn-icon mobile-hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} color="var(--color-forest-green)" />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--color-text-primary)' }}>
              Namaste, {currentUser?.name?.split(' ')[0] || 'User'}
            </h2>
            <span 
              style={{
                fontSize: '0.72rem',
                backgroundColor: isOfficer ? 'var(--color-gold-light)' : 'var(--color-sage-light)',
                color: isOfficer ? '#8C600B' : 'var(--color-forest-green)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                border: `1px solid ${isOfficer ? 'var(--color-harvest-gold)' : 'var(--color-sage-green)'}`
              }}
            >
              {isOfficer ? 'Insurance Officer' : 'Verified Farmer'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {isOfficer ? 'PMFBY Claim Verification & Audit Grid' : 'Agricultural Intelligence Grid'}
          </p>
        </div>
      </div>

      {/* Right: Weather Telemetry (Farmer), Notifications, Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Location Indicator (Officer) */}
        {isOfficer && (
          <div 
            className="weather-badge-desktop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-ivory-bg)',
              border: '1px solid var(--color-border)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              color: 'var(--color-text-primary)'
            }}
          >
            <MapPin size={16} color="var(--color-forest-green)" />
            <span>{currentUser?.jurisdiction || 'Southern Karnataka'}</span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowProfileMenu(false);
            }}
            aria-label="View notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={20} color="var(--color-forest-green)" />
            {unreadCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-status-danger)'
                }}
              />
            )}
          </button>

          {showNotifs && (
            <div 
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{unreadCount} unread</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: n.read ? 'transparent' : 'var(--color-sage-light)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{n.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>{n.message}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifs(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)'
            }}
          >
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.name || "Profile"} 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <ChevronDown size={14} color="var(--color-text-muted)" />
          </button>

          {showProfileMenu && (
            <div 
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '210px',
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                padding: '0.5rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>+91 {currentUser?.mobile}</div>
              </div>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(isOfficer ? '/officer/profile' : '/farmer/profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-ivory-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-status-danger)',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-status-danger-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .weather-badge-desktop {
            display: none !important;
          }
        }
        @media (min-width: 961px) {
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
