import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import {
  MegaMenuFeaturedCard,
  MegaMenuSubcategoryItem,
  NAVIGATION_SECTIONS,
  NavSectionId,
} from '../../data/navigation.data';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import {
  Product,
  ProductCategorySlug,
  ProductDepartment,
} from '../../types/product.types';
import { NavbarMegaMenu } from './NavbarMegaMenu';

interface HeaderNavigationProps {
  activeDepartment: ProductDepartment;
  activeCategory: ProductCategorySlug;
  cartCount: number;
  wishlistCount: number;
  isSearchOpen: boolean;
  showingWishlistOnly: boolean;
  onSelectDepartment: (dept: ProductDepartment) => void;
  onSelectCategory: (cat: ProductCategorySlug) => void;
  onSelectSearchFilter?: (query: string, dept?: ProductDepartment) => void;
  onSelectProduct?: (product: Product) => void;
  onGoHome?: () => void;
  onToggleSearch: () => void;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onFilterWishlistedOnly: () => void;
}

/**
 * HeaderNavigation
 * Single Responsibility: Implements the ALIGNE 3-zone top navigation bar with:
 * - 4 primary items: INICIO, RECIÉN LLEGADO, ROPA, MAKEUP
 * - Smoothly sliding horizontal indicator bar that glides across navbar links on hover/active
 * - Full-width Mega Menu deployment for RECIÉN LLEGADO, ROPA, and MAKEUP
 */
