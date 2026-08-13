import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mic, MicOff, Globe, ArrowRight, CheckCircle2, AlertCircle, Volume2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import api from '../../api/client';
import { trackEvent } from '../../utils/analytics';
import { useAccessibility } from '../../context/AccessibilityContext';

export const SpeechTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAccessibility();

  const sessionId = location.state?.sessionId || sessionStorage.getItem('current_session_id') || `sess_${Date.now()}`;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);

  useEffect(() => {
    trackEvent('test_speech_started', { sessionId, language });

    // Initialize Web Speech API recognition
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
        // Simulate audio wave fluctuation
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
    } else {
      setSpeechSupported(false);
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
      // 1. Submit speech analysis
      await api.post(`/api/sessions/${sessionId}/speech`, {
        transcript
      });

      // 2. Finalize total screening session
      await api.post(`/api/sessions/${sessionId}/finalize`);

      trackEvent('test_speech_completed', { sessionId });

      // Navigate to Final Clinical Report
      navigate(`/report/${sessionId}`);
    } catch (err) {
      console.error('Speech test submit error:', err);
      navigate(`/report/${sessionId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const promptText = language.startsWith('hi') 
    ? 'कृपया अपनी सुबह की दिनचर्या के बारे में 2-3 वाक्यों में बताएं (जैसे: आप कब उठते हैं, चाय पीना, सैर पर जाना)।'
    : 'Please describe your typical morning routine in 2 to 3 sentences (e.g. what time you wake up, having breakfast, going for a walk).';

  return (
    <>
      <Helmet>
        <title>Speech Pattern Analysis — Step 3 of 3 — CogniGuard</title>
        <meta name="description" content="Step 3 of dementia screening: Web Speech voice analysis measuring hesitation pauses and vocabulary flow." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        {/* STEP PROGRESS BAR */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            <span>Step 3 of 3: Speech & Acoustic Pattern Analysis</span>
            <span>100% Completed</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--color-slate-light)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-brand-teal)', borderRadius: '9999px' }}></div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4338CA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Mic size={30} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Vernacular Speech & Acoustic Analysis
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Voice rhythm, pause ratios, and vocabulary repetition provide subtle cognitive signals.
            </p>
          </div>

          {/* VERNACULAR LANGUAGE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem', backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Globe size={20} color="var(--color-brand-teal)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Speech Language:</span>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en-US')}
              className={`btn ${language === 'en-US' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.9rem', minHeight: '36px', fontSize: '0.9rem' }}
            >
              English (US)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('hi-IN')}
              className={`btn ${language === 'hi-IN' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.9rem', minHeight: '36px', fontSize: '0.9rem' }}
            >
              हिंदी (Hindi)
            </button>
          </div>

          {/* SPEAKING PROMPT BOX */}
          <div className="card" style={{ backgroundColor: '#FAFDFD', borderLeft: '4px solid var(--color-brand-teal)', marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={20} color="var(--color-brand-teal)" /> Voice Speech Prompt:
            </h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
              "{promptText}"
            </p>
          </div>

          {/* VOICE RECORDING BUTTON & AUDIO WAVE ANIMATION */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              type="button"
              onClick={toggleListening}
              className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: '9999px',
                padding: '1.25rem 2.5rem',
                fontSize: '1.2rem',
                backgroundColor: isListening ? '#E11D48' : 'transparent',
                borderColor: isListening ? '#E11D48' : 'var(--color-brand-teal)',
                color: isListening ? '#FFFFFF' : 'var(--color-brand-teal)',
                minHeight: '60px'
              }}
            >
              {isListening ? (
                <>
                  <MicOff size={24} /> Stop Recording Voice
                </>
              ) : (
                <>
                  <Mic size={24} /> Press to Start Voice Recording
                </>
              )}
            </button>

            {/* AUDIO WAVE INDICATOR */}
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.5rem', height: '40px' }}>
                {[40, 70, 30, 90, 60, 100, 50, 80, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: `${Math.max(10, (h * audioLevel) / 100)}px`,
                      backgroundColor: 'var(--color-brand-teal)',
                      borderRadius: '4px',
                      transition: 'height 0.1s ease'
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* TRANSCRIPT TEXT ENTRY / VIEW */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="speech-transcript" className="form-label">
                Captured Voice Transcript (or Type Manually):
              </label>
              <textarea
                id="speech-transcript"
                rows="4"
                required
                placeholder="Click the microphone button above to speak, or type your response here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="form-textarea"
                style={{ fontSize: '1.05rem', lineHeight: 1.6 }}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? 'Generating Clinical Risk Report...' : 'Finalize Screening & View Risk Score Report'}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
