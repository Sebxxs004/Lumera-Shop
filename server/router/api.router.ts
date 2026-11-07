import crypto from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { VariantStockService } from '../../src/services/variant-stock.service';
import {
  AdminCatalogResponse,
  LoginResponsePayload,
  PublicCatalogResponse,
} from '../../src/types/admin.types';
import {
  Product,
  SubcategoryDefinition,
} from '../../src/types/product.types';
import { DatabaseRepository } from '../database/database.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CryptoService } from '../security/crypto.service';
import { UploadService } from '../services/upload.service';

function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function readJsonBody<T = Record<string, unknown>>(
  req: IncomingMessage
): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    const maxBodyBytes = 12 * 1024 * 1024; // 12 MB max for base64 image payloads

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.byteLength;
      if (totalBytes > maxBodyBytes) {
        reject(new Error('Payload demasiado grande.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw.trim()) {
          resolve({} as T);
          return;
        }
        resolve(JSON.parse(raw) as T);
      } catch {
        reject(new Error('JSON inválido en el cuerpo de la petición.'));
      }
    });

    req.on('error', (err) => reject(err));
  });
}

/**
 * ApiRouter
 * Single Responsibility: Handles all `/api/v1/*` backend routes with JWT verification,
 * privilege enforcement, inventory normalization, and cryptographic payload signing.
 */
