import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Play, ArrowRight, Home } from 'lucide-react';

export const ThankYouPage = () => {
  return (
    <>
      <Helmet>
        <title>Registration Complete — Thank You — CogniGuard</title>
        <meta name="description" content="Thank you for registering with CogniGuard. Your senior screening profile is now active." />
      </Helmet>

      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)', padding: '1.5rem 1rem' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '2.25rem 1.75rem' }}>
          <div style={{ width: '62px', height: '62px', borderRadius: '50%', backgroundColor: 'var(--color-low-risk-bg)', color: 'var(--color-low-risk)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--color-low-risk-border)' }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '1.65rem', color: 'var(--color-heading)', marginBottom: '0.6rem' }}>
            Thank You for Registering!
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Your confidential screening profile has been created. You can now begin your 5-minute memory, reaction speed, and voice screening tests.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Play size={18} fill="#FFFFFF" />
              Go to Screening Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={18} />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
