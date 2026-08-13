import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Activity } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import api from '../api/client';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/content/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Reviews fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <Helmet>
        <title>Patient & Clinician Reviews — CogniGuard</title>
        <meta name="description" content="Read authentic reviews and feedback from senior patients, caregivers, and geriatric specialists." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-mod-risk-bg)', color: 'var(--color-mod-risk)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Star size={26} fill="var(--color-mod-risk)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            Reviews & Testimonials
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Feedback from doctors, family caregivers, and health workers who use CogniGuard for early cognitive triage.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <Activity size={32} className="spin" color="var(--color-brand-teal)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>Loading Reviews...</p>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="card" style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div>
                  {/* STAR RATING */}
                  <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--color-mod-risk)', marginBottom: '0.75rem' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-mod-risk)" />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    "{rev.body}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-heading)', display: 'block' }}>
                    {rev.author}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
