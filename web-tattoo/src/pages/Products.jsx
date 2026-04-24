import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import './Products.css';

/**
 * Página de productos (suplementos)
 */
export default function Products() {
  // Datos de ejemplo - normalmente vendría de la API
  const mockProducts = [
    {
      id: 1,
      name: 'Cream Aftercare Premium',
      brand: 'TattooLux',
      price: 24.99,
      originalPrice: 29.99,
      description: 'Crema premium para cuidado posterior al tatuaje. Hidratación profunda y protección.',
      image: '🧴',
      rating: 4.8,
      reviewCount: 156,
      discount: 15
    },
    {
      id: 2,
      name: 'Protective Balm',
      brand: 'SkinShield',
      price: 19.99,
      description: 'Bálsamo protector con ingredientes naturales para cicatrización óptima.',
      image: '💚',
      rating: 4.6,
      reviewCount: 98
    },
    {
      id: 3,
      name: 'Healing Lotion',
      brand: 'InkCare',
      price: 21.99,
      description: 'Loción curativa especialmente formulada para tatuajes nuevos.',
      image: '🧴',
      rating: 4.7,
      reviewCount: 124
    },
    {
      id: 4,
      name: 'Anti-Scam Serum',
      brand: 'TattooLux',
      price: 32.99,
      description: 'Suero antiscarificante de última generación para mejores resultados.',
      image: '💎',
      rating: 4.9,
      reviewCount: 87,
      discount: 10
    },
    {
      id: 5,
      name: 'Vitamin E Oil',
      brand: 'NaturalCare',
      price: 15.99,
      description: 'Aceite de vitamina E puro para elasticidad y salud de la piel.',
      image: '🫒',
      rating: 4.5,
      reviewCount: 203
    },
    {
      id: 6,
      name: 'Ink Booster',
      brand: 'ColorMax',
      price: 28.99,
      description: 'Suplemento que intensifica y mantiene los colores de tu tatuaje.',
      image: '⭐',
      rating: 4.8,
      reviewCount: 145
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filtrar y ordenar productos
  useEffect(() => {
    let products = mockProducts;

    // Filtro por marca
    if (selectedBrand !== 'all') {
      products = products.filter(p => p.brand === selectedBrand);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // featured - orden original
        break;
    }

    setFilteredProducts(products);
  }, [selectedBrand, sortBy]);

  const brands = ['all', ...new Set(mockProducts.map(p => p.brand))];

  return (
    <div className="products-page">
      {/* Header */}
      <motion.div
        className="products-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <h1>Nuestros Productos</h1>
          <p>Cuidados y suplementos esenciales para tus tatuajes</p>
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
          {filteredProducts.length === 0 ? (
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
          <p className="results-count">
            Mostrando {filteredProducts.length} de {mockProducts.length} productos
          </p>
        </motion.div>
      </div>
    </div>
  );
}
