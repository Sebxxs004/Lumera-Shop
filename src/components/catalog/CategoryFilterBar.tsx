import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import {
  CategoryDefinition,
  ProductCategorySlug,
  ProductFilterState,
  SortOption,
} from '../../types/product.types';
import { PillDropdown, PillDropdownOption } from '../ui/PillDropdown';

const SORT_OPTIONS: PillDropdownOption<SortOption>[] = [
  { value: 'featured', label: 'ORDENAR: DESTACADOS' },
  { value: 'newest', label: 'ORDENAR: NUEVOS INGRESOS' },
  { value: 'price-asc', label: 'PRECIO: MENOR A MAYOR' },
  { value: 'price-desc', label: 'PRECIO: MAYOR A MENOR' },
  { value: 'name-asc', label: 'NOMBRE: A - Z' },
];

interface CategoryFilterBarProps {
  categories: CategoryDefinition[];
  filters: ProductFilterState;
  availableSizes: string[];
  availableColors: Array<{ name: string; hex: string }>;
  totalResults: number;
  hasActiveFilters: boolean;
  isSearchExpanded: boolean;
  showingWishlistOnly: boolean;
  onSelectCategory: (slug: ProductCategorySlug) => void;
  onSearchChange: (query: string) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (colorName: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onResetFilters: () => void;
  onClearWishlistFilter: () => void;
}

/**
 * CategoryFilterBar
 * Single Responsibility: Responsive category pill bar, search input, attribute filters
 * (talla/formato & color/tono), and custom sort dropdown on a soft pastel background.
 */
export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  filters,
  availableSizes,
  availableColors,
  totalResults,
  hasActiveFilters,
  isSearchExpanded,
  showingWishlistOnly,
  onSelectCategory,
  onSearchChange,
  onToggleSize,
  onToggleColor,
  onSortChange,
  onResetFilters,
  onClearWishlistFilter,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div
      id="catalog-section"
      style={{
        marginBottom: 'var(--spacing-40)',
        backgroundColor: 'var(--color-lumera-pastel-soft)',
        border: '1px solid var(--color-lumera-mist)',
        borderRadius: 'var(--radius-cards)',
        padding: 'var(--spacing-20)',
      }}
    >
      {/* Primary Row: Category Pill Tabs + Filter/Sort Controls */}
      <div className="filter-bar-header">
        {/* Horizontally scrollable on mobile, wrapped on desktop */}
        <div
          role="tablist"
          aria-label="Categorías de productos"
          className="category-pills-scroll"
        >
          {categories.map((cat) => {
            const isActive =
              filters.category === cat.slug && !showingWishlistOnly;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  if (showingWishlistOnly) onClearWishlistFilter();
                  onSelectCategory(cat.slug);
                }}
                className={`pill-btn ${
                  isActive ? 'pill-btn--brand' : 'pill-btn--outline'
                }`}
                style={{
                  padding: 'var(--spacing-10) var(--spacing-20)',
                  fontSize: 'var(--text-caption)',
                  flexShrink: 0,
                }}
              >
                {cat.shortName}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Filter Toggle + Sort Pill Dropdown */}
        <div className="filter-controls-group">
          <span
            className="pill-tag"
            style={{
              padding: '7px 14px',
            }}
          >
            {totalResults} {totalResults === 1 ? 'PIEZA' : 'PIEZAS'}
          </span>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className={`pill-btn ${
              showAdvancedFilters ||
              filters.selectedSize ||
              filters.selectedColorName
                ? 'pill-btn--brand'
                : 'pill-btn--outline'
            }`}
            style={{
              padding: 'var(--spacing-10) var(--spacing-20)',
              fontSize: 'var(--text-caption)',
            }}
          >
            <SlidersHorizontal size={14} />
            <span>TALLAS &amp; COLORES</span>
          </button>

          <PillDropdown
            options={SORT_OPTIONS}
            value={filters.sortBy}
            onChange={onSortChange}
            ariaLabel="Ordenar productos"
          />
        </div>
      </div>

      {/* Search Bar */}
      {(isSearchExpanded || filters.searchQuery.length > 0) && (
        <div
          style={{
            marginTop: 'var(--spacing-20)',
            position: 'relative',
          }}
        >
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por prenda, maquillaje, tono (ej. Satén, Corset, Lip Oil, Rosa)..."
            className="pill-input"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              style={{
                position: 'absolute',
                right: 'var(--spacing-20)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-lumera-statement)',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Expandable Drawer for Size/Presentation & Color/Shade Filters */}
      {showAdvancedFilters && (
        <div
          style={{
            marginTop: 'var(--spacing-20)',
            paddingTop: 'var(--spacing-20)',
            borderTop: '1px solid var(--color-lumera-mist)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-24)',
          }}
        >
          {/* Size / Format Filter */}
          <div>
            <p
              className="text-caption-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                marginBottom: 'var(--spacing-10)',
              }}
            >
              FILTRAR POR TALLA O FORMATO DISPONIBLE
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-8)',
              }}
            >
              {availableSizes.map((size) => {
                const isSelected = filters.selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onToggleSize(size)}
                    className={`pill-btn pill-btn--ghost ${
                      isSelected ? 'is-selected' : ''
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color / Shade Filter */}
          <div>
            <p
              className="text-caption-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                marginBottom: 'var(--spacing-10)',
              }}
            >
              FILTRAR POR COLOR O TONO DE MAQUILLAJE
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-8)',
              }}
            >
              {availableColors.map((color) => {
                const isSelected = filters.selectedColorName === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => onToggleColor(color.name)}
                    className={`pill-btn pill-btn--ghost ${
                      isSelected ? 'is-selected' : ''
                    }`}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: color.hex,
                        border: '1px solid var(--color-lumera-mist)',
                        display: 'inline-block',
                      }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {(hasActiveFilters || showingWishlistOnly) && (
        <div
          style={{
            marginTop: 'var(--spacing-16)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-10)',
          }}
        >
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-lumera-statement)' }}
          >
            FILTROS ACTIVOS:
          </span>

          {showingWishlistOnly && (
            <button
              type="button"
              onClick={onClearWishlistFilter}
              className="pill-tag pill-tag--outline"
              style={{ cursor: 'pointer' }}
            >
              SOLO FAVORITOS ✕
            </button>
          )}

          {filters.selectedSize && (
            <button
              type="button"
              onClick={() => onToggleSize(filters.selectedSize!)}
              className="pill-tag pill-tag--outline"
              style={{ cursor: 'pointer' }}
            >
              TALLA/FORMATO: {filters.selectedSize} ✕
            </button>
          )}

          {filters.selectedColorName && (
            <button
              type="button"
              onClick={() => onToggleColor(filters.selectedColorName!)}
              className="pill-tag pill-tag--outline"
              style={{ cursor: 'pointer' }}
            >
              COLOR/TONO: {filters.selectedColorName} ✕
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClearWishlistFilter();
              onResetFilters();
            }}
            className="text-caption-editorial"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-lumera-statement)',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: 'var(--spacing-8)',
            }}
          >
            LIMPIAR TODO
          </button>
        </div>
      )}
    </div>
  );
};
