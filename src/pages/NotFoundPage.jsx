import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Home, LayoutDashboard } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found — CogniGuard Dementia Screening</title>
        <meta name="description" content="The page you are looking for does not exist. Return to your screening dashboard or landing page." />
      </Helmet>

      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '580px', width: '100%', textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <AlertTriangle size={42} />
          </div>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            404 — Page Not Found
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.25rem' }}>
            We couldn't find the page or screening resource you were trying to access. Let's get you back to your cognitive screening dashboard.
          </p>

          {/* Checklist Item #1: Dedicated 404 component on * route with friendly message + link back to /dashboard */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <LayoutDashboard size={20} />
              Back to Dashboard
            </Link>

            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={20} />
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
