import React from 'react';
import { ProductDepartment } from '../../types/product.types';

interface HeroBannerProps {
  onExploreCatalog: (department?: ProductDepartment) => void;
}

/**
 * HeroBanner
 * Single Responsibility: Full-viewport campaign imagery with centered text overlay per Skills/DESIGN2.md
 * - Full-bleed editorial photograph spanning viewport width (0px radius)
 * - Centered headline in Nimbus Sans Extended 60px weight 700, letter-spacing 8px, #ffffff, uppercase
 * - Ghost outline button below: transparent background, 1px #ffffff border, #ffffff text, 0px radius,
 *   17px 40px padding, GT America Mono 12px weight 500, letter-spacing 0.067em uppercase.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCatalog }) => {
  return (
    <section
      aria-label="Campaña principal LUMÉRA"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(480px, 78vh, 760px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--color-warm-charcoal)',
      }}
    >
      {/* Full-bleed high-contrast editorial photograph */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
        alt="Campaña Editorial LUMÉRA"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 25%',
          filter: 'contrast(1.04) brightness(0.72)',
        }}
      />

      {/* Centered Editorial Headline & Ghost Outline Actions */}
      <div
        className="lumera-container"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-24)',
          paddingTop: 'var(--spacing-56)',
          paddingBottom: 'var(--spacing-56)',
        }}
      >
        <p
          className="text-caption-editorial"
          style={{
            color: 'var(--color-pure-white)',
            letterSpacing: '0.15em',
          }}
        >
          COLLECTION 01 // ATELIER APPAREL &amp; LUMÉRA BEAUTY
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-nimbus-sans-extended)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'clamp(38px, 7vw, 60px)',
            lineHeight: 1.07,
            letterSpacing: 'clamp(4px, 0.9vw, 8px)',
            color: 'var(--color-pure-white)',
            textTransform: 'uppercase',
            maxWidth: '900px',
          }}
        >
          ARCHITECTURAL SILK &amp; PURE PIGMENT
        </h1>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-16)',
            marginTop: 'var(--spacing-8)',
          }}
        >
          <button
            type="button"
            onClick={() => onExploreCatalog('all')}
            className="pill-btn pill-btn--white"
          >
            DISCOVER THE COLLECTION
          </button>

          <button
            type="button"
            onClick={() => onExploreCatalog('boutique')}
            className="pill-btn pill-btn--white"
          >
            SHOP APPAREL
          </button>

          <button
            type="button"
            onClick={() => onExploreCatalog('makeup')}
            className="pill-btn pill-btn--white"
          >
            SHOP BEAUTY
          </button>
        </div>
      </div>
    </section>
  );
};
