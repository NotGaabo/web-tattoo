import { create } from 'zustand';

const isBrowser = typeof window !== 'undefined';
const CART_STORAGE_KEY = 'web-tattoo-cart';
const AUTH_STORAGE_KEY = 'web-tattoo-auth';

function readStorage(key, fallback) {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key}:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key}:`, error);
  }
}

const storedCart = readStorage(CART_STORAGE_KEY, {
  items: [],
  total: 0,
});

const storedAuth = readStorage(AUTH_STORAGE_KEY, {
  user: null,
  isAuthenticated: false,
  token: null,
});

function persistCart(items) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const snapshot = { items, total };
  writeStorage(CART_STORAGE_KEY, snapshot);
  return snapshot;
}

export const useCartStore = create((set) => ({
  items: storedCart.items,
  total: storedCart.total,
  addItem: (product) =>
    set((state) => {
      const quantity = Number(product.quantity || 1);
      const existingItem = state.items.find((item) => item.id === product.id);

      const items = existingItem
        ? state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...state.items, { ...product, quantity }];

      return persistCart(items);
    }),
  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== productId);
      return persistCart(items);
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((item) => item.id !== productId);
        return persistCart(items);
      }

      const items = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );

      return persistCart(items);
    }),
  clearCart: () =>
    set(() => {
      const snapshot = { items: [], total: 0 };
      writeStorage(CART_STORAGE_KEY, snapshot);
      return snapshot;
    }),
}));

export const useAuthStore = create((set) => ({
  user: storedAuth.user,
  isAuthenticated: storedAuth.isAuthenticated,
  token: storedAuth.token,
  isCheckingSession: true,
  setSession: (user, token) =>
    set(() => {
      const nextState = {
        user,
        token,
        isAuthenticated: Boolean(user),
        isCheckingSession: false,
      };
      writeStorage(AUTH_STORAGE_KEY, {
        user: nextState.user,
        token: nextState.token,
        isAuthenticated: nextState.isAuthenticated,
      });
      return nextState;
    }),
  clearSession: () =>
    set(() => {
      const nextState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isCheckingSession: false,
      };
      writeStorage(AUTH_STORAGE_KEY, {
        user: null,
        token: null,
        isAuthenticated: false,
      });
      return nextState;
    }),
  setCheckingSession: (isCheckingSession) => set({ isCheckingSession }),
}));

export const useUIStore = create((set) => ({
  isLoading: false,
  notification: null,
  isCartOpen: false,
  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),
  closeCart: () => set({ isCartOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  showNotification: (message, type = 'info') =>
    set({
      notification: {
        id: Date.now(),
        message,
        type,
      },
    }),
  clearNotification: () => set({ notification: null }),
}));
