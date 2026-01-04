import type { CartItem } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  selectedIds: string[];
  isLoading: boolean;
  isInitialized: boolean;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string | null, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  updateVariant: (itemId: string, variantId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleSelect: (itemId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  getSelectedItems: () => CartItem[];
  getTotalItems: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedIds: [],
      isLoading: false,
      isInitialized: false,

      fetchCart: async () => {
        const user = localStorage.getItem('user');
        if (!user) {
          set({ items: [], isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const userData = JSON.parse(user);
          const response = await fetch(`/api/cart?userId=${userData.id}`);
          if (response.ok) {
            const data = await response.json();
            set({ items: data.items, isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId, variantId, quantity = 1) => {
        const user = localStorage.getItem('user');
        if (!user) return false;

        set({ isLoading: true });
        try {
          const userData = JSON.parse(user);
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userData.id,
              productId,
              variantId,
              quantity,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            set({ items: data.items });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const previousItems = get().items;
        set({
          items: previousItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        });

        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) set({ items: previousItems });
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ items: previousItems });
        }
      },

      updateVariant: async (itemId, variantId) => {
        const previousItems = get().items;
        const item = previousItems.find((i) => i.id === itemId);
        if (!item) return;

        const newVariant = item.product.variants.find((v) => v.id === variantId);
        if (!newVariant) return;

        set({
          items: previousItems.map((i) =>
            i.id === itemId ? { ...i, variantId, variant: newVariant } : i,
          ),
        });

        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantId }),
          });

          if (!response.ok) set({ items: previousItems });
        } catch (error) {
          console.error('Failed to update variant:', error);
          set({ items: previousItems });
        }
      },

      removeItem: async (itemId) => {
        const previousItems = get().items;
        set({
          items: previousItems.filter((item) => item.id !== itemId),
          selectedIds: get().selectedIds.filter((id) => id !== itemId),
        });

        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
          });

          if (!response.ok) set({ items: previousItems });
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ items: previousItems });
        }
      },

      clearCart: async () => {
        const user = localStorage.getItem('user');
        if (!user) return;

        const previousItems = get().items;
        set({ items: [], selectedIds: [] });

        try {
          const userData = JSON.parse(user);
          const response = await fetch(`/api/cart?userId=${userData.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) set({ items: previousItems });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ items: previousItems });
        }
      },

      toggleSelect: (itemId) => {
        const selectedIds = get().selectedIds;
        if (selectedIds.includes(itemId))
          set({ selectedIds: selectedIds.filter((id) => id !== itemId) });
        else set({ selectedIds: [...selectedIds, itemId] });
      },

      selectAll: () => {
        set({ selectedIds: get().items.map((item) => item.id) });
      },

      deselectAll: () => {
        set({ selectedIds: [] });
      },

      getSelectedItems: () => {
        const { items, selectedIds } = get();
        return items.filter((item) => selectedIds.includes(item.id));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ selectedIds: state.selectedIds }),
    },
  ),
);
