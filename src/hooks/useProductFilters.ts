import { useEffect, useMemo, useState } from 'react';
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
 * Single Responsibility: State management and derived data for catalog navigation & filters,
 * subscribed to backend catalog updates.
 */
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilterState>(INITIAL_FILTER_STATE);
  const [catalogRevision, setCatalogRevision] = useState(0);

  useEffect(() => {
    void ProductService.refreshFromBackend();
    return ProductService.subscribe(() => {
      setCatalogRevision((prev) => prev + 1);
    });
  }, []);

  const filteredProducts = useMemo(
    () => ProductService.filterAndSortProducts(filters),
    [filters, catalogRevision]
  );

  const activeCategoryDefinition = useMemo(
    () => ProductService.getCategoryBySlug(filters.category),
    [filters.category, catalogRevision]
  );

  const availableSizes = useMemo(
    () =>
      ProductService.getAvailableSizesForFilter(
        filters.category,
        filters.department
      ),
    [filters.category, filters.department, catalogRevision]
  );

  const availableColors = useMemo(
    () =>
      ProductService.getAvailableColorsForFilter(
        filters.category,
        filters.department
      ),
    [filters.category, filters.department, catalogRevision]
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
    filters.searchQuery.trim().length > 0 ||
    filters.selectedSize !== null ||
    filters.selectedColorName !== null;

  return {
    filters,
    filteredProducts,
    activeCategoryDefinition,
    availableSizes,
    availableColors,
    hasActiveFilters,
    catalogRevision,
    setDepartment,
    setCategory,
    setSearchQuery,
    toggleSizeFilter,
    toggleColorFilter,
    setSortBy,
    resetFilters,
  };
}
