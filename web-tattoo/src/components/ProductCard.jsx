import React, { useState } from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartStore } from '../context/store';
import './ProductCard.css';

/**
 * Componente ProductCard - Tarjeta de producto reutilizable
 * @param {Object} product - Datos del producto
 * @param {number} product.id - ID único del producto
 * @param {string} product.name - Nombre del producto
 * @param {string} product.brand - Marca del producto
 * @param {number} product.price - Precio del producto
 * @param {string} product.description - Descripción del producto
 * @param {string} product.image - URL de la imagen
 * @param {number} product.rating - Rating promedio (0-5)
 * @param {number} product.reviewCount - Cantidad de reseñas
 */
export default function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    // Feedback visual
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen del producto */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
      </div>

      {/* Contenido */}
      <div className="product-info">
        {/* Marca y nombre */}
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-text">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Descripción */}
        <p className="product-description">{product.description}</p>

        {/* Precio y botón */}
        <div className="product-footer">
          <div className="price-section">
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
            <span className="price">${product.price.toFixed(2)}</span>
          </div>

          <motion.button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
          >
            {isAdded ? (
              <span>✓ Añadido</span>
            ) : (
              <>
                <FiShoppingCart /> Agregar
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
