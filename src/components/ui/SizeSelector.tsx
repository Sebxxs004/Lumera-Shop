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
 * Single Responsibility: Pill-shaped selector for sizes or makeup presentations,
 * displaying exact measurements/details for the chosen option.
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
          marginBottom: 'var(--spacing-10)',
        }}
      >
        <span
          className="text-caption-editorial"
          style={{ color: 'var(--color-lumera-statement)' }}
        >
          {labelPrefix}:{' '}
          <strong style={{ color: 'var(--color-carbon)' }}>
            {selectedSize.label}
          </strong>
        </span>

        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-caption-editorial"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-lumera-statement)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            GUÍA DE MEDIDAS & TONOS
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
          return (
            <button
              key={size.label}
              type="button"
              disabled={!size.inStock}
              onClick={() => onSelectSize(size)}
              style={{
                borderRadius: 'var(--radius-buttons)',
                padding: 'var(--spacing-10) var(--spacing-20)',
                fontFamily: 'var(--font-soehne)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: 'var(--tracking-body-sm)',
                border: isSelected
                  ? '1px solid var(--color-lumera-statement)'
                  : '1px solid var(--color-lumera-mist)',
                backgroundColor: isSelected
                  ? 'var(--color-lumera-statement)'
                  : 'var(--color-paper-white)',
                color: isSelected
                  ? 'var(--color-paper-white)'
                  : 'var(--color-lumera-statement)',
                cursor: size.inStock ? 'pointer' : 'not-allowed',
                opacity: size.inStock ? 1 : 0.38,
                textDecoration: size.inStock ? 'none' : 'line-through',
                transition: 'all 0.15s ease',
              }}
            >
              {size.label}
            </button>
          );
        })}
      </div>

      {selectedSize.measurementsOrDetail && (
        <p
          className="text-caption-editorial"
          style={{
            marginTop: 'var(--spacing-10)',
            color: 'var(--color-carbon)',
            fontWeight: 'var(--font-weight-regular)',
            textTransform: 'none',
            letterSpacing: 'var(--tracking-body-sm)',
            fontSize: '12px',
          }}
        >
          Detalle de selección: {selectedSize.measurementsOrDetail}
        </p>
      )}
    </div>
  );
};

