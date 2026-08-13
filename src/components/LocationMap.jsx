import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
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

  if (loading) return <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>Loading clinic map...</div>;

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem 1.25rem 0.85rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', color: 'var(--color-heading)' }}>
          <MapPin color="var(--color-brand-teal)" size={20} />
          NGO Screening Center & Clinic Location
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Visit our community health hub for in-person medical evaluation and specialist doctor referrals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', borderTop: '1px solid var(--color-border)' }}>
        {/* Map View Frame */}
        <div style={{ backgroundColor: 'var(--color-card-subtle)', minHeight: '220px', position: 'relative', overflow: 'hidden' }}>
          <iframe
            title="CogniGuard NGO Center Map Location"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '220px' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${location?.lat || 18.5204},${location?.lng || 73.8567}&z=15&output=embed`}
          ></iframe>
        </div>

        {/* Address Details & Actions */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem', backgroundColor: 'var(--color-card-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.9rem' }}>
              <MapPin size={18} color="var(--color-brand-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--color-heading)' }}>Address:</strong>
                <p style={{ color: 'var(--color-text-muted)' }}>{location?.address}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.9rem' }}>
              <Phone size={18} color="var(--color-brand-teal)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--color-heading)' }}>Phone:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{location?.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.9rem' }}>
              <Clock size={18} color="var(--color-brand-teal)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--color-heading)' }}>Hours:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{location?.hours}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location?.address || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ width: '100%', minHeight: '38px', fontSize: '0.875rem' }}
          >
            <Navigation size={16} />
            Get Driving Directions
          </a>
        </div>
      </div>
    </div>
  );
};
