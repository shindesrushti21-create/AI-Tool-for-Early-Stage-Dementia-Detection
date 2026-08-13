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

        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <BookOpen size={30} />
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            Clinical & NGO Field Case Studies
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Documented impact of CogniGuard across community health centers, senior care facilities, and home screening programs.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Activity size={36} className="spin" color="var(--color-brand-teal)" />
            <p>Loading Case Studies...</p>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
            {studies.map((item) => (
              <div key={item.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                    <CheckCircle2 size={16} /> NGO Field Impact
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                    {item.title}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
