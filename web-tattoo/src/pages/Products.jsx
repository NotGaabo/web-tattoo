import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import './Products.css';

/**
 * Página de productos (suplementos)
 */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        
        // Manejar diferentes formatos de respuesta
        const productsList = response?.data || response || [];
        const formattedProducts = Array.isArray(productsList) 
          ? productsList.map(product => ({
              ...product,
              image: product.image || '',
              rating: product.rating || 4.5,
              reviewCount: product.reviewCount || 0,
              originalPrice: product.price ? product.price * 1.2 : product.price
          }))
          : [];
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('No pudimos cargar los productos. Por favor intenta más tarde.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por marca
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // featured - orden original
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrand, sortBy]);

  const brands = ['all', ...new Set(products.map(p => p.brand || 'Sin marca'))];

  return (
    <div className="products-page">
      {/* Header */}
          <motion.div
            className="products-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
        <div className="container">
          <h1>Tienda</h1>
          <p>Agujas, tintas, cuidados posteriores y herramientas esenciales para tus tatuajes</p>
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
              {brands.map(brand => (
                <label key={brand} className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  <span>{brand === 'all' ? 'Todas' : brand}</span>
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
              <option value="featured">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
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
