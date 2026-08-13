import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyMobileCTA } from './components/StickyMobileCTA';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { MemoryTestPage } from './pages/tests/MemoryTestPage';
import { CognitiveTestPage } from './pages/tests/CognitiveTestPage';
import { SpeechTestPage } from './pages/tests/SpeechTestPage';
import { ReportPage } from './pages/ReportPage';
import { FaqPage } from './pages/FaqPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TeamPage } from './pages/TeamPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="main-container" style={{ textAlign: 'center', padding: '4rem' }}>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/faqs" element={<FaqPage />} />
                <Route path="/case-studies" element={<CaseStudiesPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/test/memory" element={<ProtectedRoute><MemoryTestPage /></ProtectedRoute>} />
                <Route path="/test/cognitive" element={<ProtectedRoute><CognitiveTestPage /></ProtectedRoute>} />
                <Route path="/test/speech" element={<ProtectedRoute><SpeechTestPage /></ProtectedRoute>} />
                <Route path="/report/:sessionId" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

                {/* Custom 404 Route (Checklist Item #1) */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <StickyMobileCTA />
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </AccessibilityProvider>
    </HelmetProvider>
  );
}
