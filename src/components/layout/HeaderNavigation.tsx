import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import {
  MegaMenuFeaturedCard,
  MegaMenuSubcategoryItem,
  NAVIGATION_SECTIONS,
  NavSectionId,
} from '../../data/navigation.data';
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
  onToggleSearch: () => void;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onFilterWishlistedOnly: () => void;
}

/**
 * HeaderNavigation
 * Single Responsibility: Implements the ALIGNE 3-zone top navigation bar with:
 * 1. Smoothly sliding horizontal indicator bar that glides across navbar links on hover/active
 * 2. Full-width Mega Menu deployment with left-hand subcategories and 3 right-hand Bestseller portrait cards
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
  onToggleSearch,
  onOpenCart,
  onOpenSizeGuide,
  onFilterWishlistedOnly,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<NavSectionId | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const navContainerRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Determine which nav section is currently active based on filters
  const activeSectionId: NavSectionId = (() => {
    if (showingWishlistOnly) return 'new-arrivals';
    if (activeDepartment === 'boutique') return 'boutique';
    if (activeDepartment === 'makeup') return 'makeup';
    if (activeCategory !== 'all') return 'collections';
    return 'new-arrivals';
  })();

  // Target section for the sliding bar: hovered section takes priority over active section
  const targetSectionId = openSectionId ?? activeSectionId;

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
    if (sectionId === 'new-arrivals') {
      onSelectDepartment('all');
    } else if (sectionId === 'boutique') {
      onSelectDepartment('boutique');
    } else if (sectionId === 'makeup') {
      onSelectDepartment('makeup');
    } else if (sectionId === 'collections') {
      onSelectCategory('vestidos-conjuntos');
    } else if (sectionId === 'our-story') {
      onOpenSizeGuide();
    }
    setOpenSectionId(null);
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
    setOpenSectionId(null);
    setIsMobileMenuOpen(false);
  };

  const handleFeaturedCardClick = (card: MegaMenuFeaturedCard) => {
    const product = ProductService.getProductById(card.productId);
    if (product && onSelectProduct) {
      onSelectProduct(product);
    }
    setOpenSectionId(null);
    setIsMobileMenuOpen(false);
  };

  const activeMegaMenuSection = openSectionId
    ? NAVIGATION_SECTIONS.find((sec) => sec.id === openSectionId) ?? null
    : null;

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
      onMouseLeave={() => setOpenSectionId(null)}
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'var(--spacing-20)',
        }}
      >
        {/* 1. Far Left: LUMÉRA Dark Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              onSelectDepartment('all');
              setOpenSectionId(null);
              setIsMobileMenuOpen(false);
            }}
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

        {/* 2. Dead Center: 5 Uppercase Navigation Links + Sliding Bar */}
        <nav
          ref={navContainerRef}
          aria-label="Navegación principal"
          className="desktop-nav"
          style={{
            position: 'relative',
            justifyContent: 'center',
            gap: 'clamp(22px, 2.8vw, 38px)',
            paddingBottom: '6px',
          }}
        >
          {NAVIGATION_SECTIONS.map((sec) => {
            const isHoveredOrOpen = openSectionId === sec.id;
            const isHighlighted =
              isHoveredOrOpen || (!openSectionId && activeSectionId === sec.id);

            return (
              <button
                key={sec.id}
                ref={(el) => {
                  buttonRefs.current[sec.id] = el;
                }}
                type="button"
                onMouseEnter={() => setOpenSectionId(sec.id)}
                onFocus={() => setOpenSectionId(sec.id)}
                onClick={() => handleTopNavClick(sec.id)}
                aria-expanded={isHoveredOrOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 0',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  color: isHoveredOrOpen
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
              backgroundColor: openSectionId
                ? 'var(--color-signal-blue)'
                : 'var(--color-soft-black)',
              opacity: indicatorStyle.opacity,
              transition:
                'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), width 0.28s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease, opacity 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        </nav>

        {/* 3. Far Right: USD $ + Search Icon + User/Saved Icon + Bag Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'clamp(14px, 1.8vw, 24px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-gt-america-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.09em',
              color: 'var(--color-soft-black)',
              textTransform: 'uppercase',
            }}
          >
            USD $
          </span>

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
          onClose={() => setOpenSectionId(null)}
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
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  {sec.subcategories.slice(0, 5).map((sub) => (
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
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
