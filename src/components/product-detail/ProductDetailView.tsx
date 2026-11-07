import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import {
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../../types/product.types';
import { ColorSwatchSelector } from '../ui/ColorSwatchSelector';
import { SizeSelector } from '../ui/SizeSelector';

interface ProductDetailViewProps {
  product: Product;
  initialColor?: ProductColorVariant;
  initialSize?: ProductSizeOption;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    product: Product,
    color: ProductColorVariant,
    size: ProductSizeOption,
    quantity: number
  ) => void;
  onBackToCatalog: () => void;
  onSelectRelatedProduct: (product: Product) => void;
  onOpenSizeGuide: () => void;
}

/**
 * ProductDetailView
 * Single Responsibility: Full editorial product page showing photography angles,
 * color/shade variants, size/format measurements, composition/ingredients,
 * and cross-sell recommendations.
 */
export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  initialColor,
  initialSize,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBackToCatalog,
  onSelectRelatedProduct,
  onOpenSizeGuide,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColorVariant>(
    initialColor ?? product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption>(
    initialSize ?? product.sizes.find((s) => s.inStock) ?? product.sizes[0]
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'specs' | 'composition'
  >('description');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setSelectedColor(initialColor ?? product.colors[0]);
    setSelectedSize(
      initialSize ?? product.sizes.find((s) => s.inStock) ?? product.sizes[0]
    );
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, initialColor, initialSize]);

  const handleColorChange = (color: ProductColorVariant) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
  };

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const relatedProducts = ProductService.getRelatedProducts(product);
  const currentImages = selectedColor.images;

  return (
    <section className="lumera-container lumera-section">
      {/* Top Breadcrumb & Back Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-16)',
          marginBottom: 'var(--spacing-30)',
          paddingBottom: 'var(--spacing-16)',
          borderBottom: '1px solid var(--color-lumera-mist)',
        }}
      >
        <button
          type="button"
          onClick={onBackToCatalog}
          className="pill-btn pill-btn--outline"
          style={{
            padding: 'var(--spacing-8) var(--spacing-20)',
            fontSize: 'var(--text-caption)',
          }}
        >
          <ArrowLeft size={15} />
          <span>VOLVER AL CATÁLOGO</span>
        </button>

        <div
          className="text-caption-editorial"
          style={{ color: 'var(--color-lumera-statement)' }}
        >
          LUMÉRA / {product.categoryLabel.toUpperCase()} /{' '}
          <span style={{ color: 'var(--color-carbon)' }}>{product.sku}</span>
        </div>
      </div>

      {/* Main 2-Column Editorial Spread (Stacks into 1 column on mobile) */}
      <div className="product-detail-grid">
        {/* Left Column: Product Photography Gallery */}
        <div>
          <div
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              borderRadius: 'var(--radius-cards)',
              overflow: 'hidden',
              border: '1px solid var(--color-lumera-mist)',
              backgroundColor: 'var(--surface-fog-footer)',
              marginBottom: 'var(--spacing-16)',
            }}
          >
            <img
              src={currentImages[activeImageIndex] ?? currentImages[0]}
              alt={`${product.name} - ${selectedColor.name}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {product.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--spacing-16)',
                  left: 'var(--spacing-16)',
                }}
              >
                <span className="pill-tag">{product.badge}</span>
              </div>
            )}

            {/* Color Swatch Badge Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 'var(--spacing-16)',
                left: 'var(--spacing-16)',
                backgroundColor: 'var(--color-paper-white)',
                border: '1px solid var(--color-lumera-statement)',
                borderRadius: 'var(--radius-tags)',
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedColor.hex,
                  border: '1px solid var(--color-lumera-mist)',
                }}
              />
              <span
                className="text-caption-editorial"
                style={{ color: 'var(--color-lumera-statement)' }}
              >
                {selectedColor.name}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {currentImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-12)',
                overflowX: 'auto',
              }}
            >
              {currentImages.map((imgUrl, index) => (
                <button
                  key={imgUrl + index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: 84,
                    height: 108,
                    borderRadius: 'var(--radius-cards)',
                    overflow: 'hidden',
                    border:
                      activeImageIndex === index
                        ? '2px solid var(--color-lumera-statement)'
                        : '1px solid var(--color-lumera-mist)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Vista ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Configuration & Editorial Details */}
        <div>
          <p
            className="text-caption-editorial"
            style={{
              color: 'var(--color-lumera-statement)',
              marginBottom: 'var(--spacing-8)',
            }}
          >
            {product.categoryLabel} · SKU {product.sku}
          </p>

          <h1
            className="display-heading"
            style={{ marginBottom: 'var(--spacing-10)' }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: 'var(--text-subheading)',
              color: 'var(--color-carbon)',
              marginBottom: 'var(--spacing-20)',
            }}
          >
            {product.subtitle}
          </p>

          {/* Price Block */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-12)',
              paddingBottom: 'var(--spacing-24)',
              marginBottom: 'var(--spacing-24)',
              borderBottom: '1px solid var(--color-lumera-mist)',
            }}
          >
            <span
              className="display-heading-sm"
              style={{ color: 'var(--color-lumera-statement)' }}
            >
              {CurrencyService.formatUSD(product.price)}
            </span>
            {product.compareAtPrice && (
              <span
                style={{
                  fontSize: 'var(--text-subheading)',
                  color: 'var(--color-lumera-mist)',
                  textDecoration: 'line-through',
                }}
              >
                {CurrencyService.formatUSD(product.compareAtPrice)}
              </span>
            )}
            <span
              className="pill-tag pill-tag--outline"
              style={{ marginLeft: 'auto' }}
            >
              DISPONIBLE EN STOCK
            </span>
          </div>

          {/* 1. Selector de Color / Tono */}
          <div style={{ marginBottom: 'var(--spacing-24)' }}>
            <ColorSwatchSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              size="md"
              labelPrefix={product.colorTypeLabel}
            />
          </div>

          {/* 2. Selector de Talla / Formato */}
          <div style={{ marginBottom: 'var(--spacing-30)' }}>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              labelPrefix={product.sizeTypeLabel}
              onOpenSizeGuide={onOpenSizeGuide}
            />
          </div>

          {/* 3. Quantity & Primary Add to Bag Pill CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-12)',
              marginBottom: 'var(--spacing-30)',
            }}
          >
            {/* Pill Quantity Control */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-lumera-statement)',
                borderRadius: 'var(--radius-buttons)',
                padding: '0 var(--spacing-12)',
                height: '48px',
              }}
            >
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-lumera-statement)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-8)',
                  display: 'flex',
                }}
              >
                <Minus size={15} />
              </button>
              <span
                className="text-body-sm-editorial"
                style={{
                  minWidth: '32px',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-lumera-statement)',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-lumera-statement)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-8)',
                  display: 'flex',
                }}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              type="button"
              onClick={handleAdd}
              className="pill-btn pill-btn--brand"
              style={{
                flex: 1,
                minWidth: '220px',
                height: '48px',
              }}
            >
              {addedFeedback ? (
                <>
                  <Check size={17} />
                  <span>AÑADIDO A TU BOLSA</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={17} />
                  <span>
                    AÑADIR A LA BOLSA ·{' '}
                    {CurrencyService.formatUSD(product.price * quantity)}
                  </span>
                </>
              )}
            </button>

            {/* Wishlist Pill Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Guardar en favoritos"
              className="pill-btn pill-btn--outline"
              style={{
                height: '48px',
                padding: '0 var(--spacing-20)',
              }}
            >
              <Heart
                size={18}
                fill={isWishlisted ? 'var(--color-lumera-statement)' : 'none'}
              />
            </button>
          </div>

          {/* Editorial Information Tabs */}
          <div
            style={{
              borderTop: '1px solid var(--color-lumera-mist)',
              paddingTop: 'var(--spacing-24)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-8)',
                marginBottom: 'var(--spacing-20)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`pill-btn pill-btn--ghost ${
                  activeTab === 'description' ? 'is-selected' : ''
                }`}
              >
                DESCRIPCIÓN &amp; FIT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pill-btn pill-btn--ghost ${
                  activeTab === 'specs' ? 'is-selected' : ''
                }`}
              >
                ESPECIFICACIONES
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('composition')}
                className={`pill-btn pill-btn--ghost ${
                  activeTab === 'composition' ? 'is-selected' : ''
                }`}
              >
                {product.department === 'makeup'
                  ? 'INGREDIENTES & USO'
                  : 'COMPOSICIÓN & CUIDADO'}
              </button>
            </div>

            {activeTab === 'description' && (
              <div>
                <p
                  style={{
                    color: 'var(--color-carbon)',
                    marginBottom: 'var(--spacing-16)',
                    lineHeight: 1.6,
                  }}
                >
                  {product.description}
                </p>
                <div
                  style={{
                    border: '1px solid var(--color-lumera-mist)',
                    borderRadius: 'var(--radius-cards)',
                    padding: 'var(--spacing-16)',
                    display: 'flex',
                    gap: 'var(--spacing-12)',
                    alignItems: 'flex-start',
                  }}
                >
                  <Sparkles
                    size={18}
                    style={{
                      color: 'var(--color-lumera-statement)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <p
                    className="text-body-sm-editorial"
                    style={{ color: 'var(--color-lumera-statement)' }}
                  >
                    <strong>NOTA EDITORIAL LUMÉRA:</strong>{' '}
                    {product.editorialNote}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-10)',
                }}
              >
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: 'var(--spacing-8)',
                      borderBottom: '1px solid var(--color-lumera-mist)',
                      fontSize: 'var(--text-body-sm)',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--color-lumera-statement)',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {spec.label}
                    </span>
                    <span style={{ color: 'var(--color-carbon)' }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'composition' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-12)',
                }}
              >
                <div>
                  <h4
                    className="text-caption-editorial"
                    style={{
                      color: 'var(--color-lumera-statement)',
                      marginBottom: 'var(--spacing-6)',
                    }}
                  >
                    {product.department === 'makeup'
                      ? 'FÓRMULA E INGREDIENTES CLAVE'
                      : 'MATERIALES Y COMPOSICIÓN TEXTIL'}
                  </h4>
                  <p className="text-body-sm-editorial">
                    {product.compositionOrIngredients}
                  </p>
                </div>
                <div>
                  <h4
                    className="text-caption-editorial"
                    style={{
                      color: 'var(--color-lumera-statement)',
                      marginBottom: 'var(--spacing-6)',
                    }}
                  >
                    {product.department === 'makeup'
                      ? 'MODO DE APLICACIÓN RECOMENDADO'
                      : 'INSTRUCCIONES DE CUIDADO'}
                  </h4>
                  <p className="text-body-sm-editorial">
                    {product.careOrHowToUse}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Boutique Guarantees */}
          <div
            style={{
              marginTop: 'var(--spacing-24)',
              paddingTop: 'var(--spacing-20)',
              borderTop: '1px solid var(--color-lumera-mist)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-12)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-10)',
              }}
            >
              <Truck size={18} color="var(--color-lumera-statement)" />
              <span className="text-caption-editorial">
                ENVÍO GRATIS DESDE $180 USD
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-10)',
              }}
            >
              <ShieldCheck size={18} color="var(--color-lumera-statement)" />
              <span className="text-caption-editorial">
                CAMBIO DE TALLA SIN COSTO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Sell Section: Completa el Look */}
      <div
        style={{
          marginTop: 'var(--spacing-60)',
          paddingTop: 'var(--spacing-50)',
          borderTop: '1px solid var(--color-lumera-mist)',
        }}
      >
        <h2
          className="display-heading-sm"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-30)',
          }}
        >
          COMPLETA EL LOOK LUMÉRA
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--spacing-24)',
          }}
        >
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onSelectRelatedProduct(rel)}
              style={{
                border: '1px solid var(--color-lumera-mist)',
                borderRadius: 'var(--radius-cards)',
                padding: 'var(--spacing-16)',
                display: 'flex',
                gap: 'var(--spacing-16)',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src={rel.colors[0].images[0]}
                alt={rel.name}
                style={{
                  width: 80,
                  height: 104,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-cards)',
                  flexShrink: 0,
                }}
              />
              <div>
                <span
                  className="text-caption-editorial"
                  style={{ color: 'var(--color-lumera-statement)' }}
                >
                  {rel.categoryLabel}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-integral)',
                    fontSize: '18px',
                    color: 'var(--color-lumera-statement)',
                    margin: '4px 0',
                  }}
                >
                  {rel.name}
                </h4>
                <p
                  className="text-body-sm-editorial"
                  style={{
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-carbon)',
                  }}
                >
                  {CurrencyService.formatUSD(rel.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

