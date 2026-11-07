import React from 'react';
import { X } from 'lucide-react';

interface SizeAndShadeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SizeAndShadeGuideModal
 * Single Responsibility: Architectural spec-sheet modal for garment measurements
 * and makeup finishes per Skills/DESIGN2.md.
 */
export const SizeAndShadeGuideModal: React.FC<SizeAndShadeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const sizeRows = [
    { size: 'XS (34)', bust: '80 - 84 CM', waist: '60 - 64 CM', hip: '88 - 92 CM' },
    { size: 'S (36)', bust: '84 - 88 CM', waist: '64 - 68 CM', hip: '92 - 96 CM' },
    { size: 'M (38)', bust: '88 - 93 CM', waist: '68 - 73 CM', hip: '96 - 101 CM' },
    { size: 'L (40)', bust: '93 - 99 CM', waist: '73 - 79 CM', hip: '101 - 107 CM' },
    { size: 'XL (42)', bust: '99 - 105 CM', waist: '79 - 85 CM', hip: '107 - 113 CM' },
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
        backgroundColor: 'rgba(21, 21, 21, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-16)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-pure-white)',
          border: '1px solid var(--color-warm-charcoal)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--spacing-24)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-24)',
            paddingBottom: 'var(--spacing-16)',
            borderBottom: '1px solid var(--color-warm-charcoal)',
          }}
        >
          <div>
            <p className="text-caption-editorial">SPECIFICATION SHEET // 01</p>
            <h2 className="display-heading-sm">
              SIZE MEASUREMENTS &amp; SHADE GUIDE
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía"
            className="pill-btn pill-btn--outline"
            style={{ padding: '8px 14px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Section 1: Boutique Apparel Sizes */}
        <div style={{ marginBottom: 'var(--spacing-32)' }}>
          <h3
            className="text-caption-editorial"
            style={{
              color: 'var(--color-soft-black)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            01 // BOUTIQUE APPAREL BODY MEASUREMENTS (CM)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--color-warm-charcoal)',
                    textAlign: 'left',
                    color: 'var(--color-soft-black)',
                  }}
                >
                  <th style={{ padding: '10px' }}>SIZE</th>
                  <th style={{ padding: '10px' }}>BUST</th>
                  <th style={{ padding: '10px' }}>WAIST</th>
                  <th style={{ padding: '10px' }}>HIP</th>
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr
                    key={row.size}
                    style={{
                      borderBottom: '1px solid var(--color-ash-gray)',
                    }}
                  >
                    <td
                      style={{
                        padding: '10px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-soft-black)',
                      }}
                    >
                      {row.size}
                    </td>
                    <td style={{ padding: '10px' }}>{row.bust}</td>
                    <td style={{ padding: '10px' }}>{row.waist}</td>
                    <td style={{ padding: '10px' }}>{row.hip}</td>
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
              color: 'var(--color-soft-black)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            02 // LUMÉRA BEAUTY FINISHES &amp; TEXTURES
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
                border: '1px solid var(--color-warm-charcoal)',
                padding: 'var(--spacing-16)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-soft-black)' }}
              >
                3D MIRROR GLAZE
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-8)' }}
              >
                Cobertura translúcida modulable con péptidos voluminizadores y
                reflejo cristal sin sensación pegajosa.
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--color-warm-charcoal)',
                padding: 'var(--spacing-16)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-soft-black)' }}
              >
                VELVET MATTE
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-8)' }}
              >
                Pigmento puro en una pasada con micro-esferas hidratantes que
                suavizan la textura del labio.
              </p>
            </div>
            <div
              style={{
                border: '1px solid var(--color-warm-charcoal)',
                padding: 'var(--spacing-16)',
              }}
            >
              <strong
                className="text-caption-editorial"
                style={{ color: 'var(--color-soft-black)' }}
              >
                SILK DEW SERUM
              </strong>
              <p
                className="text-body-sm-editorial"
                style={{ marginTop: 'var(--spacing-8)' }}
              >
                Fórmulas líquidas en sérum que se funden con la piel para un
                acabado natural de larga duración.
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
            CLOSE SPEC SHEET
          </button>
        </div>
      </div>
    </div>
  );
};
