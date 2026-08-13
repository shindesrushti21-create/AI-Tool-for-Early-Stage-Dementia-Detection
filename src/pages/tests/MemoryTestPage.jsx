import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Brain, Eye, CheckCircle, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';

const TARGET_WORDS = ['Apple', 'Clock', 'River', 'Garden', 'Blanket'];

export const MemoryTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const [phase, setPhase] = useState('exposure'); // 'exposure' | 'recall' | 'submitting'
  const [timeLeft, setTimeLeft] = useState(6);
  const [userInputs, setUserInputs] = useState(['', '', '', '', '']);
  const [selectedWords, setSelectedWords] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Candidate choice words for multi-choice recall
  const CHOICE_GRID = [
    'Apple', 'Chair', 'Clock', 'River', 'Ocean', 
    'Garden', 'Blanket', 'Pillow', 'Mirror', 'Window'
  ];

  useEffect(() => {
    trackEvent('test_memory_started', { sessionId });
  }, [sessionId]);

  // Exposure phase timer (6 seconds)
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

    // Combine typed inputs and clicked checkboxes
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

      // Proceed to Cognitive test screen in sequence
      navigate('/test/cognitive', { state: { sessionId } });
    } catch (err) {
      console.error('Memory test submit error:', err);
      // Fallback navigation
      navigate('/test/cognitive', { state: { sessionId } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Memory Recall Test — Step 1 of 3 — CogniGuard</title>
        <meta name="description" content="Step 1 of dementia cognitive assessment: short-term memory word exposure and recall evaluation." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            <span>Step 1 of 3: Short-Term Memory Assessment</span>
            <span>33% Completed</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--color-slate-light)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Brain size={30} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Short-Term Memory Word Recall
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              {phase === 'exposure' 
                ? 'Memorize the 5 words below before the timer runs out.' 
                : 'Now select or type as many of the 5 words as you can remember.'}
            </p>
          </div>

          {/* PHASE 1: EXPOSURE */}
          {phase === 'exposure' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontWeight: 800, fontSize: '1.1rem', marginBottom: '2rem' }}>
                <Clock size={20} />
                Words will disappear in: {timeLeft}s
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                {TARGET_WORDS.map((word, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.25rem 2rem',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--color-navy)',
                      border: '2px solid var(--color-brand-teal)',
                      boxShadow: 'var(--shadow-md)',
                      backgroundColor: '#FFFFFF',
                      minWidth: '130px'
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase('recall')}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.5rem' }}
              >
                I'm ready now (Skip countdown)
              </button>
            </div>
          )}

          {/* PHASE 2: RECALL */}
          {phase === 'recall' && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Option A: Click the words you remember seeing:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {CHOICE_GRID.map((word) => {
                    const isSelected = selectedWords.includes(word);
                    return (
                      <button
                        type="button"
                        key={word}
                        onClick={() => toggleSelectWord(word)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          padding: '0.6rem 1.25rem',
                          minHeight: '44px',
                          fontSize: '1rem',
                          borderColor: isSelected ? 'var(--color-brand-teal)' : 'var(--color-slate-light)'
                        }}
                      >
                        {isSelected && <CheckCircle size={16} />}
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--color-slate-light)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Option B: Or type any recalled words directly:
                </h3>
                <div className="grid-2" style={{ gap: '0.75rem' }}>
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
                <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
