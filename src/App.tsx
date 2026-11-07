import React, { useEffect, useMemo, useState } from 'react';
import { AdminConsoleView } from './components/admin/AdminConsoleView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CategoryFilterBar } from './components/catalog/CategoryFilterBar';
import { ProductGrid } from './components/catalog/ProductGrid';
import { DepartmentShowcase } from './components/home/DepartmentShowcase';
import { EditorialLookbook } from './components/home/EditorialLookbook';
import { HeroBanner } from './components/home/HeroBanner';
import { LumeraNetworkGrid } from './components/home/LumeraNetworkGrid';
import { Footer } from './components/layout/Footer';
import { HeaderNavigation } from './components/layout/HeaderNavigation';
import { ProductDetailView } from './components/product-detail/ProductDetailView';
import { QuickViewModal } from './components/product-detail/QuickViewModal';
import { SizeAndShadeGuideModal } from './components/product-detail/SizeAndShadeGuideModal';
import { SectionHeading } from './components/ui/SectionHeading';
import { useCart } from './hooks/useCart';
import { useProductFilters } from './hooks/useProductFilters';
import { useWishlist } from './hooks/useWishlist';
import { ProductService } from './services/product.service';
import {
  Product,
  ProductCategorySlug,
  ProductColorVariant,
  ProductDepartment,
  ProductSizeOption,
} from './types/product.types';

