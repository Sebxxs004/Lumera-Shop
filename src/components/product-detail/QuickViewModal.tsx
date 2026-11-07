import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import {
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../../types/product.types';
import { ColorSwatchSelector } from '../ui/ColorSwatchSelector';
import { SizeSelector } from '../ui/SizeSelector';

interface QuickViewModalProps {
  product: Product | null;
  initialColor?: ProductColorVariant;
  initialSize?: ProductSizeOption;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    color: ProductColorVariant,
    size: ProductSizeOption,
    quantity: number
  ) => void;
  onOpenFullDetail: (
    product: Product,
    color: ProductColorVariant,
    size: ProductSizeOption
  ) => void;
  onOpenSizeGuide: () => void;
}

/**
 * QuickViewModal
 * Single Responsibility: Sharp 0px architectural quick-spec modal per Skills/DESIGN2.md.
 */
export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  initialColor,
  initialSize,
  onClose,
  onAddToCart,
  onOpenFullDetail,
  onOpenSizeGuide,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColorVariant | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | null>(
    null
  );
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor ?? product.colors[0]);
      setSelectedSize(
        initialSize ?? product.sizes.find((s) => s.inStock) ?? product.sizes[0]
      );
      setAdded(false);
    }
  }, [product, initialColor, initialSize]);

  if (!product || !selectedColor || !selectedSize) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista rápida de ${product.name}`}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 105,
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
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* Left: Product Image */}
        <div
          style={{
            position: 'relative',
            minHeight: '360px',
            backgroundColor: 'var(--color-ash-gray)',
          }}
        >
          <img
            src={selectedColor.images[0]}
            alt={`${product.name} - ${selectedColor.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {product.badge && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'var(--color-pure-white)',
              }}
            >
              <span className="badge-new-in">{product.badge}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Spec Sheet */}
        <div
          style={{
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--spacing-12)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              <span
                className="text-caption-editorial"
                style={{ color: 'var(--color-soft-black)' }}
              >
                {product.categoryLabel} // {product.sku}
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar vista rápida"
                className="pill-btn pill-btn--outline"
                style={{ padding: '6px 10px' }}
              >
                <X size={14} />
              </button>
            </div>

            <h2
              className="display-heading-sm"
              style={{ marginBottom: 'var(--spacing-8)' }}
            >
              {product.name}
            </h2>

            <p
              className="text-body-sm-editorial"
              style={{
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--spacing-16)',
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '18px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--spacing-20)',
                paddingBottom: 'var(--spacing-12)',
                borderBottom: '1px solid var(--color-warm-charcoal)',
              }}
            >
              {CurrencyService.formatUSD(product.price)}
            </div>

            <div style={{ marginBottom: 'var(--spacing-20)' }}>
              <ColorSwatchSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                labelPrefix={product.colorTypeLabel}
              />
            </div>

            <div>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                labelPrefix={product.sizeTypeLabel}
                onOpenSizeGuide={onOpenSizeGuide}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-8)',
              paddingTop: 'var(--spacing-16)',
              borderTop: '1px solid var(--color-ash-gray)',
            }}
          >
            <button
              type="button"
              onClick={handleAdd}
              className="pill-btn pill-btn--brand"
              style={{ width: '100%' }}
            >
              {added ? (
                <>
                  <Check size={14} />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <span>
                  ADD TO CART — {CurrencyService.formatUSD(product.price)} +
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullDetail(product, selectedColor, selectedSize);
              }}
              className="pill-btn pill-btn--outline"
              style={{ width: '100%' }}
            >
              <span>OPEN FULL TECHNICAL SPEC SHEET</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
