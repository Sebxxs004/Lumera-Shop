import React, { useState } from 'react';
import { ProductCategorySlug } from '../../types/product.types';

interface FooterProps {
  onSelectCategory: (category: ProductCategorySlug) => void;
  onOpenSizeGuide: () => void;
}

/**
 * Footer
 * Single Responsibility: Three-column architectural footer per Skills/DESIGN2.md
 * - Column titles in Nimbus Sans Extended 16px weight 700, letter-spacing 1.6px, #151515 uppercase
 * - Links in GT America Mono 12px weight 400, #151515, stacked vertically with 8px row gap
 * - White background (#ffffff) with Warm Charcoal top border
 */
export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSizeGuide,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const columnTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-nimbus-sans-extended)',
    fontSize: '16px',
    fontWeight: 'var(--font-weight-bold)',
    letterSpacing: '1.6px',
    color: 'var(--color-soft-black)',
    textTransform: 'uppercase',
    marginBottom: 'var(--spacing-16)',
  };

  const linkStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'var(--font-gt-america-mono)',
    fontSize: '12px',
    fontWeight: 'var(--font-weight-regular)',
    letterSpacing: '0.067em',
    color: 'var(--color-soft-black)',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textAlign: 'left',
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-pure-white)',
        borderTop: '1px solid var(--color-warm-charcoal)',
        padding: 'var(--spacing-60) 0 var(--spacing-40)',
        marginTop: 'var(--spacing-60)',
        color: 'var(--color-soft-black)',
      }}
    >
      <div className="lumera-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-40)',
            marginBottom: 'var(--spacing-56)',
          }}
        >
          {/* Column 1: Brand Identity */}
          <div>
            <img
              src="/assets/LUMERA-PNG.png"
              alt="LUMÉRA"
              style={{
                height: '36px',
                width: 'auto',
                marginBottom: 'var(--spacing-16)',
              }}
            />
            <p
              className="text-body-sm-editorial"
              style={{
                color: 'var(--color-soft-black)',
                maxWidth: '280px',
              }}
            >
              CASA DE MODA BOUTIQUE FEMENINA Y COSMÉTICA DE AUTOR. SILUETAS
              ARQUITECTÓNICAS Y PIGMENTOS PUROS.
            </p>
          </div>

          {/* Column 2: EXPLORE */}
          <div>
            <h3 style={columnTitleStyle}>EXPLORE</h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('vestidos-conjuntos')}
                  style={linkStyle}
                >
                  VESTIDOS &amp; CONJUNTOS SASTRE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('tops-blusas')}
                  style={linkStyle}
                >
                  TOPS, CORSETS &amp; BLUSAS EN SEDA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('faldas-pantalones')}
                  style={linkStyle}
                >
                  FALDAS BIAS-CUT &amp; PALAZZO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('maquillaje-labios-rostro')}
                  style={linkStyle}
                >
                  MAQUILLAJE — LABIOS &amp; ROSTRO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('maquillaje-ojos-paletas')}
                  style={linkStyle}
                >
                  MAQUILLAJE — OJOS &amp; PALETAS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER CARE */}
          <div>
            <h3 style={columnTitleStyle}>CUSTOMER CARE</h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  style={linkStyle}
                >
                  GUÍA DE TALLAS, MEDIDAS &amp; TONOS
                </button>
              </li>
              <li style={linkStyle}>ENVÍOS EXPRESS &amp; EMPAQUE ATELIER</li>
              <li style={linkStyle}>FÓRMULAS 100% CRUELTY-FREE &amp; VEGANAS</li>
              <li style={linkStyle}>CAMBIOS DE TALLA SIN COSTO (30 DÍAS)</li>
            </ul>
          </div>

          {/* Column 4: FOLLOW / DISPATCH */}
          <div>
            <h3 style={columnTitleStyle}>FOLLOW &amp; DISPATCH</h3>
            <p
              className="text-body-sm-editorial"
              style={{ marginBottom: 'var(--spacing-12)' }}
            >
              ACCESO ANTICIPADO A ARCHIVOS DE SASTRERÍA Y NUEVOS TONOS DE
              MAQUILLAJE.
            </p>
            {subscribed ? (
              <div className="badge-new-in">
                SUSCRIPCIÓN CONFIRMADA // LUMÉRA ARCHIVE
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-8)',
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="CORREO ELECTRÓNICO..."
                  className="pill-input"
                />
                <button type="submit" className="pill-btn pill-btn--brand">
                  SUSCRIBIRSE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Spec Line */}
        <div
          style={{
            borderTop: '1px solid var(--color-ash-gray)',
            paddingTop: 'var(--spacing-20)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
          }}
        >
          <span className="text-caption-editorial">
            © {new Date().getFullYear()} LUMÉRA BOUTIQUE &amp; BEAUTY. ALL
            RIGHTS RESERVED.
          </span>
          <span className="text-caption-editorial">
            SPEC SHEET ARCHIVE // MODULAR CLEAN ARCHITECTURE
          </span>
        </div>
      </div>
    </footer>
  );
};
