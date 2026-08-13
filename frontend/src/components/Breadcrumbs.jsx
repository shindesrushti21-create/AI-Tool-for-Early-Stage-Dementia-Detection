import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  'dashboard': 'Dashboard',
  'test': 'Screening Evaluation',
  'memory': 'Memory Assessment',
  'cognitive': 'Cognitive Latency Test',
  'speech': 'Speech Pattern Analysis',
  'report': 'Clinical Report',
  'faqs': 'FAQs',
  'case-studies': 'Case Studies',
  'reviews': 'Reviews & Testimonials',
  'privacy-policy': 'Privacy Policy',
  'team': 'Our NGO Team',
  'thank-you': 'Thank You'
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-trail">
      <Link to="/dashboard">
        <Home size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={13} style={{ color: 'var(--color-text-muted)' }} />
            {isLast ? (
              <span aria-current="page" style={{ fontWeight: 600, color: 'var(--color-heading)' }}>
                {displayName}
              </span>
            ) : (
              <Link to={to}>{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
