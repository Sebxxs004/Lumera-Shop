import React from 'react';
import { ProductSizeOption } from '../../types/product.types';

interface SizeSelectorProps {
  sizes: ProductSizeOption[];
  selectedSize: ProductSizeOption;
  onSelectSize: (size: ProductSizeOption) => void;
  labelPrefix?: string;
  onOpenSizeGuide?: () => void;
}

/**
 * SizeSelector
 * Single Responsibility: Sharp 0px spec-sheet selector for sizes or makeup presentations
 * per Skills/DESIGN2.md (GT America Mono 11-12px uppercase, #24170f selected fill),
 * showing explicit 'AGOTADO' status when stock is 0.
 */
export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  labelPrefix = 'TALLA',
  onOpenSizeGuide,
}) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <span
          className="text-caption-editorial"
          style={{ color: 'var(--color-soft-black)' }}
        >
          {labelPrefix}: <strong>{selectedSize.label}</strong>
          {!selectedSize.inStock && (
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 6px',
                border: '1px solid var(--color-warm-charcoal)',
                fontSize: '9px',
                fontWeight: 700,
              }}
            >
              AGOTADO
            </span>
          )}
        </span>

        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-caption-editorial"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-soft-black)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            [GUÍA DE MEDIDAS &amp; TONOS]
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-8)',
        }}
      >
        {sizes.map((size) => {
          const isSelected = size.label === selectedSize.label;
          const isAvailable =
            size.inStock &&
            (typeof size.stock !== 'number' || size.stock > 0);

          return (
            <button
              key={size.label}
              type="button"
              onClick={() => onSelectSize(size)}
              style={{
                padding: '10px 16px',
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                letterSpacing: '0.071em',
                textTransform: 'uppercase',
                border: isSelected
                  ? '1px solid var(--color-warm-charcoal)'
                  : '1px solid var(--color-soft-black)',
                backgroundColor: isSelected
                  ? 'var(--color-warm-charcoal)'
                  : 'var(--color-pure-white)',
                color: isSelected
                  ? 'var(--color-pure-white)'
                  : 'var(--color-soft-black)',
                cursor: 'pointer',
                opacity: isAvailable ? 1 : 0.42,
                textDecoration: isAvailable ? 'none' : 'line-through',
              }}
            >
              {size.label}
              {!isAvailable ? ' · AGOTADO' : ''}
            </button>
          );
        })}
      </div>

      {selectedSize.measurementsOrDetail && (
        <p
          className="text-caption-editorial"
          style={{
            marginTop: 'var(--spacing-8)',
            color: 'var(--color-soft-black)',
            opacity: 0.75,
          }}
        >
          SPEC: {selectedSize.measurementsOrDetail}
          {typeof selectedSize.stock === 'number' && selectedSize.stock > 0 && (
            <span> · DISPONIBLES: {selectedSize.stock} UDS.</span>
          )}
        </p>
      )}
    </div>
  );
};
