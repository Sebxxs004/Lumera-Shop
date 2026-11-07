import {
  AdminCatalogResponse,
  AdminUserProfile,
  LoginResponsePayload,
} from '../types/admin.types';
import { Product, SubcategoryDefinition } from '../types/product.types';
import { LocalBackendFallbackService } from './local-backend-fallback.service';
import { ProductService } from './product.service';

const TOKEN_STORAGE_KEY = 'lumera_atelier_jwt_v1';

function extractErrorMessage(
  rawError: unknown,
  fallbackMessage: string
): string {
  if (typeof rawError === 'string' && rawError.trim()) {
    return rawError;
  }
  if (
    rawError &&
    typeof rawError === 'object' &&
    'message' in rawError &&
    typeof (rawError as { message?: unknown }).message === 'string'
  ) {
    return (rawError as { message: string }).message;
  }
  return fallbackMessage;
}

async function safeReadJson<T>(
  res: Response
): Promise<{ parsed: T | null; isStaticOrMissingApi: boolean }> {
  const contentType = res.headers.get('content-type') ?? '';
  if (
    res.status === 405 ||
    res.status === 404 ||
    res.status >= 500 ||
    contentType.includes('text/html')
  ) {
    return { parsed: null, isStaticOrMissingApi: true };
  }

  try {
    const text = await res.text();
    if (!text.trim()) {
      return {
        parsed: null,
        isStaticOrMissingApi:
          res.status === 405 || res.status === 404 || res.status >= 500,
      };
    }
    return {
      parsed: JSON.parse(text) as T,
      isStaticOrMissingApi: false,
    };
  } catch {
    return {
      parsed: null,
      isStaticOrMissingApi: true,
    };
  }
}

/**
 * AdminApiService
 * Single Responsibility: Client-side HTTP gateway for authenticated admin operations.
 * Attaches cryptographically signed JWT tokens (`Authorization: Bearer <token>`)
 * to all modification requests and safely falls back when served from a static host.
 */
