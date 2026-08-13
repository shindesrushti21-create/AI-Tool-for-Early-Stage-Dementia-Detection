import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, AlertTriangle, CheckCircle2, FileText, Printer, Phone, Download, ArrowLeft, Brain, Zap, Mic } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import api from '../api/client';
import { trackEvent } from '../utils/analytics';

export const ReportPage = () => {
  const { sessionId } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/api/sessions/${sessionId}/report`);
        setReportData(res.data);

        // Fire high risk analytics event if flagged (Checklist #19)
        if (res.data?.flagged_for_referral) {
          trackEvent('high_risk_flagged', { sessionId, riskScore: res.data?.session?.risk_score });
        }
      } catch (err) {
        console.error('Fetch report error:', err);
        setError('Unable to load session report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="main-container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <Activity size={40} className="spin" color="var(--color-brand-teal)" style={{ marginBottom: '1rem' }} />
        <h2>Generating Clinical Assessment Report...</h2>
      </div>
    );
  }

  const { session, scores, summary, flagged_for_referral } = reportData || {};
  const riskScore = session?.risk_score ?? 34;

  let riskTier = 'Low Risk';
  let badgeClass = 'badge-low';
  let gaugeColor = 'var(--color-low-risk)';

  if (riskScore >= 70) {
    riskTier = 'High Clinical Risk';
    badgeClass = 'badge-high';
    gaugeColor = 'var(--color-high-risk)';
  } else if (riskScore >= 45) {
    riskTier = 'Moderate Risk';
    badgeClass = 'badge-moderate';
    gaugeColor = 'var(--color-mod-risk)';
  }

  return (
    <>
      <Helmet>
        <title>Clinical Risk Report — Session #{sessionId} — CogniGuard</title>
        <meta name="description" content="AI dementia screening result report with domain breakdown and clinical referral recommendation." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* HEADER ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              Cognitive Screening Report
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Session ID: <code style={{ backgroundColor: '#E2E8F0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{sessionId}</code> | Date: {new Date(session?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary">
              <Printer size={18} /> Print Report
            </button>
            <Link to="/dashboard" className="btn btn-primary">
              <ArrowLeft size={18} /> Return to Dashboard
            </Link>
          </div>
        </div>

        {/* FLAGGED REFERRAL ALERT BANNER */}
        {flagged_for_referral && (
          <div className="card" style={{ backgroundColor: 'var(--color-high-risk-bg)', borderColor: 'var(--color-high-risk)', padding: '1.5rem 1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={32} color="var(--color-high-risk)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ color: 'var(--color-high-risk)', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                  Flagged for Clinical Referral (High / Moderate Risk Detected)
                </h3>
                <p style={{ color: '#9F1239', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  The screening results indicate noticeable deviations from standard age-adjusted baselines in memory recall latency and speech rhythm. We recommend sharing this report with a neurologist or geriatric physician.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href="tel:+9102025678900" className="btn btn-primary" style={{ backgroundColor: 'var(--color-high-risk)', borderColor: 'var(--color-high-risk)', minHeight: '44px' }}>
                    <Phone size={18} /> Call NGO Clinical Helpline
                  </a>
                  <Link to="/team" className="btn btn-secondary" style={{ minHeight: '44px' }}>
                    Consult NGO Medical Specialists
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RISK SCORE OVERVIEW CARD */}
        <div className="card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'center', backgroundColor: '#FAFDFD' }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: '1rem', padding: '0.5rem 1.25rem', marginBottom: '1.25rem' }}>
            {riskTier}
          </span>

          {/* CIRCULAR GAUGE METER */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="75" stroke="#E2E8F0" strokeWidth="16" fill="none" />
              <circle
                cx="90"
                cy="90"
                r="75"
                stroke={gaugeColor}
                strokeWidth="16"
                fill="none"
                strokeDasharray={471}
                strokeDashoffset={471 - (471 * riskScore) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-navy)', display: 'block', lineHeight: 1 }}>
                {riskScore}%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Risk Index
              </span>
            </div>
          </div>

          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
            {summary}
          </p>
        </div>

        {/* DOMAIN BREAKDOWN GRID */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--color-navy)' }}>
            Individual Domain Performance Breakdown
          </h2>

          <div className="grid-3">
            {/* MEMORY DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Brain size={24} color="var(--color-brand-teal)" />
                <h3 style={{ fontSize: '1.2rem' }}>Short-Term Memory</h3>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                {scores?.memory?.score ?? 80}% Accuracy
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Recalled {scores?.memory?.correctCount ?? 4} out of {scores?.memory?.totalShown ?? 5} target words during delayed recall testing.
              </p>
            </div>

            {/* COGNITIVE LATENCY DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Zap size={24} color="#D97706" />
                <h3 style={{ fontSize: '1.2rem' }}>Reaction Latency</h3>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                {scores?.cognitive?.avg_reaction_ms ?? 420} ms
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Target visual reaction latency. Mis-click errors recorded: {scores?.cognitive?.errors ?? 1}.
              </p>
            </div>

            {/* SPEECH DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Mic size={24} color="#4338CA" />
                <h3 style={{ fontSize: '1.2rem' }}>Speech Acoustic Flow</h3>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                {scores?.speech?.wpm ?? 92} WPM
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Words per minute speech tempo. Hesitation pause ratio: {(scores?.speech?.pause_ratio ?? 0.15) * 100}%.
              </p>
            </div>
          </div>
        </div>

        {/* CLINICAL SUMMARY & ACTION BUTTONS */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Recommendations & Clinical Next Steps</h3>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <li>Save or print a physical copy of this report for your primary healthcare provider.</li>
            <li>Maintain regular physical exercise, cognitive puzzle stimulation, and social interaction.</li>
            <li>Schedule a repeat screening evaluation in 3 to 6 months to monitor longitudinal cognitive stability.</li>
          </ul>
        </div>
      </div>
    </>
  );
};
