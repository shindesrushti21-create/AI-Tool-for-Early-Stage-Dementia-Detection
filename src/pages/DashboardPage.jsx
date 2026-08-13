import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, Play, FileText, Calendar, CheckCircle2, AlertTriangle, ArrowRight, Brain } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { trackEvent } from '../utils/analytics';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  // Mock list of past sessions for dashboard view
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
      // Store current session ID in session storage for state persistence
      sessionStorage.setItem('current_session_id', session.id);
      navigate('/test/memory', { state: { sessionId: session.id } });
    } catch (err) {
      console.error('Failed to create session:', err);
      // Fallback navigation with timestamp ID
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
        {/* Item #5 Breadcrumb Trail */}
        <Breadcrumbs />

        {/* USER WELCOME HEADER */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'var(--color-navy)', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(13, 148, 136, 0.25)', color: 'var(--color-brand-teal-light)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Brain size={16} /> Patient Profile Active
              </div>
              <h1 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '0.4rem' }}>
                Welcome, {user?.name || 'Senior Participant'}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1rem' }}>
                Age: <strong>{user?.age || 68} years</strong> | Language: <strong>{user?.preferred_language || 'English'}</strong> | NGO Screening ID: #{user?.id || 'usr_demo'}
              </p>
            </div>

            <button
              onClick={handleStartNewSession}
              disabled={starting}
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: 'var(--color-brand-teal)', minWidth: '240px' }}
            >
              <Play size={22} fill="#FFFFFF" />
              {starting ? 'Initializing Test...' : 'Start New 5-Min Screening'}
            </button>
          </div>
        </div>

        {/* SCREENING TEST MODULE STEPS PREVIEW */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--color-navy)' }}>
            Screening Evaluation Sequence (3 Short Tests)
          </h2>

          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid var(--color-brand-teal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--color-brand-teal)', fontSize: '0.85rem' }}>STEP 1</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>~ 2 mins</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Memory Recall Test</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                View 5 target words for 6 seconds, then recall them from a list and text input.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: '#D97706', fontSize: '0.85rem' }}>STEP 2</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>~ 1.5 mins</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Cognitive Reaction Speed</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Tap target shapes as fast as possible over 5 rounds to measure reaction latency.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #4338CA' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: '#4338CA', fontSize: '0.85rem' }}>STEP 3</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>~ 1.5 mins</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Speech Voice Analysis</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Speak a short response using speech-to-text. Evaluates pauses and vocabulary rhythm.
              </p>
            </div>
          </div>
        </div>

        {/* PAST SESSIONS HISTORY */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>
              Past Screening History & Clinical Reports
            </h2>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid var(--color-slate-light)', color: 'var(--color-navy)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Screening Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Session ID</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Overall Risk Score</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Risk Level</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastSessions.map((sess) => (
                  <tr key={sess.id} style={{ borderBottom: '1px solid var(--color-slate-light)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      <Calendar size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-brand-teal)' }} />
                      {sess.date}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {sess.id}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{sess.riskScore}%</strong>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-low">
                        <CheckCircle2 size={14} /> {sess.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <Link to={`/report/${sess.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', minHeight: '36px' }}>
                        <FileText size={16} /> View Report
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
