import apiClient, { IS_MOCK_MODE } from './apiClient';

export const authService = {
  async login(identifier, password) {
    if (IS_MOCK_MODE) throw new Error('Secure authentication requires the BKIG backend.');
    return apiClient.post('/api/v1/auth/login', { identifier, password });
  },
  async verifyOtp(identifier, otp, purpose = 'login') {
    if (IS_MOCK_MODE) throw new Error('Mock authentication is disabled.');
    const endpoint = purpose === 'registration' ? '/api/v1/auth/register/verify' : purpose === 'upgrade' ? '/api/v1/auth/upgrade-phone/verify' : '/api/v1/auth/login/verify-otp';
    return apiClient.post(endpoint, purpose === 'login' ? { identifier, otp } : { phone: identifier, otp });
  },
  async updateDeviceLocation(location) {
    if (IS_MOCK_MODE) return null;
    return apiClient.patch('/api/v1/auth/me/location', location);
  },
  async register(payload) {
    if (IS_MOCK_MODE) throw new Error('Mock authentication is disabled.');
    return apiClient.post('/api/v1/auth/register', payload);
  },
  async upgradePhone(payload) {
    if (IS_MOCK_MODE) throw new Error('Mock authentication is disabled.');
    return apiClient.post('/api/v1/auth/upgrade-phone', payload);
  },
  async resendOtp(identifier, purpose = 'login') {
    if (IS_MOCK_MODE) throw new Error('Mock authentication is disabled.');
    return apiClient.post('/api/v1/auth/resend-otp', { identifier, purpose });
  }
};

export default authService;
