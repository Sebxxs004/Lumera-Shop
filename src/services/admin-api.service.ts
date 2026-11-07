import {
  AdminCatalogResponse,
  AdminUserProfile,
  LoginResponsePayload,
} from '../types/admin.types';
import { Product, SubcategoryDefinition } from '../types/product.types';
import { ProductService } from './product.service';

const TOKEN_STORAGE_KEY = 'lumera_atelier_jwt_v1';

/**
 * AdminApiService
 * Single Responsibility: Client-side HTTP gateway for authenticated admin operations.
 * Attaches cryptographically signed JWT tokens (`Authorization: Bearer <token>`)
 * to all modification requests and refreshes the public storefront state upon mutation.
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
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as LoginResponsePayload & {
      error?: string;
    };

    if (!res.ok || !data.token) {
      throw new Error(data.error ?? 'Error al iniciar sesión.');
    }

    this.setStoredToken(data.token);
    return data;
  },

  async verifySession(): Promise<AdminUserProfile | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/v1/auth/me', {
        method: 'GET',
        headers: this.buildAuthHeaders(),
      });
      if (!res.ok) {
        this.setStoredToken(null);
        return null;
      }
      const data = (await res.json()) as { user: AdminUserProfile };
      return data.user;
    } catch {
      return null;
    }
  },

  logout(): void {
    this.setStoredToken(null);
  },

  async fetchAdminCatalog(): Promise<AdminCatalogResponse> {
    const res = await fetch('/api/v1/admin/catalog', {
      method: 'GET',
      headers: this.buildAuthHeaders(),
    });
    const data = (await res.json()) as AdminCatalogResponse & {
      error?: string;
    };
    if (!res.ok) {
      throw new Error(data.error ?? 'No se pudo cargar el catálogo de administración.');
    }
    return data;
  },

  async uploadImageFile(file: File): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });

    const res = await fetch('/api/v1/admin/uploads', {
      method: 'POST',
      headers: this.buildAuthHeaders(),
      body: JSON.stringify({
        dataUrl,
        fileName: file.name,
      }),
    });

    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.error ?? 'Error al subir la imagen al servidor.');
    }

    return data.url;
  },

  async createProduct(payload: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/v1/admin/products', {
      method: 'POST',
      headers: this.buildAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { product?: Product; error?: string };
    if (!res.ok || !data.product) {
      throw new Error(data.error ?? 'Error al crear el producto.');
    }

    await ProductService.refreshFromBackend();
    return data.product;
  },

  async updateProduct(
    productId: string,
    payload: Partial<Product>
  ): Promise<Product> {
    const res = await fetch(
      `/api/v1/admin/products/${encodeURIComponent(productId)}`,
      {
        method: 'PUT',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    const data = (await res.json()) as { product?: Product; error?: string };
    if (!res.ok || !data.product) {
      throw new Error(data.error ?? 'Error al actualizar el producto.');
    }

    await ProductService.refreshFromBackend();
    return data.product;
  },

  async toggleProductVisibility(
    productId: string,
    isVisible: boolean
  ): Promise<Product> {
    const res = await fetch(
      `/api/v1/admin/products/${encodeURIComponent(productId)}/visibility`,
      {
        method: 'PATCH',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify({ isVisible }),
      }
    );

    const data = (await res.json()) as { product?: Product; error?: string };
    if (!res.ok || !data.product) {
      throw new Error(data.error ?? 'Error al cambiar visibilidad.');
    }

    await ProductService.refreshFromBackend();
    return data.product;
  },

  async updateVariantStock(params: {
    productId: string;
    colorId?: string;
    sizeLabel?: string;
    stock: number;
  }): Promise<Product> {
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

    const data = (await res.json()) as { product?: Product; error?: string };
    if (!res.ok || !data.product) {
      throw new Error(data.error ?? 'Error al actualizar stock.');
    }

    await ProductService.refreshFromBackend();
    return data.product;
  },

  async deleteProduct(productId: string): Promise<void> {
    const res = await fetch(
      `/api/v1/admin/products/${encodeURIComponent(productId)}`,
      {
        method: 'DELETE',
        headers: this.buildAuthHeaders(),
      }
    );

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? 'Error al eliminar producto.');
    }

    await ProductService.refreshFromBackend();
  },

  async createSubcategory(
    payload: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    const res = await fetch('/api/v1/admin/subcategories', {
      method: 'POST',
      headers: this.buildAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as {
      subcategory?: SubcategoryDefinition;
      error?: string;
    };
    if (!res.ok || !data.subcategory) {
      throw new Error(data.error ?? 'Error al crear subcategoría.');
    }

    await ProductService.refreshFromBackend();
    return data.subcategory;
  },

  async updateSubcategory(
    id: string,
    payload: Partial<SubcategoryDefinition>
  ): Promise<SubcategoryDefinition> {
    const res = await fetch(
      `/api/v1/admin/subcategories/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    const data = (await res.json()) as {
      subcategory?: SubcategoryDefinition;
      error?: string;
    };
    if (!res.ok || !data.subcategory) {
      throw new Error(data.error ?? 'Error al actualizar subcategoría.');
    }

    await ProductService.refreshFromBackend();
    return data.subcategory;
  },

  async deleteSubcategory(id: string): Promise<void> {
    const res = await fetch(
      `/api/v1/admin/subcategories/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: this.buildAuthHeaders(),
      }
    );

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? 'Error al eliminar subcategoría.');
    }

    await ProductService.refreshFromBackend();
  },
};
