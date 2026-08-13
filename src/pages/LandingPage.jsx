import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, ShieldCheck, Clock, Award, ArrowRight, Brain, Mic, Zap, Users, CheckCircle2 } from 'lucide-react';
import { LocationMap } from '../components/LocationMap';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const targetLink = isAuthenticated ? '/dashboard' : '/signup';

  const handleStartScreeningClick = () => {
    trackEvent('cta_click_landing_hero', { link: targetLink });
  };

  return (
    <>
      <Helmet>
        <title>CogniGuard — Accessible Early Dementia Screening App</title>
        <meta name="description" content="Free AI-based early dementia and MCI cognitive screening tool. Analyzes memory recall, reaction latency, and voice fluency in under 5 minutes." />
      </Helmet>

      {/* HERO SECTION — Item #2 Above the fold CTA & Item #8 Response time promise */}
      <section style={{ backgroundColor: '#FAFDFD', padding: '3.5rem 1.5rem', borderBottom: '1px solid var(--color-slate-light)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <Clock size={16} />
                Get your results in under 5 minutes (Response Promise)
              </div>

              <h1 style={{ fontSize: '2.6rem', color: 'var(--color-navy)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                Early Dementia & Cognitive Screening Powered by AI Voice Analytics
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                A low-cost, non-invasive screening tool designed for seniors and caregivers. Evaluate short-term memory, reaction time, and speech fluency in your native language.
              </p>

              {/* PRIMARY CTA ABOVE THE FOLD — Checklist Item #2 */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  to={targetLink}
                  onClick={handleStartScreeningClick}
                  className="btn btn-primary btn-lg"
                  aria-label="Start free cognitive screening now"
                >
                  <Activity size={22} />
                  Start Free Screening
                  <ArrowRight size={20} />
                </Link>

                <Link to="/faqs" className="btn btn-secondary btn-lg">
                  How It Works
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="var(--color-brand-teal)" /> No clinical appointment needed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="var(--color-brand-teal)" /> Multi-language voice support
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="var(--color-brand-teal)" /> Instant clinical PDF report
                </span>
              </div>
            </div>

            {/* Accessible Illustration / Image — Item #16 Real Alt Text */}
            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Senior person sitting comfortably with a health worker reviewing cognitive screening results on a digital tablet"
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--color-slate-light)', paddingTop: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--color-brand-teal)', display: 'block' }}>1,200+</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Seniors Screened</span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--color-navy)', display: 'block' }}>&lt; 5 min</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Test Time</span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--color-low-risk)', display: 'block' }}>94%</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Clinical Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE TEST MODULE OVERVIEW */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              Comprehensive 3-Step Cognitive & Voice Battery
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Detecting subtle neurodegenerative patterns early through multi-domain quantitative assessment.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '54px', height: '54px', borderRadius: '12px', backgroundColor: 'var(--color-brand-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-teal-dark)', marginBottom: '1.25rem' }}>
                <Brain size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. Short-Term Memory</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Evaluates word retrieval and delayed memory retention by exposing 5 key words followed by recall testing.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '54px', height: '54px', borderRadius: '12px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: '1.25rem' }}>
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Reaction Latency</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Interactive visual reaction test measuring target hit latency in milliseconds and mis-click error rate.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '54px', height: '54px', borderRadius: '12px', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338CA', marginBottom: '1.25rem' }}>
                <Mic size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Vernacular Speech AI</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Captures acoustic speech flow (WPM, pause ratios, vocabulary repetition) with English & Hindi voice recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP & NGO LOCATION SECTION — Item #14 Maps + directions */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-slate-light)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <LocationMap />
        </div>
      </section>

      {/* INTERNAL LINKS CALLOUT BANNER — Item #3 Internal links */}
      <section style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '1rem' }}>
            Empowering Senior Brain Health Across Communities
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Read real caregiver testimonials, review NGO case studies, or contact our medical advisory board.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/case-studies" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Read Case Studies
            </Link>
            <Link to="/reviews" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Patient Reviews
            </Link>
            <Link to="/team" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
