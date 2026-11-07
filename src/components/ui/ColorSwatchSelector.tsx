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
 * Single Responsibility: Sharp 0px architectural color/shade swatch selector per DESIGN2.md,
 * with automatic 'AGOTADO' visual indicator when a shade/color has 0 units available.
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
  const isSelectedSoldOut =
    selectedColor.inStock === false ||
    (typeof selectedColor.stock === 'number' && selectedColor.stock <= 0);

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
            {isSelectedSoldOut && (
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
          const isSoldOut =
            color.inStock === false ||
            (typeof color.stock === 'number' && color.stock <= 0);

          return (
            <button
              key={color.id}
              type="button"
              title={`${color.name}${color.finish ? ` (${color.finish})` : ''}${
                isSoldOut ? ' — AGOTADO' : ''
              }`}
              aria-label={`Seleccionar ${color.name}${
                isSoldOut ? ' (Agotado)' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(color);
              }}
              style={{
                position: 'relative',
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
                opacity: isSoldOut ? 0.45 : 1,
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
              {isSoldOut && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top right, transparent calc(50% - 1px), #151515 calc(50% - 1px), #151515 calc(50% + 1px), transparent calc(50% + 1px))',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
