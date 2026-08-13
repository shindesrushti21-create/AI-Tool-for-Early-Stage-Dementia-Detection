import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const Footer = () => {
  const { t } = useAccessibility();

  return (
    <footer className="site-footer" role="contentinfo">
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 1.25rem 1.25rem' }}>
        <div className="grid-3" style={{ gap: '2rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.65rem' }}>
              <Activity size={22} color="#14B8A6" />
              CogniGuard NGO
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
              {t('hero_subtitle')}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '0.85rem', fontSize: '1rem', fontWeight: 700 }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/case-studies">{t('nav_case_studies')}</Link></li>
              <li><Link to="/faqs">{t('nav_faqs')}</Link></li>
              <li><Link to="/reviews">{t('nav_reviews')}</Link></li>
              <li><Link to="/team">{t('nav_team')}</Link></li>
              <li><Link to="/privacy-policy">{t('nav_privacy')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '0.85rem', fontSize: '1rem', fontWeight: 700 }}>24/7 Screening Helpline</h4>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Phone size={15} color="#14B8A6" />
              +91 (020) 2567-8900 (Toll-Free Senior Helpline)
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Mail size={15} color="#14B8A6" />
              support@cogniguard-screening.org
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#CBD5E1', backgroundColor: '#1E293B', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <ShieldCheck size={16} color="#14B8A6" />
              Encrypted & Confidential Healthcare Platform
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.825rem', color: '#64748B' }}>
          <p>© {new Date().getFullYear()} CogniGuard Foundation for Healthcare Innovation.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <Heart size={13} color="#E11D48" fill="#E11D48" /> for Senior Cognitive Health
          </p>
        </div>
      </div>
    </footer>
  );
};
