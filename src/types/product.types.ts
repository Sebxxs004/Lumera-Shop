export type ProductDepartment = 'all' | 'boutique' | 'makeup';

export type ProductCategorySlug =
  | 'all'
  | 'vestidos-conjuntos'
  | 'tops-blusas'
  | 'faldas-pantalones'
  | 'maquillaje-labios-rostro'
  | 'maquillaje-ojos-paletas';

export interface CategoryDefinition {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  department: ProductDepartment;
  tagline: string;
  description: string;
  coverImage: string;
}

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  finish?: string; // e.g. "Satinado", "Mate Terciopelo", "Gloss Cristal", "Seda Natural"
  images: string[];
}

export interface ProductSizeOption {
  label: string; // e.g. 'XS', 'S', 'M', 'L', 'XL' or '15 ml', '30 ml', 'Full Size'
  measurementsOrDetail: string; // e.g. 'Busto 84-88cm · Cintura 64-68cm' or '0.5 fl. oz. · Duración 12h'
  inStock: boolean;
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
  price: number;
  compareAtPrice?: number;
  badge?: 'NEW IN' | 'BESTSELLER' | 'LIMITED EDITION' | 'EDITORIAL PICK';
  description: string;
  editorialNote: string;
  colors: ProductColorVariant[];
  sizes: ProductSizeOption[];
  sizeTypeLabel: 'TALLA' | 'FORMATO / PRESENTACIÓN';
  colorTypeLabel: 'COLOR' | 'TONO / ACABADO';
  compositionOrIngredients: string;
  careOrHowToUse: string;
  specifications: ProductSpecification[];
  relatedProductIds: string[];
  featured?: boolean;
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

