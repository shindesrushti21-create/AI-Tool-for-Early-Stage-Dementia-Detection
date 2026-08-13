import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createT } from '../i18n/translations';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('cogni_font_size') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('cogni_high_contrast') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('cogni_lang') || 'en-US');

  useEffect(() => {
    localStorage.setItem('cogni_font_size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('cogni_high_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('cogni_lang', language);
  }, [language]);

  const toggleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const t = useMemo(() => createT(language), [language]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      toggleFontSize,
      highContrast,
      toggleHighContrast,
      language,
      setLanguage,
      t
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
