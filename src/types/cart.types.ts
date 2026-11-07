import { Product, ProductColorVariant, ProductSizeOption } from './product.types';

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedColor: ProductColorVariant;
  selectedSize: ProductSizeOption;
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  total: number;
}

