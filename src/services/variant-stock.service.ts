import {
  InventoryTrackingMode,
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../types/product.types';

/**
 * VariantStockService
 * Single Responsibility: Centralized, pure domain engine for evaluating and normalizing
 * product stock across all 3 inventory tracking modes:
 * - 'by_size': Stock per size/format
 * - 'by_color': Stock per color/shade
 * - 'by_color_and_size': Stock per (colorId x sizeLabel) combination
 */
export const VariantStockService = {
  buildVariantKey(colorId: string, sizeLabel: string): string {
    return `${colorId}__${sizeLabel}`;
  },

  getInventoryMode(product: Product): InventoryTrackingMode {
    return product.inventoryMode ?? 'by_color_and_size';
  },

  /**
   * Returns the exact available unit count for a specific (color, size) pair.
   */
  getVariantStock(
    product: Product,
    colorId: string,
    sizeLabel: string
  ): number {
    const mode = this.getInventoryMode(product);

    if (mode === 'by_color_and_size' && product.variantStockMatrix) {
      const key = this.buildVariantKey(colorId, sizeLabel);
      if (typeof product.variantStockMatrix[key] === 'number') {
        return Math.max(0, product.variantStockMatrix[key]);
      }
    }

    if (mode === 'by_color') {
      const color = product.colors.find((c) => c.id === colorId);
      if (typeof color?.stock === 'number') {
        return Math.max(0, color.stock);
      }
      return color?.inStock === false ? 0 : 5;
    }

    if (mode === 'by_size') {
      const size = product.sizes.find((s) => s.label === sizeLabel);
      if (typeof size?.stock === 'number') {
        return Math.max(0, size.stock);
      }
      return size?.inStock ? 5 : 0;
    }

    // Fallback if matrix isn't populated yet
    const size = product.sizes.find((s) => s.label === sizeLabel);
    if (typeof size?.stock === 'number') {
      return Math.max(0, size.stock);
    }
    return size?.inStock ? 5 : 0;
  },

  /**
   * Checks if a specific (colorId, sizeLabel) combination has available stock (> 0).
   */
  isVariantInStock(
    product: Product,
    colorId: string,
    sizeLabel: string
  ): boolean {
    return this.getVariantStock(product, colorId, sizeLabel) > 0;
  },

  /**
   * Returns total available units for a given color/shade across all sizes.
   */
  getColorTotalStock(product: Product, colorId: string): number {
    const mode = this.getInventoryMode(product);
    if (mode === 'by_color') {
      const color = product.colors.find((c) => c.id === colorId);
      return typeof color?.stock === 'number'
        ? Math.max(0, color.stock)
        : color?.inStock === false
        ? 0
        : 5;
    }

    return product.sizes.reduce(
      (sum, s) => sum + this.getVariantStock(product, colorId, s.label),
      0
    );
  },

  /**
   * Checks if a given color/shade has at least 1 unit available.
   */
  isColorInStock(product: Product, colorId: string): boolean {
    return this.getColorTotalStock(product, colorId) > 0;
  },

  /**
   * Returns total available units across the entire product.
   */
  getProductTotalStock(product: Product): number {
    const mode = this.getInventoryMode(product);
    if (mode === 'by_size') {
      return product.sizes.reduce(
        (sum, s) =>
          sum + (typeof s.stock === 'number' ? Math.max(0, s.stock) : s.inStock ? 5 : 0),
        0
      );
    }
    if (mode === 'by_color') {
      return product.colors.reduce(
        (sum, c) =>
          sum +
          (typeof c.stock === 'number'
            ? Math.max(0, c.stock)
            : c.inStock === false
            ? 0
            : 5),
        0
      );
    }
    return product.colors.reduce(
      (sum, c) => sum + this.getColorTotalStock(product, c.id),
      0
    );
  },

  /**
   * Returns true if the entire product is completely sold out (0 units across all variants).
   */
  isProductSoldOut(product: Product): boolean {
    return this.getProductTotalStock(product) <= 0;
  },

  /**
   * Returns the sizes array contextualized for a currently selected colorId,
   * so SizeSelector automatically displays which sizes are inStock or AGOTADO for that color.
   */
  getSizesForSelectedColor(
    product: Product,
    selectedColorId: string
  ): ProductSizeOption[] {
    return product.sizes.map((size) => {
      const stock = this.getVariantStock(product, selectedColorId, size.label);
      return {
        ...size,
        stock,
        inStock: stock > 0,
      };
    });
  },

  /**
   * Returns the colors array with computed `inStock` and `stock` flags.
   */
  getColorsWithStockStatus(product: Product): ProductColorVariant[] {
    return product.colors.map((color) => {
      const totalForColor = this.getColorTotalStock(product, color.id);
      return {
        ...color,
        stock:
          this.getInventoryMode(product) === 'by_color'
            ? color.stock ?? totalForColor
            : totalForColor,
        inStock: totalForColor > 0,
      };
    });
  },

  /**
   * Normalizes a Product record so `variantStockMatrix`, `sizes[].stock/inStock`,
   * `colors[].stock/inStock`, and COP price fields are always consistent.
   */
  normalizeProductInventory(product: Product): Product {
    const mode: InventoryTrackingMode =
      product.inventoryMode ?? 'by_color_and_size';
    const normalizedPrice =
      product.price < 1000 ? product.price * 1000 : product.price;
    const normalizedCompareAt =
      product.compareAtPrice && product.compareAtPrice < 1000
        ? product.compareAtPrice * 1000
        : product.compareAtPrice;

    const matrix: Record<string, number> = {
      ...(product.variantStockMatrix ?? {}),
    };

    // Ensure matrix has entries for every color x size pair
    for (const color of product.colors) {
      for (const size of product.sizes) {
        const key = this.buildVariantKey(color.id, size.label);
        if (typeof matrix[key] !== 'number') {
          if (mode === 'by_color') {
            matrix[key] =
              typeof color.stock === 'number'
                ? color.stock
                : color.inStock === false
                ? 0
                : 6;
          } else {
            matrix[key] =
              typeof size.stock === 'number'
                ? size.stock
                : size.inStock
                ? 6
                : 0;
          }
        }
      }
    }

    const draft: Product = {
      ...product,
      price: normalizedPrice,
      compareAtPrice: normalizedCompareAt,
      costPriceCop:
        product.costPriceCop ?? Math.round(normalizedPrice * 0.42),
      taxRatePct: product.taxRatePct ?? 19,
      isVisible: product.isVisible !== false,
      inventoryMode: mode,
      variantStockMatrix: matrix,
    };

    const normalizedSizes: ProductSizeOption[] = draft.sizes.map((size) => {
      if (mode === 'by_size') {
        const stockVal =
          typeof size.stock === 'number'
            ? Math.max(0, size.stock)
            : size.inStock
            ? 6
            : 0;
        // Sync matrix for this size across colors
        for (const color of draft.colors) {
          matrix[this.buildVariantKey(color.id, size.label)] = stockVal;
        }
        return {
          ...size,
          stock: stockVal,
          inStock: stockVal > 0,
        };
      }

      // In 'by_color' or 'by_color_and_size', size is inStock if any color has > 0 for this size
      const totalForSize = draft.colors.reduce((sum, color) => {
        const key = this.buildVariantKey(color.id, size.label);
        return sum + Math.max(0, matrix[key] ?? 0);
      }, 0);

      return {
        ...size,
        stock: totalForSize,
        inStock: totalForSize > 0,
      };
    });

    const normalizedColors: ProductColorVariant[] = draft.colors.map(
      (color) => {
        if (mode === 'by_color') {
          const stockVal =
            typeof color.stock === 'number'
              ? Math.max(0, color.stock)
              : color.inStock === false
              ? 0
              : 8;
          for (const size of draft.sizes) {
            matrix[this.buildVariantKey(color.id, size.label)] = stockVal;
          }
          return {
            ...color,
            stock: stockVal,
            inStock: stockVal > 0,
          };
        }

        const totalForColor = draft.sizes.reduce((sum, size) => {
          const key = this.buildVariantKey(color.id, size.label);
          return sum + Math.max(0, matrix[key] ?? 0);
        }, 0);

        return {
          ...color,
          stock: totalForColor,
          inStock: totalForColor > 0,
        };
      }
    );

    return {
      ...draft,
      colors: normalizedColors,
      sizes: normalizedSizes,
      variantStockMatrix: matrix,
    };
  },
};
