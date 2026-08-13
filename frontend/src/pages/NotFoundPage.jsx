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

      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)', padding: '1.5rem 1rem' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '2.5rem 1.75rem' }}>
          <div style={{ width: '62px', height: '62px', borderRadius: '50%', backgroundColor: 'var(--color-mod-risk-bg)', color: 'var(--color-mod-risk)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--color-mod-risk-border)' }}>
            <AlertTriangle size={36} />
          </div>

          <h1 style={{ fontSize: '1.65rem', color: 'var(--color-heading)', marginBottom: '0.6rem' }}>
            404 — Page Not Found
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            We couldn't find the page or screening resource you were trying to access. Let's get you back to your cognitive screening dashboard.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <LayoutDashboard size={18} />
              Back to Dashboard
            </Link>

            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={18} />
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
