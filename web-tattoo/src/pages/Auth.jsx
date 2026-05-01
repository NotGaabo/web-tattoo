import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiUser, FiUsers } from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../context/store';
import odooAuthService, { getSessionHomePath } from '../services/odooAuth';
import './Auth.css';

function useModeFromQuery(search) {
  return useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('mode') === 'register' ? 'register' : 'login';
  }, [search]);
}

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultMode = useModeFromQuery(location.search);
  const setSession = useAuthStore((state) => state.setSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingSession = useAuthStore((state) => state.isCheckingSession);
  const user = useAuthStore((state) => state.user);
  const showNotification = useUIStore((state) => state.showNotification);

  const [mode, setMode] = useState(defaultMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const secretaryUrl = import.meta.env.VITE_SECRETARY_URL || '/web';

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated && user) {
      navigate(getSessionHomePath(user), { replace: true });
    }
  }, [isAuthenticated, isCheckingSession, navigate, user]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginData.email || !loginData.password) {
      showNotification('Escribe tu correo y tu contrasena para entrar.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await odooAuthService.login({
        login: loginData.email,
        password: loginData.password,
      });
      setSession(session, session.token);
      showNotification('Sesion iniciada. Ya te llevamos a tu area.', 'success');
      navigate(getSessionHomePath(session), { replace: true });
    } catch (error) {
      showNotification(error.message || 'No se pudo iniciar sesion.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registerData.name || !registerData.email || !registerData.password) {
      showNotification('Completa nombre, correo y contrasena para crear tu portal.', 'warning');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showNotification('Las contrasenas no coinciden.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await odooAuthService.register(registerData);
      setSession(session, session.token);
      showNotification('Registro listo. Tu usuario se creo como portal.', 'success');
      navigate(getSessionHomePath(session), { replace: true });
    } catch (error) {
      showNotification(error.message || 'No se pudo completar el registro portal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="container auth-grid">
          <motion.div
            className="auth-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow">Portal de clientes</span>
            <h1>Entra a tu espacio y deja que secretaria gestione la magia.</h1>
            <p>
              El registro usa el acceso publico de Odoo para crear clientes tipo portal, sin tocar
              el backend base. Desde ahi pueden revisar cotizaciones, citas y seguimiento.
            </p>

            <div className="auth-pill-list">
              <div className="auth-pill">
                <FiShield />
                <span>Registro portal con sesion conectada a Odoo</span>
              </div>
              <div className="auth-pill">
                <FiUser />
                <span>Acceso para clientes a citas, pedidos y cotizaciones</span>
              </div>
              <div className="auth-pill">
                <FiUsers />
                <span>Area secretaria separada para aprobacion interna</span>
              </div>
            </div>

            <div className="auth-side-actions">
              <a href={secretaryUrl} className="btn btn-secondary">
                Ir al area secretaria <FiArrowRight />
              </a>
              <Link to="/services" className="btn btn-ghost">
                Ver estilos y reservas
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="auth-card"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="auth-switch">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => setMode('register')}
              >
                Registro
              </button>
            </div>

            {mode === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Correo</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="cliente@inkhouse.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contrasena</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Tu acceso del portal"
                    disabled={isSubmitting}
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar al portal'}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Nombre del cliente"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="cliente@inkhouse.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefono</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="+591 ..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-row auth-form-row">
                  <div className="form-group">
                    <label htmlFor="registerPassword">Contrasena</label>
                    <input
                      id="registerPassword"
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Crea tu clave"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Repite la clave"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando portal...' : 'Crear cuenta portal'}
                </button>

                <p className="auth-note">
                  Al registrarte, el usuario queda pensado para portal y el equipo interno gestiona la
                  parte administrativa desde el area secretaria.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
