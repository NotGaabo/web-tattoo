const API_URL = import.meta.env.VITE_API_URL || '';

function normalizeSession(data = {}) {
  const role = data.role || (data.is_portal === false ? 'internal' : 'portal');
  const isAdmin = role === 'admin' || Boolean(data.is_admin);
  const isPortal = role === 'portal';

  return {
    id: data.id || null,
    name: data.name || '',
    email: data.email || '',
    token: data.token || '',
    role,
    user_type: data.user_type || (isPortal ? 'portal' : 'internal'),
    is_admin: isAdmin,
    is_portal: isPortal,
  };
}

export function getSessionHomePath(sessionOrRole) {
  const role = typeof sessionOrRole === 'string' ? sessionOrRole : sessionOrRole?.role;
  return role === 'portal' ? '/portal' : '/gestion';
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
