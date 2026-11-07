import React from 'react';
import { Sparkles, Shirt } from 'lucide-react';
import { ProductDepartment } from '../../types/product.types';

interface DepartmentShowcaseProps {
  activeDepartment: ProductDepartment;
  onSelectDepartment: (department: ProductDepartment) => void;
}

/**
 * DepartmentShowcase
 * Single Responsibility: Category Split Banner per Skills/DESIGN2.md
 * - Dark (#24170f) background section, two large editorial images side by side (0px radius)
 * - Small white silhouette product icon + minimal monospace label centered on each image
 */
export const DepartmentShowcase: React.FC<DepartmentShowcaseProps> = ({
  activeDepartment,
  onSelectDepartment,
}) => {
  return (
    <section
      style={{
        backgroundColor: 'var(--color-warm-charcoal)',
        padding: 'var(--spacing-60) 0',
      }}
    >
      <div className="lumera-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: 'var(--spacing-12)',
            marginBottom: 'var(--spacing-24)',
          }}
        >
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-pure-white)' }}
          >
            INDEX // 01 — DEPARTMENTS
          </span>
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-pure-white)', opacity: 0.7 }}
          >
            SELECT A DIVISION TO FILTER THE SPEC SHEET
          </span>
        </div>

        <div className="department-showcase-grid">
          {/* Column 1: Boutique Apparel */}
          <article
            onClick={() => onSelectDepartment('boutique')}
            style={{
              position: 'relative',
              aspectRatio: '4 / 5',
              maxHeight: '520px',
              width: '100%',
              overflow: 'hidden',
              cursor: 'pointer',
              border:
                activeDepartment === 'boutique'
                  ? '2px solid var(--color-pure-white)'
                  : 'none',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
              alt="Moda Boutique Femenina"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.75)',
              }}
            />

            {/* Centered White Silhouette Icon + Spec Label per DESIGN2.md */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-16)',
                padding: 'var(--spacing-24)',
                textAlign: 'center',
              }}
            >
              <Shirt size={24} color="#ffffff" strokeWidth={1.5} />
              <h3
                style={{
                  fontFamily: 'var(--font-nimbus-sans-extended)',
                  fontSize: 'clamp(26px, 3.5vw, 40px)',
                  fontWeight: 'var(--font-weight-bold)',
                  letterSpacing: '4px',
                  color: 'var(--color-pure-white)',
                  textTransform: 'uppercase',
                }}
              >
                BOUTIQUE APPAREL
              </h3>
              <span
                className="text-caption-editorial"
                style={{
                  color: 'var(--color-pure-white)',
                  border: '1px solid var(--color-pure-white)',
                  padding: '8px 18px',
                }}
              >
                VESTIDOS · CORSETS · SASTRE [XS—XL]
              </span>
            </div>
          </article>

          {/* Column 2: Luméra Beauty */}
          <article
            onClick={() => onSelectDepartment('makeup')}
            style={{
              position: 'relative',
              aspectRatio: '4 / 5',
              maxHeight: '520px',
              width: '100%',
              overflow: 'hidden',
              cursor: 'pointer',
              border:
                activeDepartment === 'makeup'
                  ? '2px solid var(--color-pure-white)'
                  : 'none',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
              alt="Maquillaje Luméra Beauty"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.75)',
              }}
            />

            {/* Centered White Silhouette Icon + Spec Label per DESIGN2.md */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-16)',
                padding: 'var(--spacing-24)',
                textAlign: 'center',
              }}
            >
              <Sparkles size={24} color="#ffffff" strokeWidth={1.5} />
              <h3
                style={{
                  fontFamily: 'var(--font-nimbus-sans-extended)',
                  fontSize: 'clamp(26px, 3.5vw, 40px)',
                  fontWeight: 'var(--font-weight-bold)',
                  letterSpacing: '4px',
                  color: 'var(--color-pure-white)',
                  textTransform: 'uppercase',
                }}
              >
                LUMÉRA BEAUTY
              </h3>
              <span
                className="text-caption-editorial"
                style={{
                  color: 'var(--color-pure-white)',
                  border: '1px solid var(--color-pure-white)',
                  padding: '8px 18px',
                }}
              >
                LABIOS · ROSTRO · PALETAS [TONOS]
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
