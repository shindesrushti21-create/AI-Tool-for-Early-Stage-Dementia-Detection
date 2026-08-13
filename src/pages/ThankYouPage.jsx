import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Play, ArrowRight, Home } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ThankYouPage = () => {
  return (
    <>
      <Helmet>
        <title>Registration Complete — Thank You — CogniGuard</title>
        <meta name="description" content="Thank you for registering with CogniGuard. Your senior screening profile is now active." />
      </Helmet>

      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--color-low-risk-bg)', color: 'var(--color-low-risk)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={42} />
          </div>

          <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            Thank You for Registering!
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your confidential screening profile has been created. You can now begin your 5-minute memory, reaction speed, and voice screening tests.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Play size={20} fill="#FFFFFF" />
              Go to Screening Dashboard
              <ArrowRight size={20} />
            </Link>

            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={20} />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
