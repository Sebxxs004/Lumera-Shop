import React from 'react';
import { ProductColorVariant } from '../../types/product.types';

interface ColorSwatchSelectorProps {
  colors: ProductColorVariant[];
  selectedColor: ProductColorVariant;
  onSelectColor: (color: ProductColorVariant) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  labelPrefix?: string;
}

/**
 * ColorSwatchSelector
 * Single Responsibility: Interactive selector for product colors or makeup shades.
 */
export const ColorSwatchSelector: React.FC<ColorSwatchSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
  showLabel = true,
  labelPrefix = 'COLOR',
}) => {
  const swatchDimension = size === 'sm' ? 20 : 28;

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-10)',
            gap: 'var(--spacing-8)',
          }}
        >
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-lumera-statement)' }}
          >
            {labelPrefix}:{' '}
            <strong style={{ color: 'var(--color-carbon)' }}>
              {selectedColor.name}
            </strong>
          </span>
          {selectedColor.finish && (
            <span
              className="text-caption-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                opacity: 0.85,
              }}
            >
              {selectedColor.finish}
            </span>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: size === 'sm' ? 'var(--spacing-8)' : 'var(--spacing-10)',
        }}
      >
        {colors.map((color) => {
          const isSelected = color.id === selectedColor.id;
          return (
            <button
              key={color.id}
              type="button"
              title={`${color.name}${color.finish ? ` (${color.finish})` : ''}`}
              aria-label={`Seleccionar ${color.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(color);
              }}
              style={{
                width: swatchDimension + 8,
                height: swatchDimension + 8,
                borderRadius: 'var(--radius-full)',
                padding: '3px',
                border: isSelected
                  ? '2px solid var(--color-lumera-statement)'
                  : '1px solid var(--color-lumera-mist)',
                backgroundColor: 'var(--color-paper-white)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: color.hex,
                  border:
                    color.hex.toLowerCase() === '#ffffff' ||
                    color.hex.toLowerCase() === '#f8f8f6' ||
                    color.hex.toLowerCase() === '#f5efe6'
                      ? '1px solid var(--color-lumera-mist)'
                      : 'none',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

