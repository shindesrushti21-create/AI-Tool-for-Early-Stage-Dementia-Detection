import api from '../api/client';

export const trackEvent = async (eventName, payload = {}) => {
  try {
    // 1. Fire internal analytics endpoint
    await api.post('/api/analytics/event', {
      event_name: eventName,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
        url: window.location.pathname
      }
    });

    // 2. Fire Google Analytics window.gtag if present
    if (window.gtag) {
      window.gtag('event', eventName, payload);
    }
  } catch (err) {
    console.warn(`[Analytics error logging ${eventName}]`, err);
  }
};
