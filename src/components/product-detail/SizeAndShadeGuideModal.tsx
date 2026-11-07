import React from 'react';
import { X } from 'lucide-react';

interface SizeAndShadeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SizeAndShadeGuideModal
 * Single Responsibility: Displays the boutique garment measurement table (XS-XL)
 * and the Luméra Beauty makeup finish & shade guide.
 */
export const SizeAndShadeGuideModal: React.FC<SizeAndShadeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const sizeRows = [
    { size: 'XS (34)', bust: '80 - 84 cm', waist: '60 - 64 cm', hip: '88 - 92 cm' },
    { size: 'S (36)', bust: '84 - 88 cm', waist: '64 - 68 cm', hip: '92 - 96 cm' },
    { size: 'M (38)', bust: '88 - 93 cm', waist: '68 - 73 cm', hip: '96 - 101 cm' },
    { size: 'L (40)', bust: '93 - 99 cm', waist: '73 - 79 cm', hip: '101 - 107 cm' },
    { size: 'XL (42)', bust: '99 - 105 cm', waist: '79 - 85 cm', hip: '107 - 113 cm' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Guía de Tallas y Tonos LUMÉRA"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(27, 27, 27, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-20)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-paper-white-canvas)',
          border: '2px solid var(--color-lumera-statement)',
          borderRadius: 'var(--radius-cards)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--card-padding)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-24)',
            paddingBottom: 'var(--spacing-16)',
            borderBottom: '1px solid var(--color-lumera-mist)',
          }}
        >
          <div>
            <p className="text-caption-editorial">ATELIER &amp; BEAUTY</p>
            <h2 className="display-heading-sm">
              GUÍA DE TALLAS, MEDIDAS &amp; TONOS
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía"
            className="pill-btn pill-btn--outline"
            style={{ padding: 'var(--spacing-8) var(--spacing-16)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Boutique Apparel Sizes */}
        <div style={{ marginBottom: 'var(--spacing-30)' }}>
          <h3
            className="text-caption-editorial"
            style={{
              color: 'var(--color-lumera-statement)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            1. MEDIDAS CORPORALES — ROPA FEMENINA BOUTIQUE
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 'var(--text-body-sm)',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--color-lumera-statement)',
                    textAlign: 'left',
                    color: 'var(--color-lumera-statement)',
                  }}
                >
                  <th style={{ padding: 'var(--spacing-10)' }}>TALLA</th>
                  <th style={{ padding: 'var(--spacing-10)' }}>BUSTO</th>
                  <th style={{ padding: 'var(--spacing-10)' }}>CINTURA</th>
                  <th style={{ padding: 'var(--spacing-10)' }}>CADERA</th>
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr
                    key={row.size}
                    style={{
                      borderBottom: '1px solid var(--color-lumera-mist)',
                    }}
                  >
                    <td
                      style={{
                        padding: 'var(--spacing-10)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-lumera-statement)',
                      }}
                    >
                      {row.size}
                    </td>
                    <td style={{ padding: 'var(--spacing-10)' }}>{row.bust}</td>
                    <td style={{ padding: 'var(--spacing-10)' }}>{row.waist}</td>
                    <td style={{ padding: 'var(--spacing-10)' }}>{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Makeup Finishes & Formats */}
        <div style={{ marginBottom: 'var(--spacing-24)' }}>
          <h3
            className="text-caption-editorial"
            style={{
              color: 'var(--color-lumera-statement)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            2. GUÍA DE ACABADOS — MAQUILLAJE LUMÉRA BEAUTY
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-16)',
            }}
          >
            <div
              style={{
                border: '1px solid var(--color-lumera-mist)',
                borderRadius: 'var(--radius-cards)',
                padding: 'var(--spacing-15)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-lumera-statement)' }}
              >
                BRILLO ESPEJO 3D (GLAZE)
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-6)' }}
              >
                Cobertura translúcida modulable con péptidos voluminizadores y
                reflejo cristal sin sensación pegajosa.
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--color-lumera-mist)',
                borderRadius: 'var(--radius-cards)',
                padding: 'var(--spacing-15)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-lumera-statement)' }}
              >
                MATE TERCIOPELO (VELVET)
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-6)' }}
              >
                Pigmento puro en una pasada con micro-esferas hidratantes que
                suavizan la textura del labio.
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--color-lumera-mist)',
                borderRadius: 'var(--radius-cards)',
                padding: 'var(--spacing-15)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-lumera-statement)' }}
              >
                SEGUNDA PIEL (SILK DEW)
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-6)' }}
              >
                Fórmulas líquidas en sérum que se funden con la piel para un
                rubor natural de larga duración.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            className="pill-btn pill-btn--brand"
          >
            ENTENDIDO →
          </button>
        </div>
      </div>
    </div>
  );
};

