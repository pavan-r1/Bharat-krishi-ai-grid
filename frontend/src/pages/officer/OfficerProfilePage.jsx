import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Phone, 
  LogOut,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfficerProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Claims Officer Profile
          </h1>
          <span className="demo-pill">Nodal Authority</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          PMFBY Zonal Assessment & Audit Clearance Credentials.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ padding: 'var(--space-xl)', backgroundColor: 'var(--color-warm-cream)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1.5rem' }}>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser?.name || "Officer"}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--color-harvest-gold)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest-green)', margin: 0 }}>
              {currentUser?.name || 'Dr. Ananya Sharma'}
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {currentUser?.designation || 'Senior Agricultural Claims Assessor'}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className="badge badge-approved">Nodal Assessor Active</span>
              <span className="badge badge-info">{currentUser?.officerId || 'OFF-KA-8402'}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>DEPARTMENT</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.department || 'Department of Agriculture & Farmers Welfare'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>BRANCH / CELL</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.branch || 'PMFBY Zonal Assessment Wing'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>OFFICIAL MOBILE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontWeight: 600 }}>
              <Phone size={15} color="var(--color-forest-green)" />
              <span>+91 {currentUser?.mobile}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>JURISDICTION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontWeight: 600 }}>
              <MapPin size={15} color="var(--color-terracotta)" />
              <span>{currentUser?.jurisdiction || 'Southern Karnataka Zone'}</span>
            </div>
          </div>
        </div>

        {/* Audit Sign-off Authority Info */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--color-gold-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-harvest-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={22} color="var(--color-forest-green)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-forest-green)' }}>Digital Sanction Clearance Authority</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Authorized to sanction PMFBY indemnity disbursals up to ₹5,00,000 per claim.</div>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerProfilePage;