export const AdminApiService = {
  getStoredToken(): string | null {
    try {
      return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  setStoredToken(token: string | null): void {
    try {
      if (token) {
        window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage restriction
    }
  },

  buildAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  },

  async login(
    email: string,
    password: string
  ): Promise<LoginResponsePayload> {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<
        LoginResponsePayload & { error?: string }
      >(res);

      if (isStaticOrMissingApi) {
        const fallbackLogin = await LocalBackendFallbackService.login(
          email,
          password
        );
        this.setStoredToken(fallbackLogin.token);
        return fallbackLogin;
      }

      if (!res.ok || !parsed?.token) {
        throw new Error(
          extractErrorMessage(parsed?.error, 'Error al iniciar sesión.')
        );
      }

      this.setStoredToken(parsed.token);
      return parsed;
    } catch (err) {
      if (err instanceof TypeError) {
        const fallbackLogin = await LocalBackendFallbackService.login(
          email,
          password
        );
        this.setStoredToken(fallbackLogin.token);
        return fallbackLogin;
      }
      throw err;
    }
  },

  async verifySession(): Promise<AdminUserProfile | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/v1/auth/me', {
        method: 'GET',
        headers: this.buildAuthHeaders(),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        user?: AdminUserProfile;
      }>(res);

      if (isStaticOrMissingApi) {
        return LocalBackendFallbackService.verifyToken(token);
      }

      if (!res.ok || !parsed?.user) {
        this.setStoredToken(null);
        return null;
      }

      return parsed.user;
    } catch {
      return LocalBackendFallbackService.verifyToken(token);
    }
  },

  logout(): void {
    this.setStoredToken(null);
  },

  async fetchAdminCatalog(): Promise<AdminCatalogResponse> {
    try {
      const res = await fetch('/api/v1/admin/catalog', {
        method: 'GET',
        headers: this.buildAuthHeaders(),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<
        AdminCatalogResponse & { error?: string }
      >(res);

      if (
        isStaticOrMissingApi ||
        LocalBackendFallbackService.hasLocalOverrides()
      ) {
        return LocalBackendFallbackService.getAdminCatalog();
      }

      if (!res.ok || !parsed) {
        throw new Error(
          extractErrorMessage(
            parsed?.error,
            'No se pudo cargar el catálogo de administración.'
          )
        );
      }
      return parsed;
    } catch {
      return LocalBackendFallbackService.getAdminCatalog();
    }
  },

  async uploadImageFile(file: File): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });

    try {
      const res = await fetch('/api/v1/admin/uploads', {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify({
          dataUrl,
          fileName: file.name,
        }),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        url?: string;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        return dataUrl;
      }

      if (!res.ok || !parsed?.url) {
        throw new Error(
          parsed?.error ?? 'Error al subir la imagen al servidor.'
        );
      }

      return parsed.url;
    } catch {
      return dataUrl;
    }
  },

  async createProduct(payload: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        product?: Product;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const created =
          await LocalBackendFallbackService.createProduct(payload);
        await ProductService.refreshFromBackend();
        return created;
      }

      if (!res.ok || !parsed?.product) {
        throw new Error(parsed?.error ?? 'Error al crear el producto.');
      }

      await ProductService.refreshFromBackend();
      return parsed.product;
    } catch (err) {
      if (err instanceof TypeError) {
        const created =
          await LocalBackendFallbackService.createProduct(payload);
        await ProductService.refreshFromBackend();
        return created;
      }
      throw err;
    }
  },

  async updateProduct(
    productId: string,
    payload: Partial<Product>
  ): Promise<Product> {
    try {
      const res = await fetch(
        `/api/v1/admin/products/${encodeURIComponent(productId)}`,
        {
          method: 'PUT',
          headers: this.buildAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        product?: Product;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const updated = await LocalBackendFallbackService.updateProduct(
          productId,
          payload
        );
        await ProductService.refreshFromBackend();
        return updated;
      }

      if (!res.ok || !parsed?.product) {
        throw new Error(parsed?.error ?? 'Error al actualizar el producto.');
      }

      await ProductService.refreshFromBackend();
      return parsed.product;
    } catch (err) {
      if (err instanceof TypeError) {
        const updated = await LocalBackendFallbackService.updateProduct(
          productId,
          payload
        );
        await ProductService.refreshFromBackend();
        return updated;
      }
      throw err;
    }
  },

  async toggleProductVisibility(
    productId: string,
    isVisible: boolean
  ): Promise<Product> {
    try {
      const res = await fetch(
        `/api/v1/admin/products/${encodeURIComponent(productId)}/visibility`,
        {
          method: 'PATCH',
          headers: this.buildAuthHeaders(),
          body: JSON.stringify({ isVisible }),
        }
      );

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        product?: Product;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const updated = await LocalBackendFallbackService.toggleVisibility(
          productId,
          isVisible
        );
        await ProductService.refreshFromBackend();
        return updated;
      }

      if (!res.ok || !parsed?.product) {
        throw new Error(parsed?.error ?? 'Error al cambiar visibilidad.');
      }

      await ProductService.refreshFromBackend();
      return parsed.product;
    } catch {
      const updated = await LocalBackendFallbackService.toggleVisibility(
        productId,
        isVisible
      );
      await ProductService.refreshFromBackend();
      return updated;
    }
  },

  async updateVariantStock(params: {
    productId: string;
    colorId?: string;
    sizeLabel?: string;
    stock: number;
  }): Promise<Product> {
    try {
      const res = await fetch(
        `/api/v1/admin/products/${encodeURIComponent(params.productId)}/stock`,
        {
          method: 'PATCH',
          headers: this.buildAuthHeaders(),
          body: JSON.stringify({
            colorId: params.colorId,
            sizeLabel: params.sizeLabel,
            stock: params.stock,
          }),
        }
      );

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        product?: Product;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const updated =
          await LocalBackendFallbackService.updateVariantStock(params);
        await ProductService.refreshFromBackend();
        return updated;
      }

      if (!res.ok || !parsed?.product) {
        throw new Error(parsed?.error ?? 'Error al actualizar stock.');
      }

      await ProductService.refreshFromBackend();
      return parsed.product;
    } catch {
      const updated =
        await LocalBackendFallbackService.updateVariantStock(params);
      await ProductService.refreshFromBackend();
      return updated;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      const res = await fetch(
        `/api/v1/admin/products/${encodeURIComponent(productId)}`,
        {
          method: 'DELETE',
          headers: this.buildAuthHeaders(),
        }
      );

      const { isStaticOrMissingApi } = await safeReadJson(res);
      if (isStaticOrMissingApi) {
        await LocalBackendFallbackService.deleteProduct(productId);
        await ProductService.refreshFromBackend();
        return;
      }
    } catch {
      await LocalBackendFallbackService.deleteProduct(productId);
    }

    await ProductService.refreshFromBackend();
  },

  async createSubcategory(
    payload: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    try {
      const res = await fetch('/api/v1/admin/subcategories', {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        subcategory?: SubcategoryDefinition;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const created =
          await LocalBackendFallbackService.createSubcategory(payload);
        await ProductService.refreshFromBackend();
        return created;
      }

      if (!res.ok || !parsed?.subcategory) {
        throw new Error(parsed?.error ?? 'Error al crear subcategoría.');
      }

      await ProductService.refreshFromBackend();
      return parsed.subcategory;
    } catch {
      const created =
        await LocalBackendFallbackService.createSubcategory(payload);
      await ProductService.refreshFromBackend();
      return created;
    }
  },

  async updateSubcategory(
    id: string,
    payload: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    try {
      const res = await fetch(
        `/api/v1/admin/subcategories/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          headers: this.buildAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const { parsed, isStaticOrMissingApi } = await safeReadJson<{
        subcategory?: SubcategoryDefinition;
        error?: string;
      }>(res);

      if (isStaticOrMissingApi) {
        const updated = await LocalBackendFallbackService.updateSubcategory(
          id,
          payload
        );
        await ProductService.refreshFromBackend();
        return updated;
      }

      if (!res.ok || !parsed?.subcategory) {
        throw new Error(parsed?.error ?? 'Error al actualizar subcategoría.');
      }

      await ProductService.refreshFromBackend();
      return parsed.subcategory;
    } catch {
      const updated = await LocalBackendFallbackService.updateSubcategory(
        id,
        payload
      );
      await ProductService.refreshFromBackend();
      return updated;
    }
  },

  async deleteSubcategory(id: string): Promise<void> {
    try {
      const res = await fetch(
        `/api/v1/admin/subcategories/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: this.buildAuthHeaders(),
        }
      );

      const { isStaticOrMissingApi } = await safeReadJson(res);
      if (isStaticOrMissingApi) {
        await LocalBackendFallbackService.deleteSubcategory(id);
      }
    } catch {
      await LocalBackendFallbackService.deleteSubcategory(id);
    }

    await ProductService.refreshFromBackend();
  },
};
