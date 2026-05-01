import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import { getSessionHomePath } from '../services/odooAuth';

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingSession = useAuthStore((state) => state.isCheckingSession);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (isCheckingSession) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="page-card page-card-center">
            <span className="eyebrow">Sincronizando portal</span>
            <h1>Validando tu acceso</h1>
            <p>Estamos comprobando tu sesion con Odoo para llevarte al portal correcto.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={getSessionHomePath(user)} replace />;
  }

  return children;
}
