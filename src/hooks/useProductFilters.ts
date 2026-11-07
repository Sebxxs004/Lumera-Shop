import { useMemo, useState } from 'react';
import { ProductService } from '../services/product.service';
import {
  ProductCategorySlug,
  ProductDepartment,
  ProductFilterState,
  SortOption,
} from '../types/product.types';

const INITIAL_FILTER_STATE: ProductFilterState = {
  department: 'all',
  category: 'all',
  searchQuery: '',
  selectedSize: null,
  selectedColorName: null,
  sortBy: 'featured',
};

/**
 * useProductFilters
 * Single Responsibility: State management and derived data for catalog navigation & filters.
 */
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilterState>(INITIAL_FILTER_STATE);

  const filteredProducts = useMemo(
    () => ProductService.filterAndSortProducts(filters),
    [filters]
  );

  const activeCategoryDefinition = useMemo(
    () => ProductService.getCategoryBySlug(filters.category),
    [filters.category]
  );

  const availableSizes = useMemo(
    () =>
      ProductService.getAvailableSizesForFilter(
        filters.category,
        filters.department
      ),
    [filters.category, filters.department]
  );

  const availableColors = useMemo(
    () =>
      ProductService.getAvailableColorsForFilter(
        filters.category,
        filters.department
      ),
    [filters.category, filters.department]
  );

  const setDepartment = (department: ProductDepartment) => {
    setFilters((prev) => ({
      ...prev,
      department,
      category: 'all',
      selectedSize: null,
      selectedColorName: null,
    }));
  };

  const setCategory = (category: ProductCategorySlug) => {
    const categoryDef = ProductService.getCategoryBySlug(category);
    setFilters((prev) => ({
      ...prev,
      category,
      department: category === 'all' ? 'all' : categoryDef.department,
      selectedSize: null,
      selectedColorName: null,
    }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const toggleSizeFilter = (sizeLabel: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSize: prev.selectedSize === sizeLabel ? null : sizeLabel,
    }));
  };

  const toggleColorFilter = (colorName: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedColorName:
        prev.selectedColorName === colorName ? null : colorName,
    }));
  };

  const setSortBy = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
  };

  const hasActiveFilters =
    filters.department !== 'all' ||
    filters.category !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    filters.selectedSize !== null ||
    filters.selectedColorName !== null;

  return {
    filters,
    filteredProducts,
    activeCategoryDefinition,
    availableSizes,
    availableColors,
    hasActiveFilters,
    setDepartment,
    setCategory,
    setSearchQuery,
    toggleSizeFilter,
    toggleColorFilter,
    setSortBy,
    resetFilters,
  };
}

