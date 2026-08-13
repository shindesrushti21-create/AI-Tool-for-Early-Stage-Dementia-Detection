import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Health Data Privacy Policy — CogniGuard NGO</title>
        <meta name="description" content="CogniGuard health data privacy policy explaining encrypted data storage, speech transcript anonymization, and patient confidentiality." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        <div style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Health Data Privacy & Security Policy
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Protecting senior health data, speech transcripts, and memory scores with strict confidentiality.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', lineHeight: 1.75, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--color-brand-teal)', marginBottom: '0.75rem' }}>
              <Lock size={20} />
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-heading)' }}>1. What Screening Data We Collect</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.35rem' }}>
              CogniGuard collects non-invasive cognitive task metrics: memory recall accuracy rates, visual reaction latency in milliseconds, and speech acoustic parameters (Words Per Minute, pause ratios, and speech transcripts). We do NOT record raw video or facial biometrics.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--color-brand-teal)', marginBottom: '0.75rem' }}>
              <EyeOff size={20} />
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-heading)' }}>2. Data Anonymization & Encryption</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.35rem' }}>
              All screening sessions are tagged with anonymized session identifiers. Speech transcripts captured during voice evaluations are transmitted over SSL/TLS encrypted connections and processed in-memory.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--color-brand-teal)', marginBottom: '0.75rem' }}>
              <Server size={20} />
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-heading)' }}>3. Patient Rights & Non-Commercial Use</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.35rem' }}>
              CogniGuard is a healthcare NGO initiative. We never sell, rent, or monetize patient data. Users have the right to request full deletion of their past screening sessions and clinical reports at any time.
            </p>

            <div style={{ backgroundColor: 'var(--color-card-subtle)', borderLeft: '4px solid var(--color-brand-teal)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: 'var(--color-heading)' }}>Need Data Support?</strong>{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>Contact our NGO Data Protection Officer at{' '}</span>
              <a href="mailto:privacy@cogniguard-screening.org" style={{ color: 'var(--color-brand-teal)', fontWeight: 700 }}>
                privacy@cogniguard-screening.org
              </a>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
