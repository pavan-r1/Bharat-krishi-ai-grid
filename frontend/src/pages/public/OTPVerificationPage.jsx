import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Logo from '../../components/branding/Logo';
import OTPInput from '../../components/common/OTPInput';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const OTPVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const purpose = location.state?.purpose || 'login';
  const otpLength = 6;
  const identifier = location.state?.identifier;
  const channel = location.state?.channel || (purpose === 'registration' ? 'sms' : 'email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (otp.length !== otpLength) {
      setError(`Please enter the complete ${otpLength}-digit verification code.`);
      return;
    }

    setIsVerifying(true);
    try {
      if (purpose === 'registration') {
        await authService.verifyOtp(identifier, otp, purpose);
        navigate('/login', { replace: true, state: { registrationSuccess: true } });
        return;
      }

      const result = await login(identifier, otp, purpose);
      if (result.success) {
        // Enforce Authoritative Role Navigation
        if (result.user.role === 'officer') {
          navigate('/officer/dashboard', { replace: true });
        } else {
          navigate('/farmer/dashboard', { replace: true });
        }
      } else {
        setError(result.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    try {
      const result = await authService.resendOtp(identifier, purpose);
      setResendNotice(result.message || 'If this verification request is active, the challenge has been refreshed.');
    } catch (err) {
      setError(err.message || 'Unable to resend the code.');
    }
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-ivory-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)'
      }}
    >
      <div 
        className="card"
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: 'var(--color-warm-cream)',
          padding: 'clamp(1.5rem, 4vw, 2.75rem)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Back Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link 
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-forest-green)',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Brand */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Logo variant="dark" />
        </div>

        <h2 style={{ fontSize: '1.65rem', color: 'var(--color-forest-green)', marginBottom: '0.5rem' }}>
          Verify Your {channel === 'sms' ? 'Phone' : 'Email'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
          Enter the {otpLength}-digit verification code for <strong style={{ color: 'var(--color-text-primary)' }}>{identifier || 'your registered contact'}</strong>.
        </p>

        {/* Error Alert */}
        {error && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-status-danger-bg)',
              border: '1px solid var(--color-status-danger-border)',
              color: 'var(--color-status-danger)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Resend Success Message */}
        {resendNotice && !error && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-status-success-bg)',
              border: '1px solid var(--color-status-success-border)',
              color: 'var(--color-status-success)',
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{resendNotice}</span>
          </div>
        )}

        {/* OTP Input Component */}
        <form onSubmit={handleVerify}>
          <OTPInput 
            value={otp} 
            onChange={setOtp} 
            length={otpLength} 
            disabled={isVerifying}
            error={!!error}
          />

          {/* Verify & Login Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
            disabled={isVerifying || otp.length !== otpLength}
          >
            {isVerifying ? 'Verifying Code...' : 'Verify & Continue'}
          </button>
        </form>

        {/* Resend Countdown */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-forest-green)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              <span>Resend Verification Code</span>
            </button>
          ) : (
            <span>Resend code in <strong>{countdown}s</strong></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
