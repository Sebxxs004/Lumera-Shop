import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
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
 * Single Responsibility: Exact ALIGNE-style 3-zone top navigation bar:
 * - Far Left: Brand Logo (/assets/LUMERA-PNG.png)
 * - Center: 5 uppercase navigation links (NEW ARRIVALS, SHOP, COLLECTIONS, THE GET UP, OUR STORY)
 * - Far Right: USD $ + minimal stroke icons (Search, Account/Saved, Shopping Bag)
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
      label: 'NEW ARRIVALS',
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
      label: 'SHOP BOUTIQUE',
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
      label: 'COLLECTIONS',
      isActive:
        activeCategory === 'vestidos-conjuntos' && !showingWishlistOnly,
      onClick: () => {
        onSelectCategory('vestidos-conjuntos');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'SIZE SPEC',
      isActive: false,
      onClick: () => {
        onOpenSizeGuide();
        setIsMobileMenuOpen(false);
      },
    },
  ];

  const centerNavLinkStyle = (isActive = false): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: isActive
      ? '1px solid var(--color-soft-black)'
      : '1px solid transparent',
    padding: '4px 0',
    fontFamily: 'var(--font-gt-america-mono)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
    color: 'var(--color-soft-black)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

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
      style={{
        width: '100%',
        backgroundColor: 'transparent',
        padding: '22px clamp(16px, 3.5vw, 44px)',
        position: 'relative',
        zIndex: 80,
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

        {/* 2. Dead Center: 5 Uppercase Navigation Links */}
        <nav
          aria-label="Navegación principal"
          className="desktop-nav"
          style={{
            justifyContent: 'center',
            gap: 'clamp(20px, 2.8vw, 38px)',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              style={centerNavLinkStyle(item.isActive)}
            >
              {item.label}
            </button>
          ))}
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

      {/* Mobile Navigation Drawer */}
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
          </div>
        </div>
      )}
    </header>
  );
};
