import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import NotificationCenter from './components/NotificationCenter';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Artists from './pages/Artists';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Portal from './pages/Portal';
import { useAuthStore } from './context/store';
import odooAuthService from './services/odooAuth';
import './App.css';

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

function AppLayout() {
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setCheckingSession = useAuthStore((state) => state.setCheckingSession);

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      setCheckingSession(true);

      try {
        const session = await odooAuthService.getSessionInfo();

        if (!isMounted) {
          return;
        }

        if (session) {
          setSession(session);
        } else {
          clearSession();
        }
      } catch (error) {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    }

    syncSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, setCheckingSession, setSession]);

  return (
    <div className="app">
      <Header />
      <Cart />
      <NotificationCenter />

      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container">
        <div className="page-card page-card-center">
          <span className="eyebrow">404</span>
          <h1>La aguja no encontro esta ruta.</h1>
          <p>Volvamos al inicio para seguir navegando el estudio.</p>
          <a href="/" className="btn btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
