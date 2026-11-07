export type ProductDepartment = 'all' | 'boutique' | 'makeup';

export type ProductCategorySlug =
  | 'all'
  | 'vestidos-conjuntos'
  | 'tops-blusas'
  | 'faldas-pantalones'
  | 'maquillaje-labios-rostro'
  | 'maquillaje-ojos-paletas';

/**
 * InventoryTrackingMode
 * - 'by_size': Stock controlled per size/format (e.g., Garment XS/S/M/L or Makeup Full Size/Mini)
 * - 'by_color': Stock controlled per color/shade (e.g., Makeup single size with multiple shades)
 * - 'by_color_and_size': Matrix stock controlled per (Color/Shade x Size/Format) combination
 */
export type InventoryTrackingMode =
  | 'by_size'
  | 'by_color'
  | 'by_color_and_size';

export interface CategoryDefinition {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  department: ProductDepartment;
  tagline: string;
  description: string;
  coverImage: string;
}

export interface SubcategoryDefinition {
  id: string;
  slug: string;
  label: string;
  department: 'boutique' | 'makeup';
  category: Exclude<ProductCategorySlug, 'all'>;
  searchKeyword?: string;
  showInNewArrivals: boolean;
  isVisible: boolean;
  sortOrder: number;
}

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  finish?: string; // e.g. "Satinado", "Mate Terciopelo", "Gloss Cristal", "Seda Natural"
  images: string[];
  stock?: number; // Used when inventoryMode === 'by_color'
  inStock?: boolean;
}

export interface ProductSizeOption {
  label: string; // e.g. 'XS', 'S', 'M', 'L', 'XL' or '15 ml', '30 ml', 'Full Size'
  measurementsOrDetail: string; // e.g. 'Busto 84-88cm · Cintura 64-68cm' or '0.5 fl. oz. · Duración 12h'
  inStock: boolean;
  stock?: number; // Used when inventoryMode === 'by_size'
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  department: 'boutique' | 'makeup';
  category: Exclude<ProductCategorySlug, 'all'>;
  categoryLabel: string;
  subcategoryId?: string;
  price: number;
  compareAtPrice?: number;
  /** Accounting fields prepared for future payment gateway & financial ledger */
  costPriceCop?: number;
  taxRatePct?: number;
  badge?: 'NEW IN' | 'BESTSELLER' | 'LIMITED EDITION' | 'EDITORIAL PICK';
  description: string;
  editorialNote: string;
  colors: ProductColorVariant[];
  sizes: ProductSizeOption[];
  sizeTypeLabel: 'TALLA' | 'FORMATO / PRESENTACIÓN';
  colorTypeLabel: 'COLOR' | 'TONO / ACABADO';
  /** Controls how stock & sold-out states are evaluated for this product */
  inventoryMode?: InventoryTrackingMode;
  /** Key format: `${colorId}__${sizeLabel}` -> integer stock units */
  variantStockMatrix?: Record<string, number>;
  /** Controls whether the product is visible on the public storefront */
  isVisible?: boolean;
  compositionOrIngredients: string;
  careOrHowToUse: string;
  specifications: ProductSpecification[];
  relatedProductIds: string[];
  featured?: boolean;
  updatedAt?: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc';

export interface ProductFilterState {
  department: ProductDepartment;
  category: ProductCategorySlug;
  searchQuery: string;
  selectedSize: string | null;
  selectedColorName: string | null;
  sortBy: SortOption;
}
