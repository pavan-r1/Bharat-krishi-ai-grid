import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sprout, 
  CreditCard, 
  LogOut,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmerProfilePage = () => {
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
            Kisan Profile & Landholding
          </h1>
          <span className="demo-pill">Verified Account</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Manage your verified agricultural credentials and cadastral records.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ padding: 'var(--space-xl)', backgroundColor: 'var(--color-warm-cream)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1.5rem' }}>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser?.name || "Farmer"}
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
              {currentUser?.name || 'Rameshwar Patel'}
            </h2>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Farmer Beneficiary ID: <strong>{currentUser?.id || 'BKIG-FARMER-001'}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className="badge badge-success">Aadhaar e-KYC Verified</span>
              <span className="badge badge-info">PMFBY Insured</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>REGISTERED MOBILE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontWeight: 600 }}>
              <Phone size={15} color="var(--color-forest-green)" />
              <span>+91 {currentUser?.mobile}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>MASKED AADHAAR</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.aadhaarMasked || 'XXXX-XXXX-4921'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>KISAN CREDIT CARD (KCC)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontWeight: 600 }}>
              <CreditCard size={15} color="var(--color-harvest-gold)" />
              <span>{currentUser?.kisanCreditCard || 'KCC-KA-88912'}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>TOTAL LANDHOLDING</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.landArea || '4.2 Hectares'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>PRIMARY CROPS</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.primaryCrop || 'Ragi & Maize'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>REVENUE JURISDICTION</span>
            <div style={{ fontWeight: 600, marginTop: '3px' }}>
              {currentUser?.village}, {currentUser?.taluk}, {currentUser?.district}
            </div>
          </div>
        </div>

        {/* Kisan Call Center Box */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--color-sage-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={22} color="var(--color-forest-green)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-forest-green)' }}>Need Support or Advisory?</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Kisan Call Centre Toll Free 24x7: 1800-180-1551</div>
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

export default FarmerProfilePage;
