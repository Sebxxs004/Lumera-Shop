import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { CartItem, CartSummary } from '../../types/cart.types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  summary: CartSummary;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

/**
 * CartDrawer
 * Single Responsibility: Sharp 0px architectural shopping bag drawer per Skills/DESIGN2.md.
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  summary,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
    }, 400);
  };

  const progressPercentage = Math.min(
    100,
    (summary.subtotal / summary.freeShippingThreshold) * 100
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bolsa de compras LUMÉRA"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(21, 21, 21, 0.72)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--color-pure-white)',
          borderLeft: '1px solid var(--color-warm-charcoal)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: 'var(--spacing-24)',
            borderBottom: '1px solid var(--color-warm-charcoal)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-16)',
            }}
          >
            <h2 className="display-heading-sm">
              SHOPPING CART ({summary.totalItems})
            </h2>

            <button
              type="button"
              onClick={() => {
                setOrderPlaced(false);
                onClose();
              }}
              aria-label="Cerrar bolsa"
              className="pill-btn pill-btn--outline"
              style={{ padding: '8px 12px' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div>
            <p
              className="text-caption-editorial"
              style={{
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              {summary.remainingForFreeShipping === 0 && summary.subtotal > 0
                ? 'COMPLIMENTARY EXPRESS SHIPPING UNLOCKED'
                : `ADD ${CurrencyService.formatUSD(
                    summary.remainingForFreeShipping
                  )} FOR COMPLIMENTARY SHIPPING`}
            </p>
            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'var(--color-ash-gray)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-warm-charcoal)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Middle Item List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-24)',
          }}
        >
          {orderPlaced ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-40) var(--spacing-16)',
              }}
            >
              <CheckCircle2
                size={38}
                color="var(--color-warm-charcoal)"
                style={{ margin: '0 auto var(--spacing-16)' }}
              />
              <h3
                className="display-heading-sm"
                style={{ marginBottom: 'var(--spacing-12)' }}
              >
                ORDER DISPATCH SIMULATED
              </h3>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-soft-black)',
                  marginBottom: 'var(--spacing-24)',
                }}
              >
                Tu selección de prendas y maquillaje LUMÉRA está lista. Al
                conectar el backend de pagos e inventario, este flujo procesará
                tu orden en tiempo real.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderPlaced(false);
                  onClose();
                }}
                className="pill-btn pill-btn--brand"
              >
                CONTINUE BROWSING
              </button>
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-56) var(--spacing-16)',
              }}
            >
              <p
                className="text-caption-editorial"
                style={{
                  color: 'var(--color-soft-black)',
                  marginBottom: 'var(--spacing-8)',
                }}
              >
                YOUR CART IS EMPTY
              </p>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-soft-black)',
                  marginBottom: 'var(--spacing-24)',
                }}
              >
                Explora nuestros vestidos en satén, corsets sastre y maquillaje
                seleccionando tu talla o tono.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="pill-btn pill-btn--brand"
              >
                DISCOVER COLLECTION
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-20)',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '76px 1fr',
                    gap: 'var(--spacing-16)',
                    paddingBottom: 'var(--spacing-20)',
                    borderBottom: '1px solid var(--color-ash-gray)',
                  }}
                >
                  <img
                    src={item.selectedColor.images[0]}
                    alt={item.product.name}
                    style={{
                      width: 76,
                      height: 102,
                      objectFit: 'cover',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-8)',
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: 'var(--font-gt-america-mono)',
                            fontSize: '12px',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-soft-black)',
                            lineHeight: 1.35,
                          }}
                        >
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label="Eliminar producto"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-soft-black)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: item.selectedColor.hex,
                            border: '1px solid var(--color-soft-black)',
                          }}
                        />
                        <span
                          className="text-caption-editorial"
                          style={{ color: 'var(--color-soft-black)' }}
                        >
                          {item.selectedColor.name} // {item.selectedSize.label}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'var(--spacing-12)',
                      }}
                    >
                      {/* 0px Quantity Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-warm-charcoal)',
                          padding: '2px 6px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-soft-black)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Minus size={11} />
                        </button>
                        <span
                          className="text-caption-editorial"
                          style={{
                            minWidth: 22,
                            textAlign: 'center',
                            color: 'var(--color-soft-black)',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-soft-black)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span
                        className="text-body-sm-editorial"
                        style={{
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-soft-black)',
                        }}
                      >
                        {CurrencyService.formatUSD(
                          item.product.price * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Checkout Summary */}
        {items.length > 0 && !orderPlaced && (
          <div
            style={{
              padding: 'var(--spacing-24)',
              backgroundColor: 'var(--color-ash-gray)',
              borderTop: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              <span className="text-caption-editorial">SUBTOTAL</span>
              <span className="text-body-sm-editorial">
                {CurrencyService.formatUSD(summary.subtotal)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-16)',
              }}
            >
              <span className="text-caption-editorial">SHIPPING</span>
              <span className="text-caption-editorial">
                {summary.shippingCost === 0
                  ? 'COMPLIMENTARY ($0)'
                  : CurrencyService.formatUSD(summary.shippingCost)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: 'var(--spacing-12)',
                marginBottom: 'var(--spacing-20)',
                borderTop: '1px solid var(--color-warm-charcoal)',
              }}
            >
              <span className="text-caption-editorial">ESTIMATED TOTAL</span>
              <span
                style={{
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '18px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-soft-black)',
                }}
              >
                {CurrencyService.formatUSD(summary.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="pill-btn pill-btn--brand"
              style={{ width: '100%' }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
