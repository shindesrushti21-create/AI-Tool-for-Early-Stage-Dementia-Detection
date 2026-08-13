import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Target, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';

export const CognitiveTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const TOTAL_TRIALS = 5;
  const [trial, setTrial] = useState(0);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'finished'
  const [reactionTimes, setReactionTimes] = useState([]);
  const [errors, setErrors] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    trackEvent('test_cognitive_started', { sessionId });
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sessionId]);

  const startNextTrial = () => {
    setGameState('waiting');
    // Random delay between 1.5s and 3.5s
    const randomDelay = Math.floor(Math.random() * 2000) + 1500;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, randomDelay);
  };

  const handleTargetClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early! Record error
      setErrors(prev => prev + 1);
      clearTimeout(timerRef.current);
      alert('Too early! Wait for the target to turn bright GREEN before clicking.');
      setGameState('idle');
      return;
    }

    if (gameState === 'ready') {
      const elapsed = Date.now() - startTimeRef.current;
      const newTimes = [...reactionTimes, elapsed];
      setReactionTimes(newTimes);

      const nextTrial = trial + 1;
      setTrial(nextTrial);

      if (nextTrial >= TOTAL_TRIALS) {
        setGameState('finished');
      } else {
        setGameState('idle');
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const sum = reactionTimes.reduce((acc, curr) => acc + curr, 0);
    const avg_reaction_ms = reactionTimes.length > 0 ? Math.round(sum / reactionTimes.length) : 420;

    try {
      await api.post(`/api/sessions/${sessionId}/cognitive`, {
        avg_reaction_ms,
        errors,
        task_type: 'visual_reaction_speed'
      });

      trackEvent('test_cognitive_completed', {
        sessionId,
        avg_reaction_ms,
        errors
      });

      // Proceed to Speech test screen in sequence
      navigate('/test/speech', { state: { sessionId } });
    } catch (err) {
      console.error('Cognitive test submit error:', err);
      navigate('/test/speech', { state: { sessionId } });
    } finally {
      setSubmitting(false);
    }
  };

  const avgReaction = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <>
      <Helmet>
        <title>Cognitive Latency Test — Step 2 of 3 — CogniGuard</title>
        <meta name="description" content="Step 2 of dementia screening: visual reaction latency and motor-cognitive speed measurement." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            <span>Step 2 of 3: Visual Reaction Latency Test</span>
            <span>66% Completed</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--color-slate-light)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '66%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Zap size={30} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Visual Reaction Latency Test
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Trial {Math.min(trial + 1, TOTAL_TRIALS)} of {TOTAL_TRIALS}. Click <strong>START TRIAL</strong>, then tap the target as fast as you can when it turns <strong>BRIGHT GREEN</strong>.
            </p>
          </div>

          {/* GAME CANVAS BOX */}
          {gameState !== 'finished' ? (
            <div style={{ textAlign: 'center' }}>
              <div
                onClick={handleTargetClick}
                role="button"
                tabIndex={0}
                aria-label="Reaction target zone"
                style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                  backgroundColor: gameState === 'ready' 
                    ? 'var(--color-low-risk)' 
                    : gameState === 'waiting' 
                    ? '#E2E8F0' 
                    : '#FAFDFD',
                  border: gameState === 'ready' 
                    ? '4px solid #047857' 
                    : '2px dashed var(--color-brand-teal)',
                  boxShadow: gameState === 'ready' ? '0 0 30px rgba(5, 150, 105, 0.5)' : 'none',
                  marginBottom: '2rem'
                }}
              >
                {gameState === 'idle' && (
                  <div>
                    <Target size={48} color="var(--color-brand-teal)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-navy)' }}>
                      Press "Start Round {trial + 1}" Below
                    </p>
                  </div>
                )}

                {gameState === 'waiting' && (
                  <div>
                    <RefreshCw size={40} className="spin" style={{ color: 'var(--color-slate-muted)', marginBottom: '0.5rem' }} />
                    <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                      Get Ready... Wait for GREEN!
                    </p>
                  </div>
                )}

                {gameState === 'ready' && (
                  <div>
                    <Zap size={56} color="#FFFFFF" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ color: '#FFFFFF', fontSize: '2rem' }}>TAP / CLICK NOW!</h2>
                  </div>
                )}
              </div>

              {gameState === 'idle' && (
                <button
                  onClick={startNextTrial}
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: '220px' }}
                >
                  Start Round {trial + 1}
                </button>
              )}
            </div>
          ) : (
            /* FINISHED STATE */
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-low-risk-bg)', color: 'var(--color-low-risk)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                <CheckCircle2 size={36} style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reaction Test Complete!</h2>
                <p style={{ fontSize: '1.1rem' }}>
                  Average Latency: <strong>{avgReaction} ms</strong> | Mis-click Errors: <strong>{errors}</strong>
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {submitting ? 'Saving Latency Score...' : 'Continue to Step 3: Speech Analysis'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* REACTION HISTORY SCORES */}
          {reactionTimes.length > 0 && gameState !== 'finished' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-slate-light)', paddingTop: '1.25rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {reactionTimes.map((time, i) => (
                <span key={i} className="badge badge-low" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                  Trial {i + 1}: {time}ms
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
