import { useEffect, useMemo, useState } from 'react';
import { StorageService } from '../services/storage.service';
import { VariantStockService } from '../services/variant-stock.service';
import { CartItem, CartSummary } from '../types/cart.types';
import {
  Product,
  ProductColorVariant,
  ProductSizeOption,
} from '../types/product.types';

const CART_STORAGE_KEY = 'lumera_shop_cart_v2';
const FREE_SHIPPING_THRESHOLD = 250000;
const STANDARD_SHIPPING_COST = 15000;

/**
 * useCart
 * Single Responsibility: Manages shopping bag items, variant combinations, stock caps, and COP totals.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() =>
    StorageService.get<CartItem[]>(CART_STORAGE_KEY, [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedNotification, setLastAddedNotification] = useState<string | null>(
    null
  );

  useEffect(() => {
    StorageService.set(CART_STORAGE_KEY, items);
  }, [items]);

  const addItem = (
    product: Product,
    selectedColor: ProductColorVariant,
    selectedSize: ProductSizeOption,
    quantity = 1
  ) => {
    const maxStock = VariantStockService.getVariantStock(
      product,
      selectedColor.id,
      selectedSize.label
    );

    if (maxStock <= 0) {
      return;
    }

    const cartItemId = `${product.id}__${selectedColor.id}__${selectedSize.label}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.cartItemId === cartItemId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const nextQty = Math.min(
          maxStock,
          updated[existingIndex].quantity + quantity
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          product,
          quantity: nextQty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          selectedColor,
          selectedSize,
          quantity: Math.min(maxStock, quantity),
        },
      ];
    });

    setLastAddedNotification(
      `${product.name} (${selectedColor.name} · ${selectedSize.label})`
    );
    setTimeout(() => {
      setLastAddedNotification(null);
    }, 3200);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const maxStock = VariantStockService.getVariantStock(
          item.product,
          item.selectedColor.id,
          item.selectedSize.label
        );
        return {
          ...item,
          quantity: Math.min(Math.max(1, maxStock), newQuantity),
        };
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const summary: CartSummary = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => {
      const unitCop =
        item.product.price < 1000
          ? item.product.price * 1000
          : item.product.price;
      return acc + unitCop * item.quantity;
    }, 0);
    const remainingForFreeShipping = Math.max(
      0,
      FREE_SHIPPING_THRESHOLD - subtotal
    );
    const shippingCost =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_COST;

    return {
      totalItems,
      subtotal,
      shippingCost,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      remainingForFreeShipping,
      total: subtotal + shippingCost,
    };
  }, [items]);

  return {
    items,
    summary,
    isCartOpen,
    lastAddedNotification,
    setIsCartOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
