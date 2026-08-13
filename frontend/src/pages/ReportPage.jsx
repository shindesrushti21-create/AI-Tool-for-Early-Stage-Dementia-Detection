import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, AlertTriangle, CheckCircle2, Printer, Phone, ArrowLeft, Brain, Zap, Mic } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import api from '../api/client';
import { trackEvent } from '../utils/analytics';

export const ReportPage = () => {
  const { sessionId } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/api/sessions/${sessionId}/report`);
        setReportData(res.data);

        if (res.data?.flagged_for_referral) {
          trackEvent('high_risk_flagged', { sessionId, riskScore: res.data?.session?.risk_score });
        }
      } catch (err) {
        console.error('Fetch report error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [sessionId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="main-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <Activity size={36} className="spin" color="var(--color-brand-teal)" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ color: 'var(--color-heading)', fontSize: '1.3rem' }}>Generating Clinical Assessment Report...</h2>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', color: 'var(--color-heading)', marginBottom: '0.2rem' }}>
              Cognitive Screening Report
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Session ID: <code style={{ backgroundColor: 'var(--color-card-subtle)', padding: '0.15rem 0.45rem', borderRadius: '4px', color: 'var(--color-heading)' }}>{sessionId}</code> | Date: {new Date(session?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
              <Printer size={16} /> Print Report
            </button>
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              <ArrowLeft size={16} /> Return to Dashboard
            </Link>
          </div>
        </div>

        {/* FLAGGED REFERRAL ALERT BANNER */}
        {flagged_for_referral && (
          <div className="card" style={{ backgroundColor: 'var(--color-high-risk-bg)', borderColor: 'var(--color-high-risk-border)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={28} color="var(--color-high-risk)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ color: 'var(--color-high-risk)', fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                  Flagged for Clinical Referral — Elevated Risk Detected
                </h3>
                <p style={{ color: 'var(--color-high-risk)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '0.85rem', opacity: 0.9 }}>
                  The screening results indicate noticeable deviations in memory recall latency and speech rhythm. We recommend sharing this report with a neurologist or geriatric physician.
                </p>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href="tel:+9102025678900" className="btn btn-primary" style={{ backgroundColor: 'var(--color-high-risk)', borderColor: 'var(--color-high-risk)', minHeight: '38px', fontSize: '0.875rem' }}>
                    <Phone size={16} /> Call NGO Helpline
                  </a>
                  <Link to="/team" className="btn btn-secondary" style={{ minHeight: '38px', fontSize: '0.875rem' }}>
                    Consult NGO Specialists
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RISK SCORE OVERVIEW CARD */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.3rem 1rem', marginBottom: '1.25rem' }}>
            {riskTier}
          </span>

          {/* CIRCULAR GAUGE METER */}
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="66" stroke="var(--color-border)" strokeWidth="14" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="66"
                stroke={gaugeColor}
                strokeWidth="14"
                fill="none"
                strokeDasharray={415}
                strokeDashoffset={415 - (415 * riskScore) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s ease', transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-heading)', display: 'block', lineHeight: 1 }}>
                {riskScore}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Risk Index
              </span>
            </div>
          </div>

          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.55 }}>
            {summary}
          </p>
        </div>

        {/* DOMAIN BREAKDOWN GRID */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-heading)' }}>
            Individual Domain Performance Breakdown
          </h2>

          <div className="grid-3">
            {/* MEMORY DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <Brain size={20} color="var(--color-brand-teal)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-heading)' }}>Short-Term Memory</h3>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
                {scores?.memory?.score ?? 80}%
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Recalled {scores?.memory?.correctCount ?? 4} of {scores?.memory?.totalShown ?? 5} words.
              </p>
            </div>

            {/* COGNITIVE LATENCY DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <Zap size={20} color="var(--color-mod-risk)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-heading)' }}>Reaction Latency</h3>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
                {scores?.cognitive?.avg_reaction_ms ?? 420} ms
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Mis-click errors: {scores?.cognitive?.errors ?? 1}.
              </p>
            </div>

            {/* SPEECH DOMAIN */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <Mic size={20} color="var(--color-brand-teal-dark)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-heading)' }}>Speech Acoustic Flow</h3>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
                {scores?.speech?.wpm ?? 92} WPM
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Pause ratio: {Math.round((scores?.speech?.pause_ratio ?? 0.15) * 100)}%.
              </p>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem', color: 'var(--color-heading)' }}>Recommendations & Clinical Next Steps</h3>
          <ul style={{ paddingLeft: '1.15rem', lineHeight: 1.75, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
            <li>Save or print a physical copy of this report for your primary healthcare provider.</li>
            <li>Maintain regular physical exercise, cognitive puzzle stimulation, and social interaction.</li>
            <li>Schedule a repeat screening evaluation in 3 to 6 months to monitor longitudinal cognitive stability.</li>
          </ul>
        </div>
      </div>
    </>
  );
};
