import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Artists from './pages/Artists';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import './App.css';

/**
 * Componente principal de la aplicación
 * Maneja el enrutamiento y la estructura general
 */
function App() {
  return (
    <Router>
      <div className="app">
        {/* Header - Navegación */}
        <Header />

        {/* Carrito */}
        <Cart />

        {/* Contenido principal */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

/**
 * Página 404 - No encontrada
 */
function NotFound() {
  return (
    <motion.div
      className="not-found-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <a href="/" className="btn btn-primary">
          Volver al Inicio
        </a>
      </div>
    </motion.div>
  );
}

export default App;
