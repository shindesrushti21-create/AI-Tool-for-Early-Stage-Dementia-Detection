import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Sun, Moon, Type, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleFontSize, fontSize, highContrast, toggleHighContrast, language, setLanguage } = useAccessibility();

  return (
    <header className="header-nav" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand-logo" aria-label="CogniGuard Home">
          <Activity size={28} color="var(--color-brand-teal)" />
          <span>Cogni</span>Guard
        </Link>

        {/* Navigation Links (Checklist Item #3) */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li><NavLink to="/case-studies">Case Studies</NavLink></li>
            <li><NavLink to="/faqs">FAQs</NavLink></li>
            <li><NavLink to="/reviews">Reviews</NavLink></li>
            <li><NavLink to="/team">Team</NavLink></li>
            <li><NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
          </ul>
        </nav>

        {/* Accessibility & Auth Controls */}
        <div className="accessibility-controls">
          {/* Vernacular Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={18} style={{ color: 'var(--color-brand-teal)' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select"
              aria-label="Select Screening Vernacular Language"
              style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', minHeight: '38px', width: 'auto' }}
            >
              <option value="en-US">English</option>
              <option value="hi-IN">हिंदी (Hindi)</option>
              <option value="mr-IN">मराठी (Marathi)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Font Size Adjuster Button */}
          <button
            onClick={toggleFontSize}
            className="btn btn-secondary"
            title={`Font Size: ${fontSize.toUpperCase()}. Click to scale font size.`}
            aria-label="Toggle Font Size for Accessibility"
            style={{ padding: '0.35rem 0.65rem', minHeight: '38px', fontSize: '0.85rem' }}
          >
            <Type size={16} />
            {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className="btn btn-secondary"
            title="Toggle High Contrast Theme"
            aria-label="Toggle High Contrast Mode"
            style={{ padding: '0.35rem 0.65rem', minHeight: '38px' }}
          >
            {highContrast ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth Action */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 1rem', minHeight: '38px', fontSize: '0.9rem' }}>
                <User size={16} />
                {user?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
                title="Log Out"
                aria-label="Log Out"
                style={{ padding: '0.4rem 0.6rem', minHeight: '38px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1.1rem', minHeight: '38px', fontSize: '0.9rem' }}>
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
