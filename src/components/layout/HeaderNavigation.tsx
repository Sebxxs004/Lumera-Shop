import React, { useState } from 'react';
import { Heart, Menu, Ruler, Search, ShoppingBag, X } from 'lucide-react';
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
 * Single Responsibility: Responsive primary site navigation.
 * Desktop: Left nav links, Center LUMERA-PNG.png logo, Right utility icons.
 * Mobile: Left Hamburger drawer trigger, Center logo, Right utility icons + Pastel Mobile Menu Drawer.
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
      label: 'Colección',
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
      label: 'Moda Boutique',
      isActive: activeDepartment === 'boutique' && !showingWishlistOnly,
      onClick: () => {
        onSelectDepartment('boutique');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'Maquillaje',
      isActive: activeDepartment === 'makeup' && !showingWishlistOnly,
      onClick: () => {
        onSelectDepartment('makeup');
        setIsMobileMenuOpen(false);
      },
    },
    {
      label: 'Vestidos & Sets',
      isActive:
        activeCategory === 'vestidos-conjuntos' && !showingWishlistOnly,
      onClick: () => {
        onSelectCategory('vestidos-conjuntos');
        setIsMobileMenuOpen(false);
      },
    },
  ];

  return (
    <header
      style={{
        backgroundColor: 'var(--surface-paper-white-canvas)',
        borderBottom: '1px solid var(--color-lumera-pastel)',
        padding: 'var(--spacing-16) 0',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <div className="lumera-container header-grid">
        {/* Left: Desktop Links OR Mobile Menu Button */}
        <div>
          <nav aria-label="Navegación principal" className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                style={{
                  background: item.isActive
                    ? 'var(--color-lumera-pastel)'
                    : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-tags)',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-soehne)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: item.isActive
                    ? 'var(--font-weight-bold)'
                    : 'var(--font-weight-regular)',
                  letterSpacing: 'var(--tracking-body-sm)',
                  color: 'var(--color-lumera-statement)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Abrir menú de navegación"
            className="mobile-menu-trigger pill-btn pill-btn--pastel"
            style={{
              padding: '8px 14px',
            }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span style={{ fontSize: '11px' }}>MENÚ</span>
          </button>
        </div>

        {/* Center Logo Mark: assets/LUMERA-PNG.png */}
        <div style={{ textAlign: 'center' }}>
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
                height: 'clamp(34px, 5vw, 56px)',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </button>
        </div>

        {/* Right Utility Icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'clamp(10px, 2vw, 20px)',
          }}
        >
          <button
            type="button"
            onClick={onToggleSearch}
            title="Buscar piezas o tonos"
            aria-label="Buscar productos"
            style={{
              background: isSearchOpen
                ? 'var(--color-lumera-pastel)'
                : 'none',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px',
              color: 'var(--color-lumera-statement)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Search size={20} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            title="Guía de Tallas y Tonos"
            aria-label="Abrir guía de tallas y tonos"
            className="desktop-nav"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-lumera-statement)',
              cursor: 'pointer',
            }}
          >
            <Ruler size={20} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={onFilterWishlistedOnly}
            title="Ver favoritos guardados"
            aria-label="Favoritos"
            style={{
              background: showingWishlistOnly
                ? 'var(--color-lumera-pastel)'
                : 'none',
              border: 'none',
              borderRadius: 'var(--radius-tags)',
              padding: '6px',
              color: 'var(--color-lumera-statement)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Heart
              size={20}
              strokeWidth={1.9}
              fill={
                showingWishlistOnly ? 'var(--color-lumera-statement)' : 'none'
              }
            />
            {wishlistCount > 0 && (
              <span
                className="text-caption-editorial"
                style={{
                  color: 'var(--color-lumera-statement)',
                  fontSize: '10px',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            title="Abrir bolsa de compras"
            aria-label="Bolsa de compras"
            style={{
              backgroundColor: 'var(--color-lumera-pastel)',
              border: '1px solid var(--color-lumera-mist)',
              borderRadius: 'var(--radius-tags)',
              padding: '6px 12px',
              color: 'var(--color-lumera-statement)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={18} strokeWidth={1.9} />
            <span
              className="text-caption-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                fontSize: '11px',
              }}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-lumera-pastel-soft)',
            borderTop: '1px solid var(--color-lumera-mist)',
            borderBottom: '1px solid var(--color-lumera-mist)',
            padding: 'var(--spacing-20) var(--spacing-16)',
            marginTop: 'var(--spacing-12)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-10)',
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
                <span>→</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSizeGuide();
              }}
              className="pill-btn pill-btn--pastel"
              style={{
                width: '100%',
                marginTop: 'var(--spacing-6)',
              }}
            >
              <Ruler size={16} />
              <span>GUÍA DE TALLAS, MEDIDAS &amp; TONOS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