export const ApiRouter = {
  async handle(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<boolean> {
    const rawUrl = req.url ?? '';
    if (!rawUrl.startsWith('/api/v1/')) {
      return false;
    }

    const urlObj = new URL(rawUrl, 'http://localhost');
    const pathname = urlObj.pathname;
    const method = (req.method ?? 'GET').toUpperCase();

    try {
      /* ======================================================================
         1. AUTHENTICATION ENDPOINTS
         ====================================================================== */
      if (pathname === '/api/v1/auth/login' && method === 'POST') {
        const body = await readJsonBody<{ email?: string; password?: string }>(
          req
        );
        const email = (body.email ?? '').trim().toLowerCase();
        const password = body.password ?? '';

        if (!email || !password) {
          sendJson(res, 400, {
            error: 'Debes ingresar correo electrónico y contraseña.',
          });
          return true;
        }

        const db = DatabaseRepository.read();
        const userRecord = db.users.find(
          (u) => u.email.toLowerCase() === email
        );

        if (
          !userRecord ||
          !CryptoService.verifyPassword(password, userRecord.passwordHash)
        ) {
          sendJson(res, 401, {
            error: 'Credenciales inválidas. Verifica tu correo y contraseña.',
          });
          return true;
        }

        const { token, expiresAt } = CryptoService.signToken({
          sub: userRecord.id,
          email: userRecord.email,
          fullName: userRecord.fullName,
          role: userRecord.role,
        });

        const response: LoginResponsePayload = {
          token,
          expiresAt,
          user: {
            id: userRecord.id,
            email: userRecord.email,
            fullName: userRecord.fullName,
            role: userRecord.role,
          },
        };

        sendJson(res, 200, response);
        return true;
      }

      if (pathname === '/api/v1/auth/me' && method === 'GET') {
        const auth = AuthMiddleware.requireRole(req, [
          'ADMIN',
          'MANAGER',
          'ACCOUNTING',
        ]);
        if (!auth.authorized) {
          sendJson(res, auth.status, { error: auth.message });
          return true;
        }

        sendJson(res, 200, {
          user: {
            id: auth.claims.sub,
            email: auth.claims.email,
            fullName: auth.claims.fullName,
            role: auth.claims.role,
          },
        });
        return true;
      }

      /* ======================================================================
         2. PUBLIC STOREFRONT CATALOG (READ-ONLY, VISIBILITY FILTERED & SIGNED)
         ====================================================================== */
      if (pathname === '/api/v1/catalog' && method === 'GET') {
        const db = DatabaseRepository.read();

        const publicProducts: Product[] = db.products
          .filter((p) => p.isVisible !== false)
          .map((p) => {
            const normalized = VariantStockService.normalizeProductInventory(p);
            // Strip internal accounting cost price from public storefront payload
            const { costPriceCop: _cost, ...publicProduct } = normalized;
            return publicProduct;
          });

        const publicSubcategories = db.subcategories
          .filter((s) => s.isVisible !== false)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        const generatedAt = new Date().toISOString();
        const signature = CryptoService.signPayloadIntegrity({
          productsCount: publicProducts.length,
          subcategoriesCount: publicSubcategories.length,
          updatedAt: db.updatedAt,
        });

        const payload: PublicCatalogResponse = {
          products: publicProducts,
          subcategories: publicSubcategories,
          signature,
          generatedAt,
        };

        sendJson(res, 200, payload);
        return true;
      }

      /* ======================================================================
         3. PROTECTED ADMIN ROUTES (REQUIRE CRYPTOGRAPHIC JWT + ADMIN PRIVILEGE)
         ====================================================================== */
      if (pathname.startsWith('/api/v1/admin/')) {
        const auth = AuthMiddleware.requireRole(req, ['ADMIN', 'MANAGER']);
        if (!auth.authorized) {
          sendJson(res, auth.status, { error: auth.message });
          return true;
        }

        const actorEmail = auth.claims.email;

        // GET /api/v1/admin/catalog
        if (pathname === '/api/v1/admin/catalog' && method === 'GET') {
          const db = DatabaseRepository.read();
          const normalizedProducts = db.products.map((p) =>
            VariantStockService.normalizeProductInventory(p)
          );
          const sortedSubcategories = [...db.subcategories].sort(
            (a, b) => a.sortOrder - b.sortOrder
          );

          const generatedAt = new Date().toISOString();
          const signature = CryptoService.signPayloadIntegrity({
            products: normalizedProducts.map((p) => ({
              id: p.id,
              price: p.price,
              stock: VariantStockService.getProductTotalStock(p),
            })),
            updatedAt: db.updatedAt,
          });

          const response: AdminCatalogResponse = {
            products: normalizedProducts,
            subcategories: sortedSubcategories,
            ledger: db.inventoryLedger,
            signature,
            generatedAt,
          };

          sendJson(res, 200, response);
          return true;
        }

        // POST /api/v1/admin/uploads (Upload local image for garment/color/makeup)
        if (pathname === '/api/v1/admin/uploads' && method === 'POST') {
          const body = await readJsonBody<{
            dataUrl?: string;
            fileName?: string;
          }>(req);

          if (!body.dataUrl) {
            sendJson(res, 400, {
              error: 'No se recibió la imagen a cargar.',
            });
            return true;
          }

          const uploaded = UploadService.saveBase64Image(
            body.dataUrl,
            body.fileName
          );
          sendJson(res, 201, uploaded);
          return true;
        }

        // POST /api/v1/admin/products (Create Product)
        if (pathname === '/api/v1/admin/products' && method === 'POST') {
          const incoming = await readJsonBody<Partial<Product>>(req);
          if (!incoming.name || !incoming.department || !incoming.category) {
            sendJson(res, 400, {
              error:
                'Nombre, departamento (Ropa o Makeup) y categoría son obligatorios.',
            });
            return true;
          }

          const db = DatabaseRepository.read();
          const newId =
            incoming.id?.trim() ||
            `lum-${incoming.department === 'makeup' ? 'mk' : 'ropa'}-${crypto
              .randomUUID()
              .slice(0, 6)}`;

          const nowIso = new Date().toISOString();
          const baseProduct: Product = {
            id: newId,
            sku:
              incoming.sku?.trim().toUpperCase() ||
              newId.toUpperCase(),
            name: incoming.name.trim().toUpperCase(),
            subtitle: incoming.subtitle?.trim() || '',
            department: incoming.department,
            category: incoming.category,
            categoryLabel:
              incoming.categoryLabel || incoming.category,
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
            colors:
              Array.isArray(incoming.colors) && incoming.colors.length > 0
                ? incoming.colors
                : [
                    {
                      id: 'color-default',
                      name: 'Tono Principal',
                      hex: '#151515',
                      finish: 'Estándar',
                      images: [
                        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
                      ],
                      stock: 5,
                      inStock: true,
                    },
                  ],
            sizes:
              Array.isArray(incoming.sizes) && incoming.sizes.length > 0
                ? incoming.sizes
                : [
                    {
                      label:
                        incoming.department === 'makeup' ? 'Full Size' : 'S',
                      measurementsOrDetail: 'Estándar',
                      inStock: true,
                      stock: 5,
                    },
                  ],
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
            compositionOrIngredients:
              incoming.compositionOrIngredients || '',
            careOrHowToUse: incoming.careOrHowToUse || '',
            specifications: incoming.specifications ?? [],
            relatedProductIds: incoming.relatedProductIds ?? [],
            featured: Boolean(incoming.featured),
            updatedAt: nowIso,
          };

          const normalized =
            VariantStockService.normalizeProductInventory(baseProduct);

          db.products.unshift(normalized);

          DatabaseRepository.recordLedgerEntry({
            db,
            product: normalized,
            variantKey: 'CREATE_PRODUCT',
            previousStock: 0,
            newStock: VariantStockService.getProductTotalStock(normalized),
            reason: 'PRODUCT_UPDATE',
            actorEmail,
          });

          DatabaseRepository.save(db);
          sendJson(res, 201, { product: normalized });
          return true;
        }

        // Product ID routes: /api/v1/admin/products/:id...
        const productRouteMatch =
          /^\/api\/v1\/admin\/products\/([^/]+)(?:\/(visibility|stock))?$/.exec(
            pathname
          );

        if (productRouteMatch) {
          const productId = decodeURIComponent(productRouteMatch[1]);
          const subAction = productRouteMatch[2];
          const db = DatabaseRepository.read();
          const productIndex = db.products.findIndex((p) => p.id === productId);

          if (productIndex === -1) {
            sendJson(res, 404, { error: 'Producto no encontrado.' });
            return true;
          }

          const existingProduct =
            VariantStockService.normalizeProductInventory(
              db.products[productIndex]
            );

          // PATCH /api/v1/admin/products/:id/visibility
          if (subAction === 'visibility' && method === 'PATCH') {
            const body = await readJsonBody<{ isVisible?: boolean }>(req);
            const nextVisible =
              typeof body.isVisible === 'boolean'
                ? body.isVisible
                : !existingProduct.isVisible;

            const updated: Product = {
              ...existingProduct,
              isVisible: nextVisible,
              updatedAt: new Date().toISOString(),
            };

            db.products[productIndex] = updated;
            DatabaseRepository.save(db);
            sendJson(res, 200, { product: updated });
            return true;
          }

          // PATCH /api/v1/admin/products/:id/stock
          if (subAction === 'stock' && method === 'PATCH') {
            const body = await readJsonBody<{
              colorId?: string;
              sizeLabel?: string;
              stock?: number;
            }>(req);

            const newStock = Math.max(0, Math.floor(Number(body.stock ?? 0)));
            const mode = VariantStockService.getInventoryMode(existingProduct);
            const prevTotal =
              VariantStockService.getProductTotalStock(existingProduct);

            let variantKeyLabel = 'ALL';
            const updatedDraft: Product = {
              ...existingProduct,
              colors: existingProduct.colors.map((c) => ({ ...c })),
              sizes: existingProduct.sizes.map((s) => ({ ...s })),
              variantStockMatrix: {
                ...(existingProduct.variantStockMatrix ?? {}),
              },
            };

            if (mode === 'by_size' && body.sizeLabel) {
              variantKeyLabel = `SIZE:${body.sizeLabel}`;
              updatedDraft.sizes = updatedDraft.sizes.map((s) =>
                s.label === body.sizeLabel
                  ? { ...s, stock: newStock, inStock: newStock > 0 }
                  : s
              );
            } else if (mode === 'by_color' && body.colorId) {
              variantKeyLabel = `COLOR:${body.colorId}`;
              updatedDraft.colors = updatedDraft.colors.map((c) =>
                c.id === body.colorId
                  ? { ...c, stock: newStock, inStock: newStock > 0 }
                  : c
              );
            } else if (body.colorId && body.sizeLabel) {
              const key = VariantStockService.buildVariantKey(
                body.colorId,
                body.sizeLabel
              );
              variantKeyLabel = key;
              updatedDraft.variantStockMatrix![key] = newStock;
            }

            const normalized =
              VariantStockService.normalizeProductInventory(updatedDraft);
            normalized.updatedAt = new Date().toISOString();

            db.products[productIndex] = normalized;
            const nextTotal =
              VariantStockService.getProductTotalStock(normalized);

            DatabaseRepository.recordLedgerEntry({
              db,
              product: normalized,
              variantKey: variantKeyLabel,
              previousStock: prevTotal,
              newStock: nextTotal,
              reason: 'ADMIN_ADJUSTMENT',
              actorEmail,
            });

            DatabaseRepository.save(db);
            sendJson(res, 200, { product: normalized });
            return true;
          }

          // PUT /api/v1/admin/products/:id (Full Update)
          if (!subAction && method === 'PUT') {
            const incoming = await readJsonBody<Partial<Product>>(req);
            const prevTotal =
              VariantStockService.getProductTotalStock(existingProduct);

            const merged: Product = {
              ...existingProduct,
              ...incoming,
              id: existingProduct.id,
              name: (incoming.name ?? existingProduct.name)
                .trim()
                .toUpperCase(),
              sku: (incoming.sku ?? existingProduct.sku).trim().toUpperCase(),
              price: Number(incoming.price ?? existingProduct.price),
              updatedAt: new Date().toISOString(),
            };

            const normalized =
              VariantStockService.normalizeProductInventory(merged);
            db.products[productIndex] = normalized;

            const nextTotal =
              VariantStockService.getProductTotalStock(normalized);

            DatabaseRepository.recordLedgerEntry({
              db,
              product: normalized,
              variantKey: 'FULL_PRODUCT_UPDATE',
              previousStock: prevTotal,
              newStock: nextTotal,
              reason: 'PRODUCT_UPDATE',
              actorEmail,
            });

            DatabaseRepository.save(db);
            sendJson(res, 200, { product: normalized });
            return true;
          }

          // DELETE /api/v1/admin/products/:id
          if (!subAction && method === 'DELETE') {
            db.products.splice(productIndex, 1);
            DatabaseRepository.save(db);
            sendJson(res, 200, { deletedId: productId });
            return true;
          }
        }

        // POST /api/v1/admin/subcategories
        if (pathname === '/api/v1/admin/subcategories' && method === 'POST') {
          const body = await readJsonBody<Partial<SubcategoryDefinition>>(req);
          if (!body.label || !body.department || !body.category) {
            sendJson(res, 400, {
              error:
                'Nombre de subcategoría, departamento y categoría base son obligatorios.',
            });
            return true;
          }

          const db = DatabaseRepository.read();
          const slug =
            body.slug?.trim().toLowerCase() ||
            body.label
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');

          const newSub: SubcategoryDefinition = {
            id: `sub-${crypto.randomUUID().slice(0, 8)}`,
            slug,
            label: body.label.trim().toUpperCase(),
            department: body.department,
            category: body.category,
            searchKeyword: body.searchKeyword?.trim() || '',
            showInNewArrivals: Boolean(body.showInNewArrivals),
            isVisible: body.isVisible !== false,
            sortOrder:
              typeof body.sortOrder === 'number'
                ? body.sortOrder
                : db.subcategories.length + 1,
          };

          db.subcategories.push(newSub);
          DatabaseRepository.save(db);
          sendJson(res, 201, { subcategory: newSub });
          return true;
        }

        // PUT or DELETE /api/v1/admin/subcategories/:id
        const subRouteMatch = /^\/api\/v1\/admin\/subcategories\/([^/]+)$/.exec(
          pathname
        );
        if (subRouteMatch) {
          const subId = decodeURIComponent(subRouteMatch[1]);
          const db = DatabaseRepository.read();
          const subIndex = db.subcategories.findIndex((s) => s.id === subId);

          if (subIndex === -1) {
            sendJson(res, 404, { error: 'Subcategoría no encontrada.' });
            return true;
          }

          if (method === 'PUT') {
            const body = await readJsonBody<Partial<SubcategoryDefinition>>(
              req
            );
            const existing = db.subcategories[subIndex];
            const updated: SubcategoryDefinition = {
              ...existing,
              ...body,
              id: existing.id,
              label: (body.label ?? existing.label).trim().toUpperCase(),
            };
            db.subcategories[subIndex] = updated;
            DatabaseRepository.save(db);
            sendJson(res, 200, { subcategory: updated });
            return true;
          }

          if (method === 'DELETE') {
            db.subcategories.splice(subIndex, 1);
            DatabaseRepository.save(db);
            sendJson(res, 200, { deletedId: subId });
            return true;
          }
        }
      }

      sendJson(res, 404, { error: `Ruta API no encontrada: ${pathname}` });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error interno del servidor.';
      sendJson(res, 500, { error: message });
      return true;
    }
  },
};
