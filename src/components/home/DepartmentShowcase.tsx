import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductDepartment } from '../../types/product.types';

interface DepartmentShowcaseProps {
  activeDepartment: ProductDepartment;
  onSelectDepartment: (department: ProductDepartment) => void;
}

/**
 * DepartmentShowcase
 * Single Responsibility: Responsive editorial statement section below the hero
 * allowing quick visual switching between Boutique Apparel and Luméra Makeup.
 */
export const DepartmentShowcase: React.FC<DepartmentShowcaseProps> = ({
  activeDepartment,
  onSelectDepartment,
}) => {
  return (
    <section className="lumera-section lumera-container">
      <SectionHeading
        eyebrow="UNA CASA DE ESTILO DEFINIDA POR EL DETALLE"
        title="A BRAND BUILT ON RADIANCE"
        subtitle="Explora nuestras dos líneas curadas: confección boutique en sedas y linos estructurados con guía precisa de tallas, y maquillaje de alto rendimiento con selector de tonos reales."
      />

      <div className="department-showcase-grid">
        {/* Card 1: Moda Femenina Boutique */}
        <article
          onClick={() => onSelectDepartment('boutique')}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-cards)',
            overflow: 'hidden',
            minHeight: 'clamp(280px, 42vw, 360px)',
            cursor: 'pointer',
            border:
              activeDepartment === 'boutique'
                ? '2px solid var(--color-lumera-statement)'
                : '1px solid var(--color-lumera-mist)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
            alt="Moda Femenina Boutique Luméra"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--hero-scrim-gradient)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              padding: 'var(--card-padding)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--spacing-20)',
            }}
          >
            <div>
              <span className="pill-tag">ATELIER APPAREL</span>
              <h3
                className="display-heading-sm"
                style={{
                  color: 'var(--color-paper-white)',
                  marginTop: 'var(--spacing-15)',
                }}
              >
                MODA BOUTIQUE FEMENINA
              </h3>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-lumera-pastel-soft)',
                  marginTop: 'var(--spacing-8)',
                  maxWidth: '340px',
                }}
              >
                Vestidos midi satinados, corsets anatómicos, blusas en organza y
                pantalones palazzo en tallas XS a XL.
              </p>
            </div>
            <div>
              <span className="pill-btn pill-btn--white">
                VER ROPA BOUTIQUE →
              </span>
            </div>
          </div>
        </article>

        {/* Card 2: Luméra Beauty & Maquillaje */}
        <article
          onClick={() => onSelectDepartment('makeup')}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-cards)',
            overflow: 'hidden',
            minHeight: 'clamp(280px, 42vw, 360px)',
            cursor: 'pointer',
            border:
              activeDepartment === 'makeup'
                ? '2px solid var(--color-lumera-statement)'
                : '1px solid var(--color-lumera-mist)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
            alt="Maquillaje Luméra Beauty"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--hero-scrim-gradient)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              padding: 'var(--card-padding)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--spacing-20)',
            }}
          >
            <div>
              <span className="pill-tag">LUMÉRA BEAUTY</span>
              <h3
                className="display-heading-sm"
                style={{
                  color: 'var(--color-paper-white)',
                  marginTop: 'var(--spacing-15)',
                }}
              >
                MAQUILLAJE &amp; COLOR
              </h3>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-lumera-pastel-soft)',
                  marginTop: 'var(--spacing-8)',
                  maxWidth: '340px',
                }}
              >
                Aceites labiales con péptidos, labiales mate terciopelo, rubores
                sérum y paletas de sombras de alta pigmentación.
              </p>
            </div>
            <div>
              <span className="pill-btn pill-btn--white">
                VER MAQUILLAJE →
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
