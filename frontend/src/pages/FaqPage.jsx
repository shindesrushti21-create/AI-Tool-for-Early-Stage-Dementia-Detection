import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, Activity } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Accordion } from '../components/Accordion';
import api from '../api/client';

export const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/api/content/faqs');
        setFaqs(res.data);
      } catch (err) {
        console.error('FAQ fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions — CogniGuard</title>
        <meta name="description" content="Find answers to common questions about early dementia screening, speech voice analysis, memory testing, and clinical referrals." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <HelpCircle size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Learn how CogniGuard AI detects subtle cognitive changes and how to interpret your screening results.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <Activity size={32} className="spin" color="var(--color-brand-teal)" />
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>Loading FAQs...</p>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
            <Accordion items={faqs} />
          </div>
        )}
      </div>
    </>
  );
};
