import { CATEGORIES_DATA } from '../data/categories.data';
import { PRODUCTS_DATA } from '../data/products.data';
import { INITIAL_SUBCATEGORIES_SEED } from '../data/subcategories.data';
import { PublicCatalogResponse } from '../types/admin.types';
import {
  CategoryDefinition,
  Product,
  ProductCategorySlug,
  ProductFilterState,
  SubcategoryDefinition,
} from '../types/product.types';
import { LocalBackendFallbackService } from './local-backend-fallback.service';
import { VariantStockService } from './variant-stock.service';

type CatalogChangeListener = () => void;

let currentProducts: Product[] = PRODUCTS_DATA.map((p) =>
  VariantStockService.normalizeProductInventory(p)
);
let currentSubcategories: SubcategoryDefinition[] = [
  ...INITIAL_SUBCATEGORIES_SEED,
];
let currentSignature = 'seed-unverified';
const listeners = new Set<CatalogChangeListener>();

function notifyCatalogListeners() {
  listeners.forEach((listener) => listener());
}

/**
 * ProductService
 * Single Responsibility: Domain logic for querying, filtering, sorting, and relating products,
 * synchronized with the signed `/api/v1/catalog` backend endpoint.
 */
export const ProductService = {
  subscribe(listener: CatalogChangeListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async refreshFromBackend(): Promise<void> {
    if (LocalBackendFallbackService.hasLocalOverrides()) {
      const fallback = await LocalBackendFallbackService.getPublicCatalog();
      currentProducts = fallback.products;
      currentSubcategories = fallback.subcategories;
      currentSignature = fallback.signature;
      notifyCatalogListeners();
      return;
    }

    try {
      const res = await fetch('/api/v1/catalog', {
        headers: { Accept: 'application/json' },
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (!res.ok || contentType.includes('text/html')) {
        const fallback = await LocalBackendFallbackService.getPublicCatalog();
        currentProducts = fallback.products;
        currentSubcategories = fallback.subcategories;
        currentSignature = fallback.signature;
        notifyCatalogListeners();
        return;
      }

      const text = await res.text();
      if (!text.trim()) return;
      const data = JSON.parse(text) as PublicCatalogResponse;

      if (Array.isArray(data.products)) {
        currentProducts = data.products
          .filter((p) => p.isVisible !== false)
          .map((p) => VariantStockService.normalizeProductInventory(p));
      }
      if (Array.isArray(data.subcategories)) {
        currentSubcategories = data.subcategories.filter(
          (s) => s.isVisible !== false
        );
      }
      if (data.signature) {
        currentSignature = data.signature;
      }
      notifyCatalogListeners();
    } catch {
      const fallback = await LocalBackendFallbackService.getPublicCatalog();
      currentProducts = fallback.products;
      currentSubcategories = fallback.subcategories;
      currentSignature = fallback.signature;
      notifyCatalogListeners();
    }
  },

  getCatalogSignature(): string {
    return currentSignature;
  },

  getAllProducts(): Product[] {
    return currentProducts;
  },

  getAllSubcategories(): SubcategoryDefinition[] {
    return currentSubcategories;
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
    return currentProducts.find((item) => item.id === productId);
  },

  getRelatedProducts(product: Product): Product[] {
    const explicit = product.relatedProductIds
      .map((id) => currentProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (explicit.length >= 3) {
      return explicit.slice(0, 3);
    }

    const fallback = currentProducts.filter(
      (p) => p.id !== product.id && !explicit.some((e) => e.id === p.id)
    );

    return [...explicit, ...fallback].slice(0, 3);
  },

  getAvailableSizesForFilter(
    category: ProductCategorySlug,
    department: string
  ): string[] {
    const pool = currentProducts.filter((p) => {
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
    const pool = currentProducts.filter((p) => {
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

    return Array.from(colorMap.entries()).map(([name, hex]) => ({
      name,
      hex,
    }));
  },

  filterAndSortProducts(filter: ProductFilterState): Product[] {
    const normalizedQuery = filter.searchQuery.trim().toLowerCase();

    const filtered = currentProducts.filter((product) => {
      if (product.isVisible === false) return false;

      if (
        filter.department !== 'all' &&
        product.department !== filter.department
      ) {
        return false;
      }

      if (filter.category !== 'all' && product.category !== filter.category) {
        return false;
      }

      if (normalizedQuery.length > 0) {
        const matchesName = product.name
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesSubtitle = product.subtitle
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesCategory = product.categoryLabel
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesColor = product.colors.some((c) =>
          c.name.toLowerCase().includes(normalizedQuery)
        );
        if (
          !matchesName &&
          !matchesSubtitle &&
          !matchesCategory &&
          !matchesColor
        ) {
          return false;
        }
      }

      if (filter.selectedSize) {
        const hasSizeInStock = product.sizes.some(
          (s) => s.label === filter.selectedSize && s.inStock
        );
        if (!hasSizeInStock) return false;
      }

      if (filter.selectedColorName) {
        const hasColor = product.colors.some(
          (c) => c.name === filter.selectedColorName
        );
        if (!hasColor) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    switch (filter.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        sorted.sort((a, b) => (b.badge === 'NEW IN' ? 1 : 0) - (a.badge === 'NEW IN' ? 1 : 0));
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return sorted;
  },
};
