import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Sun, Moon, Type, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleFontSize, fontSize, highContrast, toggleHighContrast, language, setLanguage, t } = useAccessibility();

  return (
    <header className="header-nav" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand-logo" aria-label="CogniGuard Home">
          <Activity size={24} color="var(--color-brand-teal)" />
          <span>Cogni</span>Guard
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li><NavLink to="/case-studies">{t('nav_case_studies')}</NavLink></li>
            <li><NavLink to="/faqs">{t('nav_faqs')}</NavLink></li>
            <li><NavLink to="/reviews">{t('nav_reviews')}</NavLink></li>
            <li><NavLink to="/team">{t('nav_team')}</NavLink></li>
            <li><NavLink to="/privacy-policy">{t('nav_privacy')}</NavLink></li>
          </ul>
        </nav>

        {/* Accessibility & Auth Controls */}
        <div className="accessibility-controls">
          {/* Vernacular Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Globe size={16} style={{ color: 'var(--color-brand-teal)' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select"
              aria-label="Select Screening Language"
              style={{ padding: '0.25rem 0.4rem', fontSize: '0.825rem', minHeight: '34px', width: 'auto' }}
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
            style={{ padding: '0.25rem 0.5rem', minHeight: '34px', fontSize: '0.825rem' }}
          >
            <Type size={14} />
            {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </button>

          {/* Dark Mode / High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className="btn btn-secondary"
            title={highContrast ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
            style={{ padding: '0.25rem 0.5rem', minHeight: '34px' }}
          >
            {highContrast ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} />}
          </button>

          {/* Auth Action */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', minHeight: '34px', fontSize: '0.85rem' }}>
                <User size={14} />
                {user?.name?.split(' ')[0] || t('nav_dashboard')}
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
                title={t('nav_logout')}
                aria-label={t('nav_logout')}
                style={{ padding: '0.35rem 0.5rem', minHeight: '34px' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.35rem 0.9rem', minHeight: '34px', fontSize: '0.85rem' }}>
              {t('nav_login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
