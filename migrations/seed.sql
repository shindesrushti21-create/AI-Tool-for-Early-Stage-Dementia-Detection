-- ============================================================
-- Seed Data
-- Dementia Screening App — Demo Content
-- Run AFTER 001_init.sql:  psql $DATABASE_URL -f migrations/seed.sql
-- ============================================================

-- ─── Case Studies ────────────────────────────────────────────
INSERT INTO case_studies (title, body) VALUES
(
  'Early Detection Changes Everything: Rajan''s Story',
  'Rajan, a 68-year-old retired schoolteacher from Nagpur, first noticed he was repeating questions during family conversations. His daughter encouraged him to use the CogniCare screening tool. His first session scored in the Medium risk band, and after two follow-up clinical visits, mild cognitive impairment was confirmed. Early intervention — lifestyle changes and medication — slowed progression significantly. "I would not have gone to a doctor on my own," Rajan admitted. "The app made it easy and non-scary."'
),
(
  'Helping Rural Communities Access Cognitive Care',
  'In the Wardha district, an NGO health worker used CogniCare on a tablet during a village health camp to screen 42 adults over age 60 in a single day. Six participants were flagged as High risk and referred to the nearest district hospital. Without the digital tool, these screenings would have required a trained neurologist''s visit — a near impossibility in that setting. The tool''s offline-capable design and simple interface proved critical in low-connectivity environments.'
),
(
  'Tracking Progress: How Baseline Comparison Works for Meena',
  'Meena, 72, was screened by her son using CogniCare at home after her husband noticed memory slips. Her baseline session in January scored Low risk (composite 32). A follow-up screening six months later showed a composite of 51, a 59% deviation from baseline — automatically flagged as Medium risk with a clinical referral recommendation. Her neurologist praised the longitudinal data the app provided: "Having a personal baseline to compare against is far more meaningful than a population average."'
),
(
  'Speech Pattern Analysis: A Subtle Early Signal',
  'Research shows that changes in speech fluency — reduced words-per-minute, increased hesitation words, and vocabulary repetition — can precede other dementia symptoms by years. CogniCare''s speech module captures a 60-second verbal description task and automatically computes these metrics. In a pilot with 120 participants at a Pune memory clinic, the speech component alone achieved 71% sensitivity for MCI detection when compared against neuropsychologist assessments.'
),
(
  'From Stigma to Screening: Changing Attitudes in Semi-Urban India',
  'One of the biggest barriers to dementia care in India is stigma — families often dismiss symptoms as "normal ageing." CogniCare''s gentle, game-like interface reframes cognitive screening as a routine wellness check rather than a medical test. In a six-month community pilot in Aurangabad, monthly active screeners increased from 40 to 310, and caregiver awareness of early dementia signs increased by 64% as measured by a post-survey.'
);

-- ─── FAQs ────────────────────────────────────────────────────
INSERT INTO faqs (question, answer, sort_order) VALUES
(
  'Is CogniCare a diagnostic tool?',
  'No. CogniCare is an early screening and risk-assessment tool, not a clinical diagnosis. A High risk result means you should consult a qualified neurologist or geriatrician. Only a medical professional can diagnose dementia or mild cognitive impairment (MCI).',
  1
),
(
  'How long does one screening session take?',
  'A full session — memory recall, reaction-time task, and speech sample — takes approximately 10–15 minutes. You can complete it at home, on your phone or tablet, without any special equipment.',
  2
),
(
  'What happens to my data?',
  'Your data is stored securely and is only used to compute your risk score and track your personal progress over time. We do not share individual data with third parties. All data is encrypted in transit and at rest.',
  3
),
(
  'Why does the app compare me to my own baseline instead of population averages?',
  'Cognitive ability varies widely between individuals. What is "normal" for one person may not be for another. By comparing your current session to your first (baseline) session, CogniCare detects meaningful personal changes — a much more sensitive signal than a fixed population threshold.',
  4
),
(
  'Can I use this tool for a family member who is not comfortable with technology?',
  'Yes. A caregiver or family member can administer the test on behalf of the patient. The interface is designed to be simple, with large text and audio instructions. The app supports multiple Indian languages in the frontend — contact us for details.',
  5
);

-- ─── Reviews ─────────────────────────────────────────────────
INSERT INTO reviews (author, rating, body) VALUES
(
  'Dr. Anita Kulkarni, Geriatric Neurologist, Pune',
  5,
  'CogniCare fills a genuine gap in our healthcare system. I now recommend it to families of at-risk patients as a between-visit monitoring tool. The baseline deviation feature is clinically meaningful and the reports are easy for both patients and families to understand.'
),
(
  'Sunita R., Caregiver (daughter of patient)',
  5,
  'My mother is 74 and lives alone. I was worried about her memory but she refused to "see a doctor for something so small." The CogniCare app was a turning point — she treated it like a game, and when the result flagged Medium risk, she agreed to see a specialist. It changed everything for us. Thank you.'
),
(
  'Vikram Desai, Healthcare NGO Coordinator, Nashik',
  4,
  'We ran CogniCare at three rural health camps and screened over 200 people in a week. The backend API made it easy to integrate with our existing health records system. The only improvement I''d suggest is offline mode support — connectivity is still patchy in some villages. Overall, an excellent, practical tool for community health work.'
);
