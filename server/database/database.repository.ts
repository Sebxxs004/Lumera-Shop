import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PRODUCTS_DATA } from '../../src/data/products.data';
import { INITIAL_SUBCATEGORIES_SEED } from '../../src/data/subcategories.data';
import { VariantStockService } from '../../src/services/variant-stock.service';
import {
  InventoryLedgerEntry,
  UserRole,
} from '../../src/types/admin.types';
import {
  Product,
  SubcategoryDefinition,
} from '../../src/types/product.types';
import { SecurityConfig } from '../config/security.config';
import { CryptoService } from '../security/crypto.service';

export interface StoredUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: StoredUserRecord[];
  subcategories: SubcategoryDefinition[];
  products: Product[];
  inventoryLedger: InventoryLedgerEntry[];
  updatedAt: string;
}

const LOCAL_DB_PATH = path.resolve(
  process.cwd(),
  'server',
  'database',
  'lumera-db.json'
);
const TMP_DB_PATH = path.join(os.tmpdir(), 'lumera-db.json');

let memoryDbCache: DatabaseSchema | null = null;

/**
 * DatabaseRepository
 * Single Responsibility: Persistent server-side data storage, atomic read/write,
 * initial seed hydration, and accounting inventory ledger recording.
 * Supports both local disk (`server/database/lumera-db.json`) and Vercel serverless (`/tmp/lumera-db.json`).
 */
export const DatabaseRepository = {
  ensureInitialized(): DatabaseSchema {
    // 1. Try reading from `/tmp` first if running in serverless and already written
    if (fs.existsSync(TMP_DB_PATH)) {
      try {
        const raw = fs.readFileSync(TMP_DB_PATH, 'utf8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (
          parsed &&
          Array.isArray(parsed.products) &&
          Array.isArray(parsed.users)
        ) {
          memoryDbCache = parsed;
          return parsed;
        }
      } catch {
        // Continue
      }
    }

    // 2. Try reading from repository `server/database/lumera-db.json`
    if (fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (
          parsed &&
          Array.isArray(parsed.products) &&
          Array.isArray(parsed.users)
        ) {
          memoryDbCache = parsed;
          return parsed;
        }
      } catch {
        // Continue
      }
    }

    if (memoryDbCache) {
      return memoryDbCache;
    }

    const nowIso = new Date().toISOString();
    const adminUser: StoredUserRecord = {
      id: 'usr-admin-001',
      email: SecurityConfig.DEFAULT_ADMIN_EMAIL.toLowerCase(),
      fullName: SecurityConfig.DEFAULT_ADMIN_NAME,
      role: 'ADMIN',
      passwordHash: CryptoService.hashPassword(
        SecurityConfig.DEFAULT_ADMIN_PASSWORD
      ),
      createdAt: nowIso,
    };

    const seededProducts: Product[] = PRODUCTS_DATA.map((product) =>
      VariantStockService.normalizeProductInventory({
        ...product,
        inventoryMode: product.inventoryMode ?? 'by_color_and_size',
        isVisible: true,
        updatedAt: nowIso,
      })
    );

    const initialLedger: InventoryLedgerEntry[] = seededProducts.map((prod) => {
      const totalStock = VariantStockService.getProductTotalStock(prod);
      const entryCore = {
        productId: prod.id,
        sku: prod.sku,
        productName: prod.name,
        variantKey: 'ALL_VARIANTS',
        previousStock: 0,
        newStock: totalStock,
        delta: totalStock,
        unitPriceCop: prod.price,
        unitCostCop: prod.costPriceCop ?? Math.round(prod.price * 0.42),
        reason: 'INITIAL_SEED' as const,
        actorEmail: adminUser.email,
        createdAt: nowIso,
      };
      return {
        id: `ldg-${crypto.randomUUID().slice(0, 8)}`,
        ...entryCore,
        signature: CryptoService.signPayloadIntegrity(entryCore),
      };
    });

    const initialDb: DatabaseSchema = {
      users: [adminUser],
      subcategories: [...INITIAL_SUBCATEGORIES_SEED],
      products: seededProducts,
      inventoryLedger: initialLedger,
      updatedAt: nowIso,
    };

    this.save(initialDb);
    return initialDb;
  },

  read(): DatabaseSchema {
    return this.ensureInitialized();
  },

  save(data: DatabaseSchema): void {
    data.updatedAt = new Date().toISOString();
    memoryDbCache = data;
    const serialized = JSON.stringify(data, null, 2);

    // Attempt local save first, fallback to /tmp on Vercel read-only filesystem
    try {
      const dir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_PATH, serialized, 'utf8');
    } catch {
      try {
        fs.writeFileSync(TMP_DB_PATH, serialized, 'utf8');
      } catch {
        // Kept in memoryDbCache
      }
    }
  },

  recordLedgerEntry(params: {
    db: DatabaseSchema;
    product: Product;
    variantKey: string;
    previousStock: number;
    newStock: number;
    reason: InventoryLedgerEntry['reason'];
    actorEmail: string;
  }): InventoryLedgerEntry {
    const nowIso = new Date().toISOString();
    const core = {
      productId: params.product.id,
      sku: params.product.sku,
      productName: params.product.name,
      variantKey: params.variantKey,
      previousStock: params.previousStock,
      newStock: params.newStock,
      delta: params.newStock - params.previousStock,
      unitPriceCop: params.product.price,
      unitCostCop:
        params.product.costPriceCop ?? Math.round(params.product.price * 0.42),
      reason: params.reason,
      actorEmail: params.actorEmail,
      createdAt: nowIso,
    };

    const entry: InventoryLedgerEntry = {
      id: `ldg-${crypto.randomUUID().slice(0, 8)}`,
      ...core,
      signature: CryptoService.signPayloadIntegrity(core),
    };

    params.db.inventoryLedger.unshift(entry);
    if (params.db.inventoryLedger.length > 500) {
      params.db.inventoryLedger = params.db.inventoryLedger.slice(0, 500);
    }

    return entry;
  },
};
