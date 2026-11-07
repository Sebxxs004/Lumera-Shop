import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import {
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../../types/product.types';
import { ColorSwatchSelector } from '../ui/ColorSwatchSelector';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (
    product: Product,
    initialColor: ProductColorVariant,
    initialSize: ProductSizeOption
  ) => void;
  onQuickViewProduct: (
    product: Product,
    initialColor: ProductColorVariant,
    initialSize: ProductSizeOption
  ) => void;
  onQuickAddToCart: (
    product: Product,
    selectedColor: ProductColorVariant,
    selectedSize: ProductSizeOption
  ) => void;
}

/**
 * ProductCard
 * Single Responsibility: Architectural product card per Skills/DESIGN2.md
 * - Full-bleed editorial photograph (0px radius, no card border chrome — bleeds into white canvas)
 * - Small '+' glyph in bottom-right corner of image for quick-add (#151515)
 * - Below image: Product name in GT America Mono 12px weight 500 (#151515) with inline
 *   Signal Blue (#0073ff) 'NEW IN' badge + Price in GT America Mono 12px weight 400 (#151515)
 * - Interactive color swatches & size selector below for effortless shopping.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickViewProduct,
  onQuickAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColorVariant>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption>(
    product.sizes.find((s) => s.inStock) ?? product.sizes[0]
  );
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = selectedColor.images[0];
  const secondaryImage = selectedColor.images[1] ?? selectedColor.images[0];

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--color-pure-white)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* 1. Full-bleed 0px Editorial Photograph */}
        <div
          onClick={() => onSelectProduct(product, selectedColor, selectedSize)}
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: 'var(--color-ash-gray)',
            marginBottom: 'var(--spacing-12)',
          }}
        >
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={`${product.name} - ${selectedColor.name}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.45s ease',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          />

          {/* Top-Right Minimal Wishlist Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={
              isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'
            }
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: 30,
              height: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: 'none',
              color: 'var(--color-soft-black)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Heart
              size={14}
              strokeWidth={1.8}
              fill={isWishlisted ? 'var(--color-soft-black)' : 'none'}
            />
          </button>

          {/* Bottom-Left Quick View Trigger on Hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickViewProduct(product, selectedColor, selectedSize);
            }}
            className="text-caption-editorial"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              color: 'var(--color-soft-black)',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '5px 10px',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0.85,
            }}
          >
            QUICK SPEC
          </button>

          {/* Bottom-Right Quick-Add '+' Glyph per DESIGN2.md */}
          <button
            type="button"
            title="Añadir rápidamente a la bolsa"
            aria-label={`Añadir ${product.name} a la bolsa`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product, selectedColor, selectedSize);
            }}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              width: 28,
              height: 28,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              border: 'none',
              color: 'var(--color-soft-black)',
              fontFamily: 'var(--font-gt-america-mono)',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>

        {/* 2. Bare-White Spec Block Below Image */}
        <div>
          {/* Product Name + Inline Signal Blue 'NEW IN' Badge per DESIGN2.md */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--spacing-8)',
              marginBottom: '6px',
            }}
          >
            <h3
              onClick={() =>
                onSelectProduct(product, selectedColor, selectedSize)
              }
              style={{
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                letterSpacing: '0.067em',
                lineHeight: 1.4,
                color: 'var(--color-soft-black)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {product.name}
            </h3>

            {product.badge && (
              <span className="badge-new-in" style={{ flexShrink: 0 }}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Price Row in GT America Mono 12px weight 400 (#151515) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-regular)',
                  letterSpacing: '0.067em',
                  color: 'var(--color-soft-black)',
                }}
              >
                {CurrencyService.formatUSD(product.price)}
              </span>
              {product.compareAtPrice && (
                <span
                  style={{
                    fontFamily: 'var(--font-gt-america-mono)',
                    fontSize: '11px',
                    color: 'var(--color-soft-black)',
                    opacity: 0.45,
                    textDecoration: 'line-through',
                  }}
                >
                  {CurrencyService.formatUSD(product.compareAtPrice)}
                </span>
              )}
            </div>

            <span
              className="text-caption-editorial"
              style={{ color: 'var(--color-soft-black)', opacity: 0.55 }}
            >
              {product.sku}
            </span>
          </div>

          {/* Interactive Color / Shade Swatches */}
          <div
            style={{
              paddingTop: 'var(--spacing-10)',
              borderTop: '1px solid var(--color-ash-gray)',
              marginBottom: 'var(--spacing-10)',
            }}
          >
            <ColorSwatchSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              size="sm"
              labelPrefix={product.colorTypeLabel}
            />
          </div>

          {/* Interactive Size / Format Quick Selector */}
          <div style={{ marginBottom: 'var(--spacing-12)' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {product.sizes.map((sizeOpt) => {
                const isSelected = sizeOpt.label === selectedSize.label;
                return (
                  <button
                    key={sizeOpt.label}
                    type="button"
                    disabled={!sizeOpt.inStock}
                    onClick={() => setSelectedSize(sizeOpt)}
                    className={`pill-btn pill-btn--ghost ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      textDecoration: sizeOpt.inStock ? 'none' : 'line-through',
                    }}
                  >
                    {sizeOpt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Action Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'var(--spacing-8)',
        }}
      >
        <button
          type="button"
          onClick={() =>
            onQuickAddToCart(product, selectedColor, selectedSize)
          }
          className="pill-btn pill-btn--brand"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '11px',
          }}
        >
          ADD TO CART +
        </button>

        <button
          type="button"
          onClick={() => onSelectProduct(product, selectedColor, selectedSize)}
          className="pill-btn pill-btn--outline"
          style={{
            padding: '12px 14px',
            fontSize: '11px',
          }}
        >
          SPEC
        </button>
      </div>
    </article>
  );
};
