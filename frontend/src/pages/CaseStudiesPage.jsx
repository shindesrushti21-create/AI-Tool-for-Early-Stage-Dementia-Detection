import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Activity, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import api from '../api/client';

export const CaseStudiesPage = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await api.get('/api/content/case-studies');
        setStudies(res.data);
      } catch (err) {
        console.error('Case studies fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  return (
    <>
      <Helmet>
        <title>Clinical Case Studies — CogniGuard NGO Outreach</title>
        <meta name="description" content="Explore real NGO field trial case studies demonstrating early dementia detection in rural primary health centers." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <BookOpen size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            Clinical & NGO Field Case Studies
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Documented impact of CogniGuard across community health centers, senior care facilities, and home screening programs.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <Activity size={32} className="spin" color="var(--color-brand-teal)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>Loading Case Studies...</p>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {studies.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.35rem 1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={14} /> NGO Field Impact
                </div>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
