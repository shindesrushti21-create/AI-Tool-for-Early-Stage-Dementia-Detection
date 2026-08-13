import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, Clock, ArrowRight, Brain, Mic, Zap, CheckCircle2 } from 'lucide-react';
import { LocationMap } from '../components/LocationMap';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { trackEvent } from '../utils/analytics';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useAccessibility();
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

      {/* HERO SECTION */}
      <section style={{ backgroundColor: 'var(--color-card-subtle)', padding: '2.5rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>
                <Clock size={15} />
                {t('hero_badge')}
              </div>

              <h1 style={{ fontSize: '2rem', color: 'var(--color-heading)', marginBottom: '0.85rem', lineHeight: 1.25 }}>
                {t('hero_title')}
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.55 }}>
                {t('hero_subtitle')}
              </p>

              {/* PRIMARY CTA */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  to={targetLink}
                  onClick={handleStartScreeningClick}
                  className="btn btn-primary btn-lg"
                  aria-label="Start free cognitive screening now"
                >
                  <Activity size={18} />
                  {t('hero_cta_primary')}
                  <ArrowRight size={18} />
                </Link>

                <Link to="/faqs" className="btn btn-secondary btn-lg">
                  {t('hero_cta_secondary')}
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" /> {t('hero_trust_1')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" /> {t('hero_trust_2')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" /> {t('hero_trust_3')}
                </span>
              </div>
            </div>

            {/* Illustration / Image */}
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Senior person sitting comfortably with a health worker reviewing cognitive screening results on a digital tablet"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--color-brand-teal)', display: 'block' }}>1,200+</strong>
                  <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>{t('stat_screened')}</span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--color-heading)', display: 'block' }}>&lt; 5 min</strong>
                  <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>{t('stat_time')}</span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--color-low-risk)', display: 'block' }}>94%</strong>
                  <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>{t('stat_accuracy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE TEST MODULE OVERVIEW */}
      <section style={{ padding: '3rem 1.25rem', backgroundColor: 'var(--color-bg)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.25rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              {t('section_tests_title')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {t('section_tests_subtitle')}
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: 'var(--color-brand-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-teal-dark)', marginBottom: '1rem' }}>
                <Brain size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-heading)' }}>{t('test_memory_title')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                {t('test_memory_desc')}
              </p>
            </div>

            <div className="card">
              <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: 'var(--color-mod-risk-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-mod-risk)', marginBottom: '1rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-heading)' }}>{t('test_cognitive_title')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                {t('test_cognitive_desc')}
              </p>
            </div>

            <div className="card">
              <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: 'var(--color-card-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-teal)', marginBottom: '1rem' }}>
                <Mic size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-heading)' }}>{t('test_speech_title')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                {t('test_speech_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP & NGO LOCATION SECTION */}
      <section style={{ padding: '2.5rem 1.25rem', backgroundColor: 'var(--color-card-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <LocationMap />
        </div>
      </section>

      {/* INTERNAL LINKS CALLOUT BANNER */}
      <section style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '2.5rem 1.25rem', textAlign: 'center' }}>
        <div className="main-container" style={{ padding: '0' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {t('cta_banner_title')}
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
            {t('cta_banner_subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/case-studies" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              {t('cta_read_case_studies')}
            </Link>
            <Link to="/reviews" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              {t('cta_patient_reviews')}
            </Link>
            <Link to="/team" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              {t('cta_meet_team')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
