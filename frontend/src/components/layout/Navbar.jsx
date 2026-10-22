import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCheck, Sprout } from 'lucide-react';
import Logo from '../branding/Logo';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Features', path: '/#features' },
    { label: 'Impact', path: '/#impact' },
    { label: 'How It Works', path: '/#how-it-works' }
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.includes('#')) {
      const id = path.split('#')[1];
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#F7F1E3',
        borderBottom: '1px solid #E6DEC8',
        padding: '0.85rem 0'
      }}
    >
      {/* Top-left subtle botanical decoration matching reference */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '84px',
          height: '84px',
          pointerEvents: 'none',
          zIndex: 0
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M0 0 Q25 15 45 45 Q65 75 75 100" stroke="#173F2A" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
        <path d="M12 8 C18 4 25 10 24 16 C20 20 14 18 12 8 Z" fill="#173F2A" opacity="0.2" />
        <path d="M22 22 C30 18 36 24 34 30 C28 34 22 30 22 22 Z" fill="#D6A84F" opacity="0.25" />
        <path d="M38 42 C46 38 52 44 50 50 C44 54 38 50 38 42 Z" fill="#173F2A" opacity="0.18" />
        <path d="M0 25 C10 22 18 28 16 35 C10 40 4 36 0 25 Z" fill="#D6A84F" opacity="0.2" />
      </svg>

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* BKIG Botanical Logo at left */}
        <Logo variant="dark" />

        {/* Desktop Nav Links */}
        <nav 
          style={{ display: 'none', alignItems: 'center', gap: '2rem' }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isHomeActive = link.label === 'Home' && location.pathname === '/' && (!location.hash || location.hash === '');
            const isActive = isHomeActive || (location.pathname === link.path && !link.path.includes('#'));
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  color: isActive ? '#173F2A' : '#4D554E',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: '6px 0',
                  display: 'inline-block'
                }}
              >
                {link.label}
                {isHomeActive && (
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      left: '0px',
                      right: '0px',
                      height: '2px',
                      backgroundColor: '#D6A84F',
                      borderRadius: '1px'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Botanical Icon + Two-line text + Forest-Green Login Button */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#EEF3E6',
                border: '1px solid #DDE4D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Sprout size={18} color="#173F2A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#173F2A' }}>For a Stronger</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 500, color: '#4D554E' }}>Agriculture Community</span>
            </div>
          </div>

          {isAuthenticated ? (
            <Link 
              to={currentUser?.role === 'officer' ? '/officer/dashboard' : '/farmer/dashboard'}
              className="login-btn-header"
              style={{
                backgroundColor: '#173F2A',
                color: '#FFFFFF',
                border: '1px solid #173F2A',
                borderRadius: '9999px',
                padding: '0.6rem 1.4rem',
                fontWeight: 600,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(23, 63, 42, 0.18)',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={16} />
              <span>{currentUser?.role === 'officer' ? 'Officer Portal' : 'Farmer Portal'}</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="login-btn-header"
              style={{
                backgroundColor: '#173F2A',
                color: '#FFFFFF',
                border: '1px solid #173F2A',
                borderRadius: '9999px',
                padding: '0.6rem 1.4rem',
                fontWeight: 600,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(23, 63, 42, 0.18)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Login</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="btn-icon mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{ display: 'flex', color: '#173F2A' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#F7F1E3',
            borderBottom: '1px solid #E6DEC8',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 99
          }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#EEF3E6',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid #DDE4D0',
              alignSelf: 'flex-start'
            }}
          >
            <Sprout size={16} color="#173F2A" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#173F2A' }}>For a Stronger</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#4D554E' }}>Agriculture Community</span>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#172A21',
                padding: '0.4rem 0'
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #E4E0D5', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <Link 
                to={currentUser?.role === 'officer' ? '/officer/dashboard' : '/farmer/dashboard'}
                className="btn btn-primary"
                style={{ backgroundColor: '#173F2A', color: '#F7F1E3' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#173F2A', color: '#F7F1E3', display: 'flex', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Login</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/role-selection" 
                  className="btn btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Choose Role & Explore
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
