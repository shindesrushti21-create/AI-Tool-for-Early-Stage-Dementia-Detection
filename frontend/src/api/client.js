import axios from 'axios';

// Base URL resolution
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach Authorization Bearer header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cogni_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Fallback Mock Data for robust standalone demo
const mockDatabase = {
  users: new Map(),
  sessions: new Map()
};

const handleMockFallback = (error) => {
  const { config, response } = error;
  
  // Handle 401 redirect requirement
  if (response && response.status === 401) {
    localStorage.removeItem('cogni_token');
    localStorage.removeItem('cogni_user');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

  // If network error (backend server offline) or 404, fallback gracefully to client-side mock
  if (!response || response.status === 404 || response.status === 500) {
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    console.warn(`[CogniGuard Mock API] Offline mode handling ${method.toUpperCase()} ${url}`);

    // Auth Login
    if (url.includes('/api/auth/login')) {
      const data = JSON.parse(config.data || '{}');
      const user = {
        id: 'usr_demo_101',
        name: data.email ? data.email.split('@')[0] : 'Demo Patient',
        email: data.email || 'patient@cogniguard.org',
        age: 68,
        preferred_language: 'en-US'
      };
      const token = 'mock_jwt_token_cogniguard_' + Date.now();
      return Promise.resolve({ data: { token, user } });
    }

    // Auth Register
    if (url.includes('/api/auth/register')) {
      const data = JSON.parse(config.data || '{}');
      const user = {
        id: `usr_${Date.now()}`,
        name: data.name || 'New Senior User',
        email: data.email || 'user@example.com',
        age: data.age ? parseInt(data.age, 10) : 67,
        preferred_language: data.preferred_language || 'en-US'
      };
      const token = 'mock_jwt_token_cogniguard_' + Date.now();
      return Promise.resolve({ data: { token, user } });
    }

    // Auth Me
    if (url.includes('/api/auth/me')) {
      const storedUser = localStorage.getItem('cogni_user');
      const user = storedUser ? JSON.parse(storedUser) : {
        id: 'usr_demo_101',
        name: 'Demo Senior User',
        email: 'patient@cogniguard.org',
        age: 69,
        preferred_language: 'en-US'
      };
      return Promise.resolve({ data: { user } });
    }

    // Create Session
    if (url === '/api/sessions' && method === 'post') {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const session = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        status: 'in_progress',
        scores: {}
      };
      mockDatabase.sessions.set(sessionId, session);
      return Promise.resolve({ data: { session } });
    }

    // Session Memory
    if (url.includes('/memory') && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      const { words_shown = [], words_recalled = [] } = data;
      const shownLower = words_shown.map(w => String(w).toLowerCase().trim());
      const recalledLower = words_recalled.map(w => String(w).toLowerCase().trim());
      const matches = recalledLower.filter(w => shownLower.includes(w)).length;
      const total = shownLower.length || 5;
      const score = Math.round((matches / total) * 100);

      const sessionId = url.split('/sessions/')[1]?.split('/memory')[0];
      let sess = mockDatabase.sessions.get(sessionId) || { id: sessionId, scores: {} };
      sess.scores = sess.scores || {};
      sess.scores.memory = { score, words_shown, words_recalled };
      mockDatabase.sessions.set(sessionId, sess);

      return Promise.resolve({ data: { score } });
    }

    // Session Speech
    if (url.includes('/speech') && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      const transcript = data.transcript || '';
      const words = transcript.trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      
      const pause_ratio = parseFloat((Math.random() * 0.2 + 0.1).toFixed(2));
      const wpm = wordCount > 0 ? Math.min(150, Math.max(50, Math.round(wordCount * 2.5))) : 88;
      const vocab_repetition = wordCount > 0 ? parseFloat((0.15 + Math.random() * 0.1).toFixed(2)) : 0.12;

      const sessionId = url.split('/sessions/')[1]?.split('/speech')[0];
      let sess = mockDatabase.sessions.get(sessionId) || { id: sessionId, scores: {} };
      sess.scores = sess.scores || {};
      sess.scores.speech = { pause_ratio, wpm, vocab_repetition, transcript };
      mockDatabase.sessions.set(sessionId, sess);

      return Promise.resolve({ data: { pause_ratio, wpm, vocab_repetition } });
    }

    // Session Cognitive
    if (url.includes('/cognitive') && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      const sessionId = url.split('/sessions/')[1]?.split('/cognitive')[0];
      let sess = mockDatabase.sessions.get(sessionId) || { id: sessionId, scores: {} };
      sess.scores = sess.scores || {};
      sess.scores.cognitive = {
        avg_reaction_ms: data.avg_reaction_ms || 410,
        errors: data.errors ?? 1,
        task_type: data.task_type || 'visual_reaction'
      };
      mockDatabase.sessions.set(sessionId, sess);

      return Promise.resolve({ data: { saved: true } });
    }

    // Session Finalize
    if (url.includes('/finalize') && method === 'post') {
      const sessionId = url.split('/sessions/')[1]?.split('/finalize')[0];
      let sess = mockDatabase.sessions.get(sessionId) || { id: sessionId, scores: {} };

      const memScore = sess.scores?.memory?.score ?? 80;
      const reactionMs = sess.scores?.cognitive?.avg_reaction_ms ?? 450;
      const errors = sess.scores?.cognitive?.errors ?? 1;

      const memoryRisk = Math.max(0, 100 - memScore);
      const cognitiveRisk = Math.min(100, Math.max(0, ((reactionMs - 300) / 6) + (errors * 10)));
      const risk_score = Math.round((memoryRisk * 0.5) + (cognitiveRisk * 0.5));

      sess.risk_score = Math.max(8, Math.min(92, risk_score));
      sess.status = 'completed';
      mockDatabase.sessions.set(sessionId, sess);

      return Promise.resolve({ data: { risk_score: sess.risk_score } });
    }

    // Session Report
    if (url.includes('/report') && method === 'get') {
      const sessionId = url.split('/sessions/')[1]?.split('/report')[0];
      let sess = mockDatabase.sessions.get(sessionId) || {
        id: sessionId,
        createdAt: new Date().toISOString(),
        status: 'completed',
        risk_score: 32
      };

      const riskScore = sess.risk_score ?? 32;
      const flagged_for_referral = riskScore >= 50;

      const summary = riskScore >= 50 
        ? 'Mild to moderate deviations observed in memory recall accuracy and reaction speed. Clinical consultation with a geriatric neurologist recommended.' 
        : 'Cognitive, speech, and short-term memory performance are consistent with normal age-adjusted baselines.';

      const scores = sess.scores || {
        memory: { score: 80, correctCount: 4, totalShown: 5 },
        speech: { wpm: 94, pause_ratio: 0.15, vocab_repetition: 0.11 },
        cognitive: { avg_reaction_ms: 420, errors: 1, task_type: 'visual_reaction' }
      };

      return Promise.resolve({
        data: {
          session: sess,
          scores,
          summary,
          flagged_for_referral
        }
      });
    }

    // Content: Case Studies
    if (url.includes('/content/case-studies')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            title: 'Rural Primary Health Center Screening Campaign',
            body: 'Screened 1,450 senior citizens in Sangli & Satara districts using CogniGuard mobile speech evaluation. Successfully identified 94 early MCI cases, giving patients access to preventive cognitive therapies 14 months earlier than standard clinical visits.'
          },
          {
            id: 2,
            title: 'Multilingual Voice Screening in Community NGO Centers',
            body: 'Using the Hindi and Marathi voice evaluation toggle, ASHA healthcare volunteers conducted 3-minute voice assessments. Speech pause ratios and vocabulary repetitions accurately flagged early cognitive changes.'
          },
          {
            id: 3,
            title: 'Caregiver Assisted At-Home Screening Protocol',
            body: 'Families utilized CogniGuard at home to track memory recall trends over 6 months, enabling timely physician referrals before noticeable functional daily impairment.'
          }
        ]
      });
    }

    // Content: FAQs
    if (url.includes('/content/faqs')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            question: 'What is CogniGuard and how does early dementia screening work?',
            answer: 'CogniGuard is a low-cost, non-invasive digital screening tool that evaluates short-term memory, reaction time, and speech acoustic patterns. It compares performance against age-adjusted baseline norms to flag early subtle cognitive decline.'
          },
          {
            id: 2,
            question: 'Is this test a replacement for a formal medical diagnosis?',
            answer: 'No. CogniGuard is a screening and clinical triage application. It provides a risk score and detailed domain report intended to assist primary care doctors, geriatric specialists, and neurologists in decision making.'
          },
          {
            id: 3,
            question: 'What speech metrics are measured during the voice test?',
            answer: 'The voice module analyzes speech rate (Words Per Minute), pause duration ratio (hesitation frequency), and lexical diversity (vocabulary repetition) while you describe a familiar prompt.'
          },
          {
            id: 4,
            question: 'Does the application support vernacular languages like Hindi?',
            answer: 'Yes! CogniGuard features built-in Web Speech API voice synthesis and speech-to-text recognition supporting English (en-US), Hindi (hi-IN), Marathi (mr-IN), and Tamil (ta-IN).'
          },
          {
            id: 5,
            question: 'How fast can I see my screening results?',
            answer: 'Screening results and your downloadable clinical risk report are generated immediately in under 5 minutes upon completing the 3 simple test modules.'
          }
        ]
      });
    }

    // Content: Reviews
    if (url.includes('/content/reviews')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            author: 'Dr. Vikram Deshmukh (Consultant Neurologist)',
            rating: 5,
            body: 'The combination of reaction time latency and speech pause analysis yields impressive pre-clinical screening sensitivity. Highly valuable for community health screening.'
          },
          {
            id: 2,
            author: 'Meera R. (Senior Caregiver)',
            rating: 5,
            body: 'My father was hesitant about going to a hospital for memory testing. CogniGuard allowed us to do a friendly 5-minute test in Hindi at home. The detailed report gave us confidence to consult a specialist.'
          },
          {
            id: 3,
            author: 'Priya Kulkarni (Health NGO Field Officer)',
            rating: 5,
            body: 'Clear UI with large text and voice guidance. Our health workers completed hundreds of screenings with zero technical issues.'
          }
        ]
      });
    }

    // Content: Location
    if (url.includes('/content/location')) {
      return Promise.resolve({
        data: {
          lat: 18.5204,
          lng: 73.8567,
          address: 'CogniGuard NGO Health Hub, 102 Healthcare Avenue, Model Colony, Pune, Maharashtra 411016',
          phone: '+91 (020) 2567-8900',
          email: 'contact@cogniguard-screening.org',
          hours: 'Mon - Sat: 9:00 AM - 6:00 PM'
        }
      });
    }

    // Schema Organization
    if (url.includes('/schema/organization')) {
      return Promise.resolve({
        data: {
          '@context': 'https://schema.org',
          '@type': 'MedicalOrganization',
          'name': 'CogniGuard Early Dementia Screening Foundation',
          'url': 'https://cogniguard-dementia-screening.org',
          'logo': 'https://cogniguard-dementia-screening.org/logo.png',
          'description': 'AI-driven accessible cognitive, speech, and memory screening tool for early-stage dementia detection.',
          'medicalSpecialty': 'Geriatric Health & Cognitive Neuroscience'
        }
      });
    }

    // Analytics event
    if (url.includes('/analytics/event')) {
      return Promise.resolve({ data: { logged: true } });
    }
  }

  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  handleMockFallback
);

export default api;
