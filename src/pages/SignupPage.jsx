import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserPlus, Mail, Lock, User, Calendar, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '68',
    preferred_language: 'en-US'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
      trackEvent('user_signup_success', { email: formData.email, age: formData.age });
      navigate('/thank-you');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account — CogniGuard Dementia Screening</title>
        <meta name="description" content="Register for a free account to begin your AI-based cognitive, memory, and speech dementia screening." />
      </Helmet>

      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)', padding: '1.5rem 1rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <UserPlus size={22} />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Free Patient Registration</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Create your profile to start confidential cognitive assessments.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--color-high-risk-bg)', color: 'var(--color-high-risk)', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Ramchandra Patil"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="patient@example.org"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label htmlFor="signup-age" className="form-label">
                  Age (Years)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-age"
                    name="age"
                    type="number"
                    min="40"
                    max="110"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-lang" className="form-label">
                  Language
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="signup-lang"
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    className="form-select"
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    <option value="en-US">English</option>
                    <option value="hi-IN">हिंदी (Hindi)</option>
                    <option value="mr-IN">मराठी (Marathi)</option>
                    <option value="ta-IN">தமிழ் (Tamil)</option>
                  </select>
                  <Globe size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {loading ? 'Creating Profile...' : 'Complete Free Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--color-brand-teal)', fontWeight: 700 }}>
              Log In Here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
