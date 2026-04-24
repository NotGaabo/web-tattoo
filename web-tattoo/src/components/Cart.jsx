import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../context/store';
import './Cart.css';

/**
 * Componente Cart - Modal del carrito de compras
 */
export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isCartOpen, toggleCart } = useUIStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Panel del carrito */}
          <motion.div
            className="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className="cart-header">
              <h2>Tu Carrito</h2>
              <button className="close-btn" onClick={toggleCart} aria-label="Cerrar">
                <FiX size={28} />
              </button>
            </div>

            {/* Contenido */}
            <div className="cart-content">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p>Tu carrito está vacío</p>
                  <p>Explora nuestros productos</p>
                </div>
              ) : (
                <div className="cart-items">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {/* Imagen */}
                      <img src={item.image} alt={item.name} className="item-image" />

                      {/* Info */}
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Cantidad */}
                      <div className="quantity-control">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Eliminar */}
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar producto"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-footer">
                {/* Total */}
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                {/* Botones */}
                <div className="cart-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={clearCart}
                  >
                    Vaciar carrito
                  </button>
                  <Link
                    to="/checkout"
                    className="btn btn-primary"
                    onClick={toggleCart}
                  >
                    Ir a Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
