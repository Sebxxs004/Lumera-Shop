import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
} from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import { VariantStockService } from '../../services/variant-stock.service';
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
 * Single Responsibility: Full architectural spec-sheet product page per Skills/DESIGN2.md
 * (0px sharp photography, GT America Mono specifications, Nimbus Sans Extended titles,
 *  #24170f Warm Charcoal primary actions, #0073ff Signal Blue novelty badge).
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
  const colorsWithStock = useMemo(
    () => VariantStockService.getColorsWithStockStatus(product),
    [product]
  );

  const [selectedColor, setSelectedColor] = useState<ProductColorVariant>(
    initialColor ??
      colorsWithStock.find((c) => c.inStock) ??
      colorsWithStock[0]
  );

  const sizesForColor = useMemo(
    () =>
      VariantStockService.getSizesForSelectedColor(product, selectedColor.id),
    [product, selectedColor.id]
  );

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption>(
    initialSize ??
      sizesForColor.find((s) => s.inStock) ??
      sizesForColor[0]
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'specs' | 'composition'
  >('description');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const currentVariantStock = VariantStockService.getVariantStock(
    product,
    selectedColor.id,
    selectedSize.label
  );
  const isCurrentVariantInStock = currentVariantStock > 0;

  useEffect(() => {
    const nextColor =
      initialColor ??
      colorsWithStock.find((c) => c.inStock) ??
      colorsWithStock[0];
    setSelectedColor(nextColor);
    const nextSizes = VariantStockService.getSizesForSelectedColor(
      product,
      nextColor.id
    );
    setSelectedSize(
      initialSize ??
        nextSizes.find((s) => s.inStock) ??
        nextSizes[0]
    );
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, initialColor, initialSize, colorsWithStock]);

  const handleColorChange = (color: ProductColorVariant) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
    const nextSizes = VariantStockService.getSizesForSelectedColor(
      product,
      color.id
    );
    const matching = nextSizes.find((s) => s.label === selectedSize.label);
    if (matching && matching.inStock) {
      setSelectedSize(matching);
    } else {
      setSelectedSize(nextSizes.find((s) => s.inStock) ?? nextSizes[0]);
    }
    setQuantity(1);
  };

  const handleAdd = () => {
    if (!isCurrentVariantInStock) return;
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const relatedProducts = ProductService.getRelatedProducts(product);
  const currentImages = selectedColor.images;

  return (
    <section className="lumera-container lumera-section">
      {/* Top Spec Breadcrumb & Back Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-16)',
          marginBottom: 'var(--spacing-32)',
          paddingBottom: 'var(--spacing-16)',
          borderBottom: '1px solid var(--color-warm-charcoal)',
        }}
      >
        <button
          type="button"
          onClick={onBackToCatalog}
          className="pill-btn pill-btn--outline"
          style={{
            padding: '10px 20px',
            fontSize: '10px',
          }}
        >
          <ArrowLeft size={13} />
          <span>BACK TO INDEX</span>
        </button>

        <div
          className="text-caption-editorial"
          style={{ color: 'var(--color-soft-black)' }}
        >
          SPEC SHEET // {product.categoryLabel.toUpperCase()} //{' '}
          <strong>{product.sku}</strong>
        </div>
      </div>

      {/* Main 2-Column Architectural Spread */}
      <div className="product-detail-grid">
        {/* Left Column: Full-Bleed 0px Photography Gallery */}
        <div>
          <div
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              overflow: 'hidden',
              backgroundColor: 'var(--color-ash-gray)',
              marginBottom: 'var(--spacing-12)',
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

            {/* Bottom-Left Active Swatch Indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'var(--color-pure-white)',
                border: '1px solid var(--color-warm-charcoal)',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: selectedColor.hex,
                  border: '1px solid var(--color-soft-black)',
                }}
              />
              <span
                className="text-caption-editorial"
                style={{ color: 'var(--color-soft-black)' }}
              >
                {selectedColor.name}
              </span>
            </div>
          </div>

          {/* 0px Thumbnail Strip */}
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
                    height: 110,
                    overflow: 'hidden',
                    border:
                      activeImageIndex === index
                        ? '2px solid var(--color-warm-charcoal)'
                        : '1px solid var(--color-ash-gray)',
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

        {/* Right Column: Architectural Spec Sheet & Configuration */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--spacing-12)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            <span
              className="text-caption-editorial"
              style={{ color: 'var(--color-soft-black)' }}
            >
              {product.categoryLabel} // REF: {product.sku}
            </span>

            {product.badge && (
              <span className="badge-new-in">{product.badge}</span>
            )}
          </div>

          <h1
            className="display-heading"
            style={{ marginBottom: 'var(--spacing-8)' }}
          >
            {product.name}
          </h1>

          <p
            className="text-body-sm-editorial"
            style={{
              color: 'var(--color-soft-black)',
              marginBottom: 'var(--spacing-20)',
              textTransform: 'uppercase',
            }}
          >
            {product.subtitle}
          </p>

          {/* Price Spec Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-12)',
              paddingBottom: 'var(--spacing-20)',
              marginBottom: 'var(--spacing-24)',
              borderBottom: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '20px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-soft-black)',
              }}
            >
              {CurrencyService.formatUSD(product.price)}
            </span>
            {product.compareAtPrice && (
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '14px',
                  color: 'var(--color-soft-black)',
                  opacity: 0.45,
                  textDecoration: 'line-through',
                }}
              >
                {CurrencyService.formatUSD(product.compareAtPrice)}
              </span>
            )}
            <span
              className="text-caption-editorial"
              style={{ marginLeft: 'auto', color: 'var(--color-soft-black)' }}
            >
              {isCurrentVariantInStock
                ? `STATUS: EN STOCK (${currentVariantStock} UDS.)`
                : 'STATUS: AGOTADO'}
            </span>
          </div>

          {/* 1. Selector de Color / Tono */}
          <div style={{ marginBottom: 'var(--spacing-24)' }}>
            <ColorSwatchSelector
              colors={colorsWithStock}
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              size="md"
              labelPrefix={product.colorTypeLabel}
            />
          </div>

          {/* 2. Selector de Talla / Formato */}
          <div style={{ marginBottom: 'var(--spacing-24)' }}>
            <SizeSelector
              sizes={sizesForColor}
              selectedSize={
                sizesForColor.find((s) => s.label === selectedSize.label) ??
                selectedSize
              }
              onSelectSize={(s) => {
                setSelectedSize(s);
                setQuantity(1);
              }}
              labelPrefix={product.sizeTypeLabel}
              onOpenSizeGuide={onOpenSizeGuide}
            />
          </div>

          {/* 3. Quantity & Warm Charcoal Primary CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-12)',
              marginBottom: 'var(--spacing-32)',
            }}
          >
            {/* 0px Quantity Stepper */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-warm-charcoal)',
                padding: '0 var(--spacing-8)',
                height: '50px',
              }}
            >
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-soft-black)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-8)',
                  display: 'flex',
                }}
              >
                <Minus size={14} />
              </button>
              <span
                className="text-body-sm-editorial"
                style={{
                  minWidth: '30px',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-soft-black)',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                disabled={!isCurrentVariantInStock || quantity >= currentVariantStock}
                onClick={() =>
                  setQuantity((q) => Math.min(Math.max(1, currentVariantStock), q + 1))
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-soft-black)',
                  cursor:
                    isCurrentVariantInStock && quantity < currentVariantStock
                      ? 'pointer'
                      : 'not-allowed',
                  padding: 'var(--spacing-8)',
                  display: 'flex',
                  opacity:
                    isCurrentVariantInStock && quantity < currentVariantStock
                      ? 1
                      : 0.35,
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Warm Charcoal Primary CTA Button */}
            <button
              type="button"
              disabled={!isCurrentVariantInStock}
              onClick={handleAdd}
              className="pill-btn pill-btn--brand"
              style={{
                flex: 1,
                minWidth: '210px',
                height: '50px',
                opacity: isCurrentVariantInStock ? 1 : 0.45,
                cursor: isCurrentVariantInStock ? 'pointer' : 'not-allowed',
              }}
            >
              {!isCurrentVariantInStock ? (
                <span>AGOTADO — SIN STOCK</span>
              ) : addedFeedback ? (
                <>
                  <Check size={15} />
                  <span>AÑADIDO A LA BOLSA</span>
                </>
              ) : (
                <span>
                  AÑADIR A LA BOLSA —{' '}
                  {CurrencyService.formatCOP(product.price * quantity)} +
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Guardar en favoritos"
              className="pill-btn pill-btn--outline"
              style={{
                height: '50px',
                padding: '0 18px',
              }}
            >
              <Heart
                size={16}
                fill={isWishlisted ? 'var(--color-soft-black)' : 'none'}
              />
            </button>
          </div>

          {/* Spec Sheet Tabs */}
          <div
            style={{
              borderTop: '1px solid var(--color-warm-charcoal)',
              paddingTop: 'var(--spacing-20)',
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
                01 // DESCRIPTION &amp; FIT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pill-btn pill-btn--ghost ${
                  activeTab === 'specs' ? 'is-selected' : ''
                }`}
              >
                02 // TECHNICAL SPECS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('composition')}
                className={`pill-btn pill-btn--ghost ${
                  activeTab === 'composition' ? 'is-selected' : ''
                }`}
              >
                03 //{' '}
                {product.department === 'makeup'
                  ? 'FORMULA & USE'
                  : 'COMPOSITION & CARE'}
              </button>
            </div>

            {activeTab === 'description' && (
              <div>
                <p
                  style={{
                    color: 'var(--color-soft-black)',
                    marginBottom: 'var(--spacing-16)',
                    lineHeight: 1.7,
                  }}
                >
                  {product.description}
                </p>
                <div
                  style={{
                    backgroundColor: 'var(--color-ash-gray)',
                    borderLeft: '2px solid var(--color-warm-charcoal)',
                    padding: 'var(--spacing-16)',
                  }}
                >
                  <p
                    className="text-body-sm-editorial"
                    style={{ color: 'var(--color-soft-black)' }}
                  >
                    <strong>STYLING NOTE //</strong> {product.editorialNote}
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
                      borderBottom: '1px solid var(--color-ash-gray)',
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--color-soft-black)',
                        fontWeight: 'var(--font-weight-medium)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {spec.label}
                    </span>
                    <span style={{ color: 'var(--color-soft-black)' }}>
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
                  gap: 'var(--spacing-16)',
                }}
              >
                <div>
                  <h4
                    className="text-caption-editorial"
                    style={{
                      color: 'var(--color-soft-black)',
                      marginBottom: 'var(--spacing-4)',
                    }}
                  >
                    {product.department === 'makeup'
                      ? 'ACTIVE INGREDIENTS'
                      : 'TEXTILE COMPOSITION'}
                  </h4>
                  <p className="text-body-sm-editorial">
                    {product.compositionOrIngredients}
                  </p>
                </div>
                <div>
                  <h4
                    className="text-caption-editorial"
                    style={{
                      color: 'var(--color-soft-black)',
                      marginBottom: 'var(--spacing-4)',
                    }}
                  >
                    {product.department === 'makeup'
                      ? 'APPLICATION PROTOCOL'
                      : 'CARE INSTRUCTIONS'}
                  </h4>
                  <p className="text-body-sm-editorial">
                    {product.careOrHowToUse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Sell Section: Pair With */}
      <div
        style={{
          marginTop: 'var(--spacing-60)',
          paddingTop: 'var(--spacing-40)',
          borderTop: '1px solid var(--color-warm-charcoal)',
        }}
      >
        <p
          className="text-caption-editorial"
          style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}
        >
          RECOMMENDED PAIRING
        </p>
        <h2
          className="display-heading"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-32)',
          }}
        >
          COMPLETE THE ARCHIVE LOOK
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--spacing-20)',
          }}
        >
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onSelectRelatedProduct(rel)}
              style={{
                border: '1px solid var(--color-warm-charcoal)',
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
                  width: 76,
                  height: 100,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div>
                <span
                  className="text-caption-editorial"
                  style={{ color: 'var(--color-soft-black)', opacity: 0.6 }}
                >
                  {rel.sku}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-gt-america-mono)',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-soft-black)',
                    margin: '4px 0',
                  }}
                >
                  {rel.name}
                </h4>
                <p
                  className="text-body-sm-editorial"
                  style={{
                    color: 'var(--color-soft-black)',
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
