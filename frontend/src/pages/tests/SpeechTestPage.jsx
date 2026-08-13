import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mic, MicOff, Globe, ArrowRight, Volume2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';
import { useAccessibility } from '../../context/AccessibilityContext';

export const SpeechTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useAccessibility();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);

  useEffect(() => {
    trackEvent('test_speech_started', { sessionId, language });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioLevel(0);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [sessionId, language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use the text entry box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAudioLevel(0);
    } else {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleLanguageToggle = (newLang) => {
    setLanguage(newLang);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) {
      alert('Please speak or type a short transcript before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/sessions/${sessionId}/speech`, {
        transcript
      });
      await api.post(`/api/sessions/${sessionId}/finalize`);

      trackEvent('test_speech_completed', { sessionId });
      navigate(`/report/${sessionId}`);
    } catch (err) {
      console.error('Speech test submit error:', err);
      navigate(`/report/${sessionId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const promptText = t('speech_prompt_text');

  return (
    <>
      <Helmet>
        <title>{t('speech_title')} — Step 3 of 3 — CogniGuard</title>
        <meta name="description" content="Step 3 of dementia screening: Web Speech voice analysis measuring hesitation pauses and vocabulary flow." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
            <span>{t('speech_step')}</span>
            <span>100% Completed</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-card-subtle)', color: 'var(--color-brand-teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Mic size={26} />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '0.35rem' }}>
              {t('speech_title')}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {t('speech_subtitle')}
            </p>
          </div>

          {/* VERNACULAR LANGUAGE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', backgroundColor: 'var(--color-card-subtle)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
            <Globe size={18} color="var(--color-brand-teal)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-heading)' }}>{t('speech_lang_label')}</span>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en-US')}
              className={`btn ${language === 'en-US' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', minHeight: '34px', fontSize: '0.825rem' }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('hi-IN')}
              className={`btn ${language === 'hi-IN' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', minHeight: '34px', fontSize: '0.825rem' }}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('mr-IN')}
              className={`btn ${language === 'mr-IN' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', minHeight: '34px', fontSize: '0.825rem' }}
            >
              मराठी (Marathi)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('ta-IN')}
              className={`btn ${language === 'ta-IN' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', minHeight: '34px', fontSize: '0.825rem' }}
            >
              தமிழ் (Tamil)
            </button>
          </div>

          {/* SPEAKING PROMPT BOX */}
          <div className="card" style={{ backgroundColor: 'var(--color-card-subtle)', borderLeft: '4px solid var(--color-brand-teal)', marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--color-heading)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Volume2 size={16} color="var(--color-brand-teal)" /> {t('speech_prompt_label')}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-heading)', fontWeight: 600 }}>
              "{promptText}"
            </p>
          </div>

          {/* VOICE RECORDING BUTTON & AUDIO WAVE ANIMATION */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={toggleListening}
              className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: '9999px',
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                backgroundColor: isListening ? '#E11D48' : 'transparent',
                borderColor: isListening ? '#E11D48' : 'var(--color-brand-teal)',
                color: isListening ? '#FFFFFF' : 'var(--color-brand-teal)',
                minHeight: '52px'
              }}
            >
              {isListening ? (
                <>
                  <MicOff size={20} /> {t('speech_mic_listening')}
                </>
              ) : (
                <>
                  <Mic size={20} /> {t('speech_mic_start')}
                </>
              )}
            </button>

            {/* AUDIO WAVE INDICATOR */}
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '1.25rem', height: '32px' }}>
                {[40, 70, 30, 90, 60, 100, 50, 80, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '5px',
                      height: `${Math.max(8, (h * audioLevel) / 100)}px`,
                      backgroundColor: 'var(--color-brand-teal)',
                      borderRadius: '3px',
                      transition: 'height 0.1s ease'
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* TRANSCRIPT TEXT ENTRY / VIEW */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="speech-transcript" className="form-label">
                {t('speech_transcript_label') || 'Captured Voice Transcript (or Type Manually):'}
              </label>
              <textarea
                id="speech-transcript"
                rows="3"
                required
                placeholder={t('speech_placeholder')}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="form-textarea"
                style={{ fontSize: '0.95rem', lineHeight: 1.55 }}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? t('speech_analyzing') : t('speech_submit_btn')}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
