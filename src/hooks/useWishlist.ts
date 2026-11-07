import { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.service';

const WISHLIST_STORAGE_KEY = 'lumera_shop_wishlist_v1';

/**
 * useWishlist
 * Single Responsibility: Manages user's saved favorite product IDs.
 */
export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    StorageService.get<string[]>(WISHLIST_STORAGE_KEY, [])
  );

  useEffect(() => {
    StorageService.set(WISHLIST_STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string): boolean =>
    wishlistIds.includes(productId);

  return {
    wishlistIds,
    wishlistCount: wishlistIds.length,
    toggleWishlist,
    isWishlisted,
  };
}

