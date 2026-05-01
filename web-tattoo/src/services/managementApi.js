import apiClient from './api';

function unwrap(payload) {
  const data = payload?.data;
  return data && Object.prototype.hasOwnProperty.call(data, 'data') ? data.data : data;
}

async function request(method, url, body = null) {
  const response = await apiClient.request({
    method,
    url,
    data: body,
  });
  return unwrap(response);
}

function listResponse(value) {
  return Array.isArray(value) ? value : [];
}

function singleResponse(value) {
  return value && typeof value === 'object' ? value : null;
}

export const managementApi = {
  async getDashboard() {
    const [artists, products, gallery, services] = await Promise.all([
      this.listArtists(),
      this.listProducts(),
      this.listGallery(),
      this.listServices(),
    ]);

    return {
      artists,
      products,
      gallery,
      services,
    };
  },

  async listArtists() {
    return listResponse(await request('GET', '/api/artists'));
  },

  async createArtist(payload) {
    return singleResponse(await request('POST', '/api/artists', payload));
  },

  async updateArtist(id, payload) {
    return singleResponse(await request('PUT', `/api/artists/${id}`, payload));
  },

  async deleteArtist(id) {
    return request('DELETE', `/api/artists/${id}`);
  },

  async listProducts() {
    return listResponse(await request('GET', '/api/products'));
  },

  async createProduct(payload) {
    return singleResponse(await request('POST', '/api/products', payload));
  },

  async updateProduct(id, payload) {
    return singleResponse(await request('PUT', `/api/products/${id}`, payload));
  },

  async deleteProduct(id) {
    return request('DELETE', `/api/products/${id}`);
  },

  async listGallery(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.artist_id) {
      searchParams.set('artist_id', params.artist_id);
    }
    if (params.tattoo_type) {
      searchParams.set('tattoo_type', params.tattoo_type);
    }

    const query = searchParams.toString();
    const endpoint = query ? `/api/gallery?${query}` : '/api/gallery';
    return listResponse(await request('GET', endpoint));
  },

  async createGalleryItem(payload) {
    return singleResponse(await request('POST', '/api/gallery', payload));
  },

  async updateGalleryItem(id, payload) {
    return singleResponse(await request('PUT', `/api/gallery/${id}`, payload));
  },

  async deleteGalleryItem(id) {
    return request('DELETE', `/api/gallery/${id}`);
  },

  async listServices() {
    return listResponse(await request('GET', '/api/services'));
  },

  async createService(payload) {
    return singleResponse(await request('POST', '/api/services', payload));
  },

  async updateService(id, payload) {
    return singleResponse(await request('PUT', `/api/services/${id}`, payload));
  },

  async deleteService(id) {
    return request('DELETE', `/api/services/${id}`);
  },
};

export default managementApi;
