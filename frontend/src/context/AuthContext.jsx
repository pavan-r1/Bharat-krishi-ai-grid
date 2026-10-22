import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

const STORAGE_KEY = 'bkig_user_session';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => Boolean(sessionStorage.getItem('bkig_access_token')));

  useEffect(() => {
    const token = sessionStorage.getItem('bkig_access_token');
    if (!token) { setCurrentUser(null); setLoading(false); return; }
    apiClient.get('/api/v1/auth/me').then(setCurrentUser).catch(() => {
      sessionStorage.removeItem('bkig_access_token');
      sessionStorage.removeItem(STORAGE_KEY);
      setCurrentUser(null);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  /**
   * Authoritative login via OTP verification.
   * Role is determined STRICTLY by user record, never user interface override.
   */
  const login = async (identifier, otp, purpose = 'login') => {
    setLoading(true);
    try {
      const { user, access_token } = await authService.verifyOtp(identifier, otp, purpose);
      sessionStorage.setItem('bkig_access_token', access_token);
      setCurrentUser(user);
      if (user.role === 'farmer' && typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              authService.updateDeviceLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy_meters: coords.accuracy,
              }).then(({ device_location: deviceLocation }) => {
                setCurrentUser(existing => existing?.id === user.id ? { ...existing, device_location: deviceLocation } : existing);
              }).catch(() => {});
            },
            () => {},
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
          );
        } catch {
          // Location access is optional; never block an authenticated login.
        }
      }
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out and wipe session
   */
  const logout = () => {
    apiClient.post('/api/v1/auth/logout').catch(() => {});
    setCurrentUser(null);
      sessionStorage.removeItem('bkig_access_token');
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
