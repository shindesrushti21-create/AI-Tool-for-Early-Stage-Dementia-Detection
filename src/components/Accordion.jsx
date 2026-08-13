import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const Accordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="accordion-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.id || idx}
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              borderColor: isOpen ? 'var(--color-brand-teal)' : 'var(--color-slate-light)',
              backgroundColor: isOpen ? '#FAFDFD' : 'var(--color-card-bg)'
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
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--color-navy)',
                gap: '1rem'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <HelpCircle size={22} color="var(--color-brand-teal)" />
                {item.question}
              </span>
              <ChevronDown
                size={20}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
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
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-slate-light)',
                  fontSize: '1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6
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
