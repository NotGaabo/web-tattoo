import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiCheck, FiFileText, FiPenTool, FiUser } from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../context/store';
import { appointmentService, serviceService, tattooArtistService } from '../services/api';
import { getSessionHomePath } from '../services/odooAuth';
import './Booking.css';

export default function Booking() {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const showNotification = useUIStore((state) => state.showNotification);

  const [artists, setArtists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [workType, setWorkType] = useState('new');
  const [sizeArea, setSizeArea] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const queryArtistId = new URLSearchParams(location.search).get('artistId');
  const initialArtistId = artistId || queryArtistId || '';

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesion para reservar una cita.', 'warning');
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [artistResponse, servicesResponse] = await Promise.all([
          tattooArtistService.getAll(),
          serviceService.getAll(),
        ]);

        const artistList = Array.isArray(artistResponse?.data) ? artistResponse.data : Array.isArray(artistResponse) ? artistResponse : [];
        const serviceList = Array.isArray(servicesResponse?.data) ? servicesResponse.data : Array.isArray(servicesResponse) ? servicesResponse : [];

        setArtists(artistList);
        setServices(serviceList);
        if (initialArtistId) {
          setSelectedArtistId(String(initialArtistId));
        }
      } catch (error) {
        showNotification('No se pudieron cargar los datos de la cita.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initialArtistId, isAuthenticated, navigate, showNotification]);

  const selectedArtist = useMemo(
    () => artists.find((artist) => String(artist.id) === String(selectedArtistId)) || null,
    [artists, selectedArtistId],
  );

  const filteredServices = useMemo(() => services, [services]);

  const selectedService = useMemo(
    () => filteredServices.find((service) => String(service.id) === String(selectedServiceId)) || null,
    [filteredServices, selectedServiceId],
  );

  const handleBooking = async () => {
    if (!selectedArtistId || !selectedService || !selectedDate) {
      showNotification('Selecciona tatuador, servicio y dia.', 'warning');
      return;
    }

    setBooking(true);

    try {
      const response = await appointmentService.create({
        artist_id: Number(selectedArtistId),
        service_id: selectedService.id,
        appointment_date: selectedDate,
        work_type: workType,
        size_area: sizeArea,
        design_description: designDescription,
        notes,
      });

      if (response?.whatsapp_url) {
        window.open(response.whatsapp_url, '_blank', 'noopener,noreferrer');
      }

      showNotification('Cita registrada. Se abrio WhatsApp con el mensaje precargado.', 'success');
      navigate(getSessionHomePath(user));
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || 'No se pudo registrar la cita.', 'error');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="booking-page"><div className="loading">Cargando...</div></div>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <button className="back-button" onClick={() => navigate(selectedArtist ? `/artists/${selectedArtist.id}` : '/artists')}>
          <FiArrowLeft /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="booking-header">
          <h1>Reservar cita</h1>
          <p>Elige dia, tatuador y una descripcion breve. Guardamos la solicitud y te abrimos WhatsApp para enviarla.</p>
        </motion.div>

        <div className="booking-content">
          <div className="booking-section">
            <h3><FiUser /> Tatuador</h3>
            <select value={selectedArtistId} onChange={(event) => setSelectedArtistId(event.target.value)}>
              <option value="">Selecciona un tatuador</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}{artist.specialization ? ` - ${artist.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="booking-section">
            <h3><FiPenTool /> Servicio</h3>
            <select value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)}>
              <option value="">Selecciona un servicio</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="booking-section">
            <h3><FiCalendar /> Dia</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={!selectedArtistId}
            />
          </div>

          <div className="booking-section">
            <h3><FiFileText /> Informacion breve</h3>
            <input
              type="text"
              value={sizeArea}
              onChange={(event) => setSizeArea(event.target.value)}
              placeholder="Zona o tamano aproximado"
            />
            <textarea
              value={designDescription}
              onChange={(event) => setDesignDescription(event.target.value)}
              placeholder="Idea general del tatuaje"
              rows="4"
              style={{ marginTop: '0.75rem' }}
            />
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Detalle extra que quieras agregar"
              rows="3"
              style={{ marginTop: '0.75rem' }}
            />
          </div>

          <div className="booking-section">
            <h3><FiCheck /> Resumen</h3>
            <div className="booking-summary-inline">
              <p><strong>Tatuador:</strong> {selectedArtist?.name || 'Pendiente'}</p>
              <p><strong>Servicio:</strong> {selectedService?.name || 'Pendiente'}</p>
              <p><strong>Dia:</strong> {selectedDate || 'Pendiente'}</p>
            </div>
            <button
              className="booking-confirm-button"
              onClick={handleBooking}
              disabled={booking || !selectedArtistId || !selectedService || !selectedDate}
            >
              {booking ? 'Guardando...' : 'Guardar y abrir WhatsApp'}
              <FiCheck />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
