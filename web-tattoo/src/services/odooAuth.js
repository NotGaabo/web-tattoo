const API_URL = import.meta.env.VITE_API_URL || '';

function normalizeSession(data = {}) {
  return {
    id: data.id || null,
    name: data.name || '',
    email: data.email || '',
    token: data.token || '',
    role: data.role || 'portal',
    is_admin: data.is_admin || false,
    is_portal: data.is_portal || true,
  };
}

async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Call failed: ${endpoint}`, error);
    throw error;
  }
}

export const odooAuthService = {
  async login({ login, password }) {
    try {
      const response = await apiCall('/api/auth/login', 'POST', {
        email: login,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const user = normalizeSession(response.data);
      return user;
    } catch (error) {
      throw new Error(error.message || 'No se pudo iniciar sesión.');
    }
  },

  async register({ name, email, password, phone }) {
    try {
      const response = await apiCall('/api/auth/register', 'POST', {
        name,
        email,
        password,
        phone,
      });

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const user = normalizeSession(response.data);
      return user;
    } catch (error) {
      throw new Error(error.message || 'No se pudo completar el registro.');
    }
  },

  async getSessionInfo(token) {
    try {
      const response = await apiCall('/api/auth/me', 'GET', null, token);

      if (!response.success) {
        throw new Error(response.message || 'Session not valid');
      }

      return normalizeSession(response.data);
    } catch (error) {
      return null;
    }
  },

  async logout() {
    try {
      await apiCall('/api/auth/logout', 'POST');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
};

export default odooAuthService;
