import React from 'react';
import {
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../../types/product.types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (
    product: Product,
    initialColor: ProductColorVariant,
    initialSize: ProductSizeOption
  ) => void;
  onQuickViewProduct: (
    product: Product,
    initialColor: ProductColorVariant,
    initialSize: ProductSizeOption
  ) => void;
  onQuickAddToCart: (
    product: Product,
    selectedColor: ProductColorVariant,
    selectedSize: ProductSizeOption
  ) => void;
  onResetFilters: () => void;
}

/**
 * ProductGrid
 * Single Responsibility: Renders the responsive product gallery grid or an editorial empty state.
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickViewProduct,
  onQuickAddToCart,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-60) var(--spacing-24)',
          backgroundColor: 'var(--color-lumera-pastel-soft)',
          border: '1px solid var(--color-lumera-mist)',
          borderRadius: 'var(--radius-cards)',
        }}
      >
        <p
          className="text-caption-editorial"
          style={{
            color: 'var(--color-lumera-statement)',
            marginBottom: 'var(--spacing-12)',
          }}
        >
          SIN COINCIDENCIAS EN EL CATÁLOGO
        </p>
        <h3
          className="display-heading-sm"
          style={{ marginBottom: 'var(--spacing-16)' }}
        >
          NO ENCONTRAMOS PIEZAS CON ESOS FILTROS
        </h3>
        <p
          className="text-body-sm-editorial"
          style={{
            maxWidth: '460px',
            margin: '0 auto var(--spacing-24)',
            color: 'var(--color-carbon)',
          }}
        >
          Prueba restableciendo los filtros de talla, tono o categoría para
          explorar toda la colección LUMÉRA.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="pill-btn pill-btn--brand"
        >
          VER TODA LA COLECCIÓN →
        </button>
      </div>
    );
  }

  return (
    <div className="product-gallery-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={isWishlisted(product.id)}
          onToggleWishlist={onToggleWishlist}
          onSelectProduct={onSelectProduct}
          onQuickViewProduct={onQuickViewProduct}
          onQuickAddToCart={onQuickAddToCart}
        />
      ))}
    </div>
  );
};
