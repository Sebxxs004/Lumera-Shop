import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ShoppingBag, X } from 'lucide-react';
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
 * Single Responsibility: Floating editorial modal allowing users to inspect
 * colors/shades, sizes/formats, and measurements without losing catalog scroll position.
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
        backgroundColor: 'rgba(27, 27, 27, 0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-20)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-paper-white-canvas)',
          border: '2px solid var(--color-lumera-statement)',
          borderRadius: 'var(--radius-cards)',
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
            backgroundColor: 'var(--surface-fog-footer)',
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
                top: 'var(--spacing-15)',
                left: 'var(--spacing-15)',
              }}
            >
              <span className="pill-tag">{product.badge}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Configuration */}
        <div
          style={{
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--spacing-12)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              <span
                className="text-caption-editorial"
                style={{ color: 'var(--color-lumera-statement)' }}
              >
                {product.categoryLabel} · {product.sku}
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar vista rápida"
                className="pill-btn pill-btn--outline"
                style={{ padding: '6px 12px' }}
              >
                <X size={15} />
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
                color: 'var(--color-carbon)',
                marginBottom: 'var(--spacing-15)',
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                fontFamily: 'var(--font-integral)',
                fontSize: '28px',
                color: 'var(--color-lumera-statement)',
                marginBottom: 'var(--spacing-20)',
                paddingBottom: 'var(--spacing-15)',
                borderBottom: '1px solid var(--color-lumera-mist)',
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
              gap: 'var(--spacing-10)',
              paddingTop: 'var(--spacing-15)',
              borderTop: '1px solid var(--color-lumera-mist)',
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
                  <Check size={16} />
                  <span>AÑADIDO A LA BOLSA</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>
                    AÑADIR A LA BOLSA · {CurrencyService.formatUSD(product.price)}
                  </span>
                </>
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
              <span>VER FICHA COMPLETA E INGREDIENTES / COMPOSICIÓN</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

