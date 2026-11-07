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
  { value: 'featured', label: 'SORT: FEATURED' },
  { value: 'newest', label: 'SORT: NEW IN' },
  { value: 'price-asc', label: 'PRICE: LOW — HIGH' },
  { value: 'price-desc', label: 'PRICE: HIGH — LOW' },
  { value: 'name-asc', label: 'NAME: A — Z' },
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
 * Single Responsibility: Architectural spec-sheet filter bar per Skills/DESIGN2.md
 * (0px sharp edges, GT America Mono 10-11px uppercase, #24170f filled active states).
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
        borderTop: '1px solid var(--color-warm-charcoal)',
        borderBottom: '1px solid var(--color-warm-charcoal)',
        padding: 'var(--spacing-16) 0',
      }}
    >
      {/* Primary Row: Category Tabs + Filter/Sort Controls */}
      <div className="filter-bar-header">
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
                  padding: '10px 18px',
                  fontSize: '10px',
                  letterSpacing: '0.093em',
                  flexShrink: 0,
                }}
              >
                {cat.shortName}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Item Count + Filter Drawer Trigger + Custom Sort Dropdown */}
        <div className="filter-controls-group">
          <span
            className="text-caption-editorial"
            style={{
              color: 'var(--color-soft-black)',
              padding: '0 6px',
            }}
          >
            [{totalResults} {totalResults === 1 ? 'ITEM' : 'ITEMS'}]
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
              padding: '10px 18px',
              fontSize: '10px',
              letterSpacing: '0.093em',
            }}
          >
            <SlidersHorizontal size={12} />
            <span>FILTER: TALLAS &amp; COLORES</span>
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
            marginTop: 'var(--spacing-16)',
            position: 'relative',
          }}
        >
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="BUSCAR POR PRENDA, MAQUILLAJE, SKU O TONO..."
            className="pill-input"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              style={{
                position: 'absolute',
                right: 'var(--spacing-16)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-soft-black)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Expandable Spec Panel for Size/Format & Color/Shade Filters */}
      {showAdvancedFilters && (
        <div
          style={{
            marginTop: 'var(--spacing-16)',
            padding: 'var(--spacing-20)',
            backgroundColor: 'var(--color-ash-gray)',
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
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              01 // FILTER BY SIZE OR FORMAT
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
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
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              02 // FILTER BY COLOR OR SHADE
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
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
                        width: 10,
                        height: 10,
                        backgroundColor: color.hex,
                        border: '1px solid var(--color-soft-black)',
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
            marginTop: 'var(--spacing-12)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-8)',
          }}
        >
          <span
            className="text-caption-editorial"
            style={{ color: 'var(--color-soft-black)' }}
          >
            ACTIVE FILTERS:
          </span>

          {showingWishlistOnly && (
            <button
              type="button"
              onClick={onClearWishlistFilter}
              className="badge-new-in"
              style={{ cursor: 'pointer' }}
            >
              SAVED ITEMS ONLY [X]
            </button>
          )}

          {filters.selectedSize && (
            <button
              type="button"
              onClick={() => onToggleSize(filters.selectedSize!)}
              className="badge-new-in"
              style={{ cursor: 'pointer' }}
            >
              SIZE: {filters.selectedSize} [X]
            </button>
          )}

          {filters.selectedColorName && (
            <button
              type="button"
              onClick={() => onToggleColor(filters.selectedColorName!)}
              className="badge-new-in"
              style={{ cursor: 'pointer' }}
            >
              COLOR: {filters.selectedColorName} [X]
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
              color: 'var(--color-soft-black)',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: 'var(--spacing-8)',
            }}
          >
            RESET ALL
          </button>
        </div>
      )}
    </div>
  );
};
