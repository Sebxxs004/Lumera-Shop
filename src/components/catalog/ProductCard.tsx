import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
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
 * Single Responsibility: Editorial product card allowing the user to preview images,
 * switch color/shade swatches live, choose a size/format, and either inspect full details
 * or add directly to the bag.
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
        backgroundColor: 'var(--surface-paper-white-canvas)',
        border: '1px solid var(--color-lumera-mist)',
        borderRadius: 'var(--radius-cards)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.2s ease',
        borderColor: isHovered
          ? 'var(--color-lumera-statement)'
          : 'var(--color-lumera-mist)',
      }}
    >
      {/* Top: Image Frame */}
      <div>
        <div
          onClick={() => onSelectProduct(product, selectedColor, selectedSize)}
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: 'var(--surface-fog-footer)',
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
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />

          {/* Top Left Badge */}
          {product.badge && (
            <div
              style={{
                position: 'absolute',
                top: 'var(--spacing-12)',
                left: 'var(--spacing-12)',
              }}
            >
              <span className="pill-tag">{product.badge}</span>
            </div>
          )}

          {/* Top Right Wishlist Button */}
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
              top: 'var(--spacing-12)',
              right: 'var(--spacing-12)',
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-paper-white)',
              border: '1px solid var(--color-lumera-statement)',
              color: 'var(--color-lumera-statement)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Heart
              size={17}
              fill={isWishlisted ? 'var(--color-lumera-statement)' : 'none'}
            />
          </button>

          {/* Bottom Quick Inspect Pill on Hover */}
          <div
            style={{
              position: 'absolute',
              bottom: 'var(--spacing-12)',
              right: 'var(--spacing-12)',
              left: 'var(--spacing-12)',
              display: 'flex',
              justifyContent: 'flex-end',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickViewProduct(product, selectedColor, selectedSize);
              }}
              className="pill-btn pill-btn--white"
              style={{
                padding: 'var(--spacing-8) var(--spacing-16)',
                fontSize: 'var(--text-caption)',
              }}
            >
              <Eye size={14} />
              <span>VISTA RÁPIDA</span>
            </button>
          </div>
        </div>

        {/* Product Info Block */}
        <div style={{ padding: 'var(--spacing-20)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 'var(--spacing-8)',
              marginBottom: 'var(--spacing-6)',
            }}
          >
            <span
              className="text-caption-editorial"
              style={{ color: 'var(--color-lumera-statement)' }}
            >
              {product.categoryLabel}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {product.compareAtPrice && (
                <span
                  className="text-body-sm-editorial"
                  style={{
                    color: 'var(--color-lumera-mist)',
                    textDecoration: 'line-through',
                  }}
                >
                  {CurrencyService.formatUSD(product.compareAtPrice)}
                </span>
              )}
              <span
                className="text-body-sm-editorial"
                style={{
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-lumera-statement)',
                }}
              >
                {CurrencyService.formatUSD(product.price)}
              </span>
            </div>
          </div>

          <h3
            onClick={() =>
              onSelectProduct(product, selectedColor, selectedSize)
            }
            style={{
              fontFamily: 'var(--font-integral)',
              fontSize: '22px',
              lineHeight: 1.05,
              letterSpacing: '0.03em',
              color: 'var(--color-lumera-statement)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: 'var(--spacing-6)',
            }}
          >
            {product.name}
          </h3>

          <p
            className="text-body-sm-editorial"
            style={{
              color: 'var(--color-carbon)',
              marginBottom: 'var(--spacing-16)',
              fontSize: '13px',
            }}
          >
            {product.subtitle}
          </p>

          {/* Interactive Color / Shade Swatches */}
          <div style={{ marginBottom: 'var(--spacing-15)' }}>
            <ColorSwatchSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              size="sm"
              labelPrefix={product.colorTypeLabel}
            />
          </div>

          {/* Interactive Size / Format Quick Selector */}
          <div>
            <span
              className="text-caption-editorial"
              style={{
                display: 'block',
                color: 'var(--color-lumera-statement)',
                marginBottom: 'var(--spacing-6)',
              }}
            >
              {product.sizeTypeLabel}:{' '}
              <strong style={{ color: 'var(--color-carbon)' }}>
                {selectedSize.label}
              </strong>
            </span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-6)',
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
                      padding: '4px 11px',
                      fontSize: '11px',
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

      {/* Bottom Action Bar */}
      <div
        style={{
          padding: '0 var(--spacing-20) var(--spacing-20)',
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
            padding: 'var(--spacing-12) var(--spacing-16)',
            fontSize: 'var(--text-caption)',
          }}
        >
          <ShoppingBag size={15} />
          <span>AÑADIR A LA BOLSA</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectProduct(product, selectedColor, selectedSize)}
          className="pill-btn pill-btn--outline"
          style={{
            padding: 'var(--spacing-12) var(--spacing-16)',
            fontSize: 'var(--text-caption)',
          }}
          title="Ver ficha completa del producto"
        >
          FICHA →
        </button>
      </div>
    </article>
  );
};

