import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Target, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';
import { useAccessibility } from '../../context/AccessibilityContext';

export const CognitiveTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAccessibility();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const TOTAL_TRIALS = 5;
  const [trial, setTrial] = useState(0);
  const [gameState, setGameState] = useState('idle');
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
    const randomDelay = Math.floor(Math.random() * 2000) + 1500;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, randomDelay);
  };

  const handleTargetClick = () => {
    if (gameState === 'waiting') {
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
        <title>{t('test_cognitive_title')} — Step 2 of 3 — CogniGuard</title>
        <meta name="description" content="Step 2 of dementia cognitive screening: visual reaction latency measurement in milliseconds." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
            <span>Step 2 of 3: Visual Reaction Latency Test</span>
            <span>66% Completed</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '66%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-mod-risk-bg)', color: 'var(--color-mod-risk)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Zap size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
              Visual Reaction Latency Test
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
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
                  height: '200px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                  backgroundColor: gameState === 'ready' 
                    ? '#059669' 
                    : gameState === 'waiting' 
                    ? 'var(--color-card-subtle)' 
                    : 'var(--color-card-bg)',
                  border: gameState === 'ready' 
                    ? '3px solid #047857' 
                    : '2px dashed var(--color-brand-teal)',
                  boxShadow: gameState === 'ready' ? '0 0 24px rgba(5, 150, 105, 0.4)' : 'none',
                  marginBottom: '1.5rem'
                }}
              >
                {gameState === 'idle' && (
                  <div>
                    <Target size={40} color="var(--color-brand-teal)" style={{ marginBottom: '0.4rem' }} />
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-heading)' }}>
                      Press "Start Round {trial + 1}" Below
                    </p>
                  </div>
                )}

                {gameState === 'waiting' && (
                  <div>
                    <RefreshCw size={32} className="spin" style={{ color: 'var(--color-text-muted)', marginBottom: '0.4rem' }} />
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
                      Get Ready... Wait for GREEN!
                    </p>
                  </div>
                )}

                {gameState === 'ready' && (
                  <div>
                    <Zap size={48} color="#FFFFFF" style={{ marginBottom: '0.4rem' }} />
                    <h2 style={{ color: '#FFFFFF', fontSize: '1.75rem' }}>TAP / CLICK NOW!</h2>
                  </div>
                )}
              </div>

              {gameState === 'idle' && (
                <button
                  onClick={startNextTrial}
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: '200px' }}
                >
                  Start Round {trial + 1}
                </button>
              )}
            </div>
          ) : (
            /* FINISHED STATE */
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-low-risk-bg)', color: 'var(--color-low-risk)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-low-risk-border)', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={32} style={{ marginBottom: '0.4rem' }} />
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Reaction Test Complete!</h2>
                <p style={{ fontSize: '1rem' }}>
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
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* REACTION HISTORY SCORES */}
          {reactionTimes.length > 0 && gameState !== 'finished' && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {reactionTimes.map((time, i) => (
                <span key={i} className="badge badge-low" style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}>
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
