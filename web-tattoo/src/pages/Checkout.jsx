import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../context/store';
import './Checkout.css';

/**
 * Página de Checkout - Proceso de compra
 */
export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const showNotification = useUIStore(state => state.showNotification);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'transfer'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    if (!formData.name || !formData.email || !formData.address || !formData.city) {
      showNotification('Por favor, completa todos los campos requeridos', 'warning');
      return;
    }

    // Simular creación de orden
    const orderData = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items,
      total,
      customer: formData,
      date: new Date().toISOString()
    };

    console.log('Orden creada:', orderData);
    
    // Guardar orden en localStorage (en producción sería en base de datos)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    showNotification('¡Orden creada exitosamente!', 'success');
    setOrderPlaced(true);
    clearCart();
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
            <p>Tu orden ha sido procesada exitosamente</p>

            {/* Detalles de la orden */}
            <div className="order-details">
              <h3>Detalles de la Orden</h3>
              <div className="detail-row">
                <span>Número de Orden:</span>
                <strong>#ORD-2024-001</strong>
              </div>
              <div className="detail-row">
                <span>Total:</span>
                <strong className="amount">${total.toFixed(2)}</strong>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <strong>{formData.email}</strong>
              </div>
            </div>

            {/* Instrucciones de pago */}
            <div className="payment-instructions">
              <h3>Instrucciones de Pago</h3>
              <div className="instruction-box">
                <p><strong>Método:</strong> Transferencia Bancaria</p>
                <p>
                  <strong>Banco:</strong> Banco Principal España<br />
                  <strong>IBAN:</strong> ES91 2100 0418 4502 0005 1332<br />
                  <strong>Concepto:</strong> Orden #ORD-2024-001
                </p>
                <p className="important">
                  Importante: Tu orden será procesada una vez confirmemos el pago.
                  Recibirás un email de confirmación en {formData.email}
                </p>
              </div>
            </div>

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
          <h2>Información de Entrega</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="name">Nombre Completo *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@example.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 666 777 888"
              />
            </div>

            {/* Dirección */}
            <div className="form-group">
              <label htmlFor="address">Dirección *</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle Principal 123"
                required
              />
            </div>

            {/* Ciudad y Código Postal */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ciudad *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Madrid"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Código Postal *</label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="28001"
                  required
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div className="form-group">
              <label>Método de Pago *</label>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                  />
                  <span>Transferencia Bancaria</span>
                </label>
              </div>
            </div>

            {/* Botón */}
            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              whileTap={{ scale: 0.95 }}
            >
              Completar Compra
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

            {/* Subtotal */}
            <div className="summary-subtotal">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Envío */}
            <div className="summary-shipping">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>

            {/* Total */}
            <div className="summary-total">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>

            {/* Info */}
            <div className="summary-info">
              <p>
                ✓ Envío rápido y seguro<br />
                ✓ Embalaje profesional<br />
                ✓ Protección de comprador
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
