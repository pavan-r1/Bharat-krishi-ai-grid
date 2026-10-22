import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../branding/Logo';
import { Shield, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      style={{
        backgroundColor: '#103B27',
        color: '#FFFDF7',
        borderTop: '3px solid #D6A84F',
        paddingTop: 'var(--space-3xl)',
        paddingBottom: 'var(--space-xl)'
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-2xl)'
          }}
        >
          {/* Column 1: Brand & Vision */}
          <div>
            <Logo variant="light" size="large" />
            <p style={{ color: '#DDE4D0', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
              Bharat Krishi Intelligence Grid (BKIG) is an agricultural intelligence platform 
              dedicated to empowering Indian farmers with verified mandi intelligence, automated scheme discovery, 
              and transparent crop insurance assessment.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#D6A84F' }}>v1.0.0</span>
            </div>
          </div>

          {/* Column 2: Core Modules */}
          <div>
            <h4 style={{ color: '#FFFDF7', marginBottom: '1rem', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
              Core Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/farmer/submit-claim" style={{ color: '#DDE4D0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="#D6A84F" />
                  <span>Crop Insurance Claim Wizard</span>
                </Link>
              </li>
              <li>
                <Link to="/farmer/mandi-prices" style={{ color: '#DDE4D0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#D6A84F" />
                  <span>Mandi Price Intelligence</span>
                </Link>
              </li>
              <li>
                <Link to="/farmer/schemes" style={{ color: '#DDE4D0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#D6A84F" />
                  <span>Government Scheme Finder</span>
                </Link>
              </li>
              <li>
                <Link to="/officer/dashboard" style={{ color: '#DDE4D0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="#D6A84F" />
                  <span>Insurance Officer Queue</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Portals & Documentation */}
          <div>
            <h4 style={{ color: '#FFFDF7', marginBottom: '1rem', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
              Portals & Access
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/login" style={{ color: '#DDE4D0', fontSize: '0.9rem' }}>
                  Farmer Login (Mobile + OTP)
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#DDE4D0', fontSize: '0.9rem' }}>
                  Insurance Officer Portal
                </Link>
              </li>
              <li>
                <Link to="/role-selection" style={{ color: '#DDE4D0', fontSize: '0.9rem' }}>
                  Role Selection Directory
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#DDE4D0', fontSize: '0.9rem' }}>
                  About BKIG Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: National Agriculture Cell */}
          <div>
            <h4 style={{ color: '#FFFDF7', marginBottom: '1rem', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
              Support & Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#DDE4D0', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#D6A84F" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#D6A84F" style={{ flexShrink: 0 }} />
                <span>Kisan Call Centre Toll Free: 1800-180-1551</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#D6A84F" style={{ flexShrink: 0 }} />
                <span>For agricultural assistance, contact the Kisan Call Centre.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid rgba(228, 224, 213, 0.15)',
            paddingTop: 'var(--space-md)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#8E9990'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Bharat Krishi Intelligence Grid (BKIG). All rights reserved.
          </div>
          <div style={{ color: '#DDE4D0' }}>
            Built for Indian Agriculture &bull; Healthy Farms, Prosperous Farmers, Stronger Bharat
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
