import { create } from 'zustand';

/**
 * Store global para manejar el carrito de compras
 * Utiliza Zustand para un estado predecible y reactivo
 */
export const useCartStore = create((set) => ({
  // Estado
  items: [],
  total: 0,

  // Acciones
  /**
   * Añade un producto al carrito
   * @param {Object} product - Producto a añadir
   */
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si el producto ya existe, incrementar cantidad
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        ),
        total: state.total + (product.price * (product.quantity || 1))
      };
    }

    // Añadir nuevo producto
    return {
      items: [...state.items, { ...product, quantity: product.quantity || 1 }],
      total: state.total + (product.price * (product.quantity || 1))
    };
  }),

  /**
   * Elimina un producto del carrito
   * @param {number} productId - ID del producto a eliminar
   */
  removeItem: (productId) => set((state) => {
    const item = state.items.find(i => i.id === productId);
    if (!item) return state;

    return {
      items: state.items.filter(item => item.id !== productId),
      total: state.total - (item.price * item.quantity)
    };
  }),

  /**
   * Actualiza la cantidad de un producto
   * @param {number} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   */
  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return state; // No permitir cantidades negativas
    }

    const item = state.items.find(i => i.id === productId);
    if (!item) return state;

    const difference = item.price * (quantity - item.quantity);

    return {
      items: state.items.map(i =>
        i.id === productId ? { ...i, quantity } : i
      ),
      total: state.total + difference
    };
  }),

  /**
   * Vacía el carrito
   */
  clearCart: () => set({
    items: [],
    total: 0
  })
}));

/**
 * Store global para autenticación y datos del usuario
 */
export const useAuthStore = create((set) => ({
  // Estado
  user: null,
  isAuthenticated: false,

  // Acciones
  /**
   * Simula el login de usuario
   * @param {Object} userInfo - Información del usuario
   */
  setUser: (userInfo) => set({
    user: userInfo,
    isAuthenticated: true
  }),

  /**
   * Logout del usuario
   */
  logout: () => set({
    user: null,
    isAuthenticated: false
  })
}));

/**
 * Store global para la UI (modales, notificaciones, etc.)
 */
export const useUIStore = create((set) => ({
  // Estado
  isLoading: false,
  notification: null,
  isCartOpen: false,

  /**
   * Abre/cierra el modal del carrito
   */
  toggleCart: () => set((state) => ({
    isCartOpen: !state.isCartOpen
  })),

  /**
   * Establece el estado de carga
   */
  setLoading: (loading) => set({
    isLoading: loading
  }),

  /**
   * Muestra una notificación
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, warning, info)
   */
  showNotification: (message, type = 'info') => set({
    notification: { message, type }
  }),

  /**
   * Limpia la notificación
   */
  clearNotification: () => set({
    notification: null
  })
}));
