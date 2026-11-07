import React from 'react';
import { ProductDepartment } from '../../types/product.types';

interface HeroBannerProps {
  onExploreCatalog: (department?: ProductDepartment) => void;
}

/**
 * HeroBanner
 * Single Responsibility: Minimalist image-free ALIGNE-style hero section.
 * Centered wide-tracked uppercase headline ("THE SEASON IS HERS") and a single
 * rectangular outline button ("SHOP THE COLLECTION") directly below it.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCatalog }) => {
  return (
    <section
      aria-label="Presentación principal LUMÉRA"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(440px, 74vh, 680px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-ash-gray)',
        borderBottom: '1px solid var(--color-warm-charcoal)',
      }}
    >
      <div
        className="lumera-container"
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '26px',
          padding: 'var(--spacing-40) var(--spacing-16)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-nimbus-sans-extended)',
            fontWeight: 700,
            fontSize: 'clamp(26px, 4vw, 44px)',
            lineHeight: 1.05,
            letterSpacing: '0.18em',
            color: 'var(--color-soft-black)',
            textTransform: 'uppercase',
          }}
        >
          THE SEASON IS HERS
        </h1>

        <button
          type="button"
          onClick={() => onExploreCatalog('all')}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-soft-black)',
            border: '1px solid var(--color-warm-charcoal)',
            padding: '15px 32px',
            fontFamily: 'var(--font-gt-america-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-warm-charcoal)';
            e.currentTarget.style.color = 'var(--color-pure-white)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-soft-black)';
          }}
        >
          SHOP THE COLLECTION
        </button>
      </div>
    </section>
  );
};
