import React, { useState } from 'react';
import { ProductCategorySlug } from '../../types/product.types';

interface FooterProps {
  onSelectCategory: (category: ProductCategorySlug) => void;
  onOpenSizeGuide: () => void;
}

/**
 * Footer
 * Single Responsibility: Page-base utility area per DESIGN.md
 * (#f2f2f2 Fog background — the ONLY non-white surface on the site,
 * 40px+ padding, Soehne 14px in brand statement color).
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

  return (
    <footer
      style={{
        backgroundColor: 'var(--surface-fog-footer)',
        padding: 'var(--spacing-60) 0 var(--spacing-40)',
        marginTop: 'var(--spacing-60)',
        color: 'var(--color-lumera-statement)',
      }}
    >
      <div className="lumera-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--spacing-40)',
            marginBottom: 'var(--spacing-50)',
          }}
        >
          {/* Brand Column with Logo */}
          <div>
            <img
              src="/assets/LUMERA-PNG.png"
              alt="LUMÉRA"
              style={{
                height: '44px',
                width: 'auto',
                marginBottom: 'var(--spacing-16)',
              }}
            />
            <p
              className="text-body-sm-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                maxWidth: '300px',
              }}
            >
              Casa de moda boutique femenina y cosmética editorial. Siluetas
              arquitectónicas, sedas nobles y pigmentos luminosos diseñados para
              hablar por sí mismos.
            </p>
          </div>

          {/* Boutique Categories */}
          <div>
            <h3
              className="text-caption-editorial"
              style={{
                marginBottom: 'var(--spacing-16)',
                color: 'var(--color-lumera-statement)',
              }}
            >
              COLECCIONES LUMÉRA
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-10)',
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('vestidos-conjuntos')}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Vestidos &amp; Conjuntos Sastre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('tops-blusas')}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Tops, Corsets &amp; Blusas en Seda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('faldas-pantalones')}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Faldas Bias-Cut &amp; Palazzo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('maquillaje-labios-rostro')}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Maquillaje — Labios &amp; Rostro
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('maquillaje-ojos-paletas')}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Maquillaje — Ojos &amp; Paletas
                </button>
              </li>
            </ul>
          </div>

          {/* Client Experience */}
          <div>
            <h3
              className="text-caption-editorial"
              style={{
                marginBottom: 'var(--spacing-16)',
                color: 'var(--color-lumera-statement)',
              }}
            >
              ATELIER &amp; ASISTENCIA
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-10)',
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-body-sm-editorial"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-lumera-statement)',
                    cursor: 'pointer',
                  }}
                >
                  Guía de Tallas, Medidas &amp; Tonos
                </button>
              </li>
              <li className="text-body-sm-editorial">
                Envíos Express &amp; Empaque Boutique
              </li>
              <li className="text-body-sm-editorial">
                Fórmulas 100% Cruelty-Free &amp; Veganas
              </li>
              <li className="text-body-sm-editorial">
                Cambios de talla sin costo (30 días)
              </li>
            </ul>
          </div>

          {/* Newsletter Pill Form */}
          <div>
            <h3
              className="text-caption-editorial"
              style={{
                marginBottom: 'var(--spacing-16)',
                color: 'var(--color-lumera-statement)',
              }}
            >
              THE LUMÉRA JOURNAL
            </h3>
            <p
              className="text-body-sm-editorial"
              style={{ marginBottom: 'var(--spacing-16)' }}
            >
              Acceso anticipado a lanzamientos limitados de sastrería y nuevos
              tonos de maquillaje.
            </p>
            {subscribed ? (
              <div
                className="pill-tag"
                style={{
                  padding: 'var(--spacing-12) var(--spacing-20)',
                }}
              >
                BIENVENIDA AL CLUB EDITORIAL LUMÉRA →
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-10)',
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  className="pill-input"
                />
                <button type="submit" className="pill-btn pill-btn--brand">
                  SUSCRIBIRME →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal Line */}
        <div
          style={{
            borderTop: '1px solid var(--color-lumera-mist)',
            paddingTop: 'var(--spacing-24)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
          }}
        >
          <span className="text-caption-editorial">
            © {new Date().getFullYear()} LUMÉRA BOUTIQUE &amp; BEAUTY. TODOS LOS
            DERECHOS RESERVADOS.
          </span>
          <span className="text-caption-editorial">
            ARQUITECTURA MODULAR FRONTEND · CLEAN DESIGN SYSTEM
          </span>
        </div>
      </div>
    </footer>
  );
};

