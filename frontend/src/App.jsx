import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import OTPVerificationPage from './pages/public/OTPVerificationPage';
import RoleSelectionPage from './pages/public/RoleSelectionPage';
import NotFoundPage from './pages/public/NotFoundPage';
import RegisterPage from './pages/public/RegisterPage';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import SubmitClaimPage from './pages/farmer/SubmitClaimPage';
import MyClaimsPage from './pages/farmer/MyClaimsPage';
import ClaimDetailsPage from './pages/farmer/ClaimDetailsPage';
import MandiPricesPage from './pages/farmer/MandiPricesPage';
import GovernmentSchemesPage from './pages/farmer/GovernmentSchemesPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import ReviewQueuePage from './pages/officer/ReviewQueuePage';
import ClaimReviewPage from './pages/officer/ClaimReviewPage';
import OfficerMandiPage from './pages/officer/OfficerMandiPage';
import OfficerSchemesPage from './pages/officer/OfficerSchemesPage';
import OfficerProfilePage from './pages/officer/OfficerProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />

          {/* Farmer Portal (Protected: Farmer Role Only) */}
          <Route
            path="/farmer"
            element={
              <ProtectedRoute allowedRole="farmer">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="submit-claim" element={<SubmitClaimPage />} />
            <Route path="claims" element={<MyClaimsPage />} />
            <Route path="claims/:claimId" element={<ClaimDetailsPage />} />
            <Route path="mandi-prices" element={<MandiPricesPage />} />
            <Route path="schemes" element={<GovernmentSchemesPage />} />
            <Route path="profile" element={<FarmerProfilePage />} />
          </Route>

          {/* Officer Portal (Protected: Officer Role Only) */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRole="officer">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="dashboard" element={<OfficerDashboard />} />
            <Route path="queue" element={<ReviewQueuePage />} />
            <Route path="claims/:claimId" element={<ClaimReviewPage />} />
            <Route path="mandi-prices" element={<OfficerMandiPage />} />
            <Route path="schemes" element={<OfficerSchemesPage />} />
            <Route path="profile" element={<OfficerProfilePage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
