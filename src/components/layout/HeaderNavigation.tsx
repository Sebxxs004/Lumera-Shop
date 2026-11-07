import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ProductCategorySlug, ProductDepartment } from '../../types/product.types';

interface HeaderNavigationProps {
  activeDepartment: ProductDepartment;
  activeCategory: ProductCategorySlug;
  cartCount: number;
  wishlistCount: number;
  isSearchOpen: boolean;
  onSelectDepartment: (dept: ProductDepartment) => void;
  onSelectCategory: (cat: ProductCategorySlug) => void;
  onToggleSearch: () => void;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onFilterWishlistedOnly: () => void;
  showingWishlistOnly: boolean;
}

/**
 * HeaderNavigation
 * Single Responsibility: Persistent architectural top navigation per Skills/DESIGN2.md
 * - Logo mark (/assets/LUMERA-PNG.png in dark tone) far left
 * - Navigation & utility links far right in GT America Mono 11px weight 500,
 *   letter-spacing 0.071em uppercase, #151515 on #ffffff canvas.
 */
export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  activeDepartment,
  activeCategory,
  cartCount,
  wishlistCount,
  isSearchOpen,
  onSelectDepartment,
  onSelectCategory,
  onToggleSearch,
  onOpenCart,
  onOpenSizeGuide,
  onFilterWishlistedOnly,
  showingWishlistOnly,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = [
    {
      label: 'SHOP ALL',
      isActive:
        activeDepartment === 'all' &&
        activeCategory === 'all' &&
        !showingWishlistOnly,
      onClick: () => {
        onSelectDepartment('all');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'MODA BOUTIQUE',
      isActive: activeDepartment === 'boutique' && !showingWishlistOnly,
      onClick: () => {
        onSelectDepartment('boutique');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'MAQUILLAJE',
      isActive: activeDepartment === 'makeup' && !showingWishlistOnly,
      onClick: () => {
        onSelectDepartment('makeup');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'VESTIDOS & SETS',
      isActive:
        activeCategory === 'vestidos-conjuntos' && !showingWishlistOnly,
      onClick: () => {
        onSelectCategory('vestidos-conjuntos');
        setIsMobileMenuOpen(false);
      },
    },
  ];

  const monoLinkStyle = (isActive = false): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: isActive
      ? '1px solid var(--color-soft-black)'
      : '1px solid transparent',
    padding: '4px 0',
    fontFamily: 'var(--font-gt-america-mono)',
    fontSize: '11px',
    fontWeight: 'var(--font-weight-medium)',
    letterSpacing: '0.071em',
    textTransform: 'uppercase',
    color: 'var(--color-soft-black)',
    cursor: 'pointer',
  });

  return (
    <header
      style={{
        backgroundColor: 'var(--color-pure-white)',
        borderBottom: '1px solid var(--color-warm-charcoal)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <div className="lumera-container header-grid">
        {/* Far Left: Dark Logo Mark (/assets/LUMERA-PNG.png) */}
        <button
          type="button"
          onClick={() => {
            onSelectDepartment('all');
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
              height: 'clamp(30px, 4.2vw, 44px)',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </button>

        {/* Far Right: Architectural Monospace Navigation & Utility Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(14px, 2.2vw, 28px)',
          }}
        >
          <nav aria-label="Navegación principal" className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                style={monoLinkStyle(item.isActive)}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenSizeGuide}
              style={monoLinkStyle(false)}
            >
              SIZE SPEC
            </button>
          </nav>

          {/* Utility Text Links per DESIGN2.md */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 1.8vw, 22px)',
            }}
          >
            <button
              type="button"
              onClick={onToggleSearch}
              style={monoLinkStyle(isSearchOpen)}
            >
              SEARCH
            </button>

            <button
              type="button"
              onClick={onFilterWishlistedOnly}
              style={monoLinkStyle(showingWishlistOnly)}
            >
              SAVED ({wishlistCount})
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              style={{
                ...monoLinkStyle(false),
                backgroundColor: 'var(--color-warm-charcoal)',
                color: 'var(--color-pure-white)',
                padding: '6px 12px',
              }}
            >
              CART ({cartCount})
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir menú"
              className="mobile-menu-trigger"
              style={{
                background: 'none',
                border: '1px solid var(--color-warm-charcoal)',
                padding: '6px 10px',
                color: 'var(--color-soft-black)',
                cursor: 'pointer',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                letterSpacing: '0.093em',
              }}
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Architectural Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-pure-white)',
            borderTop: '1px solid var(--color-warm-charcoal)',
            padding: 'var(--spacing-20) var(--spacing-16)',
            marginTop: 'var(--spacing-16)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-8)',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`pill-btn ${
                  item.isActive ? 'pill-btn--brand' : 'pill-btn--outline'
                }`}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <span>{item.label}</span>
                <span>+</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSizeGuide();
              }}
              className="pill-btn pill-btn--outline"
              style={{
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span>GUÍA DE MEDIDAS &amp; TONOS [SPEC]</span>
              <span>+</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
