import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartStore, useUIStore } from '../context/store';
import './ProductCard.css';

/**
 * Componente ProductCard - Tarjeta de producto reutilizable
 * @param {Object} product - Datos del producto
 * @param {number} product.id - ID único del producto
 * @param {string} product.name - Nombre del producto
 * @param {number} product.price - Precio del producto
 * @param {string} product.image - URL de la imagen
 */
export default function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const items = useCartStore(state => state.items);
  const showNotification = useUIStore(state => state.showNotification);
  const price = Number(product.price || 0);
  const availableQuantity = Number(product.quantity_sellable ?? product.quantity_available ?? 0);
  const cartQuantity = Number(items.find((item) => item.id === product.id)?.quantity || 0);
  const isOutOfStock = availableQuantity <= 0;
  const hasImageSrc =
    typeof product.image === 'string' &&
    (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('data:'));

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showNotification('Este producto no tiene stock disponible.', 'warning');
      return;
    }

    if (cartQuantity >= availableQuantity) {
      showNotification(`Solo hay ${availableQuantity} unidad(es) disponibles.`, 'warning');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      available_quantity: availableQuantity,
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
      <div className="product-image">
        {hasImageSrc ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-image-fallback">
            <span>{product.image || 'INK'}</span>
          </div>
        )}
        {product.discount && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
      </div>

      {/* Contenido */}
      <div className="product-info">
        <div className="product-copy">
          <h3 className="product-name">{product.name}</h3>
          <p className={`product-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {isOutOfStock ? 'Cantidad: 0' : `Cantidad: ${availableQuantity}`}
          </p>
        </div>

        {/* Precio y botón */}
        <div className="product-footer">
          <div className="price-section">
            <span className="price">${price.toFixed(2)}</span>
          </div>

          <motion.button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            disabled={isOutOfStock}
          >
            {isAdded ? (
              <span>✓ Añadido</span>
            ) : (
              <>
                <FiShoppingCart /> {isOutOfStock ? 'Sin stock' : 'Agregar'}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
