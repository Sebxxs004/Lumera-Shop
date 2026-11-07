import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
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
 * Single Responsibility: Slide-over shopping bag showing selected items,
 * chosen color/shade & size/format, free shipping progress, and order confirmation preview.
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
        backgroundColor: 'rgba(27, 27, 27, 0.6)',
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
          backgroundColor: 'var(--surface-paper-white-canvas)',
          borderLeft: '2px solid var(--color-lumera-statement)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: 'var(--spacing-24)',
            borderBottom: '1px solid var(--color-lumera-mist)',
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-10)',
              }}
            >
              <ShoppingBag size={20} color="var(--color-lumera-statement)" />
              <h2
                className="display-heading-sm"
                style={{ fontSize: '26px' }}
              >
                TU BOLSA ({summary.totalItems})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setOrderPlaced(false);
                onClose();
              }}
              aria-label="Cerrar bolsa"
              className="pill-btn pill-btn--outline"
              style={{ padding: 'var(--spacing-8) var(--spacing-15)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div>
            <p
              className="text-caption-editorial"
              style={{
                color: 'var(--color-lumera-statement)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              {summary.remainingForFreeShipping === 0 && summary.subtotal > 0
                ? '¡TIENES ENVÍO EXPRESS DE CORTESÍA DESBLOQUEADO!'
                : `TE FALTAN ${CurrencyService.formatUSD(
                    summary.remainingForFreeShipping
                  )} PARA ENVÍO EXPRESS GRATIS`}
            </p>
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-fog-footer)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-lumera-statement)',
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
                size={44}
                color="var(--color-lumera-statement)"
                style={{ margin: '0 auto var(--spacing-16)' }}
              />
              <h3
                className="display-heading-sm"
                style={{ marginBottom: 'var(--spacing-12)' }}
              >
                ¡PEDIDO SIMULADO CON ÉXITO!
              </h3>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-carbon)',
                  marginBottom: 'var(--spacing-24)',
                }}
              >
                Tu selección de prendas y maquillaje LUMÉRA está lista. Cuando
                conectemos el backend de pagos e inventario, este flujo
                procesará tu orden en tiempo real.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderPlaced(false);
                  onClose();
                }}
                className="pill-btn pill-btn--brand"
              >
                SEGUIR EXPLORANDO →
              </button>
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-50) var(--spacing-16)',
              }}
            >
              <p
                className="text-caption-editorial"
                style={{
                  color: 'var(--color-lumera-statement)',
                  marginBottom: 'var(--spacing-10)',
                }}
              >
                TU BOLSA ESTÁ VACÍA
              </p>
              <p
                className="text-body-sm-editorial"
                style={{
                  color: 'var(--color-carbon)',
                  marginBottom: 'var(--spacing-24)',
                }}
              >
                Explora nuestros vestidos en satén, corsets sastre y maquillaje
                luminoso seleccionando tu talla o tono favorito.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="pill-btn pill-btn--brand"
              >
                DESCUBRIR COLECCIÓN →
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
                    gridTemplateColumns: '80px 1fr',
                    gap: 'var(--spacing-16)',
                    paddingBottom: 'var(--spacing-20)',
                    borderBottom: '1px solid var(--color-lumera-mist)',
                  }}
                >
                  <img
                    src={item.selectedColor.images[0]}
                    alt={item.product.name}
                    style={{
                      width: 80,
                      height: 106,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-cards)',
                      border: '1px solid var(--color-lumera-mist)',
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
                            fontFamily: 'var(--font-integral)',
                            fontSize: '17px',
                            color: 'var(--color-lumera-statement)',
                            lineHeight: 1.05,
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
                            color: 'var(--color-lumera-statement)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-6)',
                          marginTop: 'var(--spacing-6)',
                        }}
                      >
                        <span
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: item.selectedColor.hex,
                            border: '1px solid var(--color-lumera-mist)',
                          }}
                        />
                        <span
                          className="text-caption-editorial"
                          style={{ color: 'var(--color-carbon)' }}
                        >
                          {item.selectedColor.name} · {item.selectedSize.label}
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
                      {/* Mini Pill Quantity Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-lumera-statement)',
                          borderRadius: 'var(--radius-buttons)',
                          padding: '2px 8px',
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
                            color: 'var(--color-lumera-statement)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="text-caption-editorial"
                          style={{
                            minWidth: 22,
                            textAlign: 'center',
                            color: 'var(--color-lumera-statement)',
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
                            color: 'var(--color-lumera-statement)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span
                        className="text-body-sm-editorial"
                        style={{
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-lumera-statement)',
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
              backgroundColor: 'var(--surface-fog-footer)',
              borderTop: '1px solid var(--color-lumera-mist)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              <span className="text-body-sm-editorial">Subtotal</span>
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
              <span className="text-body-sm-editorial">Envío Boutique</span>
              <span className="text-body-sm-editorial">
                {summary.shippingCost === 0
                  ? 'CORTESÍA (GRATIS)'
                  : CurrencyService.formatUSD(summary.shippingCost)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 'var(--spacing-12)',
                marginBottom: 'var(--spacing-20)',
                borderTop: '1px solid var(--color-lumera-mist)',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              <span className="text-caption-editorial">TOTAL ESTIMADO</span>
              <span
                style={{
                  fontFamily: 'var(--font-integral)',
                  fontSize: '24px',
                  color: 'var(--color-lumera-statement)',
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
              FINALIZAR PEDIDO →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

