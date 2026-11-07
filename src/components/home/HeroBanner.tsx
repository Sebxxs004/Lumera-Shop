import React from 'react';
import { ProductDepartment } from '../../types/product.types';

interface HeroBannerProps {
  onExploreCatalog: (department?: ProductDepartment) => void;
}

/**
 * HeroBanner
 * Single Responsibility: Full-bleed responsive hero showcase blending
 * Luméra Rose Statement and Pastel Pink tones.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCatalog }) => {
  return (
    <section
      aria-label="Colección principal LUMÉRA"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(420px, 68vh, 680px)',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-lumera-mist)',
      }}
    >
      {/* Full-bleed editorial photograph */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
        alt="Editorial Luméra Moda Boutique y Maquillaje"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 25%',
        }}
      />

      {/* Rose + Pastel gradient scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--hero-scrim-gradient)',
        }}
      />

      {/* Editorial Content Overlay */}
      <div
        className="lumera-container"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: 'clamp(28px, 6vw, 56px)',
          paddingBottom: 'clamp(28px, 6vw, 56px)',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <span
            className="pill-tag"
            style={{
              marginBottom: 'var(--spacing-16)',
              backgroundColor: 'var(--color-lumera-pastel)',
              color: 'var(--color-lumera-statement)',
            }}
          >
            COLECCIÓN CÁPSULA · ATELIER &amp; BEAUTY
          </span>

          <h1
            className="display-heading-lg"
            style={{
              color: 'var(--color-paper-white)',
              fontSize: 'clamp(34px, 6.5vw, 64px)',
              marginBottom: 'var(--spacing-16)',
            }}
          >
            SILUETAS DE SEDA &amp; ROSA PASTEL
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-soehne)',
              fontSize: 'clamp(14px, 2.2vw, 18px)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.045em',
              lineHeight: 1.45,
              textTransform: 'uppercase',
              color: 'var(--color-lumera-pastel-soft)',
              maxWidth: '520px',
            }}
          >
            SASTRERÍA FEMENINA DE AUTOR Y COSMÉTICA LUMINOSA DISEÑADAS PARA
            SENTIRSE COMO UNA SEGUNDA PIEL.
          </p>
        </div>

        {/* Bottom Row: Department Pills + Dominant CTA */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-16)',
            marginTop: 'var(--spacing-30)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-10)',
            }}
          >
            <button
              type="button"
              onClick={() => onExploreCatalog('boutique')}
              className="pill-btn pill-btn--pastel"
              style={{
                padding: 'var(--spacing-8) var(--spacing-20)',
                fontSize: 'var(--text-caption)',
              }}
            >
              ROPA BOUTIQUE →
            </button>
            <button
              type="button"
              onClick={() => onExploreCatalog('makeup')}
              className="pill-btn pill-btn--pastel"
              style={{
                padding: 'var(--spacing-8) var(--spacing-20)',
                fontSize: 'var(--text-caption)',
              }}
            >
              MAQUILLAJE LUMÉRA →
            </button>
          </div>

          <button
            type="button"
            onClick={() => onExploreCatalog('all')}
            className="pill-btn pill-btn--white"
          >
            EXPLORAR COLECCIÓN →
          </button>
        </div>
      </div>
    </section>
  );
};
