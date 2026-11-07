import { Product, SubcategoryDefinition } from './product.types';

export type UserRole = 'ADMIN' | 'ACCOUNTING' | 'MANAGER';

export interface AdminUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthTokenClaims {
  sub: string;
  email: string;
  fullName: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface LoginResponsePayload {
  token: string;
  user: AdminUserProfile;
  expiresAt: number;
}

/**
 * InventoryLedgerEntry
 * Prepared for accounting & payment gateway reconciliation:
 * Tracks every stock movement, price change, or manual adjustment with cryptographic audit trail.
 */
export interface InventoryLedgerEntry {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  variantKey: string;
  previousStock: number;
  newStock: number;
  delta: number;
  unitPriceCop: number;
  unitCostCop: number;
  reason: 'INITIAL_SEED' | 'ADMIN_ADJUSTMENT' | 'PRODUCT_UPDATE' | 'SALE_RESERVED';
  actorEmail: string;
  signature: string;
  createdAt: string;
}

export interface PublicCatalogResponse {
  products: Product[];
  subcategories: SubcategoryDefinition[];
  signature: string;
  generatedAt: string;
}

export interface AdminCatalogResponse {
  products: Product[];
  subcategories: SubcategoryDefinition[];
  ledger: InventoryLedgerEntry[];
  signature: string;
  generatedAt: string;
}
