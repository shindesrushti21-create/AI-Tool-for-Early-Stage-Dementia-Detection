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

        <div style={{ maxWidth: '850px', margin: '0 auto 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              Health Data Privacy & Security Policy
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Protecting senior health data, speech transcripts, and memory scores with strict confidentiality.
            </p>
          </div>

          <div className="card" style={{ padding: '2.5rem 2rem', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-brand-teal)', marginBottom: '1rem' }}>
              <Lock size={24} />
              <h2 style={{ fontSize: '1.4rem' }}>1. What Screening Data We Collect</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              CogniGuard collects non-invasive cognitive task metrics: memory recall accuracy rates, visual reaction latency in milliseconds, and speech acoustic parameters (Words Per Minute, pause ratios, and speech transcripts). We do NOT record raw video or facial biometrics.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-brand-teal)', marginBottom: '1rem' }}>
              <EyeOff size={24} />
              <h2 style={{ fontSize: '1.4rem' }}>2. Data Anonymization & Encryption</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              All screening sessions are tagged with anonymized session identifiers (e.g. <code>sess_98234</code>). Speech transcripts captured during voice evaluations are transmitted over SSL/TLS encrypted connections and processed in-memory.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-brand-teal)', marginBottom: '1rem' }}>
              <Server size={24} />
              <h2 style={{ fontSize: '1.4rem' }}>3. Patient Rights & Non-Commercial Use</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              CogniGuard is a healthcare NGO initiative. We never sell, rent, or monetize patient data. Users have the right to request full deletion of their past screening sessions and clinical reports at any time.
            </p>

            <div style={{ backgroundColor: '#FAFDFD', borderLeft: '4px solid var(--color-brand-teal)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <strong>Need Data Support?</strong> Contact our NGO Data Protection Officer at{' '}
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
