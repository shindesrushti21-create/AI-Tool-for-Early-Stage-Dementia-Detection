import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, Activity } from 'lucide-react';
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

        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Star size={30} fill="#D97706" />
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            Reviews & Testimonials
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Feedback from doctors, family caregivers, and health workers who use CogniGuard for early cognitive triage.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Activity size={36} className="spin" color="var(--color-brand-teal)" />
            <p>Loading Reviews...</p>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '1.75rem', marginBottom: '3rem' }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* STAR RATING */}
                  <div style={{ display: 'flex', gap: '0.25rem', color: '#D97706', marginBottom: '1rem' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={18} fill="#D97706" />
                    ))}
                  </div>

                  <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.6, italic: 'true', marginBottom: '1.25rem' }}>
                    "{rev.body}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-slate-light)', paddingTop: '0.85rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy)', display: 'block' }}>
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
