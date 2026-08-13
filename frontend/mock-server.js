import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for sessions and users
const users = new Map();
const sessions = new Map();

// Helper token generator
const createToken = (email) => `token_${Buffer.from(email).toString('base64')}_${Date.now()}`;

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid Bearer token.' });
  }
  const token = authHeader.split(' ')[1];
  req.token = token;
  next();
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, age, preferred_language } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = {
    id: `usr_${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    age: age ? parseInt(age, 10) : 65,
    preferred_language: preferred_language || 'en-US',
    createdAt: new Date().toISOString()
  };
  const token = createToken(email);
  users.set(token, user);
  return res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = {
    id: `usr_${Date.now()}`,
    name: email.split('@')[0],
    email,
    age: 68,
    preferred_language: 'en-US',
    createdAt: new Date().toISOString()
  };
  const token = createToken(email);
  users.set(token, user);
  return res.json({ token, user });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.get(req.token) || {
    id: 'usr_demo',
    name: 'Healthcare Patient',
    email: 'patient@cogniguard.org',
    age: 67,
    preferred_language: 'en-US'
  };
  return res.json({ user });
});

// --- SESSION SCREENING ENDPOINTS ---
app.post('/api/sessions', authMiddleware, (req, res) => {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const session = {
    id: sessionId,
    createdAt: new Date().toISOString(),
    status: 'in_progress',
    scores: {
      memory: null,
      speech: null,
      cognitive: null
    },
    risk_score: null
  };
  sessions.set(sessionId, session);
  return res.json({ session });
});

app.post('/api/sessions/:id/memory', (req, res) => {
  const { id } = req.params;
  const { words_shown = [], words_recalled = [] } = req.body;
  
  const shownLower = (words_shown || []).map(w => w.toLowerCase().trim());
  const recalledLower = (words_recalled || []).map(w => w.toLowerCase().trim());
  
  const correctCount = recalledLower.filter(w => shownLower.includes(w)).length;
  const totalShown = shownLower.length || 5;
  const scoreRatio = correctCount / totalShown;
  const score = Math.round(scoreRatio * 100);

  let session = sessions.get(id) || { id, scores: {} };
  session.scores.memory = {
    words_shown,
    words_recalled,
    correctCount,
    totalShown,
    score
  };
  sessions.set(id, session);

  return res.json({ score });
});

app.post('/api/sessions/:id/speech', (req, res) => {
  const { id } = req.params;
  const { transcript = '' } = req.body;

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  // Calculate simulated analytical metrics
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocab_repetition = wordCount > 0 ? parseFloat(((wordCount - uniqueWords.size) / wordCount).toFixed(2)) : 0.15;
  const wpm = wordCount > 0 ? Math.min(160, Math.max(45, Math.round((wordCount / 30) * 60))) : 85;
  const pause_ratio = parseFloat((Math.random() * 0.25 + 0.12).toFixed(2));

  let session = sessions.get(id) || { id, scores: {} };
  session.scores.speech = {
    transcript,
    pause_ratio,
    wpm,
    vocab_repetition
  };
  sessions.set(id, session);

  return res.json({ pause_ratio, wpm, vocab_repetition });
});

app.post('/api/sessions/:id/cognitive', (req, res) => {
  const { id } = req.params;
  const { avg_reaction_ms, errors, task_type } = req.body;

  let session = sessions.get(id) || { id, scores: {} };
  session.scores.cognitive = {
    avg_reaction_ms: avg_reaction_ms || 420,
    errors: errors ?? 1,
    task_type: task_type || 'visual_reaction'
  };
  sessions.set(id, session);

  return res.json({ saved: true });
});

app.post('/api/sessions/:id/finalize', (req, res) => {
  const { id } = req.params;
  let session = sessions.get(id) || { id, scores: {} };

  const memScore = session.scores.memory?.score ?? 70; // higher is better
  const reactionMs = session.scores.cognitive?.avg_reaction_ms ?? 480; // lower is better
  const errors = session.scores.cognitive?.errors ?? 1;
  const pauseRatio = session.scores.speech?.pause_ratio ?? 0.2;

  // Algorithm for dementia risk score (0 - 100%)
  // Memory weight: 45%, Cognitive weight: 35%, Speech weight: 20%
  const memoryRisk = Math.max(0, 100 - memScore);
  const cognitiveRisk = Math.min(100, Math.max(0, ((reactionMs - 300) / 7) + (errors * 12)));
  const speechRisk = Math.min(100, pauseRatio * 200);

  const calculatedRisk = Math.round((memoryRisk * 0.45) + (cognitiveRisk * 0.35) + (speechRisk * 0.20));
  const risk_score = Math.max(5, Math.min(95, calculatedRisk));

  session.risk_score = risk_score;
  session.status = 'completed';
  sessions.set(id, session);

  return res.json({ risk_score });
});

app.get('/api/sessions/:id/report', (req, res) => {
  const { id } = req.params;
  const session = sessions.get(id) || {
    id,
    createdAt: new Date().toISOString(),
    status: 'completed',
    risk_score: 34
  };

  const riskScore = session.risk_score ?? 34;
  const flagged_for_referral = riskScore >= 50;

  let riskLevel = 'Low Risk';
  let summary = 'Cognitive and speech patterns are currently within the expected range for age baseline. Annual follow-up screening recommended.';
  
  if (riskScore >= 70) {
    riskLevel = 'High Risk';
    summary = 'Significant subtle deviations detected across memory recall and speech fluency metrics. Immediate clinical consultation with a neurologist or geriatric specialist is strongly recommended.';
  } else if (riskScore >= 45) {
    riskLevel = 'Moderate Risk';
    summary = 'Mild deviations noted in visual reaction time and memory word recall. Recommended to schedule a formal clinical evaluation with a primary care physician.';
  }

  const scores = session.scores || {
    memory: { score: 75, correctCount: 4, totalShown: 5 },
    speech: { wpm: 92, pause_ratio: 0.18, vocab_repetition: 0.12 },
    cognitive: { avg_reaction_ms: 430, errors: 1, task_type: 'visual_reaction' }
  };

  return res.json({
    session,
    scores,
    summary,
    risk_level: riskLevel,
    flagged_for_referral
  });
});

// --- CONTENT ENDPOINTS ---
app.get('/api/content/case-studies', (req, res) => {
  return res.json([
    {
      id: 1,
      title: 'Community Health Outreach in Rural Maharashtra',
      body: 'Deployed CogniGuard across 14 rural primary healthcare centres in Sangli district. Over 1,200 seniors were screened in 3 months, identifying 87 early-stage MCI (Mild Cognitive Impairment) cases for timely medical intervention.'
    },
    {
      id: 2,
      title: 'Early Detection Prevents Sudden Functional Decline',
      body: 'A 71-year-old retired teacher completed the speech and memory assessment. Early detection allowed her healthcare provider to prescribe cognitive therapy and baseline lifestyle modifications 18 months before clinical onset.'
    },
    {
      id: 3,
      title: 'NGO Vernacular Voice Screening Initiative',
      body: 'By supporting Hindi, Marathi, and Tamil voice synthesis, CogniGuard empowered community healthcare workers (ASHAs) to conduct low-friction cognitive screenings directly in patients\' native tongues.'
    }
  ]);
});

app.get('/api/content/faqs', (req, res) => {
  return res.json([
    {
      id: 1,
      question: 'What is CogniGuard and how does early dementia screening work?',
      answer: 'CogniGuard is a non-invasive mobile and web cognitive screening application designed by healthcare research teams. It analyzes speech fluency, short-term memory recall, and reaction latency to detect early subtle deviations from age-adjusted baseline cognitive performance.'
    },
    {
      id: 2,
      question: 'Is this app a substitute for a clinical diagnosis by a neurologist?',
      answer: 'No. CogniGuard is a preliminary screening and risk assessment tool designed for early detection and clinical triage. If your risk score is elevated or flagged, the app provides a clinical summary report to share with a physician.'
    },
    {
      id: 3,
      question: 'What speech tasks are included and why is voice analyzed?',
      answer: 'Speech analysis measures hesitation pauses, words per minute (WPM), and vocabulary repetition rates while describing simple daily activities. Subtle changes in speech tempo and word retrieval often manifest earlier than visible physical symptoms.'
    },
    {
      id: 4,
      question: 'Does the application support regional vernacular languages?',
      answer: 'Yes! CogniGuard includes built-in multilingual speech recognition supporting English (en-US), Hindi (hi-IN), Marathi (mr-IN), and Tamil (ta-IN).'
    },
    {
      id: 5,
      question: 'How is patient health data protected and stored?',
      answer: 'All screening data and transcripts are encrypted end-to-end in compliance with healthcare data privacy standards. We do not sell or expose individual screening data.'
    }
  ]);
});

app.get('/api/content/reviews', (req, res) => {
  return res.json([
    {
      id: 1,
      author: 'Dr. Ananya Sharma (Geriatric Specialist)',
      rating: 5,
      body: 'CogniGuard fills a massive gap in community screening. The 5-minute memory and speech breakdown provides invaluable pre-clinical insights before formal MMSE tests.'
    },
    {
      id: 2,
      author: 'Rajesh K. (Caregiver & Son)',
      rating: 5,
      body: 'The app was so easy for my 74-year-old mother to use at home. The Hindi voice option made her feel comfortable, and the final report helped us start an early discussion with her neurologist.'
    },
    {
      id: 3,
      author: 'Sunita Patil (NGO Program Coordinator)',
      rating: 5,
      body: 'Our healthcare workers used CogniGuard in door-to-door senior wellness camps. Fast, intuitive, and extremely accurate.'
    }
  ]);
});

app.get('/api/content/location', (req, res) => {
  return res.json({
    lat: 18.5204,
    lng: 73.8567,
    address: 'CogniGuard NGO Health Hub, 102 Healthcare Avenue, Model Colony, Pune, Maharashtra 411016',
    phone: '+91 (020) 2567-8900',
    email: 'contact@cogniguard-screening.org',
    hours: 'Mon - Sat: 9:00 AM - 6:00 PM'
  });
});

app.get('/api/schema/organization', (req, res) => {
  return res.json({
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    'name': 'CogniGuard Early Dementia Screening Foundation',
    'url': 'https://cogniguard-dementia-screening.org',
    'logo': 'https://cogniguard-dementia-screening.org/logo.png',
    'description': 'AI-driven accessible cognitive, speech, and memory screening tool for early-stage dementia detection.',
    'medicalSpecialty': 'Geriatric Health & Cognitive Neuroscience',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '102 Healthcare Avenue, Model Colony',
      'addressLocality': 'Pune',
      'addressRegion': 'Maharashtra',
      'postalCode': '411016',
      'addressCountry': 'IN'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-020-2567-8900',
      'contactType': 'Patient Screening Helpline'
    }
  });
});

app.post('/api/analytics/event', (req, res) => {
  const { event_name, payload } = req.body;
  console.log(`[ANALYTICS EVENT] ${event_name}:`, payload);
  return res.json({ logged: true });
});

app.listen(PORT, () => {
  console.log(`CogniGuard Mock Express API running at http://localhost:${PORT}`);
});
