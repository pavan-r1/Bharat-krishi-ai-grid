import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Logo from '../../components/branding/Logo';
import authService from '../../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpgrade = new URLSearchParams(location.search).get('upgrade') === '1';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const phone = form.phone.trim();
      if (isUpgrade) await authService.upgradePhone({ email: form.email.trim().toLowerCase(), phone, password: form.password });
      else await authService.register({ name: form.name.trim(), phone, password: form.password });
      navigate('/verify-otp', { state: { identifier: phone, purpose: isUpgrade ? 'upgrade' : 'registration', channel: 'sms' } });
    } catch (err) { setError(err.message || 'Unable to start registration.'); }
    finally { setBusy(false); }
  };
  return <div style={{ minHeight: '100vh', background: 'var(--color-ivory-bg)', display: 'grid', placeItems: 'center', padding: '1rem' }}>
    <section className="card" style={{ width: 'min(100%, 460px)', padding: '2rem', background: 'var(--color-warm-cream)' }}>
      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-forest-green)', marginBottom: '1.25rem' }}><ArrowLeft size={16}/> Back to login</Link>
      <Logo variant="dark" />
      <h1 style={{ color: 'var(--color-forest-green)', margin: '1.25rem 0 .4rem' }}>{isUpgrade ? 'Verify mobile for existing account' : 'Create farmer account'}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>{isUpgrade ? 'Confirm your existing email and password, then verify a mobile number for future sign-ins.' : 'Verify your mobile number before activating your account.'}</p>
      {error && <p role="alert" style={{ color: 'var(--color-status-danger)' }}>{error}</p>}
      <form onSubmit={submit}>
        {!isUpgrade && <div className="form-group"><label className="form-label" htmlFor="register-name">Full name</label><input className="form-input" id="register-name" autoComplete="name" minLength={2} maxLength={100} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>}
        {isUpgrade && <div className="form-group"><label className="form-label" htmlFor="register-email">Existing account email</label><input className="form-input" id="register-email" type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></div>}
        <div className="form-group"><label className="form-label" htmlFor="register-phone">Mobile number</label><input className="form-input" id="register-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></div>
        <div className="form-group"><label className="form-label" htmlFor="register-password">{isUpgrade ? 'Existing account password' : 'Password'}</label><input className="form-input" id="register-password" type="password" autoComplete={isUpgrade ? 'current-password' : 'new-password'} minLength={isUpgrade ? 1 : 12} maxLength={128} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>{!isUpgrade && <small className="form-hint">Use at least 12 characters.</small>}</div>
        <button className="btn btn-primary" type="submit" disabled={busy} style={{ width: '100%' }}><UserPlus size={16}/>{busy ? 'Preparing verification…' : isUpgrade ? 'Verify mobile number' : 'Create Account'}</button>
      </form>
      {!isUpgrade && <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '.86rem' }}>Already have a farmer account? <Link to="/register?upgrade=1" style={{ color: 'var(--color-forest-green)', fontWeight: 600 }}>Verify a mobile number</Link></p>}
    </section>
  </div>;
}
