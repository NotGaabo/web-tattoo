import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sileo';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Artists from './pages/Artists';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Portal from './pages/Portal';
import Gestion from './pages/Gestion';
import Booking from './pages/Booking';
import ArtistDetail from './pages/ArtistDetail';
import Debug from './pages/Debug';
import { useAuthStore } from './context/store';
import { StudioMcpProvider } from './context/StudioMcpContext';
import odooAuthService from './services/odooAuth';
import 'sileo/styles.css';
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
  const isManagementArea = location.pathname.startsWith('/gestion');
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setCheckingSession = useAuthStore((state) => state.setCheckingSession);

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      setCheckingSession(true);

      try {
        const storedToken = useAuthStore.getState().token;
        const session = storedToken ? await odooAuthService.getSessionInfo(storedToken) : null;

        if (!isMounted) {
          return;
        }

        if (session) {
          setSession(session, session.token || storedToken);
        } else {
          clearSession();
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
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
    <StudioMcpProvider>
      <div className="app">
        {!isManagementArea && <Header />}
        {!isManagementArea && <Cart />}
        <Toaster
          position="bottom-right"
          theme="light"
          offset={{ bottom: isManagementArea ? 20 : 24, right: 20 }}
          options={{
            fill: '#1b1712',
            roundness: 18,
            styles: {
              title: 'tattoo-toast-title',
              description: 'tattoo-toast-description',
              badge: 'tattoo-toast-badge',
            },
          }}
        />

        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:artistId" element={<ArtistDetail />} />
              <Route path="/booking/:artistId" element={<Booking />} />
              <Route path="/appointment" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/debug" element={<Debug />} />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute allowedRoles={['portal']}>
                    <Portal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion/*"
                element={
                  <ProtectedRoute allowedRoles={['internal', 'admin']}>
                    <Gestion />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        {!isManagementArea && <Footer />}
      </div>
    </StudioMcpProvider>
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
