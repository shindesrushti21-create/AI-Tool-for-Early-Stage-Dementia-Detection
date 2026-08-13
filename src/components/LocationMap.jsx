import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import api from '../api/client';

export const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await api.get('/api/content/location');
        setLocation(res.data);
      } catch (err) {
        console.error('Location fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  if (loading) return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>Loading clinic map...</div>;

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.75rem 1.75rem 1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <MapPin color="var(--color-brand-teal)" size={24} />
          NGO Screening Center & Clinic Location
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Visit our community health hub for in-person medical evaluation and specialist doctor referrals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', borderTop: '1px solid var(--color-slate-light)' }}>
        {/* Map View Frame */}
        <div style={{ backgroundColor: '#E2E8F0', minHeight: '260px', position: 'relative', overflow: 'hidden' }}>
          <iframe
            title="CogniGuard NGO Center Map Location"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '260px' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${location?.lat || 18.5204},${location?.lng || 73.8567}&z=15&output=embed`}
          ></iframe>
        </div>

        {/* Address Details & Actions */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', backgroundColor: '#FAFDFD' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
              <MapPin size={20} color="var(--color-brand-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Address:</strong>
                <p style={{ color: 'var(--color-text-muted)' }}>{location?.address}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
              <Phone size={20} color="var(--color-brand-teal)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Phone:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{location?.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
              <Clock size={20} color="var(--color-brand-teal)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Hours:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{location?.hours}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location?.address || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            <Navigation size={18} />
            Get Driving Directions
          </a>
        </div>
      </div>
    </div>
  );
};
