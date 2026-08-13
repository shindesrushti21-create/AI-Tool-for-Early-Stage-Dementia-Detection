import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="main-container" style={{ padding: '0 0 2rem 0' }}>
        <div className="grid-3" style={{ gap: '2.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              <Activity size={24} color="var(--color-brand-teal)" />
              CogniGuard NGO
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6 }}>
              A low-cost, accessible AI cognitive screening platform enabling early dementia and MCI detection through voice, reaction latency, and memory recall evaluation.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
              <li><Link to="/case-studies">Clinical Case Studies</Link></li>
              <li><Link to="/faqs">Frequently Asked Questions</Link></li>
              <li><Link to="/reviews">Patient & Clinician Reviews</Link></li>
              <li><Link to="/team">Healthcare Team & Bios</Link></li>
              <li><Link to="/privacy-policy">Data Privacy & HIPAA Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '1.1rem' }}>24/7 Screening Helpline</h4>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="var(--color-brand-teal)" />
              +91 (020) 2567-8900 (Toll-Free Senior Helpline)
            </p>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--color-brand-teal)" />
              support@cogniguard-screening.org
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#CBD5E1', backgroundColor: '#1E293B', padding: '0.6rem', borderRadius: '8px' }}>
              <ShieldCheck size={18} color="var(--color-brand-teal)" />
              Encrypted & Confidential Healthcare Platform
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <p>© {new Date().getFullYear()} CogniGuard Foundation for Healthcare Innovation. Built for NGO Early Dementia Awareness.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <Heart size={14} color="#E11D48" fill="#E11D48" /> for Senior Cognitive Health
          </p>
        </div>
      </div>
    </footer>
  );
};
