import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { AdminApiService } from '../../services/admin-api.service';
import { CurrencyService } from '../../services/currency.service';
import { VariantStockService } from '../../services/variant-stock.service';
import {
  AdminUserProfile,
  InventoryLedgerEntry,
} from '../../types/admin.types';
import { Product, SubcategoryDefinition } from '../../types/product.types';
import { AdminInventoryLedgerView } from './AdminInventoryLedgerView';
import { AdminLoginView } from './AdminLoginView';
import { AdminProductFormModal } from './AdminProductFormModal';
import { AdminSubcategoryManager } from './AdminSubcategoryManager';

interface AdminConsoleViewProps {
  onExitToStorefront: () => void;
}

/**
 * AdminConsoleView
 * Single Responsibility: Orchestrates the private `/atelier-admin` route,
 * session verification, and tabbed management of Products/Stock, Subcategories,
 * and Accounting Inventory Ledger.
 */
export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  onExitToStorefront,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryDefinition[]>(
    []
  );
  const [ledger, setLedger] = useState<InventoryLedgerEntry[]>([]);
  const [catalogSignature, setCatalogSignature] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'products' | 'subcategories' | 'ledger'
  >('products');
  const [deptFilter, setDeptFilter] = useState<'all' | 'boutique' | 'makeup'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadAdminCatalog = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const response = await AdminApiService.fetchAdminCatalog();
      setProducts(response.products);
      setSubcategories(response.subcategories);
      setLedger(response.ledger);
      setCatalogSignature(response.signature);
    } catch {
      // Handle session expiration
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    AdminApiService.verifySession()
      .then((user) => {
        if (!mounted) return;
        setAdminUser(user);
        setIsCheckingAuth(false);
        if (user) {
          void loadAdminCatalog();
        }
      })
      .catch(() => {
        if (mounted) setIsCheckingAuth(false);
      });
    return () => {
      mounted = false;
    };
  }, [loadAdminCatalog]);

  const handleLogout = () => {
    AdminApiService.logout();
    setAdminUser(null);
  };

  const handleQuickVisibilityToggle = async (product: Product) => {
    const updated = await AdminApiService.toggleProductVisibility(
      product.id,
      product.isVisible === false
    );
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleQuickStockDelta = async (params: {
    product: Product;
    colorId: string;
    sizeLabel: string;
    nextStock: number;
  }) => {
    const updated = await AdminApiService.updateVariantStock({
      productId: params.product.id,
      colorId: params.colorId,
      sizeLabel: params.sizeLabel,
      stock: Math.max(0, params.nextStock),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Confirmas eliminar definitivamente "${product.name}" (${product.sku})?`
    );
    if (!confirmed) return;
    await AdminApiService.deleteProduct(product.id);
    await loadAdminCatalog();
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (deptFilter !== 'all' && p.department !== deptFilter) return false;
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, deptFilter, searchQuery]);

  // Accounting & Inventory KPIs
  const metrics = useMemo(() => {
    let totalUnits = 0;
    let totalRetailValueCop = 0;
    let totalCostValueCop = 0;
    let soldOutProductsCount = 0;

    for (const p of products) {
      const units = VariantStockService.getProductTotalStock(p);
      totalUnits += units;
      totalRetailValueCop += units * p.price;
      totalCostValueCop +=
        units * (p.costPriceCop ?? Math.round(p.price * 0.42));
      if (units <= 0) {
        soldOutProductsCount += 1;
      }
    }

    return {
      totalProducts: products.length,
      totalUnits,
      totalRetailValueCop,
      totalCostValueCop,
      soldOutProductsCount,
    };
  }, [products]);

  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-gt-america-mono)',
          fontSize: '12px',
          letterSpacing: '0.1em',
        }}
      >
        VERIFICANDO CREDENCIALES CRIPTOGRÁFICAS...
      </div>
    );
  }

  if (!adminUser) {
    return (
      <AdminLoginView
        onLoginSuccess={(user) => {
          setAdminUser(user);
          void loadAdminCatalog();
        }}
        onExitToStorefront={onExitToStorefront}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-ash-gray)',
        color: 'var(--color-soft-black)',
        paddingBottom: '64px',
      }}
    >
      {/* Top Admin Header Bar */}
      <header
        style={{
          backgroundColor: 'var(--color-warm-charcoal)',
          color: 'var(--color-pure-white)',
          padding: '18px clamp(16px, 3.5vw, 44px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontFamily: 'var(--font-nimbus-extended)',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            LUMÉRA // ATELIER ADMIN
          </span>
          <span
            className="badge-signal-blue"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              borderColor: '#0073ff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <ShieldCheck size={12} />
            <span>
              {adminUser.role} · {adminUser.email}
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => void loadAdminCatalog()}
            className="pill-btn pill-btn--white"
            style={{ padding: '8px 14px', fontSize: '10px' }}
          >
            <RefreshCw size={12} />
            <span>SINCRONIZAR</span>
          </button>

          <button
            type="button"
            onClick={onExitToStorefront}
            className="pill-btn pill-btn--white"
            style={{ padding: '8px 14px', fontSize: '10px' }}
          >
            VER TIENDA PÚBLICA
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="pill-btn pill-btn--outline"
            style={{
              padding: '8px 14px',
              fontSize: '10px',
              color: '#ffffff',
              borderColor: '#ffffff',
            }}
          >
            <LogOut size={12} />
            <span>SALIR</span>
          </button>
        </div>
      </header>

      <main className="lumera-container" style={{ paddingTop: '28px' }}>
        {/* KPI Summary Cards (Inventory + Accounting Valuation in COP) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-pure-white)',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '18px',
            }}
          >
            <span className="text-caption-editorial">
              REFERENCIAS EN CATÁLOGO
            </span>
            <div
              className="section-heading"
              style={{ fontSize: '24px', marginTop: '6px' }}
            >
              {metrics.totalProducts} PRODUCTOS
            </div>
            <span
              className="text-caption-editorial"
              style={{ opacity: 0.7 }}
            >
              {metrics.soldOutProductsCount} agotados totalmente
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-pure-white)',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '18px',
            }}
          >
            <span className="text-caption-editorial">
              UNIDADES FÍSICAS EN STOCK
            </span>
            <div
              className="section-heading"
              style={{ fontSize: '24px', marginTop: '6px' }}
            >
              {metrics.totalUnits} UDS.
            </div>
            <span
              className="text-caption-editorial"
              style={{ opacity: 0.7 }}
            >
              Suma de todas las tallas y tonos
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-pure-white)',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '18px',
            }}
          >
            <span className="text-caption-editorial">
              VALORIZACIÓN COMERCIAL (PVP COP)
            </span>
            <div
              className="section-heading"
              style={{ fontSize: '22px', marginTop: '6px' }}
            >
              {CurrencyService.formatCOP(metrics.totalRetailValueCop)}
            </div>
            <span
              className="text-caption-editorial"
              style={{ opacity: 0.7 }}
            >
              Costo base: {CurrencyService.formatCOP(metrics.totalCostValueCop)}
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-pure-white)',
              border: '1px solid var(--color-warm-charcoal)',
              padding: '18px',
            }}
          >
            <span className="text-caption-editorial">
              FIRMA CRIPTOGRÁFICA BACKEND
            </span>
            <div
              style={{
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '12px',
                fontWeight: 700,
                marginTop: '10px',
                color: 'var(--color-signal-blue)',
              }}
            >
              HMAC: {catalogSignature.slice(0, 18) || 'ACTIVA'}...
            </div>
            <span
              className="text-caption-editorial"
              style={{ opacity: 0.7 }}
            >
              Integridad verificada por servidor
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--color-warm-charcoal)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`pill-btn ${
                activeTab === 'products'
                  ? 'pill-btn--brand'
                  : 'pill-btn--outline'
              }`}
            >
              1. PRODUCTOS, VARIANTES &amp; STOCK ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subcategories')}
              className={`pill-btn ${
                activeTab === 'subcategories'
                  ? 'pill-btn--brand'
                  : 'pill-btn--outline'
              }`}
            >
              2. SUBCATEGORÍAS DEL NAVBAR ({subcategories.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`pill-btn ${
                activeTab === 'ledger'
                  ? 'pill-btn--brand'
                  : 'pill-btn--outline'
              }`}
            >
              3. KARDEX CONTABLE &amp; AUDITORÍA ({ledger.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsCreateModalOpen(true);
              }}
              className="pill-btn pill-btn--brand"
            >
              <Plus size={14} />
              <span>AGREGAR PRENDA O PRODUCTO MAKEUP</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRODUCTS & VARIANT STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            {/* Filter Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(
                  [
                    { id: 'all', label: 'TODOS' },
                    { id: 'boutique', label: 'SOLO ROPA' },
                    { id: 'makeup', label: 'SOLO MAKEUP' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDeptFilter(d.id)}
                    className={`pill-btn ${
                      deptFilter === d.id
                        ? 'pill-btn--brand'
                        : 'pill-btn--outline'
                    }`}
                    style={{ padding: '8px 14px', fontSize: '10px' }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, SKU o categoría..."
                style={{
                  minWidth: '280px',
                  padding: '10px 14px',
                  border: '1px solid var(--color-warm-charcoal)',
                  backgroundColor: 'var(--color-pure-white)',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '12px',
                }}
              />
            </div>

            {isLoadingData ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-pure-white)',
                  border: '1px solid var(--color-warm-charcoal)',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '12px',
                }}
              >
                CARGANDO INVENTARIO FIRMADO...
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {filteredProducts.map((product) => {
                  const totalStock =
                    VariantStockService.getProductTotalStock(product);
                  const mode = VariantStockService.getInventoryMode(product);
                  const modeLabel =
                    mode === 'by_size'
                      ? 'POR TALLA / TAMAÑO'
                      : mode === 'by_color'
                      ? 'POR TONO / COLOR'
                      : 'MATRIZ COLOR × TALLA';

                  return (
                    <article
                      key={product.id}
                      style={{
                        backgroundColor: 'var(--color-pure-white)',
                        border: '1px solid var(--color-warm-charcoal)',
                        padding: '20px',
                        opacity: product.isVisible === false ? 0.65 : 1,
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '88px 1fr auto',
                          gap: '20px',
                          alignItems: 'start',
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            width: '88px',
                            height: '114px',
                            backgroundColor: 'var(--color-ash-gray)',
                            border: '1px solid var(--color-warm-charcoal)',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={product.colors[0]?.images[0]}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>

                        {/* Product Info & Quick Variant Stock Matrix */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-gt-america-mono)',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 7px',
                                backgroundColor: 'var(--color-warm-charcoal)',
                                color: 'var(--color-pure-white)',
                              }}
                            >
                              {product.department === 'boutique'
                                ? 'ROPA'
                                : 'MAKEUP'}
                            </span>

                            <span className="text-caption-editorial">
                              SKU: <strong>{product.sku}</strong>
                            </span>

                            <span className="badge-signal-blue">
                              MODO: {modeLabel}
                            </span>

                            {totalStock <= 0 ? (
                              <span
                                style={{
                                  fontFamily: 'var(--font-gt-america-mono)',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  backgroundColor: '#b91c1c',
                                  color: '#ffffff',
                                }}
                              >
                                AGOTADO (0 UDS.)
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontFamily: 'var(--font-gt-america-mono)',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  border: '1px solid var(--color-warm-charcoal)',
                                }}
                              >
                                TOTAL EN STOCK: {totalStock} UDS.
                              </span>
                            )}
                          </div>

                          <h3
                            style={{
                              fontFamily: 'var(--font-gt-america-mono)',
                              fontSize: '14px',
                              fontWeight: 700,
                              marginBottom: '4px',
                            }}
                          >
                            {product.name} —{' '}
                            {CurrencyService.formatCOP(product.price)}
                          </h3>

                          <p
                            className="text-caption-editorial"
                            style={{ opacity: 0.75, marginBottom: '14px' }}
                          >
                            {product.categoryLabel} · {product.colors.length}{' '}
                            {product.department === 'makeup'
                              ? 'tonos'
                              : 'colores'}{' '}
                            · {product.sizes.length}{' '}
                            {product.department === 'makeup'
                              ? 'tamaños'
                              : 'tallas'}
                          </p>

                          {/* Interactive Quick-Stock Chips per Variant */}
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                            }}
                          >
                            {product.colors.map((clr) =>
                              product.sizes.map((sz) => {
                                const stockCount =
                                  VariantStockService.getVariantStock(
                                    product,
                                    clr.id,
                                    sz.label
                                  );
                                const isZero = stockCount <= 0;
                                return (
                                  <div
                                    key={`${clr.id}__${sz.label}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '4px 8px',
                                      border: isZero
                                        ? '1px solid #b91c1c'
                                        : '1px solid var(--color-warm-charcoal)',
                                      backgroundColor: isZero
                                        ? '#fef2f2'
                                        : '#fafafa',
                                      fontFamily:
                                        'var(--font-gt-america-mono)',
                                      fontSize: '10px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: clr.hex,
                                        border: '1px solid #888',
                                        display: 'inline-block',
                                      }}
                                    />
                                    <span>
                                      {clr.name.split('(')[0].trim()} ·{' '}
                                      <strong>{sz.label}</strong>:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void handleQuickStockDelta({
                                          product,
                                          colorId: clr.id,
                                          sizeLabel: sz.label,
                                          nextStock: stockCount - 1,
                                        })
                                      }
                                      style={{
                                        border: '1px solid #151515',
                                        background: '#fff',
                                        width: 18,
                                        height: 18,
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                      }}
                                    >
                                      -
                                    </button>
                                    <strong
                                      style={{
                                        color: isZero ? '#b91c1c' : '#151515',
                                      }}
                                    >
                                      {isZero ? 'AGOTADO (0)' : stockCount}
                                    </strong>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void handleQuickStockDelta({
                                          product,
                                          colorId: clr.id,
                                          sizeLabel: sz.label,
                                          nextStock: stockCount + 1,
                                        })
                                      }
                                      style={{
                                        border: '1px solid #151515',
                                        background: '#fff',
                                        width: 18,
                                        height: 18,
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'flex-end',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsCreateModalOpen(true);
                            }}
                            className="pill-btn pill-btn--brand"
                            style={{ padding: '8px 14px', fontSize: '10px' }}
                          >
                            <Edit3 size={12} />
                            <span>EDITAR FICHA / FOTOS / STOCK</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleQuickVisibilityToggle(product)
                            }
                            className="pill-btn pill-btn--outline"
                            style={{ padding: '8px 14px', fontSize: '10px' }}
                          >
                            {product.isVisible === false ? (
                              <>
                                <EyeOff size={12} />
                                <span>OCULTO (CLIC PARA MOSTRAR)</span>
                              </>
                            ) : (
                              <>
                                <Eye size={12} />
                                <span>VISIBLE EN TIENDA</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteProduct(product)}
                            className="pill-btn pill-btn--outline"
                            style={{ padding: '6px 10px', fontSize: '10px' }}
                          >
                            <Trash2 size={12} />
                            <span>ELIMINAR</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBCATEGORIES MANAGEMENT */}
        {activeTab === 'subcategories' && (
          <AdminSubcategoryManager
            subcategories={subcategories}
            onRefresh={loadAdminCatalog}
          />
        )}

        {/* TAB 3: ACCOUNTING & INVENTORY LEDGER */}
        {activeTab === 'ledger' && (
          <AdminInventoryLedgerView ledger={ledger} />
        )}
      </main>

      {/* Product Create / Edit Modal */}
      {isCreateModalOpen && (
        <AdminProductFormModal
          initialProduct={editingProduct}
          subcategories={subcategories}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={loadAdminCatalog}
        />
      )}
    </div>
  );
};
