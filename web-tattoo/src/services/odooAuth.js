const ODOO_BASE_URL = (import.meta.env.VITE_ODOO_URL || '').replace(/\/$/, '');
const ODOO_DB = import.meta.env.VITE_ODOO_DB || '';

function resolveOdooUrl(path) {
  return ODOO_BASE_URL ? `${ODOO_BASE_URL}${path}` : path;
}

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractCsrfToken(html) {
  const match = html.match(/name=["']csrf_token["']\s+value=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

function extractSignupError(html) {
  const match = html.match(
    /(?:alert-danger|oe_login_buttons|text-danger)[^>]*>([\s\S]*?)<\/(?:div|p|span)>/i,
  );
  return match ? stripHtml(match[1]) : '';
}

function normalizeSession(sessionInfo = {}) {
  if (!sessionInfo.uid) {
    return null;
  }

  const login = sessionInfo.username || sessionInfo.login || '';
  const partnerDisplayName =
    sessionInfo.partner_display_name ||
    sessionInfo.name ||
    login ||
    'Cliente Portal';

  return {
    id: sessionInfo.uid,
    name: partnerDisplayName,
    login,
    email: sessionInfo.email || login,
    partnerId: sessionInfo.partner_id || null,
    isPortal: !sessionInfo.is_system,
    raw: sessionInfo,
  };
}

async function jsonRpc(path, params = {}) {
  const response = await fetch(resolveOdooUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params,
      id: Date.now(),
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error('No se pudo comunicar con Odoo.');
  }

  if (payload?.error?.data?.message || payload?.error?.message) {
    throw new Error(payload.error.data?.message || payload.error.message);
  }

  return payload?.result;
}

export const odooAuthService = {
  async getSessionInfo() {
    const sessionInfo = await jsonRpc('/web/session/get_session_info');
    return normalizeSession(sessionInfo);
  },

  async login({ login, password }) {
    const sessionInfo = await jsonRpc('/web/session/authenticate', {
      db: ODOO_DB,
      login,
      password,
    });

    const user = normalizeSession(sessionInfo);

    if (!user) {
      throw new Error('No se pudo iniciar sesión con las credenciales enviadas.');
    }

    return user;
  },

  async register({ name, email, password, phone }) {
    const signupPage = await fetch(resolveOdooUrl('/web/signup'), {
      method: 'GET',
      credentials: 'include',
    });

    const signupHtml = await signupPage.text();
    const csrfToken = extractCsrfToken(signupHtml);

    if (!csrfToken) {
      throw new Error(
        'El registro público no está habilitado en Odoo. Activa portal/auth_signup para crear usuarios portal.',
      );
    }

    const formData = new URLSearchParams();
    formData.set('csrf_token', csrfToken);
    formData.set('name', name);
    formData.set('login', email);
    formData.set('password', password);
    formData.set('confirm_password', password);
    formData.set('redirect', '/web');

    if (phone) {
      formData.set('phone', phone);
    }

    if (ODOO_DB) {
      formData.set('db', ODOO_DB);
    }

    const response = await fetch(resolveOdooUrl('/web/signup'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    const responseHtml = await response.text();
    const signupError = extractSignupError(responseHtml);

    if (signupError) {
      throw new Error(signupError);
    }

    return this.login({
      login: email,
      password,
    });
  },

  async logout() {
    await jsonRpc('/web/session/destroy');
  },
};

export default odooAuthService;
