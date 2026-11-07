import { PRODUCTS_DATA } from '../data/products.data';
import { INITIAL_SUBCATEGORIES_SEED } from '../data/subcategories.data';
import {
  AdminCatalogResponse,
  AdminUserProfile,
  InventoryLedgerEntry,
  LoginResponsePayload,
  PublicCatalogResponse,
} from '../types/admin.types';
import {
  Product,
  SubcategoryDefinition,
} from '../types/product.types';
import { VariantStockService } from './variant-stock.service';

const FALLBACK_DB_KEY = 'lumera_atelier_fallback_db_v1';
const ADMIN_EMAIL = 'admin@lumera.co';
const ADMIN_PASS = 'LumeraAtelier2026!';

interface FallbackDbSchema {
  products: Product[];
  subcategories: SubcategoryDefinition[];
  ledger: InventoryLedgerEntry[];
  updatedAt: string;
}

async function computeSha256Hex(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const buf = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return `sig-${Date.now().toString(16)}`;
}

function loadFallbackDb(): FallbackDbSchema {
  try {
    const raw = window.localStorage.getItem(FALLBACK_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FallbackDbSchema;
      if (parsed && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  const nowIso = new Date().toISOString();
  const products = PRODUCTS_DATA.map((p) =>
    VariantStockService.normalizeProductInventory({
      ...p,
      inventoryMode: p.inventoryMode ?? 'by_color_and_size',
      isVisible: true,
      updatedAt: nowIso,
    })
  );

  const ledger: InventoryLedgerEntry[] = products.map((prod, idx) => {
    const total = VariantStockService.getProductTotalStock(prod);
    return {
      id: `ldg-seed-${idx + 1}`,
      productId: prod.id,
      sku: prod.sku,
      productName: prod.name,
      variantKey: 'ALL_VARIANTS',
      previousStock: 0,
      newStock: total,
      delta: total,
      unitPriceCop: prod.price,
      unitCostCop: prod.costPriceCop ?? Math.round(prod.price * 0.42),
      reason: 'INITIAL_SEED',
      actorEmail: ADMIN_EMAIL,
      signature: `hmac-sha256-seed-${prod.sku.toLowerCase()}`,
      createdAt: nowIso,
    };
  });

  const seeded: FallbackDbSchema = {
    products,
    subcategories: [...INITIAL_SUBCATEGORIES_SEED],
    ledger,
    updatedAt: nowIso,
  };

  saveFallbackDb(seeded);
  return seeded;
}

function saveFallbackDb(db: FallbackDbSchema): void {
  db.updatedAt = new Date().toISOString();
  try {
    window.localStorage.setItem(FALLBACK_DB_KEY, JSON.stringify(db));
  } catch {
    // Ignore quota errors
  }
}

/**
 * LocalBackendFallbackService
 * Single Responsibility: Provides an identical signed persistence engine when the app
 * is served from a static host or an un-restarted dev server that returns 405/404 on `/api/v1/*`.
 */
export const LocalBackendFallbackService = {
  hasLocalOverrides(): boolean {
    try {
      return Boolean(window.localStorage.getItem(FALLBACK_DB_KEY));
    } catch {
      return false;
    }
  },

  async login(
    email: string,
    password: string
  ): Promise<LoginResponsePayload> {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      throw new Error(
        'Credenciales inválidas. Verifica tu correo y contraseña.'
      );
    }

    const user: AdminUserProfile = {
      id: 'usr-admin-001',
      email: ADMIN_EMAIL,
      fullName: 'Dirección General LUMÉRA',
      role: 'ADMIN',
    };

    const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
    const sig = await computeSha256Hex(
      `${user.id}:${user.email}:${expiresAt}:lumera-secret`
    );
    const payloadB64 = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        exp: Math.floor(expiresAt / 1000),
      })
    );

    return {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payloadB64}.${sig}`,
      expiresAt,
      user,
    };
  },

  verifyToken(token: string | null): AdminUserProfile | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = JSON.parse(atob(parts[1])) as {
        sub: string;
        email: string;
        fullName: string;
        role: AdminUserProfile['role'];
        exp: number;
      };
      if (decoded.exp * 1000 < Date.now()) return null;
      return {
        id: decoded.sub,
        email: decoded.email,
        fullName: decoded.fullName,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  },

  async getPublicCatalog(): Promise<PublicCatalogResponse> {
    const db = loadFallbackDb();
    const visibleProducts = db.products
      .filter((p) => p.isVisible !== false)
      .map((p) => VariantStockService.normalizeProductInventory(p));
    const visibleSubs = db.subcategories
      .filter((s) => s.isVisible !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const sig = await computeSha256Hex(
      `${visibleProducts.length}:${visibleSubs.length}:${db.updatedAt}`
    );
    return {
      products: visibleProducts,
      subcategories: visibleSubs,
      signature: sig,
      generatedAt: new Date().toISOString(),
    };
  },

  async getAdminCatalog(): Promise<AdminCatalogResponse> {
    const db = loadFallbackDb();
    const normalized = db.products.map((p) =>
      VariantStockService.normalizeProductInventory(p)
    );
    const sig = await computeSha256Hex(
      `${normalized.length}:${db.updatedAt}`
    );
    return {
      products: normalized,
      subcategories: [...db.subcategories].sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
      ledger: db.ledger,
      signature: sig,
      generatedAt: new Date().toISOString(),
    };
  },

  async createProduct(incoming: Partial<Product>): Promise<Product> {
    const db = loadFallbackDb();
    const nowIso = new Date().toISOString();
    const newId =
      incoming.id?.trim() ||
      `lum-${incoming.department === 'makeup' ? 'mk' : 'ropa'}-${Date.now()
        .toString(36)
        .slice(-5)}`;

    const base: Product = {
      id: newId,
      sku: incoming.sku?.trim().toUpperCase() || newId.toUpperCase(),
      name: (incoming.name ?? 'NUEVO PRODUCTO').trim().toUpperCase(),
      subtitle: incoming.subtitle?.trim() || '',
      department: incoming.department ?? 'boutique',
      category: incoming.category ?? 'vestidos-conjuntos',
      categoryLabel:
        incoming.categoryLabel ?? incoming.category ?? 'Vestidos & Conjuntos',
      subcategoryId: incoming.subcategoryId,
      price: Number(incoming.price) || 0,
      compareAtPrice: incoming.compareAtPrice
        ? Number(incoming.compareAtPrice)
        : undefined,
      costPriceCop: incoming.costPriceCop
        ? Number(incoming.costPriceCop)
        : undefined,
      taxRatePct: incoming.taxRatePct ?? 19,
      badge: incoming.badge,
      description: incoming.description || '',
      editorialNote: incoming.editorialNote || '',
      colors: incoming.colors ?? [],
      sizes: incoming.sizes ?? [],
      sizeTypeLabel:
        incoming.sizeTypeLabel ??
        (incoming.department === 'makeup'
          ? 'FORMATO / PRESENTACIÓN'
          : 'TALLA'),
      colorTypeLabel:
        incoming.colorTypeLabel ??
        (incoming.department === 'makeup' ? 'TONO / ACABADO' : 'COLOR'),
      inventoryMode: incoming.inventoryMode ?? 'by_color_and_size',
      variantStockMatrix: incoming.variantStockMatrix ?? {},
      isVisible: incoming.isVisible !== false,
      compositionOrIngredients: incoming.compositionOrIngredients || '',
      careOrHowToUse: incoming.careOrHowToUse || '',
      specifications: incoming.specifications ?? [],
      relatedProductIds: incoming.relatedProductIds ?? [],
      featured: Boolean(incoming.featured),
      updatedAt: nowIso,
    };

    const normalized = VariantStockService.normalizeProductInventory(base);
    db.products.unshift(normalized);

    const totalStock = VariantStockService.getProductTotalStock(normalized);
    const sig = await computeSha256Hex(`${normalized.id}:${totalStock}:${nowIso}`);
    db.ledger.unshift({
      id: `ldg-${Date.now().toString(36)}`,
      productId: normalized.id,
      sku: normalized.sku,
      productName: normalized.name,
      variantKey: 'CREATE_PRODUCT',
      previousStock: 0,
      newStock: totalStock,
      delta: totalStock,
      unitPriceCop: normalized.price,
      unitCostCop: normalized.costPriceCop ?? Math.round(normalized.price * 0.42),
      reason: 'PRODUCT_UPDATE',
      actorEmail: ADMIN_EMAIL,
      signature: sig,
      createdAt: nowIso,
    });

    saveFallbackDb(db);
    return normalized;
  },

  async updateProduct(
    productId: string,
    incoming: Partial<Product>
  ): Promise<Product> {
    const db = loadFallbackDb();
    const idx = db.products.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error('Producto no encontrado.');

    const existing = VariantStockService.normalizeProductInventory(
      db.products[idx]
    );
    const prevTotal = VariantStockService.getProductTotalStock(existing);

    const merged: Product = {
      ...existing,
      ...incoming,
      id: existing.id,
      name: (incoming.name ?? existing.name).trim().toUpperCase(),
      sku: (incoming.sku ?? existing.sku).trim().toUpperCase(),
      price: Number(incoming.price ?? existing.price),
      updatedAt: new Date().toISOString(),
    };

    const normalized = VariantStockService.normalizeProductInventory(merged);
    db.products[idx] = normalized;
    const nextTotal = VariantStockService.getProductTotalStock(normalized);
    const sig = await computeSha256Hex(
      `${normalized.id}:${prevTotal}->${nextTotal}:${normalized.updatedAt}`
    );

    db.ledger.unshift({
      id: `ldg-${Date.now().toString(36)}`,
      productId: normalized.id,
      sku: normalized.sku,
      productName: normalized.name,
      variantKey: 'FULL_PRODUCT_UPDATE',
      previousStock: prevTotal,
      newStock: nextTotal,
      delta: nextTotal - prevTotal,
      unitPriceCop: normalized.price,
      unitCostCop: normalized.costPriceCop ?? Math.round(normalized.price * 0.42),
      reason: 'PRODUCT_UPDATE',
      actorEmail: ADMIN_EMAIL,
      signature: sig,
      createdAt: normalized.updatedAt!,
    });

    saveFallbackDb(db);
    return normalized;
  },

  async toggleVisibility(
    productId: string,
    isVisible: boolean
  ): Promise<Product> {
    const db = loadFallbackDb();
    const idx = db.products.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error('Producto no encontrado.');
    const updated: Product = {
      ...db.products[idx],
      isVisible,
      updatedAt: new Date().toISOString(),
    };
    db.products[idx] = updated;
    saveFallbackDb(db);
    return updated;
  },

  async updateVariantStock(params: {
    productId: string;
    colorId?: string;
    sizeLabel?: string;
    stock: number;
  }): Promise<Product> {
    const db = loadFallbackDb();
    const idx = db.products.findIndex((p) => p.id === params.productId);
    if (idx === -1) throw new Error('Producto no encontrado.');

    const existing = VariantStockService.normalizeProductInventory(
      db.products[idx]
    );
    const prevTotal = VariantStockService.getProductTotalStock(existing);
    const newStock = Math.max(0, Math.floor(Number(params.stock)));
    const mode = VariantStockService.getInventoryMode(existing);

    const draft: Product = {
      ...existing,
      colors: existing.colors.map((c) => ({ ...c })),
      sizes: existing.sizes.map((s) => ({ ...s })),
      variantStockMatrix: { ...(existing.variantStockMatrix ?? {}) },
    };

    let variantKeyLabel = 'ALL';
    if (mode === 'by_size' && params.sizeLabel) {
      variantKeyLabel = `SIZE:${params.sizeLabel}`;
      draft.sizes = draft.sizes.map((s) =>
        s.label === params.sizeLabel
          ? { ...s, stock: newStock, inStock: newStock > 0 }
          : s
      );
    } else if (mode === 'by_color' && params.colorId) {
      variantKeyLabel = `COLOR:${params.colorId}`;
      draft.colors = draft.colors.map((c) =>
        c.id === params.colorId
          ? { ...c, stock: newStock, inStock: newStock > 0 }
          : c
      );
    } else if (params.colorId && params.sizeLabel) {
      const key = VariantStockService.buildVariantKey(
        params.colorId,
        params.sizeLabel
      );
      variantKeyLabel = key;
      draft.variantStockMatrix![key] = newStock;
    }

    const normalized = VariantStockService.normalizeProductInventory(draft);
    normalized.updatedAt = new Date().toISOString();
    db.products[idx] = normalized;
    const nextTotal = VariantStockService.getProductTotalStock(normalized);
    const sig = await computeSha256Hex(
      `${normalized.id}:${variantKeyLabel}:${nextTotal}`
    );

    db.ledger.unshift({
      id: `ldg-${Date.now().toString(36)}`,
      productId: normalized.id,
      sku: normalized.sku,
      productName: normalized.name,
      variantKey: variantKeyLabel,
      previousStock: prevTotal,
      newStock: nextTotal,
      delta: nextTotal - prevTotal,
      unitPriceCop: normalized.price,
      unitCostCop: normalized.costPriceCop ?? Math.round(normalized.price * 0.42),
      reason: 'ADMIN_ADJUSTMENT',
      actorEmail: ADMIN_EMAIL,
      signature: sig,
      createdAt: normalized.updatedAt,
    });

    saveFallbackDb(db);
    return normalized;
  },

  async deleteProduct(productId: string): Promise<void> {
    const db = loadFallbackDb();
    db.products = db.products.filter((p) => p.id !== productId);
    saveFallbackDb(db);
  },

  async createSubcategory(
    body: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    const db = loadFallbackDb();
    const newSub: SubcategoryDefinition = {
      id: `sub-${Date.now().toString(36)}`,
      slug: (body.label ?? 'sub')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      label: (body.label ?? 'NUEVA SUBCATEGORÍA').trim().toUpperCase(),
      department: body.department ?? 'boutique',
      category: body.category ?? 'vestidos-conjuntos',
      searchKeyword: body.searchKeyword?.trim() || '',
      showInNewArrivals: Boolean(body.showInNewArrivals),
      isVisible: body.isVisible !== false,
      sortOrder: body.sortOrder ?? db.subcategories.length + 1,
    };
    db.subcategories.push(newSub);
    saveFallbackDb(db);
    return newSub;
  },

  async updateSubcategory(
    id: string,
    body: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    const db = loadFallbackDb();
    const idx = db.subcategories.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Subcategoría no encontrada.');
    const updated: SubcategoryDefinition = {
      ...db.subcategories[idx],
      ...body,
      id,
    };
    db.subcategories[idx] = updated;
    saveFallbackDb(db);
    return updated;
  },

  async deleteSubcategory(id: string): Promise<void> {
    const db = loadFallbackDb();
    db.subcategories = db.subcategories.filter((s) => s.id !== id);
    saveFallbackDb(db);
  },
};
