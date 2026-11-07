import React from 'react';
import { Instagram } from 'lucide-react';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product.types';
import { SectionHeading } from '../ui/SectionHeading';

interface LumeraNetworkGridProps {
  onSelectProduct: (product: Product) => void;
}

/**
 * LumeraNetworkGrid
 * Single Responsibility: Implements the 'Instagram Grid Card' / Network section
 * specified in Skills/DESIGN2.md:
 * "Full-bleed square or portrait image, 0px radius, Instagram icon (#ffffff, ~20px)
 *  overlaid in bottom-left corner. No text, no border — pure image tile."
 */
export const LumeraNetworkGrid: React.FC<LumeraNetworkGridProps> = ({
  onSelectProduct,
}) => {
  const networkPosts = [
    {
      id: 'net-01',
      image:
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85',
      productId: 'lum-dress-001',
      caption: '@LUMERA.ARCHIVE — Vestido Midi Satén Éclat',
    },
    {
      id: 'net-02',
      image:
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',
      productId: 'lum-dress-002',
      caption: '@LUMERA.ARCHIVE — Conjunto Sastre Lino Atelier',
    },
    {
      id: 'net-03',
      image:
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85',
      productId: 'lum-top-001',
      caption: '@LUMERA.ARCHIVE — Corset Escultural Archive',
    },
    {
      id: 'net-04',
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85',
      productId: 'lum-mk-002',
      caption: '@LUMERA.ARCHIVE — Velvet Couture Matte Lipstick',
    },
  ];

  return (
    <section className="lumera-container lumera-section">
      <SectionHeading
        eyebrow="@LUMERA.ARCHIVE // SOCIAL PROOF"
        title="THE LUMÉRA NETWORK"
        subtitle="Selecciona cualquier toma editorial de nuestra comunidad para inspeccionar la prenda o el tono utilizado."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--spacing-20)',
        }}
      >
        {networkPosts.map((post) => {
          const linkedProduct = ProductService.getProductById(post.productId);
          return (
            <div
              key={post.id}
              title={post.caption}
              onClick={() => {
                if (linkedProduct) onSelectProduct(linkedProduct);
              }}
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--color-ash-gray)',
              }}
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Bottom-left #ffffff ~20px Instagram Icon per DESIGN2.md */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  color: 'var(--color-pure-white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Instagram size={20} color="#ffffff" strokeWidth={1.8} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