export const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/atelier-admin' || hash === '#/atelier-admin';
  });

  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminRoute(path === '/atelier-admin' || hash === '#/atelier-admin');
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const {
    filters,
    filteredProducts,
    activeCategoryDefinition,
    availableSizes,
    availableColors,
    hasActiveFilters,
    setDepartment,
    setCategory,
    setSearchQuery,
    toggleSizeFilter,
    toggleColorFilter,
    setSortBy,
    resetFilters,
  } = useProductFilters();

  const {
    items: cartItems,
    summary: cartSummary,
    isCartOpen,
    lastAddedNotification,
    setIsCartOpen,
    addItem: addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const {
    wishlistIds,
    wishlistCount,
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const [selectedProductState, setSelectedProductState] = useState<{
    product: Product;
    initialColor?: ProductColorVariant;
    initialSize?: ProductSizeOption;
  } | null>(null);

  const [quickViewState, setQuickViewState] = useState<{
    product: Product;
    initialColor?: ProductColorVariant;
    initialSize?: ProductSizeOption;
  } | null>(null);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showingWishlistOnly, setShowingWishlistOnly] = useState(false);

  const categories = useMemo(() => ProductService.getAllCategories(), []);

  const displayedProducts = useMemo(() => {
    if (!showingWishlistOnly) return filteredProducts;
    return filteredProducts.filter((p) => wishlistIds.includes(p.id));
  }, [filteredProducts, showingWishlistOnly, wishlistIds]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoHome = () => {
    setSelectedProductState(null);
    setShowingWishlistOnly(false);
    resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDepartment = (department: ProductDepartment) => {
    setSelectedProductState(null);
    setShowingWishlistOnly(false);
    setDepartment(department);
    setTimeout(scrollToCatalog, 80);
  };

  const handleNavigateCategory = (category: ProductCategorySlug) => {
    setSelectedProductState(null);
    setShowingWishlistOnly(false);
    setSearchQuery('');
    setCategory(category);
    setTimeout(scrollToCatalog, 80);
  };

  const handleNavigateSearchFilter = (
    query: string,
    department?: ProductDepartment
  ) => {
    setSelectedProductState(null);
    setShowingWishlistOnly(false);
    if (department) {
      setDepartment(department);
    } else {
      setDepartment('all');
    }
    setSearchQuery(query);
    setTimeout(scrollToCatalog, 80);
  };

  const handleOpenProductDetail = (
    product: Product,
    initialColor?: ProductColorVariant,
    initialSize?: ProductSizeOption
  ) => {
    setSelectedProductState({ product, initialColor, initialSize });
  };

  if (isAdminRoute) {
    return (
      <AdminConsoleView
        onExitToStorefront={() => {
          window.history.pushState({}, '', '/');
          setIsAdminRoute(false);
          void ProductService.refreshFromBackend();
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--surface-paper-white-canvas)',
      }}
    >
      {/* 1. Integrated Top Header + Hero Area */}
      <div
        style={{
          backgroundColor: selectedProductState
            ? 'var(--surface-paper-white-canvas)'
            : 'var(--color-ash-gray)',
        }}
      >
        <HeaderNavigation
          activeDepartment={filters.department}
          activeCategory={filters.category}
          cartCount={cartSummary.totalItems}
          wishlistCount={wishlistCount}
          isSearchOpen={isSearchExpanded}
          showingWishlistOnly={showingWishlistOnly}
          onSelectDepartment={handleNavigateDepartment}
          onSelectCategory={handleNavigateCategory}
          onSelectSearchFilter={handleNavigateSearchFilter}
          onSelectProduct={(product) => handleOpenProductDetail(product)}
          onGoHome={handleGoHome}
          onToggleSearch={() => {
            setSelectedProductState(null);
            setIsSearchExpanded((prev) => !prev);
            setTimeout(scrollToCatalog, 80);
          }}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onFilterWishlistedOnly={() => {
            setSelectedProductState(null);
            setShowingWishlistOnly((prev) => !prev);
            setTimeout(scrollToCatalog, 80);
          }}
        />
      </div>

      {/* Floating Architectural Notification on Add to Cart */}
      {lastAddedNotification && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 'var(--spacing-24)',
            right: 'var(--spacing-24)',
            zIndex: 95,
            backgroundColor: 'var(--color-warm-charcoal)',
            color: 'var(--color-pure-white)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
            border: '1px solid var(--color-pure-white)',
          }}
        >
          <span className="text-caption-editorial">
            ADDED: {lastAddedNotification}
          </span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="pill-btn pill-btn--white"
            style={{
              padding: '6px 12px',
              fontSize: '10px',
            }}
          >
            VIEW CART
          </button>
        </div>
      )}

      {/* 3. Main Content Area */}
      <main style={{ flex: 1 }}>
        {selectedProductState ? (
          <ProductDetailView
            product={selectedProductState.product}
            initialColor={selectedProductState.initialColor}
            initialSize={selectedProductState.initialSize}
            isWishlisted={isWishlisted(selectedProductState.product.id)}
            onToggleWishlist={toggleWishlist}
            onAddToCart={(product, color, size, quantity) => {
              addToCart(product, color, size, quantity);
            }}
            onBackToCatalog={() => setSelectedProductState(null)}
            onSelectRelatedProduct={(related) =>
              handleOpenProductDetail(related)
            }
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        ) : (
          <>
            {/* Full-bleed Hero Banner */}
            <HeroBanner
              onExploreCatalog={(dept = 'all') =>
                handleNavigateDepartment(dept)
              }
            />

            {/* Editorial Department Split (Moda Boutique vs. Maquillaje) */}
            <DepartmentShowcase
              activeDepartment={filters.department}
              onSelectDepartment={handleNavigateDepartment}
            />

            {/* Main Catalog Section */}
            <section className="lumera-container lumera-section">
              <SectionHeading
                eyebrow={
                  showingWishlistOnly
                    ? 'TU SELECCIÓN PERSONAL'
                    : activeCategoryDefinition.tagline
                }
                title={
                  showingWishlistOnly
                    ? 'FAVORITOS GUARDADOS'
                    : activeCategoryDefinition.name
                }
                subtitle={
                  showingWishlistOnly
                    ? 'Tus prendas de boutique y tonos de maquillaje guardados para revisar al detalle.'
                    : activeCategoryDefinition.description
                }
              />

              <CategoryFilterBar
                categories={categories}
                filters={filters}
                availableSizes={availableSizes}
                availableColors={availableColors}
                totalResults={displayedProducts.length}
                hasActiveFilters={hasActiveFilters}
                isSearchExpanded={isSearchExpanded}
                showingWishlistOnly={showingWishlistOnly}
                onSelectCategory={setCategory}
                onSearchChange={setSearchQuery}
                onToggleSize={toggleSizeFilter}
                onToggleColor={toggleColorFilter}
                onSortChange={setSortBy}
                onResetFilters={resetFilters}
                onClearWishlistFilter={() => setShowingWishlistOnly(false)}
              />

              <ProductGrid
                products={displayedProducts}
                isWishlisted={isWishlisted}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={handleOpenProductDetail}
                onQuickViewProduct={(product, initialColor, initialSize) =>
                  setQuickViewState({ product, initialColor, initialSize })
                }
                onQuickAddToCart={(product, color, size) =>
                  addToCart(product, color, size, 1)
                }
                onResetFilters={() => {
                  setShowingWishlistOnly(false);
                  resetFilters();
                }}
              />
            </section>

            {/* Curated Fashion + Makeup Editorial Lookbook */}
            <EditorialLookbook
              onSelectProduct={(product) => handleOpenProductDetail(product)}
            />

            {/* The Luméra Network — Editorial Social Proof Grid per DESIGN2.md */}
            <LumeraNetworkGrid
              onSelectProduct={(product) => handleOpenProductDetail(product)}
            />
          </>
        )}
      </main>

      {/* 4. Slide-Over Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        summary={cartSummary}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      {/* 5. Quick View Modal */}
      <QuickViewModal
        product={quickViewState?.product ?? null}
        initialColor={quickViewState?.initialColor}
        initialSize={quickViewState?.initialSize}
        onClose={() => setQuickViewState(null)}
        onAddToCart={(product, color, size, quantity) =>
          addToCart(product, color, size, quantity)
        }
        onOpenFullDetail={(product, color, size) =>
          handleOpenProductDetail(product, color, size)
        }
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* 6. Size & Shade Guide Modal */}
      <SizeAndShadeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 6. Fog Footer (#f2f2f2) */}
      <Footer
        onSelectCategory={handleNavigateCategory}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />
    </div>
  );
};

