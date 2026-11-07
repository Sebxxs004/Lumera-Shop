import React from 'react';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product.types';
import { SectionHeading } from '../ui/SectionHeading';

interface EditorialLookbookProps {
  onSelectProduct: (product: Product) => void;
}

/**
 * EditorialLookbook
 * Single Responsibility: Architectural spec-sheet lookbook on Ash Gray (#ececec)
 * alternating section band per Skills/DESIGN2.md.
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
      tag: 'SPEC SHEET 01 // EVENING SILK',
      title: 'SATIN BIAS DRESS + GLAZE LIP OIL',
      description:
        'Vestido Midi Satén Éclat al bies combinado con el brillo espejo tridimensional del Peptide Lip Oil.',
      items: [dress, lipOil].filter((p): p is Product => Boolean(p)),
    },
    {
      id: 'look-atelier-tailoring',
      tag: 'SPEC SHEET 02 // ARCHITECTURAL TAILORING',
      title: 'ARCHIVE CORSET + PALAZZO + PALETTE',
      description:
        'Corset Escultural Archive junto al Pantalón Palazzo Céline de tiro alto y la Paleta de 9 sombras.',
      items: [corset, palazzo, palette].filter((p): p is Product => Boolean(p)),
    },
  ];

  return (
    <section
      style={{
        backgroundColor: 'var(--color-ash-gray)',
        padding: 'var(--spacing-60) 0',
        marginTop: 'var(--section-gap)',
      }}
    >
      <div className="lumera-container">
        <SectionHeading
          eyebrow="CURATED COMBINATIONS // APPAREL + BEAUTY"
          title="THE LUMÉRA NETWORK & LOOKS"
          subtitle="Combinaciones de archivo donde cada prenda de sastrería dialoga con su fórmula exacta de maquillaje."
        />

        <div className="lookbook-grid">
          {curatedLooks.map((look) => (
            <div
              key={look.id}
              style={{
                backgroundColor: 'var(--color-pure-white)',
                border: '1px solid var(--color-warm-charcoal)',
                padding: 'var(--spacing-24)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--spacing-20)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    marginBottom: 'var(--spacing-12)',
                  }}
                  className="badge-new-in"
                >
                  {look.tag}
                </div>

                <h3
                  className="display-heading-sm"
                  style={{ marginBottom: 'var(--spacing-8)' }}
                >
                  {look.title}
                </h3>

                <p
                  className="text-body-sm-editorial"
                  style={{
                    color: 'var(--color-soft-black)',
                    marginBottom: 'var(--spacing-16)',
                  }}
                >
                  {look.description}
                </p>
              </div>

              {/* Paired Products Spec List */}
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
                      padding: 'var(--spacing-8)',
                      border: '1px solid var(--color-ash-gray)',
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
                      }}
                    />

                    <div style={{ minWidth: 0 }}>
                      <span
                        className="text-caption-editorial"
                        style={{ color: 'var(--color-soft-black)', opacity: 0.65 }}
                      >
                        {item.sku} //{' '}
                        {item.department === 'makeup' ? 'BEAUTY' : 'APPAREL'}
                      </span>
                      <h4
                        style={{
                          fontFamily: 'var(--font-gt-america-mono)',
                          fontSize: '12px',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-soft-black)',
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
                          color: 'var(--color-soft-black)',
                        }}
                      >
                        {CurrencyService.formatUSD(item.price)}
                      </span>
                    </div>

                    <span
                      className="pill-btn pill-btn--outline"
                      style={{
                        padding: '8px 14px',
                        fontSize: '10px',
                      }}
                    >
                      VIEW +
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
