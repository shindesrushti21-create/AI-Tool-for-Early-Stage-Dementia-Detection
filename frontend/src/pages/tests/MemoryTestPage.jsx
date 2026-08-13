import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Brain, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';
import { useAccessibility } from '../../context/AccessibilityContext';

const TARGET_WORDS = ['Apple', 'Clock', 'River', 'Garden', 'Blanket'];

export const MemoryTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAccessibility();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const [phase, setPhase] = useState('exposure');
  const [timeLeft, setTimeLeft] = useState(6);
  const [userInputs, setUserInputs] = useState(['', '', '', '', '']);
  const [selectedWords, setSelectedWords] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const CHOICE_GRID = [
    'Apple', 'Chair', 'Clock', 'River', 'Ocean', 
    'Garden', 'Blanket', 'Pillow', 'Mirror', 'Window'
  ];

  useEffect(() => {
    trackEvent('test_memory_started', { sessionId });
  }, [sessionId]);

  useEffect(() => {
    if (phase === 'exposure') {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('recall');
      }
    }
  }, [phase, timeLeft]);

  const toggleSelectWord = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleInputChange = (index, value) => {
    const updated = [...userInputs];
    updated[index] = value;
    setUserInputs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const typedWords = userInputs.map(w => w.trim()).filter(Boolean);
    const combinedRecalled = Array.from(new Set([...typedWords, ...selectedWords]));

    try {
      const res = await api.post(`/api/sessions/${sessionId}/memory`, {
        words_shown: TARGET_WORDS,
        words_recalled: combinedRecalled
      });

      trackEvent('test_memory_completed', {
        sessionId,
        score: res.data?.score
      });

      navigate('/test/cognitive', { state: { sessionId } });
    } catch (err) {
      console.error('Memory test submit error:', err);
      navigate('/test/cognitive', { state: { sessionId } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('test_memory_title')} — Step 1 of 3 — CogniGuard</title>
        <meta name="description" content="Step 1 of dementia cognitive assessment: short-term memory word exposure and recall evaluation." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
            <span>{t('test_memory_title')}</span>
            <span>33% Completed</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Brain size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
              {t('test_memory_title')}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {phase === 'exposure' 
                ? t('test_memory_desc') 
                : 'Now select or type as many of the 5 words as you can remember.'}
            </p>
          </div>

          {/* PHASE 1: EXPOSURE */}
          {phase === 'exposure' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-mod-risk-bg)', color: 'var(--color-mod-risk)', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1.5rem', border: '1px solid var(--color-mod-risk-border)' }}>
                <Clock size={16} />
                Words will disappear in: {timeLeft}s
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {TARGET_WORDS.map((word, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1rem 1.5rem',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--color-heading)',
                      border: '2px solid var(--color-brand-teal)',
                      backgroundColor: 'var(--color-card-bg)',
                      minWidth: '110px'
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase('recall')}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                I'm ready now (Skip countdown)
              </button>
            </div>
          )}

          {/* PHASE 2: RECALL */}
          {phase === 'recall' && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem', color: 'var(--color-heading)' }}>
                  Option A: Click the words you remember seeing:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {CHOICE_GRID.map((word) => {
                    const isSelected = selectedWords.includes(word);
                    return (
                      <button
                        type="button"
                        key={word}
                        onClick={() => toggleSelectWord(word)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          padding: '0.5rem 1rem',
                          minHeight: '38px',
                          fontSize: '0.9rem',
                          borderColor: isSelected ? 'var(--color-brand-teal)' : 'var(--color-border)'
                        }}
                      >
                        {isSelected && <CheckCircle size={14} />}
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem', color: 'var(--color-heading)' }}>
                  Option B: Or type any recalled words directly:
                </h3>
                <div className="grid-2" style={{ gap: '0.65rem' }}>
                  {userInputs.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Word #${idx + 1}`}
                      value={val}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      className="form-input"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {submitting ? 'Saving Memory Score...' : 'Submit Memory Test & Continue to Step 2'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
