import axios from 'axios';

// En desarrollo (sin VITE_API_URL), usa el proxy de Vite
// En producción, puede especificarse VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || '/';

/**
 * Cliente HTTP configurado con la URL base de la API
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Servicio para gestionar productos (suplementos)
 */
export const productService = {
  /**
   * Obtiene la lista de todos los productos
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  /**
   * Obtiene un producto específico por ID
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  /**
   * Crea un nuevo producto (admin)
   */
  create: async (productData) => {
    try {
      const response = await apiClient.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
};

/**
 * Servicio para gestionar servicios de tatuaje
 */
export const serviceService = {
  /**
   * Obtiene la lista de servicios disponibles
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  /**
   * Obtiene un servicio específico
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }
};

/**
 * Servicio para gestionar tatuadores
 */
export const tattooArtistService = {
  /**
   * Obtiene la lista de tatuadores
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/artists');
      return response.data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      return [];
    }
  },

  /**
   * Obtiene el perfil de un tatuador
   */
  getProfile: async (id) => {
    try {
      const response = await apiClient.get(`/api/artists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      return null;
    }
  }
};

/**
 * Servicio para gestionar órdenes de compra
 */
export const orderService = {
  /**
   * Crea una nueva orden de compra
   */
  create: async (orderData) => {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Obtiene una orden específica
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  /**
   * Obtiene las órdenes del usuario
   */
  getUserOrders: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
};

/**
 * Servicio para gestionar reseñas y ratings
 */
export const reviewService = {
  /**
   * Obtiene las reseñas de un producto o servicio
   */
  getByItem: async (itemId, itemType = 'product') => {
    try {
      const response = await apiClient.get(`/api/reviews/${itemType}/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  /**
   * Crea una nueva reseña
   */
  create: async (reviewData) => {
    try {
      const response = await apiClient.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
};

/**
 * Servicio para gestionar citas de tatuaje
 */
export const appointmentService = {
  /**
   * Crea una nueva cita
   */
  create: async (appointmentData) => {
    try {
      const response = await apiClient.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Obtiene las citas disponibles de un tatuador
   */
  getAvailable: async (artistId) => {
    try {
      const response = await apiClient.get(`/api/artists/${artistId}/availability`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  }
};

export default apiClient;
