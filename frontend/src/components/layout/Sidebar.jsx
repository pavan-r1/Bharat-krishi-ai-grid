import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus2, 
  Files, 
  TrendingUp, 
  ScrollText, 
  UserCircle2, 
  LogOut, 
  ShieldCheck, 
  ClipboardCheck,
  X
} from 'lucide-react';
import Logo from '../branding/Logo';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOfficer = role === 'officer';

  // Farmer Navigation
  const farmerLinks = [
    { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'Submit Claim', path: '/farmer/submit-claim', icon: FilePlus2 },
    { label: 'My Claims', path: '/farmer/claims', icon: Files },
    { label: 'Mandi Prices', path: '/farmer/mandi-prices', icon: TrendingUp },
    { label: 'Govt Schemes', path: '/farmer/schemes', icon: ScrollText },
    { label: 'Farmer Profile', path: '/farmer/profile', icon: UserCircle2 }
  ];

  // Officer Navigation
  const officerLinks = [
    { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Review Queue', path: '/officer/queue', icon: ClipboardCheck },
    { label: 'Mandi Intelligence', path: '/officer/mandi-prices', icon: TrendingUp },
    { label: 'Schemes Directory', path: '/officer/schemes', icon: ScrollText },
    { label: 'Officer Profile', path: '/officer/profile', icon: UserCircle2 }
  ];

  const currentLinks = isOfficer ? officerLinks : farmerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 59, 39, 0.55)',
            zIndex: 990
          }}
        />
      )}

      <aside 
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-forest-green)',
          color: 'var(--color-warm-cream)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 995,
          borderRight: '1px solid #103B27',
          transition: 'transform 0.3s ease',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Sidebar Header */}
        <div 
          style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid rgba(228, 224, 213, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Logo variant="light" showSubtitle={true} to={isOfficer ? '/officer/dashboard' : '/farmer/dashboard'} />
          <button 
            className="btn-icon mobile-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ color: '#DDE4D0' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Identity Tag */}
        <div 
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            borderBottom: '1px solid rgba(228, 224, 213, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isOfficer ? '#D6A84F' : '#68D391'
            }} 
          />
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#DDE4D0', fontWeight: 600 }}>
            {isOfficer ? 'Insurance Officer Portal' : 'Kisan Farmer Portal'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav 
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto'
          }}
        >
          {currentLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.7rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : '#DDE4D0',
                  backgroundColor: isActive ? 'rgba(214, 168, 79, 0.22)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-harvest-gold)' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                })}
              >
                <Icon size={19} color={isOfficer ? '#D6A84F' : '#D6A84F'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Mini Profile & Logout */}
        <div 
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(228, 224, 213, 0.12)',
            backgroundColor: 'rgba(0, 0, 0, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.name || "User"}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #D6A84F'
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFDF7', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.name || 'Authorized User'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#DDE4D0' }}>
                {isOfficer ? currentUser?.designation || 'Claims Officer' : currentUser?.district || 'Karnataka'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFDF7',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(181, 58, 53, 0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 960px) {
          .app-sidebar {
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
        @media (min-width: 961px) {
          .mobile-close-btn {
            display: none !important;
          }
          .sidebar-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
