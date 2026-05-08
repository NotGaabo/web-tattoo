import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuthStore, useCartStore, useUIStore } from '../context/store';
import { orderService, productService } from '../services/api';
import './Checkout.css';

/**
 * Página de Checkout - Proceso de compra
 */
export default function Checkout() {
  const { items, total, clearCart, syncAvailability } = useCartStore();
  const user = useAuthStore(state => state.user);
  const showNotification = useUIStore(state => state.showNotification);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const refreshedProducts = await Promise.all(
        items.map(async (item) => {
          const response = await productService.getById(item.id);
          return response?.data || response || null;
        }),
      );
      const validProducts = refreshedProducts.filter(Boolean);
      syncAvailability(validProducts);

      const insufficientItem = items.find((item) => {
        const freshProduct = validProducts.find((product) => Number(product.id) === Number(item.id));
        const availableQuantity = Number(
          freshProduct?.quantity_sellable ?? freshProduct?.quantity_available ?? 0,
        );
        return item.quantity > availableQuantity;
      });

      if (insufficientItem) {
        const freshProduct = validProducts.find((product) => Number(product.id) === Number(insufficientItem.id));
        const availableQuantity = Number(
          freshProduct?.quantity_sellable ?? freshProduct?.quantity_available ?? 0,
        );
        showNotification(
          `Actualizamos el stock de ${insufficientItem.name}. Ahora solo hay ${availableQuantity} unidad(es) disponibles.`,
          'warning',
        );
        return;
      }

      const created = await orderService.create({
        items,
        notes,
      });
      setCreatedOrder(created?.data || created || null);
      if (created?.whatsapp_url) {
        window.open(created.whatsapp_url, '_blank', 'noopener,noreferrer');
      }
      showNotification('Orden creada y lista para confirmar por WhatsApp.', 'success');
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || 'No se pudo crear la orden.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el carrito está vacío y no hay orden, mostrar mensaje
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page empty-cart">
        <div className="container">
          <div className="empty-message">
            <h1>Carrito Vacío</h1>
            <p>No hay productos en tu carrito</p>
            <Link to="/products" className="btn btn-primary">
              <FiArrowLeft /> Volver a Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si la orden fue colocada, mostrar confirmación
  if (orderPlaced) {
    return (
      <div className="checkout-page order-confirmation">
        <div className="container">
          <motion.div
            className="confirmation-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-icon">
              <FiCheck size={48} />
            </div>
            <h1>¡Orden Confirmada!</h1>
            <p>La orden fue guardada y te abrimos WhatsApp para confirmar los detalles.</p>

            {/* Detalles de la orden */}
            <div className="order-details">
              <h3>Detalles de la Orden</h3>
              <div className="detail-row">
                <span>Número de Orden:</span>
                <strong>{createdOrder?.order_number || 'Pendiente'}</strong>
              </div>
              <div className="detail-row">
                <span>Total:</span>
                <strong className="amount">${Number(createdOrder?.total_amount ?? total).toFixed(2)}</strong>
              </div>
              <div className="detail-row">
                <span>Cliente:</span>
                <strong>{user?.name || 'Cliente'}</strong>
              </div>
            </div>

            {notes ? (
              <div className="order-details">
                <h3>Notas para el estudio</h3>
                <p>{notes}</p>
              </div>
            ) : null}

            {/* Botones */}
            <div className="confirmation-actions">
              <Link to="/" className="btn btn-primary">
                Volver al Inicio
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Seguir Comprando
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <motion.div
        className="checkout-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <Link to="/products" className="back-link">
            <FiArrowLeft /> Volver
          </Link>
          <h1>Checkout</h1>
        </div>
      </motion.div>

      <div className="container checkout-container">
        {/* Formulario */}
        <motion.div
          className="checkout-form-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Confirmar orden</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notas para WhatsApp</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ej. Quiero confirmar disponibilidad, forma de pago o algun detalle del pedido."
                rows="5"
              />
            </div>

            {/* Botón */}
            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Guardar y abrir WhatsApp'}
            </motion.button>
          </form>
        </motion.div>

        {/* Resumen */}
        <motion.div
          className="checkout-summary-section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="order-summary">
            <h2>Resumen de la Orden</h2>

            {/* Items */}
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="summary-total">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>

            {/* Info */}
            <div className="summary-info">
              <p>
                ✓ La orden se guarda primero<br />
                ✓ Luego confirmas detalles por WhatsApp<br />
                ✓ Pago y entrega se coordinan contigo
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
