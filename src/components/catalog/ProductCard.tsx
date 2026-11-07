import React, { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { VariantStockService } from '../../services/variant-stock.service';
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
 * with real-time variant stock and automatic 'AGOTADO' detection per size, shade, or combination.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickViewProduct,
  onQuickAddToCart,
}) => {
  const colorsWithStock = useMemo(
    () => VariantStockService.getColorsWithStockStatus(product),
    [product]
  );

  const [selectedColorId, setSelectedColorId] = useState<string>(
    () =>
      colorsWithStock.find((c) => c.inStock)?.id ??
      colorsWithStock[0]?.id ??
      ''
  );

  const activeColor = useMemo(
    () =>
      colorsWithStock.find((c) => c.id === selectedColorId) ??
      colorsWithStock[0],
    [colorsWithStock, selectedColorId]
  );

  const sizesForColor = useMemo(
    () =>
      VariantStockService.getSizesForSelectedColor(product, activeColor.id),
    [product, activeColor.id]
  );

  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>(
    () =>
      sizesForColor.find((s) => s.inStock)?.label ??
      sizesForColor[0]?.label ??
      ''
  );

  const activeSize = useMemo(
    () =>
      sizesForColor.find((s) => s.label === selectedSizeLabel) ??
      sizesForColor[0],
    [sizesForColor, selectedSizeLabel]
  );

  const [isHovered, setIsHovered] = useState(false);

  const currentVariantStock = VariantStockService.getVariantStock(
    product,
    activeColor.id,
    activeSize.label
  );
  const isCurrentVariantInStock = currentVariantStock > 0;
  const isProductCompletelySoldOut =
    VariantStockService.isProductSoldOut(product);

  const primaryImage = activeColor.images[0];
  const secondaryImage = activeColor.images[1] ?? activeColor.images[0];

  const handleSelectColor = (color: ProductColorVariant) => {
    setSelectedColorId(color.id);
    const nextSizes = VariantStockService.getSizesForSelectedColor(
      product,
      color.id
    );
    const currentStillInStock = nextSizes.find(
      (s) => s.label === selectedSizeLabel && s.inStock
    );
    if (!currentStillInStock) {
      const firstAvailable = nextSizes.find((s) => s.inStock);
      if (firstAvailable) {
        setSelectedSizeLabel(firstAvailable.label);
      }
    }
  };

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
          onClick={() => onSelectProduct(product, activeColor, activeSize)}
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
            alt={`${product.name} - ${activeColor.name}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.45s ease',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              opacity: isProductCompletelySoldOut ? 0.65 : 1,
            }}
          />

          {/* Top-Left Sold-Out Overlay Badge if entire product or current variant is out of stock */}
          {!isCurrentVariantInStock && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'var(--color-warm-charcoal)',
                color: 'var(--color-pure-white)',
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                textTransform: 'uppercase',
              }}
            >
              AGOTADO
            </span>
          )}

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
              onQuickViewProduct(product, activeColor, activeSize);
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
            disabled={!isCurrentVariantInStock}
            title={
              isCurrentVariantInStock
                ? 'Añadir rápidamente a la bolsa'
                : 'Variante agotada'
            }
            aria-label={`Añadir ${product.name} a la bolsa`}
            onClick={(e) => {
              e.stopPropagation();
              if (isCurrentVariantInStock) {
                onQuickAddToCart(product, activeColor, activeSize);
              }
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
              cursor: isCurrentVariantInStock ? 'pointer' : 'not-allowed',
              opacity: isCurrentVariantInStock ? 1 : 0.4,
            }}
          >
            {isCurrentVariantInStock ? '+' : '×'}
          </button>
        </div>

        {/* 2. Bare-White Spec Block Below Image */}
        <div>
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
              onClick={() => onSelectProduct(product, activeColor, activeSize)}
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

            {isProductCompletelySoldOut ? (
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 7px',
                  border: '1px solid var(--color-warm-charcoal)',
                  color: 'var(--color-warm-charcoal)',
                  flexShrink: 0,
                }}
              >
                AGOTADO
              </span>
            ) : (
              product.badge && (
                <span className="badge-new-in" style={{ flexShrink: 0 }}>
                  {product.badge}
                </span>
              )
            )}
          </div>

          {/* Price Row in COP */}
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
                {CurrencyService.formatCOP(product.price)}
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
                  {CurrencyService.formatCOP(product.compareAtPrice)}
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
              colors={colorsWithStock}
              selectedColor={activeColor}
              onSelectColor={handleSelectColor}
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
              {sizesForColor.map((sizeOpt) => {
                const isSelected = sizeOpt.label === activeSize.label;
                return (
                  <button
                    key={sizeOpt.label}
                    type="button"
                    onClick={() => setSelectedSizeLabel(sizeOpt.label)}
                    className={`pill-btn pill-btn--ghost ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      opacity: sizeOpt.inStock ? 1 : 0.4,
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
          disabled={!isCurrentVariantInStock}
          onClick={() => {
            if (isCurrentVariantInStock) {
              onQuickAddToCart(product, activeColor, activeSize);
            }
          }}
          className="pill-btn pill-btn--brand"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '11px',
            opacity: isCurrentVariantInStock ? 1 : 0.45,
            cursor: isCurrentVariantInStock ? 'pointer' : 'not-allowed',
          }}
        >
          {isCurrentVariantInStock ? 'AÑADIR A LA BOLSA +' : 'AGOTADO'}
        </button>

        <button
          type="button"
          onClick={() => onSelectProduct(product, activeColor, activeSize)}
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
