'use strict';

const express = require('express');

const router = express.Router();

// ─── GET /api/schema/organization ───────────────────────────
// Returns JSON-LD structured data for the NGO.
// Frontend injects this as:
//   <script type="application/ld+json">{...}</script>
router.get('/organization', (_req, res) => {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'NGO',
    name:         process.env.NGO_NAME    || 'CogniCare Foundation',
    url:          process.env.NGO_URL     || 'https://cognicare.org',
    logo:         `${process.env.NGO_URL || 'https://cognicare.org'}/logo.png`,
    description:  'CogniCare is a non-profit providing free AI-based early dementia and cognitive impairment screening to underserved communities in India.',
    telephone:    process.env.NGO_PHONE   || '+91-20-12345678',
    email:        process.env.NGO_EMAIL   || 'info@cognicare.org',
    address: {
      '@type':           'PostalAddress',
      streetAddress:     '12, Health Avenue',
      addressLocality:   'Pune',
      addressRegion:     'Maharashtra',
      postalCode:        '411001',
      addressCountry:    'IN',
    },
    geo: {
      '@type':     'GeoCoordinates',
      latitude:    parseFloat(process.env.NGO_LAT || '18.5204'),
      longitude:   parseFloat(process.env.NGO_LNG || '73.8567'),
    },
    openingHoursSpecification: [
      {
        '@type':     'OpeningHoursSpecification',
        dayOfWeek:   ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens:       '09:00',
        closes:      '18:00',
      },
      {
        '@type':     'OpeningHoursSpecification',
        dayOfWeek:   ['Saturday'],
        opens:       '10:00',
        closes:      '14:00',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/cognicare-foundation',
      'https://twitter.com/cognicarefdn',
    ],
  };

  return res.status(200).json(schema);
});

module.exports = router;
