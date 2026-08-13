import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StickyMobileCTA = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide on test screens or report screen to prevent UI blocking
  if (location.pathname.startsWith('/test/') || location.pathname.startsWith('/report/')) {
    return null;
  }

  const targetRoute = isAuthenticated ? '/dashboard' : '/signup';

  return (
    <div className="sticky-mobile-cta" role="region" aria-label="Quick Mobile Action">
      <div>
        <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy)', display: 'block' }}>
          Free Cognitive Screening
        </strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Takes under 5 minutes
        </span>
      </div>
      <Link to={targetRoute} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', minHeight: '44px' }}>
        <Activity size={18} />
        Start Screening
      </Link>
    </div>
  );
};
