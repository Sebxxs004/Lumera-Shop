import { ProductCategorySlug, ProductDepartment } from '../types/product.types';

export type NavSectionId =
  | 'new-arrivals'
  | 'boutique'
  | 'makeup'
  | 'collections'
  | 'our-story';

export interface MegaMenuSubcategoryItem {
  id: string;
  label: string;
  department?: ProductDepartment;
  category?: ProductCategorySlug;
  searchQuery?: string;
  productId?: string;
  openSizeGuide?: boolean;
  isHighlight?: boolean;
}

export interface MegaMenuFeaturedCard {
  id: string;
  editorialTitle: string;
  subtitle: string;
  badge: string;
  image: string;
  productId: string;
}

export interface NavSectionConfig {
  id: NavSectionId;
  label: string;
  subcategories: MegaMenuSubcategoryItem[];
  featuredCards: MegaMenuFeaturedCard[];
}

/**
 * NAVIGATION_SECTIONS
 * Single Responsibility: Curated data model for the ALIGNE-style full-width
 * Mega Menu dropdown, mapping each top-level navigation item to its left-hand
 * subcategory list and its 3 right-hand bestseller portrait cards.
 */
export const NAVIGATION_SECTIONS: NavSectionConfig[] = [
  {
    id: 'new-arrivals',
    label: 'NEW ARRIVALS',
    subcategories: [
      {
        id: 'na-all',
        label: 'SHOP ALL NEW ARRIVALS',
        department: 'all',
        category: 'all',
      },
      {
        id: 'na-boutique',
        label: 'NEW IN: ROPA & BOUTIQUE',
        department: 'boutique',
      },
      {
        id: 'na-makeup',
        label: 'NEW IN: MAQUILLAJE',
        department: 'makeup',
      },
      {
        id: 'na-dresses',
        label: 'VESTIDOS & CONJUNTOS',
        category: 'vestidos-conjuntos',
      },
      {
        id: 'na-tops',
        label: 'CORSÉTERÍA & TOPS',
        category: 'tops-blusas',
      },
      {
        id: 'na-bottoms',
        label: 'SASTRERÍA & PANTALONES',
        category: 'faldas-pantalones',
      },
      {
        id: 'na-lips',
        label: 'LABIOS & ROSTRO',
        category: 'maquillaje-labios-rostro',
      },
      {
        id: 'na-eyes',
        label: 'OJOS & PALETAS',
        category: 'maquillaje-ojos-paletas',
      },
      {
        id: 'na-satin',
        label: 'SATÉN DE SEDA',
        department: 'boutique',
        searchQuery: 'Satén',
      },
      {
        id: 'na-peptides',
        label: 'FÓRMULAS CON PÉPTIDOS',
        department: 'makeup',
        searchQuery: 'Péptidos',
      },
    ],
    featuredCards: [
      {
        id: 'feat-na-1',
        editorialTitle: 'THE PARTY EDIT',
        subtitle: 'VESTIDO MIDI SATÉN ÉCLAT — $165.00',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-001',
      },
      {
        id: 'feat-na-2',
        editorialTitle: 'MOST SOLD BEAUTY',
        subtitle: 'LUMÉRA GLAZE PEPTIDE LIP OIL — $34.00',
        badge: 'MOST SOLD',
        image:
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-001',
      },
      {
        id: 'feat-na-3',
        editorialTitle: 'TRENDING NOW',
        subtitle: 'CORSET ESCULTURAL ARCHIVE — $110.00',
        badge: 'NEW IN',
        image:
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-top-001',
      },
    ],
  },
  {
    id: 'boutique',
    label: 'SHOP',
    subcategories: [
      {
        id: 'shop-all-boutique',
        label: 'SHOP ALL',
        department: 'boutique',
      },
      {
        id: 'shop-dresses',
        label: 'DRESSES & CO-ORDS',
        category: 'vestidos-conjuntos',
      },
      {
        id: 'shop-tailoring',
        label: 'TAILORING & BLAZERS',
        department: 'boutique',
        searchQuery: 'Sastre',
      },
      {
        id: 'shop-corsetry',
        label: 'CORSETRY',
        department: 'boutique',
        searchQuery: 'Corset',
      },
      {
        id: 'shop-tops',
        label: 'TOPS & BLOUSES',
        category: 'tops-blusas',
      },
      {
        id: 'shop-trousers',
        label: 'TROUSERS & PALAZZO',
        department: 'boutique',
        searchQuery: 'Pantalón',
      },
      {
        id: 'shop-skirts',
        label: 'SKIRTS',
        department: 'boutique',
        searchQuery: 'Falda',
      },
      {
        id: 'shop-satin',
        label: 'SILK & SATIN',
        department: 'boutique',
        searchQuery: 'Satén',
      },
      {
        id: 'shop-linen',
        label: 'ATELIER LINEN',
        department: 'boutique',
        searchQuery: 'Lino',
      },
      {
        id: 'shop-organza',
        label: 'SHEER ORGANZA',
        department: 'boutique',
        searchQuery: 'Organza',
      },
      {
        id: 'shop-size-guide',
        label: 'SIZE SPEC GUIDE',
        openSizeGuide: true,
        isHighlight: true,
      },
    ],
    featuredCards: [
      {
        id: 'feat-shop-1',
        editorialTitle: 'THE PARTY EDIT',
        subtitle: 'VESTIDO MIDI SATÉN ÉCLAT — $165.00',
        badge: 'MOST SOLD',
        image:
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-001',
      },
      {
        id: 'feat-shop-2',
        editorialTitle: 'ATELIER TAILORING',
        subtitle: 'CONJUNTO SASTRE LINO ATELIER — $210.00',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-002',
      },
      {
        id: 'feat-shop-3',
        editorialTitle: 'TRENDING NOW',
        subtitle: 'PANTALÓN PALAZZO PINZAS — $145.00',
        badge: 'EDITORIAL PICK',
        image:
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-bottom-001',
      },
    ],
  },
  {
    id: 'makeup',
    label: 'MAKEUP',
    subcategories: [
      {
        id: 'mk-all',
        label: 'SHOP ALL MAKEUP',
        department: 'makeup',
      },
      {
        id: 'mk-lips-face',
        label: 'LIPS & CHEEKS',
        category: 'maquillaje-labios-rostro',
      },
      {
        id: 'mk-eyes-palettes',
        label: 'EYES & PALETTES',
        category: 'maquillaje-ojos-paletas',
      },
      {
        id: 'mk-lip-oil',
        label: 'PEPTIDE LIP OILS',
        department: 'makeup',
        searchQuery: 'Lip Oil',
      },
      {
        id: 'mk-matte-lip',
        label: 'VELVET MATTE LIPSTICKS',
        department: 'makeup',
        searchQuery: 'Lipstick',
      },
      {
        id: 'mk-blush',
        label: 'LIQUID SILK BLUSH',
        department: 'makeup',
        searchQuery: 'Blush',
      },
      {
        id: 'mk-eyeshadow',
        label: '9-SHADE EYE PALETTES',
        department: 'makeup',
        searchQuery: 'Paleta',
      },
      {
        id: 'mk-mascara',
        label: 'SCULPT MASCARA',
        department: 'makeup',
        searchQuery: 'Máscara',
      },
      {
        id: 'mk-brushes',
        label: 'PRO VEGAN BRUSHES',
        department: 'makeup',
        searchQuery: 'Brochas',
      },
      {
        id: 'mk-shade-guide',
        label: 'SHADE & FINISH SPEC',
        openSizeGuide: true,
        isHighlight: true,
      },
    ],
    featuredCards: [
      {
        id: 'feat-mk-1',
        editorialTitle: ' #1 MOST SOLD LIP OIL',
        subtitle: 'LUMÉRA GLAZE PEPTIDE LIP OIL — $34.00',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-001',
      },
      {
        id: 'feat-mk-2',
        editorialTitle: 'VELVET COUTURE EDIT',
        subtitle: 'VELVET COUTURE MATTE LIPSTICK — $38.00',
        badge: 'MOST SOLD',
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-002',
      },
      {
        id: 'feat-mk-3',
        editorialTitle: 'ROSE ARCHIVE PALETTE',
        subtitle: 'PALETA EDITORIAL 9 TONOS — $58.00',
        badge: 'LIMITED EDITION',
        image:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-004',
      },
    ],
  },
  {
    id: 'collections',
    label: 'COLLECTIONS',
    subcategories: [
      {
        id: 'col-all',
        label: 'ALL COLLECTIONS',
        department: 'all',
        category: 'all',
      },
      {
        id: 'col-evening',
        label: 'THE PARTY EDIT',
        category: 'vestidos-conjuntos',
      },
      {
        id: 'col-sculpt',
        label: 'SCULPTED SILHOUETTES',
        category: 'tops-blusas',
      },
      {
        id: 'col-tailoring',
        label: 'ARCHITECTURAL TAILORING',
        category: 'faldas-pantalones',
      },
      {
        id: 'col-rose-archive',
        label: 'ROSE ARCHIVE BEAUTY',
        category: 'maquillaje-ojos-paletas',
      },
      {
        id: 'col-dewy-skin',
        label: 'GLASS SKIN & PEPTIDES',
        category: 'maquillaje-labios-rostro',
      },
    ],
    featuredCards: [
      {
        id: 'feat-col-1',
        editorialTitle: 'SILK & CREPE ARCHIVE',
        subtitle: 'MINI VESTIDO DRAPEADO NOCTURNE — $178.00',
        badge: 'LIMITED EDITION',
        image:
          'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-003',
      },
      {
        id: 'feat-col-2',
        editorialTitle: 'SILK BLUSH ARCHIVE',
        subtitle: 'SILK PETAL LIQUID BLUSH — $36.00',
        badge: 'NEW IN',
        image:
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-003',
      },
      {
        id: 'feat-col-3',
        editorialTitle: 'SCULPTED PLEATS',
        subtitle: 'FALDA MIDI PLISADA LUMIÈRE — $138.00',
        badge: 'EDITORIAL PICK',
        image:
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-bottom-002',
      },
    ],
  },
  {
    id: 'our-story',
    label: 'OUR STORY',
    subcategories: [
      {
        id: 'story-catalog',
        label: 'EXPLORE FULL ARCHIVE',
        department: 'all',
        category: 'all',
      },
      {
        id: 'story-size-spec',
        label: 'GARMENT SIZE SPEC SHEET',
        openSizeGuide: true,
        isHighlight: true,
      },
      {
        id: 'story-shade-spec',
        label: 'MAKEUP SHADE MATRIX',
        openSizeGuide: true,
      },
      {
        id: 'story-boutique',
        label: 'ATELIER BOUTIQUE',
        department: 'boutique',
      },
      {
        id: 'story-beauty',
        label: 'CLEAN BEAUTY LAB',
        department: 'makeup',
      },
    ],
    featuredCards: [
      {
        id: 'feat-story-1',
        editorialTitle: 'ATELIER CRAFTSMANSHIP',
        subtitle: 'BLUSA ORGANZA LAZO IMPERIAL — $128.00',
        badge: 'ARCHIVE',
        image:
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-top-002',
      },
      {
        id: 'feat-story-2',
        editorialTitle: 'VEGAN PRO ARTISTRY',
        subtitle: 'SET DE 6 BROCHAS ESCULTURALES — $72.00',
        badge: 'PRO STUDIO',
        image:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-006',
      },
      {
        id: 'feat-story-3',
        editorialTitle: 'PANORAMIC VOLUME',
        subtitle: 'LASH SCULPT PANORAMIC MASCARA — $32.00',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-005',
      },
    ],
  },
];