export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  activeDepartment,
  activeCategory,
  cartCount,
  wishlistCount,
  isSearchOpen,
  showingWishlistOnly,
  onSelectDepartment,
  onSelectCategory,
  onSelectSearchFilter,
  onSelectProduct,
  onGoHome,
  onToggleSearch,
  onOpenCart,
  onOpenSizeGuide,
  onFilterWishlistedOnly,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredSectionId, setHoveredSectionId] = useState<NavSectionId | null>(
    null
  );
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const navContainerRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Determine which nav section is currently active based on filters
  const activeSectionId: NavSectionId = (() => {
    if (showingWishlistOnly) return 'inicio';
    if (activeDepartment === 'boutique') return 'ropa';
    if (activeDepartment === 'makeup') return 'makeup';
    if (activeCategory !== 'all') return 'recien-llegado';
    return 'inicio';
  })();

  // Target section for the sliding bar: hovered section takes priority over active section
  const targetSectionId = hoveredSectionId ?? activeSectionId;

  const updateSlidingIndicator = (sectionId: NavSectionId | null) => {
    if (!sectionId || !navContainerRef.current) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const btn = buttonRefs.current[sectionId];
    if (!btn) return;
    setIndicatorStyle({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
      opacity: 1,
    });
  };

  useEffect(() => {
    updateSlidingIndicator(targetSectionId);
    const handleResize = () => updateSlidingIndicator(targetSectionId);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetSectionId]);

  const handleTopNavClick = (sectionId: NavSectionId) => {
    if (sectionId === 'inicio') {
      if (onGoHome) {
        onGoHome();
      } else {
        onSelectDepartment('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sectionId === 'recien-llegado') {
      onSelectDepartment('all');
    } else if (sectionId === 'ropa') {
      onSelectDepartment('boutique');
    } else if (sectionId === 'makeup') {
      onSelectDepartment('makeup');
    }
    setHoveredSectionId(null);
    setIsMobileMenuOpen(false);
  };

  const handleSubcategoryClick = (item: MegaMenuSubcategoryItem) => {
    if (item.openSizeGuide) {
      onOpenSizeGuide();
    } else if (item.searchQuery && onSelectSearchFilter) {
      onSelectSearchFilter(item.searchQuery, item.department);
    } else if (item.category) {
      onSelectCategory(item.category);
    } else if (item.department) {
      onSelectDepartment(item.department);
    }
    setHoveredSectionId(null);
    setIsMobileMenuOpen(false);
  };

  const handleFeaturedCardClick = (card: MegaMenuFeaturedCard) => {
    const product = ProductService.getProductById(card.productId);
    if (product && onSelectProduct) {
      onSelectProduct(product);
    }
    setHoveredSectionId(null);
    setIsMobileMenuOpen(false);
  };

  const activeMegaMenuSection = (() => {
    if (!hoveredSectionId) return null;
    const baseSec = NAVIGATION_SECTIONS.find(
      (sec) => sec.id === hoveredSectionId && sec.hasMegaMenu
    );
    if (!baseSec) return null;

    const liveSubs = ProductService.getAllSubcategories();
    const liveProducts = ProductService.getAllProducts();

    let dynamicSubItems: MegaMenuSubcategoryItem[] = [];
    if (hoveredSectionId === 'ropa') {
      dynamicSubItems = [
        {
          id: 'ropa-all',
          label: 'VER TODA LA ROPA',
          department: 'boutique',
        },
        ...liveSubs
          .filter((s) => s.department === 'boutique' && s.isVisible)
          .map((s) => ({
            id: s.id,
            label: s.label,
            department: 'boutique' as const,
            category: s.category,
            searchQuery: s.searchKeyword || undefined,
          })),
        {
          id: 'ropa-guia-tallas',
          label: 'GUÍA DE TALLAS (ROPA)',
          openSizeGuide: true,
          isHighlight: true,
        },
      ];
    } else if (hoveredSectionId === 'makeup') {
      dynamicSubItems = [
        {
          id: 'mk-all',
          label: 'VER TODO MAKEUP',
          department: 'makeup',
        },
        ...liveSubs
          .filter((s) => s.department === 'makeup' && s.isVisible)
          .map((s) => ({
            id: s.id,
            label: s.label,
            department: 'makeup' as const,
            category: s.category,
            searchQuery: s.searchKeyword || undefined,
          })),
        {
          id: 'mk-guia-tonos',
          label: 'GUÍA DE TONOS & ACABADOS',
          openSizeGuide: true,
          isHighlight: true,
        },
      ];
    } else if (hoveredSectionId === 'recien-llegado') {
      dynamicSubItems = [
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
        ...liveSubs
          .filter((s) => s.showInNewArrivals && s.isVisible)
          .map((s) => ({
            id: `rl-${s.id}`,
            label: s.label,
            department: s.department,
            category: s.category,
            searchQuery: s.searchKeyword || undefined,
          })),
      ];
    }

    // Build dynamic featured cards from live products matching the section
    const deptFilter =
      hoveredSectionId === 'ropa'
        ? 'boutique'
        : hoveredSectionId === 'makeup'
        ? 'makeup'
        : 'all';

    const candidateProducts = liveProducts.filter((p) =>
      deptFilter === 'all' ? true : p.department === deptFilter
    );
    const featuredPool = [
      ...candidateProducts.filter((p) => p.badge === 'BESTSELLER' || p.featured),
      ...candidateProducts,
    ];
    const uniqueFeatured: Product[] = [];
    for (const prod of featuredPool) {
      if (!uniqueFeatured.some((u) => u.id === prod.id)) {
        uniqueFeatured.push(prod);
      }
      if (uniqueFeatured.length >= 3) break;
    }

    const dynamicCards: MegaMenuFeaturedCard[] =
      uniqueFeatured.length === 3
        ? uniqueFeatured.map((p, idx) => ({
            id: `dyn-card-${p.id}`,
            editorialTitle:
              idx === 0
                ? 'LO MÁS VENDIDO'
                : idx === 1
                ? 'DESTACADO ATELIER'
                : 'RECIÉN LLEGADO',
            subtitle: `${p.name} — ${CurrencyService.formatCOP(p.price)}`,
            badge: p.badge ?? 'MÁS VENDIDO',
            image:
              p.colors[0]?.images[0] ??
              'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
            productId: p.id,
          }))
        : baseSec.featuredCards;

    return {
      ...baseSec,
      subcategories:
        dynamicSubItems.length > 0 ? dynamicSubItems : baseSec.subcategories,
      featuredCards: dynamicCards,
    };
  })();

  const iconBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: '4px',
    color: 'var(--color-soft-black)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <header
      onMouseLeave={() => setHoveredSectionId(null)}
      style={{
        width: '100%',
        backgroundColor: activeMegaMenuSection
          ? 'var(--color-pure-white)'
          : 'transparent',
        padding: '22px clamp(16px, 3.5vw, 44px)',
        position: 'relative',
        zIndex: 90,
        transition: 'background-color 0.2s ease',
      }}
    >
      <div className="navbar-bar-layout">
        {/* 1. Far Left: LUMÉRA Dark Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => handleTopNavClick('inicio')}
            aria-label="Ir al inicio de LUMÉRA"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/LUMERA-PNG.png"
              alt="LUMÉRA"
              style={{
                height: 'clamp(26px, 3.2vw, 36px)',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </button>
        </div>

        {/* 2. Dead Center: 4 Uppercase Navigation Links (INICIO - RECIÉN LLEGADO - ROPA - MAKEUP) + Sliding Bar */}
        <nav
          ref={navContainerRef}
          aria-label="Navegación principal"
          className="desktop-nav"
          style={{
            position: 'relative',
            justifyContent: 'center',
            gap: 'clamp(24px, 3.2vw, 44px)',
            paddingBottom: '6px',
          }}
        >
          {NAVIGATION_SECTIONS.map((sec) => {
            const isHovered = hoveredSectionId === sec.id;
            const isHighlighted =
              isHovered || (!hoveredSectionId && activeSectionId === sec.id);

            return (
              <button
                key={sec.id}
                ref={(el) => {
                  buttonRefs.current[sec.id] = el;
                }}
                type="button"
                onMouseEnter={() => setHoveredSectionId(sec.id)}
                onFocus={() => setHoveredSectionId(sec.id)}
                onClick={() => handleTopNavClick(sec.id)}
                aria-expanded={isHovered && sec.hasMegaMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 0',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  color: isHovered
                    ? 'var(--color-signal-blue)'
                    : isHighlighted
                    ? 'var(--color-soft-black)'
                    : 'var(--color-soft-black)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                }}
              >
                {sec.label}
              </button>
            );
          })}

          {/* Sliding Horizontal Bar that glides across navbar options */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              backgroundColor: hoveredSectionId
                ? 'var(--color-signal-blue)'
                : 'var(--color-soft-black)',
              opacity: indicatorStyle.opacity,
              transition:
                'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), width 0.28s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease, opacity 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        </nav>

        {/* 3. Far Right: Search Icon + User/Saved Icon + Bag Icon + Mobile Menu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'clamp(14px, 1.8vw, 24px)',
          }}
        >
          <button
            type="button"
            onClick={onToggleSearch}
            title="Buscar productos"
            aria-label="Buscar"
            style={{
              ...iconBtnStyle,
              opacity: isSearchOpen ? 0.6 : 1,
            }}
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={onFilterWishlistedOnly}
            title="Guardados / Favoritos"
            aria-label="Guardados"
            style={iconBtnStyle}
          >
            <User size={18} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  marginLeft: '3px',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            title="Bolsa de compras"
            aria-label="Bolsa de compras"
            style={iconBtnStyle}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  marginLeft: '3px',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Abrir menú"
            className="mobile-menu-trigger"
            style={{
              background: 'none',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '5px 8px',
              color: 'var(--color-soft-black)',
              cursor: 'pointer',
              alignItems: 'center',
            }}
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Desktop Full-Width Mega Menu Dropdown */}
      {activeMegaMenuSection && (
        <NavbarMegaMenu
          section={activeMegaMenuSection}
          onSelectSubcategory={handleSubcategoryClick}
          onSelectFeaturedCard={handleFeaturedCardClick}
          onClose={() => setHoveredSectionId(null)}
        />
      )}

      {/* Mobile Navigation Drawer with Subcategories */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-pure-white)',
            border: '1px solid var(--color-warm-charcoal)',
            padding: 'var(--spacing-20) var(--spacing-16)',
            marginTop: 'var(--spacing-16)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-12)',
            }}
          >
            {NAVIGATION_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                style={{
                  borderBottom: '1px solid var(--border-hairline)',
                  paddingBottom: 'var(--spacing-12)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleTopNavClick(sec.id)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '4px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-gt-america-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-soft-black)',
                    cursor: 'pointer',
                  }}
                >
                  <span>{sec.label}</span>
                  <span>→</span>
                </button>
                {sec.subcategories.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '8px',
                    }}
                  >
                    {sec.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubcategoryClick(sub)}
                        className="pill-btn pill-btn--outline"
                        style={{
                          padding: '5px 10px',
                          fontSize: '10px',
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
