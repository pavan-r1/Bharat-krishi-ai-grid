import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Logo from '../../components/branding/Logo';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  // Selected role tab for visual context
  const [selectedRole, setSelectedRole] = useState(location.state?.role || 'farmer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate portal
  React.useEffect(() => {
    if (isAuthenticated) {
      const dest = currentUser?.role === 'officer' ? '/officer/dashboard' : '/farmer/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setError('');
    setIdentifier('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedIdentifier = selectedRole === 'officer' ? identifier.trim().toLowerCase() : identifier.trim();
    if (selectedRole === 'officer' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)) { setError('Please enter a valid officer email address.'); return; }
    if (selectedRole === 'farmer' && !/^(?:\+?91)?[6-9]\d{9}$/.test(normalizedIdentifier.replace(/[\s().-]/g, ''))) { setError('Please enter a valid Indian mobile number.'); return; }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const otpResponse = await authService.login(normalizedIdentifier, password);
      navigate('/verify-otp', {
        state: {
          identifier: normalizedIdentifier,
          purpose: 'login',
          channel: otpResponse.channel
        }
      });
    } catch (err) {
      setError(err.message || 'Unable to generate verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-ivory-bg)' }}>
      {/* Left Storytelling Visual Panel (Desktop only) */}
      <div 
        className="login-visual-panel"
        style={{
          flex: 1,
          backgroundColor: 'var(--color-deep-green)',
          color: '#FFFDF7',
          padding: 'clamp(2rem, 4vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(214, 168, 79, 0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      >
        <div>
          <Logo variant="light" size="large" />
          <div style={{ marginTop: '3.5rem', maxWidth: '480px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-harvest-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              National Agricultural Grid
            </span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '0.75rem', marginBottom: '1.25rem', color: '#FFFDF7' }}>
              Fair Insurance. Market Insights. Official Scheme Links.
            </h1>
            <p style={{ color: '#DDE4D0', fontSize: '1.05rem', lineHeight: 1.6 }}>
              A unified digital infrastructure connecting India's agricultural backbone with automated telemetry, verified mandi data, and institutional transparency.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '480px', color: '#DDE4D0', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Secure access for farmers and insurance officers, with verification sent to the account contact.
        </div>

        <div style={{ fontSize: '0.78rem', color: '#8E9990' }}>
          &copy; {new Date().getFullYear()} Bharat Krishi Intelligence Grid &bull; Department of Agriculture & Farmers Welfare
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 3vw, 3rem)'
        }}
      >
        <div 
          className="card"
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: 'var(--color-warm-cream)',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Mobile Logo representation */}
          <div style={{ marginBottom: '1.5rem' }} className="mobile-logo-wrap">
            <Logo variant="dark" />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-forest-green)', marginBottom: '0.4rem' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Sign in to access your agricultural intelligence workspace.
          </p>

          {location.state?.registrationSuccess && (
            <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-status-success-bg)', border: '1px solid var(--color-status-success-border)', color: 'var(--color-forest-green)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={18} />
              <span>Your account is verified. You can now sign in.</span>
            </div>
          )}

          {/* Role Switcher Tabs */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              padding: '4px',
              backgroundColor: 'var(--color-ivory-bg)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              border: '1px solid var(--color-border)'
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleTabChange('farmer')}
              style={{
                padding: '0.55rem',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedRole === 'farmer' ? 'var(--color-forest-green)' : 'transparent',
                color: selectedRole === 'farmer' ? 'var(--color-warm-cream)' : 'var(--color-text-secondary)'
              }}
            >
              Farmer Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('officer')}
              style={{
                padding: '0.55rem',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedRole === 'officer' ? 'var(--color-forest-green)' : 'transparent',
                color: selectedRole === 'officer' ? 'var(--color-warm-cream)' : 'var(--color-text-secondary)'
              }}
            >
              Insurance Officer
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-status-danger-bg)',
                border: '1px solid var(--color-status-danger-border)',
                color: 'var(--color-status-danger)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendOtp}>
            {/* Account identifier */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-identifier">
                {selectedRole === 'officer' ? 'Officer email address' : 'Mobile number'} <span className="required">*</span>
              </label>
              <input id="login-identifier" type={selectedRole === 'officer' ? 'email' : 'tel'} inputMode={selectedRole === 'officer' ? undefined : 'tel'} className="form-input" placeholder={selectedRole === 'officer' ? 'name@example.com' : '+91 98765 43210'} value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password <span className="required">*</span>
                </label>
                <span 
                  style={{ fontSize: '0.78rem', color: 'var(--color-forest-green)', cursor: 'pointer' }}
                  onClick={() => alert('Password reset is not configured yet. Please contact your BKIG administrator.')}
                >
                  Forgot Password?
                </span>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon-left" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right btn-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {selectedRole === 'farmer' && <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
              After sign-in, your browser may ask to share your device location with claim officers. If allowed, it is attached to your future claims. Location sharing is optional and does not affect login.
            </p>}

            {/* Submit CTA */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Preparing verification...' : 'Continue to OTP Verification'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Role Selection Directory Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>New to BKIG? </span>
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-forest-green)', marginRight: '0.75rem' }}>Create account</Link>
            <span style={{ color: 'var(--color-text-secondary)' }}>or </span>
            <Link to="/role-selection" style={{ fontWeight: 600, color: 'var(--color-forest-green)' }}>
              Choose Role Directory
            </Link>
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Existing farmer account? <Link to="/register?upgrade=1" style={{ color: 'var(--color-forest-green)', fontWeight: 600 }}>Verify a mobile number</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-visual-panel {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-logo-wrap {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
