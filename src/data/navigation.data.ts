import { ProductCategorySlug, ProductDepartment } from '../types/product.types';

export type NavSectionId = 'inicio' | 'recien-llegado' | 'ropa' | 'makeup';

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
  hasMegaMenu: boolean;
  subcategories: MegaMenuSubcategoryItem[];
  featuredCards: MegaMenuFeaturedCard[];
}

/**
 * NAVIGATION_SECTIONS
 * Single Responsibility: Curated data model for the 4 primary navbar items:
 * 1. INICIO
 * 2. RECIÉN LLEGADO
 * 3. ROPA
 * 4. MAKEUP
 * Each expandable section maps to its left-hand subcategory list and its 3 right-hand
 * bestseller portrait cards.
 */
export const NAVIGATION_SECTIONS: NavSectionConfig[] = [
  {
    id: 'inicio',
    label: 'INICIO',
    hasMegaMenu: false,
    subcategories: [],
    featuredCards: [],
  },
  {
    id: 'recien-llegado',
    label: 'RECIÉN LLEGADO',
    hasMegaMenu: true,
    subcategories: [
      {
        id: 'rl-all',
        label: 'VER TODO RECIÉN LLEGADO',
        department: 'all',
        category: 'all',
      },
      {
        id: 'rl-ropa',
        label: 'NUEVOS INGRESOS: ROPA',
        department: 'boutique',
      },
      {
        id: 'rl-makeup',
        label: 'NUEVOS INGRESOS: MAKEUP',
        department: 'makeup',
      },
      {
        id: 'rl-vestidos',
        label: 'VESTIDOS & CONJUNTOS',
        category: 'vestidos-conjuntos',
      },
      {
        id: 'rl-tops',
        label: 'CORSÉTERÍA & BLUSAS',
        category: 'tops-blusas',
      },
      {
        id: 'rl-pantalones',
        label: 'FALDAS & PANTALONES',
        category: 'faldas-pantalones',
      },
      {
        id: 'rl-labios',
        label: 'LABIOS & ROSTRO',
        category: 'maquillaje-labios-rostro',
      },
      {
        id: 'rl-ojos',
        label: 'OJOS & PALETAS',
        category: 'maquillaje-ojos-paletas',
      },
      {
        id: 'rl-saten',
        label: 'CÁPSULA SATÉN DE SEDA',
        department: 'boutique',
        searchQuery: 'Satén',
      },
      {
        id: 'rl-peptidos',
        label: 'FÓRMULAS CON PÉPTIDOS',
        department: 'makeup',
        searchQuery: 'Péptidos',
      },
    ],
    featuredCards: [
      {
        id: 'feat-rl-1',
        editorialTitle: 'LO MÁS VENDIDO EN ROPA',
        subtitle: 'VESTIDO MIDI SATÉN ÉCLAT — $ 165.000',
        badge: 'MÁS VENDIDO',
        image:
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-001',
      },
      {
        id: 'feat-rl-2',
        editorialTitle: 'LO MÁS VENDIDO EN MAKEUP',
        subtitle: 'LUMÉRA GLAZE PEPTIDE LIP OIL — $ 34.000',
        badge: 'MÁS VENDIDO',
        image:
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-001',
      },
      {
        id: 'feat-rl-3',
        editorialTitle: 'RECIÉN LLEGADO',
        subtitle: 'CORSET ESCULTURAL ARCHIVE — $ 110.000',
        badge: 'NUEVO',
        image:
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-top-001',
      },
    ],
  },
  {
    id: 'ropa',
    label: 'ROPA',
    hasMegaMenu: true,
    subcategories: [
      {
        id: 'ropa-all',
        label: 'VER TODA LA ROPA',
        department: 'boutique',
      },
      {
        id: 'ropa-vestidos',
        label: 'VESTIDOS & CONJUNTOS',
        category: 'vestidos-conjuntos',
      },
      {
        id: 'ropa-tops',
        label: 'TOPS & BLUSAS',
        category: 'tops-blusas',
      },
      {
        id: 'ropa-faldas-pantalones',
        label: 'FALDAS & PANTALONES',
        category: 'faldas-pantalones',
      },
      {
        id: 'ropa-sastreria',
        label: 'SASTRERÍA & BLAZERS',
        department: 'boutique',
        searchQuery: 'Sastre',
      },
      {
        id: 'ropa-corseteria',
        label: 'CORSÉTERÍA ESCULTURAL',
        department: 'boutique',
        searchQuery: 'Corset',
      },
      {
        id: 'ropa-palazzo',
        label: 'PANTALONES PALAZZO',
        department: 'boutique',
        searchQuery: 'Pantalón',
      },
      {
        id: 'ropa-faldas',
        label: 'FALDAS MIDI PLISADAS',
        department: 'boutique',
        searchQuery: 'Falda',
      },
      {
        id: 'ropa-saten',
        label: 'SEDA & SATÉN',
        department: 'boutique',
        searchQuery: 'Satén',
      },
      {
        id: 'ropa-lino',
        label: 'LINO ORGÁNICO ATELIER',
        department: 'boutique',
        searchQuery: 'Lino',
      },
      {
        id: 'ropa-organza',
        label: 'ORGANZA DE SEDA',
        department: 'boutique',
        searchQuery: 'Organza',
      },
      {
        id: 'ropa-guia-tallas',
        label: 'GUÍA DE TALLAS (ROPA)',
        openSizeGuide: true,
        isHighlight: true,
      },
    ],
    featuredCards: [
      {
        id: 'feat-ropa-1',
        editorialTitle: '#1 MÁS VENDIDO — NOCHE',
        subtitle: 'VESTIDO MIDI SATÉN ÉCLAT — $ 165.000',
        badge: 'MÁS VENDIDO',
        image:
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-001',
      },
      {
        id: 'feat-ropa-2',
        editorialTitle: 'SASTRERÍA MÁS VENDIDA',
        subtitle: 'CONJUNTO SASTRE LINO ATELIER — $ 210.000',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-dress-002',
      },
      {
        id: 'feat-ropa-3',
        editorialTitle: 'TENDENCIA EN ROPA',
        subtitle: 'PANTALÓN PALAZZO PINZAS — $ 145.000',
        badge: 'FAVORITO',
        image:
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-bottom-001',
      },
    ],
  },
  {
    id: 'makeup',
    label: 'MAKEUP',
    hasMegaMenu: true,
    subcategories: [
      {
        id: 'mk-all',
        label: 'VER TODO MAKEUP',
        department: 'makeup',
      },
      {
        id: 'mk-labios-rostro',
        label: 'LABIOS & ROSTRO',
        category: 'maquillaje-labios-rostro',
      },
      {
        id: 'mk-ojos-paletas',
        label: 'OJOS & PALETAS',
        category: 'maquillaje-ojos-paletas',
      },
      {
        id: 'mk-lip-oil',
        label: 'ACEITES LABIALES (LIP OILS)',
        department: 'makeup',
        searchQuery: 'Lip Oil',
      },
      {
        id: 'mk-labiales-mate',
        label: 'LABIALES VELVET MATE',
        department: 'makeup',
        searchQuery: 'Lipstick',
      },
      {
        id: 'mk-rubores',
        label: 'RUBORES LÍQUIDOS DE SEDA',
        department: 'makeup',
        searchQuery: 'Blush',
      },
      {
        id: 'mk-paletas',
        label: 'PALETAS DE SOMBRAS (9 TONOS)',
        department: 'makeup',
        searchQuery: 'Paleta',
      },
      {
        id: 'mk-mascaras',
        label: 'MÁSCARAS DE PESTAÑAS',
        department: 'makeup',
        searchQuery: 'Máscara',
      },
      {
        id: 'mk-brochas',
        label: 'SETS DE BROCHAS VEGANAS',
        department: 'makeup',
        searchQuery: 'Brochas',
      },
      {
        id: 'mk-guia-tonos',
        label: 'GUÍA DE TONOS & ACABADOS',
        openSizeGuide: true,
        isHighlight: true,
      },
    ],
    featuredCards: [
      {
        id: 'feat-mk-1',
        editorialTitle: '#1 MÁS VENDIDO EN MAKEUP',
        subtitle: 'LUMÉRA GLAZE PEPTIDE LIP OIL — $ 34.000',
        badge: 'MÁS VENDIDO',
        image:
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-001',
      },
      {
        id: 'feat-mk-2',
        editorialTitle: 'FAVORITO EN LABIOS',
        subtitle: 'VELVET COUTURE MATTE LIPSTICK — $ 38.000',
        badge: 'BESTSELLER',
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-002',
      },
      {
        id: 'feat-mk-3',
        editorialTitle: 'PALETA MÁS VENDIDA',
        subtitle: 'PALETA EDITORIAL ROSE ARCHIVE — $ 58.000',
        badge: 'EDICIÓN LIMITADA',
        image:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
        productId: 'lum-mk-004',
      },
    ],
  },
];
