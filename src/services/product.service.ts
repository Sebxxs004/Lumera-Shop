import { CATEGORIES_DATA } from '../data/categories.data';
import { PRODUCTS_DATA } from '../data/products.data';
import {
  CategoryDefinition,
  Product,
  ProductCategorySlug,
  ProductFilterState,
} from '../types/product.types';

/**
 * ProductService
 * Single Responsibility: Domain logic for querying, filtering, sorting, and relating products.
 * Ready to be replaced or extended with asynchronous HTTP repository calls when backend is added.
 */
export const ProductService = {
  getAllProducts(): Product[] {
    return PRODUCTS_DATA;
  },

  getAllCategories(): CategoryDefinition[] {
    return CATEGORIES_DATA;
  },

  getCategoryBySlug(slug: ProductCategorySlug): CategoryDefinition {
    return (
      CATEGORIES_DATA.find((cat) => cat.slug === slug) ?? CATEGORIES_DATA[0]
    );
  },

  getProductById(productId: string): Product | undefined {
    return PRODUCTS_DATA.find((item) => item.id === productId);
  },

  getRelatedProducts(product: Product): Product[] {
    const explicit = product.relatedProductIds
      .map((id) => PRODUCTS_DATA.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (explicit.length >= 3) {
      return explicit.slice(0, 3);
    }

    const fallback = PRODUCTS_DATA.filter(
      (p) => p.id !== product.id && !explicit.some((e) => e.id === p.id)
    );

    return [...explicit, ...fallback].slice(0, 3);
  },

  getAvailableSizesForFilter(category: ProductCategorySlug, department: string): string[] {
    const pool = PRODUCTS_DATA.filter((p) => {
      if (department !== 'all' && p.department !== department) return false;
      if (category !== 'all' && p.category !== category) return false;
      return true;
    });

    const sizeSet = new Set<string>();
    pool.forEach((product) => {
      product.sizes.forEach((size) => {
        if (size.inStock) {
          sizeSet.add(size.label);
        }
      });
    });

    return Array.from(sizeSet);
  },

  getAvailableColorsForFilter(
    category: ProductCategorySlug,
    department: string
  ): Array<{ name: string; hex: string }> {
    const pool = PRODUCTS_DATA.filter((p) => {
      if (department !== 'all' && p.department !== department) return false;
      if (category !== 'all' && p.category !== category) return false;
      return true;
    });

    const colorMap = new Map<string, string>();
    pool.forEach((product) => {
      product.colors.forEach((c) => {
        if (!colorMap.has(c.name)) {
          colorMap.set(c.name, c.hex);
        }
      });
    });

    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  },

  filterAndSortProducts(filter: ProductFilterState): Product[] {
    const normalizedQuery = filter.searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS_DATA.filter((product) => {
      if (
        filter.department !== 'all' &&
        product.department !== filter.department
      ) {
        return false;
      }

      if (filter.category !== 'all' && product.category !== filter.category) {
        return false;
      }

      if ( normalizedQuery.length > 0 ) {
        const matchesName = product.name.toLowerCase().includes(normalizedQuery);
        const matchesSubtitle = product.subtitle
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesCategory = product.categoryLabel
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesColor = product.colors.some((c) =>
          c.name.toLowerCase().includes(normalizedQuery)
        );
        if (!matchesName && !matchesSubtitle && !matchesCategory && !matchesColor) {
          return false;
        }
      }

      if (filter.selectedSize) {
        const hasSize = product.sizes.some(
          (s) => s.label === filter.selectedSize && s.inStock
        );
        if (!hasSize) return false;
      }

      if (filter.selectedColorName) {
        const hasColor = product.colors.some(
          (c) => c.name === filter.selectedColorName
        );
        if (!hasColor) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'newest':
          return (b.badge === 'NEW IN' ? 1 : 0) - (a.badge === 'NEW IN' ? 1 : 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  },
};

