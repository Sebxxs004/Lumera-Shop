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
 * Single Responsibility: Sharp 0px architectural color/shade swatch selector per DESIGN2.md.
 */
export const ColorSwatchSelector: React.FC<ColorSwatchSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
  showLabel = true,
  labelPrefix = 'COLOR',
}) => {
  const swatchDimension = size === 'sm' ? 18 : 26;

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-8)',
            gap: 'var(--spacing-8)',
          }}
        >
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-soft-black)' }}
          >
            {labelPrefix}: <strong>{selectedColor.name}</strong>
          </span>
          {selectedColor.finish && (
            <span
              className="text-caption-editorial"
              style={{
                color: 'var(--color-soft-black)',
                opacity: 0.65,
              }}
            >
              [{selectedColor.finish}]
            </span>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: size === 'sm' ? '6px' : '8px',
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
                width: swatchDimension + 6,
                height: swatchDimension + 6,
                padding: '2px',
                border: isSelected
                  ? '1.5px solid var(--color-warm-charcoal)'
                  : '1px solid var(--color-ash-gray)',
                backgroundColor: 'var(--color-pure-white)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: color.hex,
                  border:
                    color.hex.toLowerCase() === '#ffffff' ||
                    color.hex.toLowerCase() === '#f8f8f6' ||
                    color.hex.toLowerCase() === '#f5efe6'
                      ? '1px solid var(--color-ash-gray)'
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
