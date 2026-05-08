import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../context/store';
import { productBrandService, productService, resolveBackendUrl } from '../services/api';
import './Products.css';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';

/**
 * Página de productos (suplementos)
 */
export default function Products() {
  const syncAvailability = useCartStore((state) => state.syncAvailability);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsResponse, brandsResponse] = await Promise.all([
          productService.getAll(),
          productBrandService.getAll(),
        ]);
        
        // Manejar diferentes formatos de respuesta
        const productsList = productsResponse?.data || productsResponse || [];
        const brandsList = brandsResponse?.data || brandsResponse || [];
        const formattedProducts = Array.isArray(productsList) 
          ? productsList.map(product => ({
              ...product,
              image: product.image ? resolveBackendUrl(product.image) : '',
              rating: product.average_rating || 0,
              reviewCount: product.total_reviews || 0,
              originalPrice: product.price ? product.price * 1.2 : product.price
            }))
          : [];
        const formattedBrands = Array.isArray(brandsList)
          ? brandsList
              .filter((brand) => brand && brand.id != null)
              .map((brand) => ({
                id: String(brand.id),
                name: brand.name || '',
              }))
          : [];
        
        setProducts(formattedProducts);
        setBrands(formattedBrands);
        setFilteredProducts(formattedProducts);
        syncAvailability(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('No pudimos cargar los productos. Por favor intenta más tarde.');
        setProducts([]);
        setBrands([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [syncAvailability]);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = [...products];

    // Filtro por marca
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((product) => String(product.brand_id) === selectedBrand);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrand, sortBy]);

  return (
    <div className="products-page">
      {/* Header */}
      <motion.div
        className="products-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontFamily: FONT }}>
            <span style={{ display: 'block', width: 28, height: 1, background: GOLD }} />
            Aftercare
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', textTransform: 'none', color: '#fff', margin: '0 0 20px', maxWidth: '14ch' }}>
            Aftercare y productos pensados para cuidar bien cada pieza.
          </h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, maxWidth: 560 }}>
            Cuidados y suplementos esenciales para mantener el tatuaje limpio, hidratado y con mejor cicatrización.
          </p>
        </div>
      </motion.div>

      {/* Contenido */}
      <div className="container products-container">
        {/* Sidebar - Filtros */}
        <motion.aside
          className="products-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Marca */}
          <div className="filter-group">
            <h3>Marca</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="brand"
                  value="all"
                  checked={selectedBrand === 'all'}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                />
                <span>Todas</span>
              </label>
              {brands.map((brand) => (
                <label key={brand.id} className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    value={brand.id}
                    checked={selectedBrand === brand.id}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ordenar */}
          <div className="filter-group">
            <h3>Ordenar Por</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </motion.aside>

        {/* Grid de productos */}
        <motion.div
          className="products-grid-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="no-products">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="no-products">
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No hay productos que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Resultado de búsqueda */}
          {!loading && !error && (
            <p className="results-count">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
