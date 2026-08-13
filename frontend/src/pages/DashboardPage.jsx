import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Play, FileText, Calendar, CheckCircle2, Brain } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../api/client';
import { trackEvent } from '../utils/analytics';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useAccessibility();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const [pastSessions] = useState([
    {
      id: 'sess_prev_101',
      date: '2026-08-01',
      riskScore: 28,
      riskLevel: 'Low Risk',
      status: 'completed'
    },
    {
      id: 'sess_prev_102',
      date: '2026-05-15',
      riskScore: 34,
      riskLevel: 'Low Risk',
      status: 'completed'
    }
  ]);

  const handleStartNewSession = async () => {
    setStarting(true);
    try {
      trackEvent('start_new_screening_session');
      const res = await api.post('/api/sessions');
      const session = res.data.session;
      sessionStorage.setItem('current_session_id', session.id);
      navigate('/test/memory', { state: { sessionId: session.id } });
    } catch (err) {
      console.error('Failed to create session:', err);
      const fallbackId = `sess_${Date.now()}`;
      sessionStorage.setItem('current_session_id', fallbackId);
      navigate('/test/memory', { state: { sessionId: fallbackId } });
    } finally {
      setStarting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard — CogniGuard Dementia Screening</title>
        <meta name="description" content="View your cognitive health dashboard, initiate new screening sessions, and access clinical risk reports." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* USER WELCOME HEADER CARD */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Brain size={14} /> {t('dashboard_badge')}
              </div>
              <h1 style={{ color: 'var(--color-heading)', fontSize: '1.65rem', marginBottom: '0.25rem' }}>
                {t('dashboard_welcome')} {user?.name || 'Senior Participant'}
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('dashboard_age')}: <strong style={{ color: 'var(--color-heading)' }}>{user?.age || 68} years</strong> | {t('dashboard_language')}: <strong style={{ color: 'var(--color-heading)' }}>{user?.preferred_language || 'English'}</strong> | NGO Screening ID: #{user?.id || 'usr_demo'}
              </p>
            </div>

            <button
              onClick={handleStartNewSession}
              disabled={starting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px' }}
            >
              <Play size={18} fill="#FFFFFF" />
              {starting ? t('dashboard_starting') : t('dashboard_start_btn')}
            </button>
          </div>
        </div>

        {/* SCREENING TEST MODULE STEPS PREVIEW */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-heading)' }}>
            Screening Evaluation Sequence (3 Short Tests)
          </h2>

          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid var(--color-brand-teal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-brand-teal)', fontSize: '0.775rem' }}>STEP 1</span>
                <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>~ 2 mins</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--color-heading)' }}>Memory Recall Test</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                View 5 target words for 6 seconds, then recall them from a list and text input.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-mod-risk)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-mod-risk)', fontSize: '0.775rem' }}>STEP 2</span>
                <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>~ 1.5 mins</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--color-heading)' }}>Cognitive Reaction Speed</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Tap target shapes as fast as possible over 5 rounds to measure reaction latency.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-brand-teal-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-brand-teal-dark)', fontSize: '0.775rem' }}>STEP 3</span>
                <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>~ 1.5 mins</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--color-heading)' }}>Speech Voice Analysis</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Speak a short response using speech-to-text. Evaluates pauses and vocabulary rhythm.
              </p>
            </div>
          </div>
        </div>

        {/* PAST SESSIONS HISTORY */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-heading)' }}>
              Past Screening History & Clinical Reports
            </h2>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-card-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-heading)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Screening Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Session ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Overall Risk Score</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Risk Level</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastSessions.map((sess) => (
                  <tr key={sess.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-brand-teal)' }} />
                      {sess.date}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {sess.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-heading)' }}>{sess.riskScore}%</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-low">
                        <CheckCircle2 size={13} /> {sess.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <Link to={`/report/${sess.id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem', minHeight: '34px' }}>
                        <FileText size={14} /> View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
