import React from 'react';
import { Sparkles } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product.types';
import { SectionHeading } from '../ui/SectionHeading';

interface EditorialLookbookProps {
  onSelectProduct: (product: Product) => void;
}

/**
 * EditorialLookbook
 * Single Responsibility: Showcases curated fashion + makeup pairings ("Shop the Look")
 * on a soft pastel pink editorial card layout.
 */
export const EditorialLookbook: React.FC<EditorialLookbookProps> = ({
  onSelectProduct,
}) => {
  const dress = ProductService.getProductById('lum-dress-001');
  const lipOil = ProductService.getProductById('lum-mk-001');
  const corset = ProductService.getProductById('lum-top-001');
  const palazzo = ProductService.getProductById('lum-bot-001');
  const palette = ProductService.getProductById('lum-mk-004');

  const curatedLooks = [
    {
      id: 'look-soiree-rose',
      tag: 'LOOKBOOK 01 · SOIRÉE EN SATÉN',
      title: 'MONOCROMO ROSA & PASTEL',
      description:
        'La fluidez del Vestido Midi Satén Éclat combinada con el brillo espejo tridimensional del Peptide Lip Oil en tono 01 Luméra Berry.',
      items: [dress, lipOil].filter((p): p is Product => Boolean(p)),
    },
    {
      id: 'look-atelier-tailoring',
      tag: 'LOOKBOOK 02 · SASTRE DE GALERÍA',
      title: 'ESTRUCTURA & MIRADA EDITORIAL',
      description:
        'El Corset Escultural Archive junto al Pantalón Palazzo Céline y la Paleta Rose Archive de 9 sombras multidimensionales.',
      items: [corset, palazzo, palette].filter((p): p is Product => Boolean(p)),
    },
  ];

  return (
    <section
      className="lumera-container lumera-section"
      style={{
        paddingTop: 'var(--spacing-30)',
        borderTop: '1px solid var(--color-lumera-mist)',
      }}
    >
      <SectionHeading
        eyebrow="ESTILISMO COMPLETO MODA + BEAUTY"
        title="SHOP THE EDITORIAL LOOK"
        subtitle="Combinaciones curadas por nuestro atelier donde cada prenda dialoga con su tono exacto de maquillaje."
      />

      <div className="lookbook-grid">
        {curatedLooks.map((look) => (
          <div
            key={look.id}
            style={{
              backgroundColor: 'var(--color-lumera-pastel-soft)',
              border: '1px solid var(--color-lumera-mist)',
              borderRadius: 'var(--radius-cards)',
              padding: 'var(--card-padding)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--spacing-20)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-8)',
                  marginBottom: 'var(--spacing-12)',
                }}
                className="pill-tag"
              >
                <Sparkles size={13} color="var(--color-lumera-statement)" />
                <span>{look.tag}</span>
              </div>

              <h3
                className="display-heading-sm"
                style={{ marginBottom: 'var(--spacing-10)' }}
              >
                {look.title}
              </h3>

              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-carbon)',
                  marginBottom: 'var(--spacing-16)',
                }}
              >
                {look.description}
              </p>
            </div>

            {/* Paired Products List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-12)',
              }}
            >
              {look.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    alignItems: 'center',
                    gap: 'var(--spacing-12)',
                    padding: 'var(--spacing-10)',
                    backgroundColor: 'var(--color-paper-white)',
                    border: '1px solid var(--color-lumera-mist)',
                    borderRadius: 'var(--radius-cards)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={item.colors[0].images[0]}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 76,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-cards)',
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <span
                      className="text-caption-editorial"
                      style={{ color: 'var(--color-lumera-statement)' }}
                    >
                      {item.department === 'makeup'
                        ? 'MAQUILLAJE'
                        : 'ROPA BOUTIQUE'}
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-integral)',
                        fontSize: '15px',
                        color: 'var(--color-lumera-statement)',
                        margin: '2px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </h4>
                    <span
                      className="text-body-sm-editorial"
                      style={{
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-carbon)',
                      }}
                    >
                      {CurrencyService.formatUSD(item.price)}
                    </span>
                  </div>

                  <span
                    className="pill-btn pill-btn--pastel"
                    style={{
                      padding: '6px 14px',
                      fontSize: '11px',
                    }}
                  >
                    VER →
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
