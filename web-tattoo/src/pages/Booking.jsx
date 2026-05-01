import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiHash, FiPenTool, FiDroplet, FiUser } from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../context/store';
import { appointmentService, serviceService, tattooArtistService } from '../services/api';
import './Booking.css';

export default function Booking() {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { showNotification } = useUIStore();

  const [artist, setArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(artistId ? String(artistId) : '');
  const [workType, setWorkType] = useState('new');
  const [tattooArea, setTattooArea] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [previousTattoos, setPreviousTattoos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const queryArtistId = new URLSearchParams(location.search).get('artistId');
  const initialArtistId = artistId || queryArtistId;

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesión para reservar una cita', 'warning');
      navigate('/auth');
      return;
    }
    loadData();
  }, [artistId, isAuthenticated]);

  useEffect(() => {
    if (initialArtistId) {
      setSelectedArtistId(String(initialArtistId));
    }
  }, [initialArtistId]);

  useEffect(() => {
    if (!selectedArtistId) {
      setArtist(null);
      setSelectedDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);
      setLoadingSlots(false);
      return;
    }

    const loadArtist = async () => {
      try {
        setArtist(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
        const response = await tattooArtistService.getProfile(selectedArtistId);
        if (response?.success) {
          setArtist(response.data);
          if (selectedDate) {
            await loadSlots(selectedArtistId, selectedDate);
          }
        }
      } catch (error) {
        showNotification('Error cargando el tatuador seleccionado', 'error');
      }
    };

    loadArtist();
  }, [selectedArtistId]);

  const loadSlots = async (artistValue, dateValue) => {
    if (!artistValue || !dateValue) {
      return;
    }

    setLoadingSlots(true);
    try {
      const response = await appointmentService.getAvailable(artistValue, dateValue);
      if (response.success) {
        setAvailableSlots(response.data || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      showNotification('Error obteniendo horarios disponibles', 'error');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadData = async () => {
    try {
      const [artistRes, servicesRes] = await Promise.all([
        tattooArtistService.getAll(),
        serviceService.getAll()
      ]);

      const artistsList = artistRes?.data || artistRes || [];
      const servicesList = servicesRes?.data || servicesRes || [];

      if (Array.isArray(artistsList)) {
        setArtists(artistsList);
      } else {
        setArtists([]);
      }

      if (Array.isArray(servicesList)) {
        setServices(servicesList);
      } else {
        setServices([]);
      }
    } catch (error) {
      showNotification('Error cargando datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!selectedArtistId) {
      return;
    }
    await loadSlots(selectedArtistId, date);
  };

  const handleBooking = async () => {
    if (!selectedArtistId) {
      showNotification('Selecciona un tatuador antes de continuar', 'warning');
      return;
    }

    if (!selectedSlot || !selectedService) {
      showNotification('Selecciona un horario y servicio', 'warning');
      return;
    }

    setBooking(true);
    try {
      const appointmentData = {
        artist_id: parseInt(selectedArtistId, 10),
        service_id: selectedService.id,
        appointment_datetime: selectedSlot.start,
        work_type: workType,
        size_area: tattooArea,
        allergies,
        medications,
        previous_tattoos: previousTattoos,
      };

      const response = await appointmentService.create(appointmentData);
      if (response.success) {
        showNotification('Cita reservada exitosamente', 'success');
        navigate('/portal');
      }
    } catch (error) {
      showNotification(error.message || 'Error reservando cita', 'error');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <button
          className="back-button"
          onClick={() => navigate('/artists')}
        >
          <FiArrowLeft /> Volver
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="booking-header"
        >
          <h1>Agendar cita</h1>
          <p>Selecciona tatuador, tipo de trabajo y horario disponible.</p>
        </motion.div>

        <div className="booking-content">
          <div className="booking-section">
            <h3><FiUser /> Seleccionar Tatuador</h3>
            <select
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
            >
              <option value="">Selecciona un tatuador</option>
              {artists.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} {item.specialization ? `- ${item.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          {artist && (
            <div className="booking-section">
              <h3><FiUser /> Tatuador seleccionado</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>{artist.name}</p>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.6)' }}>{artist.specialization}</p>
            </div>
          )}

          <div className="booking-section">
            <h3><FiPenTool /> Tipo de trabajo</h3>
            <select value={workType} onChange={(e) => setWorkType(e.target.value)}>
              <option value="new">Tatuaje nuevo</option>
              <option value="cover">Cover</option>
              <option value="modification">Modificación</option>
              <option value="touch">Retoque</option>
            </select>
          </div>

          <div className="booking-section">
            <h3><FiHash /> Área / tamaño</h3>
            <input
              type="text"
              value={tattooArea}
              onChange={(e) => setTattooArea(e.target.value)}
              placeholder="Ej. antebrazo, pecho, espalda baja"
            />
          </div>

          <div className="booking-section">
            <h3><FiDroplet /> Información adicional</h3>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Alergias o sensibilidad de piel"
              rows="3"
            />
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Medicamentos actuales"
              rows="3"
              style={{ marginTop: '0.75rem' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
              <input
                type="checkbox"
                checked={previousTattoos}
                onChange={(e) => setPreviousTattoos(e.target.checked)}
              />
              Ya tengo tatuajes previos
            </label>
          </div>

          <div className="booking-section">
            <h3><FiCalendar /> Seleccionar Fecha</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={!selectedArtistId}
            />
            {!selectedArtistId && (
              <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                Primero selecciona un tatuador para ver horarios disponibles.
              </p>
            )}
          </div>

          <div className="booking-section">
            <h3><FiClock /> Horarios Disponibles</h3>
            {!selectedArtistId || !selectedDate ? (
              <p className="booking-hint">
                Selecciona un tatuador y una fecha para ver los horarios disponibles.
              </p>
            ) : loadingSlots ? (
              <p className="booking-hint">Buscando horarios disponibles...</p>
            ) : (
              <>
                <div className="slots-grid">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {new Date(slot.start).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </button>
                  ))}
                </div>
                {availableSlots.length === 0 && (
                  <p className="booking-hint">
                    No hay horarios disponibles para esta fecha. Prueba otro día o cambia de tatuador.
                  </p>
                )}
              </>
            )}

            {selectedArtistId && selectedDate && (
              <button
                type="button"
                className="booking-secondary-button"
                onClick={() => loadSlots(selectedArtistId, selectedDate)}
                disabled={loadingSlots}
              >
                {loadingSlots ? 'Buscando...' : 'Buscar horarios'}
              </button>
            )}
          </div>

          <div className="booking-section">
            <h3><FiUser /> Seleccionar Servicio</h3>
            <div className="services-grid">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`service-button ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-name">{service.name}</div>
                  <div className="service-price">${service.base_price}</div>
                  <div className="service-time">{service.estimated_time_hours}h</div>
                </button>
              ))}
            </div>
          </div>

          <div className="booking-section">
            <h3><FiCheck /> Enviar cita</h3>
            <p className="booking-hint">
              Confirma la cita cuando ya tengas artista, servicio y horario seleccionado.
            </p>
            <div className="booking-summary-inline">
              <p><strong>Artista:</strong> {artist?.name || 'Pendiente'}</p>
              <p><strong>Fecha:</strong> {selectedDate || 'Pendiente'}</p>
              <p><strong>Hora:</strong> {selectedSlot ? new Date(selectedSlot.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Pendiente'}</p>
              <p><strong>Servicio:</strong> {selectedService?.name || 'Pendiente'}</p>
            </div>
            <button
              className="booking-confirm-button"
              onClick={handleBooking}
              disabled={booking || !selectedArtistId || !selectedService || !selectedSlot}
            >
              {booking ? 'Reservando...' : 'Enviar cita'}
              <FiCheck />
            </button>
          </div>

          {selectedSlot && selectedService && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="booking-summary"
            >
              <h3>Vista previa de la cita</h3>
              <div className="summary-details">
                <p><strong>Fecha:</strong> {new Date(selectedSlot.start).toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {new Date(selectedSlot.start).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Servicio:</strong> {selectedService.name}</p>
                <p><strong>Precio:</strong> ${selectedService.base_price}</p>
                <p><strong>Duración:</strong> {selectedService.estimated_time_hours} horas</p>
                {tattooArea && <p><strong>Área:</strong> {tattooArea}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
