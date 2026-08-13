import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const Accordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="accordion-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.id || idx}
            className="card"
            style={{
              padding: '1rem 1.25rem',
              borderColor: isOpen ? 'var(--color-brand-teal)' : 'var(--color-border)',
              backgroundColor: isOpen ? 'var(--color-card-subtle)' : 'var(--color-card-bg)'
            }}
          >
            <button
              onClick={() => toggleItem(idx)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-header-${idx}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--color-heading)',
                gap: '0.75rem'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <HelpCircle size={18} color="var(--color-brand-teal)" style={{ flexShrink: 0 }} />
                {item.question}
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: 'var(--color-text-muted)',
                  flexShrink: 0
                }}
              />
            </button>
            {isOpen && (
              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-header-${idx}`}
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.95rem',
                  color: 'var(--color-text-main)',
                  lineHeight: 1.55
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
