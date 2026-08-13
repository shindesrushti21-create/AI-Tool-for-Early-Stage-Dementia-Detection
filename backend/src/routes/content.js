'use strict';

const express = require('express');
const db      = require('../config/db');

const router  = express.Router();

// All content routes are PUBLIC (no auth required per API contract)

// Fallback content in case database is offline
const FALLBACK_CASE_STUDIES = [
  {
    id: 'cs_1',
    title: 'Early Detection Changes Everything: Rajan\'s Story',
    body: 'Rajan, a 68-year-old retired schoolteacher, first noticed he was repeating questions during family conversations. Using CogniGuard screening, early MCI was identified, allowing timely medical intervention.',
    created_at: new Date().toISOString()
  },
  {
    id: 'cs_2',
    title: 'Helping Rural Communities Access Cognitive Care',
    body: 'In Wardha district, healthcare workers screened 42 adults in a single day. Six high-risk cases were referred to clinical specialists.',
    created_at: new Date().toISOString()
  }
];

const FALLBACK_FAQS = [
  {
    id: 'faq_1',
    question: 'Is CogniCare a diagnostic tool?',
    answer: 'No. CogniCare is an early screening and risk-assessment tool, not a clinical diagnosis. High risk results recommend consulting a neurologist or geriatric specialist.',
    sort_order: 1
  },
  {
    id: 'faq_2',
    question: 'How long does one screening session take?',
    answer: 'A full session — memory recall, reaction latency, and speech sample — takes approximately 5 minutes.',
    sort_order: 2
  },
  {
    id: 'faq_3',
    question: 'Does the application support vernacular languages?',
    answer: 'Yes! CogniCare includes built-in multilingual speech recognition supporting English (en-US), Hindi (hi-IN), Marathi (mr-IN), and Tamil (ta-IN).',
    sort_order: 3
  }
];

const FALLBACK_REVIEWS = [
  {
    id: 'rev_1',
    author: 'Dr. Anita Kulkarni, Geriatric Neurologist, Pune',
    rating: 5,
    body: 'CogniCare fills a genuine gap in our healthcare system. The 5-minute memory and speech breakdown provides invaluable pre-clinical insights.',
    created_at: new Date().toISOString()
  },
  {
    id: 'rev_2',
    author: 'Sunita R., Caregiver',
    rating: 5,
    body: 'The app was so easy for my 74-year-old mother to use at home. The Hindi voice option made her feel comfortable.',
    created_at: new Date().toISOString()
  }
];

// ─── GET /api/content/case-studies ──────────────────────────
router.get('/case-studies', async (_req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, title, body, created_at FROM case_studies ORDER BY created_at DESC'
    );
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.warn('[content/case-studies] DB query failed, returning fallback data:', err.message);
    return res.status(200).json({ data: FALLBACK_CASE_STUDIES });
  }
});

// ─── GET /api/content/faqs ──────────────────────────────────
router.get('/faqs', async (_req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, question, answer, sort_order FROM faqs ORDER BY sort_order ASC'
    );
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.warn('[content/faqs] DB query failed, returning fallback data:', err.message);
    return res.status(200).json({ data: FALLBACK_FAQS });
  }
});

// ─── GET /api/content/reviews ────────────────────────────────
router.get('/reviews', async (_req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, author, rating, body, created_at FROM reviews ORDER BY created_at DESC'
    );
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.warn('[content/reviews] DB query failed, returning fallback data:', err.message);
    return res.status(200).json({ data: FALLBACK_REVIEWS });
  }
});

// ─── GET /api/content/pages ──────────────────────────────────
// Per-page metadata for React Helmet / SEO — extend as needed.
router.get('/pages', (_req, res) => {
  const pages = [
    {
      path:        '/',
      title:       'CogniCare — Free AI Cognitive Screening for Dementia',
      description: 'Take a free, 15-minute cognitive screening test from home. CogniCare helps detect early signs of dementia and connects you with clinical care.',
    },
    {
      path:        '/about',
      title:       'About CogniCare — Our Mission & Team',
      description: 'Learn how CogniCare is making affordable dementia screening accessible across India through technology and community health workers.',
    },
    {
      path:        '/screen',
      title:       'Start Your Cognitive Screening — CogniCare',
      description: 'Begin your memory recall, reaction-time, and speech fluency assessment. Results are private and compared to your personal baseline.',
    },
    {
      path:        '/results',
      title:       'Your Screening Results — CogniCare',
      description: 'View your cognitive risk score, baseline comparison, and personalised recommendations from your latest CogniCare assessment.',
    },
    {
      path:        '/contact',
      title:       'Contact CogniCare — Get In Touch',
      description: 'Reach out to the CogniCare team for clinical referrals, partnership enquiries, or support.',
    },
    {
      path:        '/privacy',
      title:       'Privacy Policy — CogniCare',
      description: 'How CogniCare collects, stores, and protects your cognitive health data.',
    },
    {
      path:        '/thank-you',
      title:       'Thank You — CogniCare',
      description: 'Your message has been received. The CogniCare team will be in touch shortly.',
    },
  ];

  return res.status(200).json({ data: pages });
});

// ─── GET /api/content/location ────────────────────────────────
// NGO physical location — used by the frontend map embed.
router.get('/location', (_req, res) => {
  return res.status(200).json({
    data: {
      name:    process.env.NGO_NAME    || 'CogniCare Foundation',
      address: process.env.NGO_ADDRESS || '12, Health Avenue, Pune, Maharashtra 411001, India',
      lat:     parseFloat(process.env.NGO_LAT  || '18.5204'),
      lng:     parseFloat(process.env.NGO_LNG  || '73.8567'),
      phone:   process.env.NGO_PHONE   || '+91-20-12345678',
      email:   process.env.NGO_EMAIL   || 'info@cognicare.org',
      url:     process.env.NGO_URL     || 'https://cognicare.org',
    },
  });
});

// ─── POST /api/content/contact ────────────────────────────────
// Contact / referral form endpoint.
// Returns a redirect_url the frontend navigates to after submission.
router.post('/contact', async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  try {
    // Log the contact enquiry as an analytics event for demo/dashboard visibility
    await db.query(
      `INSERT INTO analytics_events (event_name, payload)
       VALUES ('contact_form_submitted', $1)`,
      [JSON.stringify({ name, email, phone: phone || null, message_length: message.length })]
    );

    return res.status(200).json({
      data: {
        success:      true,
        redirect_url: '/thank-you',
      },
    });
  } catch (err) {
    console.error('[content/contact]', err.message);
    return res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;
