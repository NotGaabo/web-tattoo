import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBarChart2,
  FiCheckCircle,
  FiDroplet,
  FiEdit2,
  FiImage,
  FiLogOut,
  FiPlusCircle,
  FiScissors,
  FiTrash2,
  FiUsers,
  FiPackage,
  FiLayers,
  FiX,
} from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../context/store';
import odooAuthService from '../services/odooAuth';
import managementApi from '../services/managementApi';
import { resolveBackendUrl } from '../services/api';
import './Gestion.css';

const EMPTY_ARTIST = {
  name: '',
  social_handle: '',
  specialization: '',
  biography: '',
  image: '',
  imagePreview: '',
};

const EMPTY_PRODUCT = {
  name: '',
  brand_id: '',
  brand: '',
  price: '',
  quantity_available: '0',
  image: '',
  imagePreview: '',
};

const EMPTY_BRAND = {
  id: null,
  name: '',
  active: true,
};

const EMPTY_GALLERY = {
  name: '',
  artist_id: '',
  tattoo_type: 'realism',
  description: '',
  work_date: '',
  sequence: 10,
  active: true,
  image: '',
  imagePreview: '',
};

const EMPTY_SERVICE = {
  name: '',
  description: '',
  active: true,
};

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: FiBarChart2, path: '/gestion' },
  { key: 'artistas', label: 'Artistas', icon: FiUsers, path: '/gestion/artistas' },
  { key: 'productos', label: 'Productos', icon: FiPackage, path: '/gestion/productos' },
  { key: 'ordenes', label: 'Ordenes', icon: FiCheckCircle, path: '/gestion/ordenes' },
  { key: 'marcas', label: 'Marcas', icon: FiDroplet, path: '/gestion/marcas' },
  { key: 'galeria', label: 'Galeria', icon: FiImage, path: '/gestion/galeria' },
  { key: 'servicios', label: 'Servicios', icon: FiLayers, path: '/gestion/servicios' },
];

const TATTOO_TYPES = [
  { value: 'realism', label: 'Realism' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'neo_traditional', label: 'Neo Traditional' },
  { value: 'blackwork', label: 'Blackwork' },
  { value: 'minimalism', label: 'Minimalism' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'lettering', label: 'Lettering' },
  { value: 'cover_up', label: 'Cover Up' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'other', label: 'Other' },
];

function sectionFromPath(pathname) {
  const part = pathname.split('/')[2];
  return ['artistas', 'productos', 'ordenes', 'marcas', 'galeria', 'servicios'].includes(part) ? part : 'dashboard';
}

function orderIdFromPath(pathname) {
  const parts = pathname.split('/');
  if (parts[2] !== 'ordenes') {
    return null;
  }
  const rawId = parts[3];
  return rawId ? Number(rawId) || null : null;
}

function previewSource(value) {
  if (!value) {
    return '';
  }

  if (String(value).startsWith('data:') || String(value).startsWith('http')) {
    return value;
  }

  return resolveBackendUrl(value);
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function entityMessage(entity, action) {
  return `${entity} ${action}.`;
}

function formatOrderState(state) {
  const labels = {
    draft: 'Nueva',
    confirmed: 'Confirmada',
    processing: 'En proceso',
    shipped: 'Enviada',
    done: 'Completada',
    cancelled: 'Cancelada',
  };
  return labels[state] || state || 'Sin estado';
}

function formatPaymentState(state) {
  const labels = {
    paid: 'Pagada',
    partial: 'Parcial',
    not_paid: 'Pendiente',
  };
  return labels[state] || state || 'Sin estado';
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="gestion-stat-card">
      <span className="gestion-stat-icon">
        <Icon size={18} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </article>
  );
}

function SectionHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="gestion-section-header">
      <div>
        <span className="eyebrow">{title}</span>
        <p>{description}</p>
      </div>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <FiPlusCircle /> {actionLabel}
        </button>
      )}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="gestion-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function GestionModal({ title, description, onClose, children }) {
  return (
    <motion.div
      className="gestion-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.section
        className="gestion-modal-card"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="gestion-modal-header">
          <div>
            <span className="eyebrow">{title}</span>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="gestion-modal-close" onClick={onClose} aria-label="Cerrar modal">
            <FiX size={20} />
          </button>
        </header>
        <div className="gestion-modal-body">{children}</div>
      </motion.section>
    </motion.div>
  );
}

export default function Gestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const showNotification = useUIStore((state) => state.showNotification);

  const [artists, setArtists] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [artistForm, setArtistForm] = useState(EMPTY_ARTIST);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND);
  const [galleryForm, setGalleryForm] = useState(EMPTY_GALLERY);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [activeModal, setActiveModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editing, setEditing] = useState({
    artistId: null,
    productId: null,
    galleryId: null,
    serviceId: null,
  });

  const section = sectionFromPath(location.pathname);
  const orderDetailId = orderIdFromPath(location.pathname);
  const currentSection = SECTIONS.find((item) => item.key === section) || SECTIONS[0];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const snapshot = await managementApi.getDashboard();
      setArtists(snapshot.artists || []);
      setProducts(snapshot.products || []);
      setOrders(snapshot.orders || []);
      setBrands(snapshot.brands || []);
      setGallery(snapshot.gallery || []);
      setServices(snapshot.services || []);
    } catch (error) {
      showNotification(error.message || 'No se pudo cargar el panel de gestion.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!['dashboard', 'artistas', 'productos', 'ordenes', 'marcas', 'galeria', 'servicios'].includes(section)) {
      navigate('/gestion', { replace: true });
    }
  }, [navigate, section]);

  useEffect(() => {
    if (!orders.length) {
      setSelectedOrderId(null);
      return;
    }

    if (orderDetailId && orders.some((order) => order.id === orderDetailId)) {
      setSelectedOrderId(orderDetailId);
      return;
    }

    if (!selectedOrderId || !orders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orderDetailId, orders, selectedOrderId]);

  useEffect(() => {
    if (section === 'galeria' && !galleryForm.artist_id && artists[0]?.id) {
      setGalleryForm((current) => ({ ...current, artist_id: String(artists[0].id) }));
    }
  }, [artists, galleryForm.artist_id, section]);

  const stats = useMemo(() => {
    const activeProducts = products.filter((item) => item.active !== false).length;
    const pendingOrders = orders.filter((item) => ['draft', 'confirmed', 'processing'].includes(item.state)).length;
    const activeGallery = gallery.filter((item) => item.active !== false).length;
    const activeServices = services.filter((item) => item.active !== false).length;

    return [
      {
        icon: FiUsers,
        label: 'Tatuadores',
        value: artists.length,
        hint: 'Perfiles del estudio',
      },
      {
        icon: FiPackage,
        label: 'Productos',
        value: products.length,
        hint: `${activeProducts} visibles`,
      },
      {
        icon: FiCheckCircle,
        label: 'Ordenes',
        value: orders.length,
        hint: `${pendingOrders} pendientes`,
      },
      {
        icon: FiImage,
        label: 'Galeria',
        value: gallery.length,
        hint: `${activeGallery} piezas activas`,
      },
      {
        icon: FiLayers,
        label: 'Servicios',
        value: services.length,
        hint: `${activeServices} disponibles`,
      },
    ];
  }, [artists, gallery, orders, products, services]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );

  const handleLogout = async () => {
    try {
      await odooAuthService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearSession();
      navigate('/', { replace: true });
    }
  };

  const setArtistImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = await toDataUrl(file);
    setArtistForm((current) => ({
      ...current,
      image: preview.split(',')[1] || '',
      imagePreview: preview,
    }));
  };

  const setGalleryImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = await toDataUrl(file);
    setGalleryForm((current) => ({
      ...current,
      image: preview.split(',')[1] || '',
      imagePreview: preview,
    }));
  };

  const setProductImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = await toDataUrl(file);
    setProductForm((current) => ({
      ...current,
      image: preview.split(',')[1] || '',
      imagePreview: preview,
    }));
  };

  const resetArtistForm = () => {
    setArtistForm(EMPTY_ARTIST);
    setEditing((current) => ({ ...current, artistId: null }));
    setActiveModal(null);
  };

  const resetProductForm = () => {
    setProductForm(EMPTY_PRODUCT);
    setEditing((current) => ({ ...current, productId: null }));
    setActiveModal(null);
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      ...EMPTY_GALLERY,
      artist_id: artists[0]?.id ? String(artists[0].id) : '',
    });
    setEditing((current) => ({ ...current, galleryId: null }));
    setActiveModal(null);
  };

  const resetServiceForm = () => {
    setServiceForm(EMPTY_SERVICE);
    setEditing((current) => ({ ...current, serviceId: null }));
    setActiveModal(null);
  };

  const openArtistModal = () => {
    resetArtistForm();
    setActiveModal('artist');
  };

  const openProductModal = () => {
    resetProductForm();
    setActiveModal('product');
  };

  const openGalleryModal = () => {
    resetGalleryForm();
    setActiveModal('gallery');
  };

  const openServiceModal = () => {
    resetServiceForm();
    setActiveModal('service');
  };

  const beginArtistEdit = (artist) => {
    setArtistForm({
      name: artist.name || '',
      social_handle: artist.social_handle || '',
      specialization: artist.specialization || '',
      biography: artist.biography || '',
      image: '',
      imagePreview: artist.image || '',
    });
    setEditing((current) => ({ ...current, artistId: artist.id }));
    setActiveModal('artist');
  };

  const beginProductEdit = (product) => {
    setProductForm({
      name: product.name || '',
      brand_id: product.brand_id ? String(product.brand_id) : '',
      brand: product.brand || '',
      price: product.price ?? '',
      quantity_available: String(product.quantity_available ?? 0),
      image: '',
      imagePreview: product.image || '',
    });
    setEditing((current) => ({ ...current, productId: product.id }));
    setActiveModal('product');
  };

  const beginGalleryEdit = (piece) => {
    setGalleryForm({
      name: piece.name || '',
      artist_id: String(piece.artist_id || artists[0]?.id || ''),
      tattoo_type: piece.tattoo_type || 'realism',
      description: piece.description || '',
      work_date: piece.work_date || '',
      sequence: piece.sequence ?? 10,
      active: piece.active !== false,
      image: '',
      imagePreview: piece.image || '',
    });
    setEditing((current) => ({ ...current, galleryId: piece.id }));
    setActiveModal('gallery');
  };

  const beginServiceEdit = (service) => {
    setServiceForm({
      name: service.name || '',
      description: service.description || '',
      active: service.active !== false,
    });
    setEditing((current) => ({ ...current, serviceId: service.id }));
    setActiveModal('service');
  };

  const submitArtist = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: artistForm.name,
        social_handle: artistForm.social_handle,
        specialization: artistForm.specialization,
        biography: artistForm.biography,
      };

      if (artistForm.image) {
        payload.image = artistForm.image;
      }

      if (editing.artistId) {
        await managementApi.updateArtist(editing.artistId, payload);
        setActiveModal(null);
        showNotification(entityMessage('Artista', 'actualizado'), 'success');
      } else {
        await managementApi.createArtist(payload);
        setActiveModal(null);
        showNotification(entityMessage('Artista', 'creado'), 'success');
      }

      await loadData();
      resetArtistForm();
    } catch (error) {
      setActiveModal(null);
      showNotification(error.response?.data?.message || error.message || 'No se pudo guardar el artista.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    if (!productForm.name.trim() || !productForm.brand_id || productForm.price === '' || productForm.quantity_available === '') {
      showNotification('Completa todos los campos del producto.', 'warning');
      return;
    }

    if (!productForm.image && !productForm.imagePreview) {
      showNotification('La foto del producto es obligatoria.', 'warning');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: productForm.name.trim(),
        brand_id: productForm.brand_id ? Number(productForm.brand_id) : false,
        brand: productForm.brand,
        price: Number(productForm.price || 0),
        quantity_available: Number(productForm.quantity_available || 0),
      };

      if (productForm.image) {
        payload.image = productForm.image;
      }

      if (editing.productId) {
        await managementApi.updateProduct(editing.productId, payload);
        setActiveModal(null);
        showNotification(entityMessage('Producto', 'actualizado'), 'success');
      } else {
        await managementApi.createProduct(payload);
        setActiveModal(null);
        showNotification(entityMessage('Producto', 'creado'), 'success');
      }

      await loadData();
      resetProductForm();
    } catch (error) {
      setActiveModal(null);
      showNotification(error.response?.data?.message || error.message || 'No se pudo guardar el producto.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const submitGallery = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: galleryForm.name,
        artist_id: Number(galleryForm.artist_id || 0),
        tattoo_type: galleryForm.tattoo_type,
        description: galleryForm.description,
        work_date: galleryForm.work_date || false,
        sequence: Number(galleryForm.sequence || 0),
        active: Boolean(galleryForm.active),
      };

      if (galleryForm.image) {
        payload.image = galleryForm.image;
      }

      if (editing.galleryId) {
        await managementApi.updateGalleryItem(editing.galleryId, payload);
        setActiveModal(null);
        showNotification(entityMessage('Pieza de galeria', 'actualizada'), 'success');
      } else {
        await managementApi.createGalleryItem(payload);
        setActiveModal(null);
        showNotification(entityMessage('Pieza de galeria', 'creada'), 'success');
      }

      await loadData();
      resetGalleryForm();
    } catch (error) {
      setActiveModal(null);
      showNotification(error.response?.data?.message || error.message || 'No se pudo guardar la galeria.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const submitService = async (event) => {
    event.preventDefault();

    if (!serviceForm.name.trim() || !serviceForm.description.trim()) {
      showNotification('Completa nombre y descripcion del servicio.', 'warning');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: serviceForm.name.trim(),
        description: serviceForm.description.trim(),
        active: Boolean(serviceForm.active),
      };

      if (editing.serviceId) {
        await managementApi.updateService(editing.serviceId, payload);
        setActiveModal(null);
        showNotification(entityMessage('Servicio', 'actualizado'), 'success');
      } else {
        await managementApi.createService(payload);
        setActiveModal(null);
        showNotification(entityMessage('Servicio', 'creado'), 'success');
      }

      await loadData();
      resetServiceForm();
    } catch (error) {
      setActiveModal(null);
      showNotification(error.response?.data?.message || error.message || 'No se pudo guardar el servicio.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeArtist = (id, name) => {
    setDeleteTarget({
      kind: 'artist',
      id,
      name,
      title: 'Eliminar artista',
      description: 'Esta accion quitara el tatuador del panel interno.',
    });
  };

  const removeProduct = (id, name) => {
    setDeleteTarget({
      kind: 'product',
      id,
      name,
      title: 'Eliminar producto',
      description: 'Esta accion eliminara el producto del inventario gestionado.',
    });
  };

  const submitBrand = async (event) => {
    event.preventDefault();
    if (!brandForm.name.trim()) {
      showNotification('Escribe el nombre de la marca.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: brandForm.name.trim(),
        active: Boolean(brandForm.active),
      };

      if (brandForm.id) {
        await managementApi.updateProductBrand(brandForm.id, payload);
        showNotification('Marca actualizada.', 'success');
      } else {
        await managementApi.createProductBrand(payload);
        showNotification('Marca creada.', 'success');
      }
      setBrandForm(EMPTY_BRAND);
      await loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || 'No se pudo guardar la marca.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeBrand = (id, name) => {
    setDeleteTarget({
      kind: 'brand',
      id,
      name,
      title: 'Eliminar marca',
      description: 'Si la marca tiene productos asociados, se archivara en vez de borrarse.',
    });
  };

  const beginBrandEdit = (brand) => {
    setBrandForm({
      id: brand.id,
      name: brand.name || '',
      active: brand.active !== false,
    });
  };

  const removeGallery = (id, name) => {
    setDeleteTarget({
      kind: 'gallery',
      id,
      name,
      title: 'Eliminar pieza',
      description: 'Esta accion eliminara la pieza de la galeria publica.',
    });
  };

  const removeService = (id, name) => {
    setDeleteTarget({
      kind: 'service',
      id,
      name,
      title: 'Eliminar servicio',
      description: 'Esta accion eliminara el servicio del catalogo interno.',
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsSaving(true);
    try {
      const actions = {
        artist: {
          run: () => managementApi.deleteArtist(deleteTarget.id),
          message: 'Artista eliminado.',
          fallback: 'No se pudo eliminar el artista.',
        },
        product: {
          run: () => managementApi.deleteProduct(deleteTarget.id),
          message: 'Producto eliminado.',
          fallback: 'No se pudo eliminar el producto.',
        },
        gallery: {
          run: () => managementApi.deleteGalleryItem(deleteTarget.id),
          message: 'Pieza de galeria eliminada.',
          fallback: 'No se pudo eliminar la galeria.',
        },
        service: {
          run: () => managementApi.deleteService(deleteTarget.id),
          message: 'Servicio eliminado.',
          fallback: 'No se pudo eliminar el servicio.',
        },
        brand: {
          run: () => managementApi.deleteProductBrand(deleteTarget.id),
          message: 'Marca actualizada.',
          fallback: 'No se pudo eliminar la marca.',
        },
      };
      const action = actions[deleteTarget.kind];

      await action.run();
      setDeleteTarget(null);
      showNotification(action.message, 'success');
      await loadData();
    } catch (error) {
      const fallback = deleteTarget
        ? {
            artist: 'No se pudo eliminar el artista.',
            product: 'No se pudo eliminar el producto.',
            gallery: 'No se pudo eliminar la galeria.',
            service: 'No se pudo eliminar el servicio.',
            brand: 'No se pudo eliminar la marca.',
          }[deleteTarget.kind]
        : 'No se pudo eliminar el registro.';
      setDeleteTarget(null);
      showNotification(error.response?.data?.message || error.message || fallback, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrder = async (orderId, action) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) {
      showNotification('No encontramos la orden seleccionada.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        action,
        notes: order.notes || '',
      };
      const updatedOrder = await managementApi.updateOrder(orderId, payload);
      const nextOrders = orders.map((item) => (item.id === orderId ? updatedOrder : item));
      setOrders(nextOrders);
      setSelectedOrderId(orderId);
      showNotification('Orden actualizada.', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || 'No se pudo actualizar la orden.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderNotes = (orderId, notes) => {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, notes } : order)),
    );
  };

  const openOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    navigate(`/gestion/ordenes/${orderId}`);
  };

  return (
    <div className="gestion-page">
      <aside className="gestion-sidebar">
        <div className="gestion-brand">
          <span className="gestion-brand-mark">
            <FiScissors size={16} />
          </span>
          <div>
            <span className="gestion-brand-title">Tattoo Studio</span>
            <small>Area interna</small>
          </div>
        </div>

        <nav className="gestion-nav">
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            const active = item.key === currentSection.key;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`gestion-nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="gestion-sidebar-footer">
          <div className="gestion-user-chip">
            <FiCheckCircle size={14} />
            <span>{user?.name || 'Usuario interno'}</span>
          </div>
          <Link to="/" className="btn btn-secondary gestion-return-btn">
            Ver sitio publico
          </Link>
          <button type="button" className="btn btn-ghost gestion-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Salir
          </button>
        </div>
      </aside>

      <main className="gestion-main">
        <motion.section
          className="gestion-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <span className="eyebrow">Gestion interna</span>
            <h1>{currentSection.label}</h1>
            <p>
              Panel operativo para artistas, productos, galeria y servicios. Mantiene la base
              visual del estudio y separa el trabajo interno del portal de clientes.
            </p>
          </div>
          <div className="gestion-hero-actions">
            <button type="button" className="btn btn-secondary" onClick={loadData}>
              <FiBarChart2 /> Refrescar
            </button>
            <span className="gestion-role-badge">
              {user?.role === 'admin' ? 'Admin' : 'Interno'}
            </span>
          </div>
        </motion.section>

        <section className="gestion-stats">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="gestion-content">
          {isLoading ? (
            <div className="gestion-loading">
              <p>Cargando datos de gestion...</p>
            </div>
          ) : (
            <>
              {section === 'dashboard' && (
                <motion.div
                  className="gestion-grid dashboard-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <article className="gestion-card">
                    <SectionHeader
                      title="Resumen"
                      description="Estado general del estudio y accesos rapidos."
                    />
                    <div className="gestion-summary-grid">
                      <div className="gestion-summary-item">
                        <strong>{artists.length}</strong>
                        <span>Artistas</span>
                      </div>
                      <div className="gestion-summary-item">
                        <strong>{products.length}</strong>
                        <span>Productos</span>
                      </div>
                      <div className="gestion-summary-item">
                        <strong>{gallery.length}</strong>
                        <span>Galeria</span>
                      </div>
                      <div className="gestion-summary-item">
                        <strong>{services.length}</strong>
                        <span>Servicios</span>
                      </div>
                    </div>
                  </article>

                  <article className="gestion-card">
                    <SectionHeader
                      title="Acceso rapido"
                      description="Atajos directos a las secciones operativas."
                    />
                    <div className="gestion-quick-links">
                      {SECTIONS.slice(1).map((item) => (
                        <Link key={item.key} to={item.path} className="gestion-quick-link">
                          <item.icon size={15} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </article>

                  <article className="gestion-card">
                    <SectionHeader
                      title="Ultimos cambios"
                      description="Una vista rapida de lo mas reciente en la base del estudio."
                    />
                    <div className="gestion-activity-list">
                      <div>
                        <strong>{artists[0]?.name || 'Sin artistas recientes'}</strong>
                        <span>Ultimo artista registrado</span>
                      </div>
                      <div>
                        <strong>{products[0]?.name || 'Sin productos recientes'}</strong>
                        <span>Ultimo producto</span>
                      </div>
                      <div>
                        <strong>{gallery[0]?.name || 'Sin piezas recientes'}</strong>
                        <span>Ultima pieza de galeria</span>
                      </div>
                    </div>
                  </article>
                </motion.div>
              )}

              {section === 'artistas' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    <SectionHeader
                      title="Artistas"
                      description="Crea el perfil publico del tatuador. Los trabajos se cargan desde Galeria."
                      actionLabel="Nuevo artista"
                      onAction={openArtistModal}
                    />

                    <form className="gestion-form" onSubmit={submitArtist}>
                      <div className="gestion-form-grid">
                        <Field label="Nombre">
                          <input
                            type="text"
                            value={artistForm.name}
                            onChange={(e) => setArtistForm((current) => ({ ...current, name: e.target.value }))}
                          />
                        </Field>
                        <Field label="Especialidad">
                          <input
                            type="text"
                            value={artistForm.specialization}
                            onChange={(e) => setArtistForm((current) => ({ ...current, specialization: e.target.value }))}
                            placeholder="Ej. Fine line, blackwork, realism"
                          />
                        </Field>
                        <Field label="Handle social">
                          <input
                            type="text"
                            value={artistForm.social_handle}
                            onChange={(e) => setArtistForm((current) => ({ ...current, social_handle: e.target.value }))}
                          />
                        </Field>
                        <Field label="Foto">
                          <input type="file" accept="image/*" onChange={setArtistImage} />
                        </Field>
                      </div>

                      <Field label="Detalle">
                        <textarea
                          value={artistForm.biography}
                          onChange={(e) => setArtistForm((current) => ({ ...current, biography: e.target.value }))}
                          placeholder="Descripcion breve del artista para la web."
                        />
                      </Field>

                      {artistForm.imagePreview && (
                        <div className="gestion-image-preview">
                          <img src={previewSource(artistForm.imagePreview)} alt="Preview artista" />
                        </div>
                      )}

                      <div className="gestion-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                          <FiPlusCircle /> {editing.artistId ? 'Actualizar' : 'Crear artista'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetArtistForm}>
                          Limpiar
                        </button>
                      </div>
                    </form>

                    <div className="gestion-table-wrap">
                      <table className="gestion-table">
                        <thead>
                          <tr>
                            <th>Artista</th>
                            <th>Handle</th>
                            <th>Trabajos</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artists.map((artist) => (
                            <tr key={artist.id}>
                              <td>
                                <div className="gestion-row-title">
                                  {artist.image && (
                                    <img
                                      src={previewSource(artist.image)}
                                      alt={artist.name}
                                      className="gestion-row-avatar"
                                    />
                                  )}
                                  <div>
                                    <strong>{artist.name}</strong>
                                    <span>{artist.specialization || 'Sin especialidad'}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{artist.social_handle || 'Sin handle'}</td>
                              <td>{(artist.gallery || []).length}</td>
                              <td>
                                <div className="gestion-row-actions">
                                  <button type="button" onClick={() => beginArtistEdit(artist)}>
                                    <FiEdit2 />
                                  </button>
                                  <button type="button" onClick={() => removeArtist(artist.id, artist.name)}>
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </motion.div>
              )}

              {section === 'productos' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    <SectionHeader
                      title="Productos"
                      description="Gestion de inventario y productos de aftercare."
                      actionLabel="Nuevo producto"
                      onAction={openProductModal}
                    />

                    <form className="gestion-form" onSubmit={submitProduct}>
                      <div className="gestion-form-grid">
                        <Field label="Nombre">
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm((current) => ({ ...current, name: e.target.value }))}
                          />
                        </Field>
                        <Field label="Marca">
                          <select
                            value={productForm.brand_id}
                            onChange={(e) => {
                              const nextId = e.target.value;
                              const selectedBrand = brands.find((brand) => String(brand.id) === nextId);
                              setProductForm((current) => ({
                                ...current,
                                brand_id: nextId,
                                brand: selectedBrand?.name || '',
                              }));
                            }}
                          >
                            <option value="">Selecciona una marca</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Precio">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm((current) => ({ ...current, price: e.target.value }))}
                          />
                        </Field>
                        <Field label="Cantidad disponible">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={productForm.quantity_available}
                            onChange={(e) => setProductForm((current) => ({ ...current, quantity_available: e.target.value }))}
                          />
                        </Field>
                      </div>

                      <Field label="Foto del producto">
                        <input type="file" accept="image/*" onChange={setProductImage} />
                      </Field>

                      {productForm.imagePreview && (
                        <div className="gestion-image-preview">
                          <img src={previewSource(productForm.imagePreview)} alt="Preview producto" />
                        </div>
                      )}

                      <div className="gestion-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                          <FiPlusCircle /> {editing.productId ? 'Actualizar' : 'Crear producto'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                          Limpiar
                        </button>
                      </div>
                    </form>

                    <div className="gestion-table-wrap">
                      <table className="gestion-table">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Marca</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>
                                <div className="gestion-row-title">
                                  {product.image && (
                                    <img
                                      src={previewSource(product.image)}
                                      alt={product.name}
                                      className="gestion-row-avatar"
                                    />
                                  )}
                                  <div>
                                    <strong>{product.name}</strong>
                                    <span>Cantidad: {Number(product.quantity_sellable ?? product.quantity_available ?? 0)}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{product.brand || 'Sin marca'}</td>
                              <td>${Number(product.price || 0).toFixed(2)}</td>
                              <td>{Number(product.quantity_sellable ?? product.quantity_available ?? 0)}</td>
                              <td>
                                <div className="gestion-row-actions">
                                  <button type="button" onClick={() => beginProductEdit(product)}>
                                    <FiEdit2 />
                                  </button>
                                  <button type="button" onClick={() => removeProduct(product.id, product.name)}>
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </motion.div>
              )}

              {section === 'ordenes' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    {!orderDetailId ? (
                      <>
                        <SectionHeader
                          title="Ordenes"
                          description="Vista previa simple de pedidos. En detalle revisas toda la informacion del cliente y cierras la orden."
                        />

                        <div className="gestion-table-wrap">
                          <table className="gestion-table">
                            <thead>
                              <tr>
                                <th>Orden</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr
                                  key={order.id}
                                  className={selectedOrderId === order.id ? 'gestion-row-selected' : ''}
                                >
                                  <td>
                                    <div className="gestion-row-title">
                                      <span className="gestion-mini-badge">
                                        <FiCheckCircle size={12} />
                                      </span>
                                      <div>
                                        <strong>{order.order_number}</strong>
                                        <span>{order.order_date ? new Date(order.order_date).toLocaleString() : 'Sin fecha'}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <strong>{order.customer?.name || 'Sin cliente'}</strong>
                                    <div>{order.customer?.phone || order.customer?.email || 'Sin contacto'}</div>
                                  </td>
                                  <td>${Number(order.total_amount || 0).toFixed(2)}</td>
                                  <td>{formatOrderState(order.state)}</td>
                                  <td>
                                    <div className="gestion-row-actions">
                                      <button type="button" className="gestion-inline-button" onClick={() => openOrderDetail(order.id)}>
                                        Detalle
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : selectedOrder ? (
                      <div className="gestion-order-screen">
                        <div className="gestion-order-screen__top">
                          <button type="button" className="btn btn-secondary" onClick={() => navigate('/gestion/ordenes')}>
                            <FiArrowLeft /> Volver a ordenes
                          </button>
                        </div>

                        <div className="gestion-order-detail">
                          <div className="gestion-order-detail__header">
                            <div>
                              <span className="eyebrow">{selectedOrder.order_number}</span>
                              <h3>{selectedOrder.customer?.name || 'Cliente'}</h3>
                              <p>
                                {selectedOrder.customer?.phone || 'Sin telefono'} · {selectedOrder.customer?.email || 'Sin correo'}
                              </p>
                            </div>
                            <div className="gestion-order-detail__meta">
                              <span>Estado: {formatOrderState(selectedOrder.state)}</span>
                              <span>Pago: {formatPaymentState(selectedOrder.payment_state)}</span>
                              <span>Total: ${Number(selectedOrder.total_amount || 0).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="gestion-order-detail__grid">
                            <div className="gestion-order-detail__panel">
                              <strong>Cliente</strong>
                              <p>{selectedOrder.customer?.name || 'Sin cliente'}</p>
                              <small>{selectedOrder.customer?.phone || selectedOrder.customer?.email || 'Sin contacto'}</small>
                            </div>
                            <div className="gestion-order-detail__panel">
                              <strong>Stock</strong>
                              <p>
                                {selectedOrder.stock_committed
                                  ? 'El stock ya fue descontado.'
                                  : selectedOrder.stock_reserved
                                    ? 'El stock esta reservado mientras confirmas por WhatsApp.'
                                    : 'La orden no tiene reserva activa.'}
                              </p>
                            </div>
                          </div>

                          <div className="gestion-table-wrap">
                            <table className="gestion-table">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Cantidad</th>
                                  <th>Precio</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedOrder.items.map((item) => (
                                  <tr key={`${selectedOrder.id}-${item.product_id}`}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${Number(item.unit_price || 0).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <Field label="Notas internas">
                            <textarea
                              value={selectedOrder.notes || ''}
                              onChange={(e) => updateOrderNotes(selectedOrder.id, e.target.value)}
                              placeholder="Ej. Cliente confirmo por WhatsApp."
                            />
                          </Field>

                          <div className="gestion-order-total">
                            <span>Total del cliente</span>
                            <strong>${Number(selectedOrder.total_amount || 0).toFixed(2)}</strong>
                          </div>

                          <div className="gestion-form-actions">
                            {!['cancelled', 'done'].includes(selectedOrder.state) ? (
                              <button
                                type="button"
                                className="btn btn-primary"
                                disabled={isSaving}
                                onClick={() => updateOrder(selectedOrder.id, 'complete')}
                              >
                                Marcar como completa
                              </button>
                            ) : null}
                            {!['cancelled', 'done', 'shipped'].includes(selectedOrder.state) ? (
                              <button
                                type="button"
                                className="btn btn-secondary gestion-danger-btn"
                                disabled={isSaving}
                                onClick={() => updateOrder(selectedOrder.id, 'cancel')}
                              >
                                Cancelar
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="gestion-loading">No encontramos esa orden.</div>
                    )}
                  </article>
                </motion.div>
              )}

              {section === 'marcas' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    <div className="gestion-brand-panel gestion-brand-panel-simple">
                      <form className="gestion-form" onSubmit={submitBrand}>
                        <div className="gestion-form-grid">
                          <Field label="Nombre de marca">
                            <input
                              type="text"
                              value={brandForm.name}
                              onChange={(e) => setBrandForm((current) => ({ ...current, name: e.target.value }))}
                            />
                          </Field>
                        </div>
                        <div className="gestion-form-actions">
                          <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            <FiPlusCircle /> {brandForm.id ? 'Guardar marca' : 'Crear marca'}
                          </button>
                          {brandForm.id ? (
                            <button type="button" className="btn btn-secondary" onClick={() => setBrandForm(EMPTY_BRAND)}>
                              Cancelar
                            </button>
                          ) : null}
                        </div>
                      </form>

                      <div className="gestion-table-wrap">
                        <table className="gestion-table">
                          <thead>
                            <tr>
                              <th>Marca</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brands.map((brand) => (
                              <tr key={brand.id}>
                                <td><strong>{brand.name}</strong></td>
                                <td>{brand.active !== false ? 'Activa' : 'Archivada'}</td>
                                <td>
                                  <div className="gestion-row-actions">
                                    <button type="button" onClick={() => beginBrandEdit(brand)}>
                                      <FiEdit2 />
                                    </button>
                                    <button type="button" onClick={() => removeBrand(brand.id, brand.name)}>
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                </motion.div>
              )}

              {section === 'galeria' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    <SectionHeader
                      title="Galeria"
                      description="Piezas realizadas por tatuador y estilo."
                      actionLabel="Nueva pieza"
                      onAction={openGalleryModal}
                    />

                    <form className="gestion-form" onSubmit={submitGallery}>
                      <div className="gestion-form-grid">
                        <Field label="Titulo">
                          <input
                            type="text"
                            value={galleryForm.name}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, name: e.target.value }))}
                          />
                        </Field>
                        <Field label="Tatuador">
                          <select
                            value={galleryForm.artist_id}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, artist_id: e.target.value }))}
                          >
                            <option value="">Selecciona un artista</option>
                            {artists.map((artist) => (
                              <option key={artist.id} value={artist.id}>
                                {artist.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Estilo">
                          <select
                            value={galleryForm.tattoo_type}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, tattoo_type: e.target.value }))}
                          >
                            {TATTOO_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Fecha">
                          <input
                            type="date"
                            value={galleryForm.work_date}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, work_date: e.target.value }))}
                          />
                        </Field>
                        <Field label="Orden">
                          <input
                            type="number"
                            min="0"
                            value={galleryForm.sequence}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, sequence: e.target.value }))}
                          />
                        </Field>
                        <Field label="Imagen">
                          <input type="file" accept="image/*" onChange={setGalleryImage} />
                        </Field>
                      </div>

                      <Field label="Descripcion">
                        <textarea
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm((current) => ({ ...current, description: e.target.value }))}
                        />
                      </Field>

                      <div className="gestion-switch-row">
                        <label>
                          <input
                            type="checkbox"
                            checked={galleryForm.active}
                            onChange={(e) => setGalleryForm((current) => ({ ...current, active: e.target.checked }))}
                          />
                          Activo
                        </label>
                      </div>

                      {galleryForm.imagePreview && (
                        <div className="gestion-image-preview">
                          <img src={previewSource(galleryForm.imagePreview)} alt="Preview galeria" />
                        </div>
                      )}

                      <div className="gestion-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                          <FiPlusCircle /> {editing.galleryId ? 'Actualizar' : 'Crear pieza'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={resetGalleryForm}>
                          Limpiar
                        </button>
                      </div>
                    </form>

                    <div className="gestion-table-wrap">
                      <table className="gestion-table">
                        <thead>
                          <tr>
                            <th>Pieza</th>
                            <th>Artista</th>
                            <th>Estilo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gallery.map((piece) => (
                            <tr key={piece.id}>
                              <td>
                                <div className="gestion-row-title">
                                  {piece.image && (
                                    <img
                                      src={previewSource(piece.image)}
                                      alt={piece.name}
                                      className="gestion-row-avatar"
                                    />
                                  )}
                                  <div>
                                    <strong>{piece.name}</strong>
                                    <span>{piece.work_date || 'Sin fecha'}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{piece.artist_name || 'Sin artista'}</td>
                              <td>{piece.tattoo_type_label || piece.tattoo_type}</td>
                              <td>{piece.active !== false ? 'Activa' : 'Inactiva'}</td>
                              <td>
                                <div className="gestion-row-actions">
                                  <button type="button" onClick={() => beginGalleryEdit(piece)}>
                                    <FiEdit2 />
                                  </button>
                                  <button type="button" onClick={() => removeGallery(piece.id, piece.name)}>
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </motion.div>
              )}

              {section === 'servicios' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <article className="gestion-card">
                    <SectionHeader
                      title="Servicios"
                      description="CRUD simple de servicios generales que luego se cotizan por WhatsApp."
                      actionLabel="Nuevo servicio"
                      onAction={openServiceModal}
                    />

                    <div className="gestion-table-wrap">
                      <table className="gestion-table">
                        <thead>
                          <tr>
                            <th>Servicio</th>
                            <th>Citas confirmadas</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id}>
                              <td>
                                <div className="gestion-row-title">
                                  <span className="gestion-mini-badge">
                                    <FiDroplet size={12} />
                                  </span>
                                  <div>
                                    <strong>{service.name}</strong>
                                    <span>{service.description || 'Sin descripcion'}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{service.total_appointments || 0}</td>
                              <td>{service.active !== false ? 'Activo' : 'Inactivo'}</td>
                              <td>
                                <div className="gestion-row-actions">
                                  <button type="button" onClick={() => beginServiceEdit(service)}>
                                    <FiEdit2 />
                                  </button>
                                  <button type="button" onClick={() => removeService(service.id, service.name)}>
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </motion.div>
              )}
            </>
          )}
        </section>

        <AnimatePresence>
          {activeModal === 'artist' && (
            <GestionModal
              title={editing.artistId ? 'Editar artista' : 'Nuevo artista'}
              description="Perfil limpio para la web. Los trabajos del tatuador se suben en Galeria."
              onClose={resetArtistForm}
            >
              <form className="gestion-form" onSubmit={submitArtist}>
                <div className="gestion-form-grid">
                  <Field label="Nombre">
                    <input
                      type="text"
                      value={artistForm.name}
                      onChange={(e) => setArtistForm((current) => ({ ...current, name: e.target.value }))}
                    />
                  </Field>
                  <Field label="Especialidad">
                    <input
                      type="text"
                      value={artistForm.specialization}
                      onChange={(e) => setArtistForm((current) => ({ ...current, specialization: e.target.value }))}
                      placeholder="Ej. Fine line, blackwork, realism"
                    />
                  </Field>
                  <Field label="Handle social">
                    <input
                      type="text"
                      placeholder='Ej. @skinart.tattoo'
                      value={artistForm.social_handle}
                      onChange={(e) => setArtistForm((current) => ({ ...current, social_handle: e.target.value }))}
                    />
                  </Field>
                  <Field label="Foto">
                    <input type="file" accept="image/*" onChange={setArtistImage} />
                  </Field>
                </div>

                <Field label="Detalle">
                  <textarea
                    value={artistForm.biography}
                    onChange={(e) => setArtistForm((current) => ({ ...current, biography: e.target.value }))}
                    placeholder="Descripcion breve del artista para la web."
                  />
                </Field>

                {artistForm.imagePreview && (
                  <div className="gestion-image-preview">
                    <img src={previewSource(artistForm.imagePreview)} alt="Preview artista" />
                  </div>
                )}

                <div className="gestion-form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    <FiPlusCircle /> {editing.artistId ? 'Actualizar' : 'Crear artista'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetArtistForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </GestionModal>
          )}

          {activeModal === 'product' && (
            <GestionModal
              title={editing.productId ? 'Editar producto' : 'Nuevo producto'}
              description="Administra productos, precios e imagenes del catalogo."
              onClose={resetProductForm}
            >
              <form className="gestion-form" onSubmit={submitProduct}>
                <div className="gestion-form-grid">
                  <Field label="Nombre">
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm((current) => ({ ...current, name: e.target.value }))}
                    />
                  </Field>
                  <Field label="Marca">
                    <select
                      required
                      value={productForm.brand_id}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        const selectedBrand = brands.find((brand) => String(brand.id) === nextId);
                        setProductForm((current) => ({
                          ...current,
                          brand_id: nextId,
                          brand: selectedBrand?.name || '',
                        }));
                      }}
                    >
                      <option value="">Selecciona una marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Precio">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm((current) => ({ ...current, price: e.target.value }))}
                    />
                  </Field>
                  <Field label="Cantidad disponible">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={productForm.quantity_available}
                      onChange={(e) => setProductForm((current) => ({ ...current, quantity_available: e.target.value }))}
                    />
                  </Field>
                </div>

                <Field label="Foto del producto">
                  <input
                    type="file"
                    accept="image/*"
                    required={!productForm.imagePreview}
                    onChange={setProductImage}
                  />
                </Field>

                {productForm.imagePreview && (
                  <div className="gestion-image-preview">
                    <img src={previewSource(productForm.imagePreview)} alt="Preview producto" />
                  </div>
                )}

                <div className="gestion-form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    <FiPlusCircle /> {editing.productId ? 'Actualizar' : 'Crear producto'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </GestionModal>
          )}

          {activeModal === 'gallery' && (
            <GestionModal
              title={editing.galleryId ? 'Editar pieza' : 'Nueva pieza'}
              description="Controla que trabajos aparecen en la galeria publica."
              onClose={resetGalleryForm}
            >
              <form className="gestion-form" onSubmit={submitGallery}>
                <div className="gestion-form-grid">
                  <Field label="Titulo">
                    <input
                      type="text"
                      value={galleryForm.name}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, name: e.target.value }))}
                    />
                  </Field>
                  <Field label="Tatuador">
                    <select
                      value={galleryForm.artist_id}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, artist_id: e.target.value }))}
                    >
                      <option value="">Selecciona un artista</option>
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Estilo">
                    <select
                      value={galleryForm.tattoo_type}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, tattoo_type: e.target.value }))}
                    >
                      {TATTOO_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Fecha">
                    <input
                      type="date"
                      value={galleryForm.work_date}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, work_date: e.target.value }))}
                    />
                  </Field>
                  <Field label="Orden">
                    <input
                      type="number"
                      min="0"
                      value={galleryForm.sequence}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, sequence: e.target.value }))}
                    />
                  </Field>
                  <Field label="Imagen">
                    <input type="file" accept="image/*" onChange={setGalleryImage} />
                  </Field>
                </div>

                <Field label="Descripcion">
                  <textarea
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm((current) => ({ ...current, description: e.target.value }))}
                  />
                </Field>

                <div className="gestion-switch-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={galleryForm.active}
                      onChange={(e) => setGalleryForm((current) => ({ ...current, active: e.target.checked }))}
                    />
                    Activo
                  </label>
                </div>

                {galleryForm.imagePreview && (
                  <div className="gestion-image-preview">
                    <img src={previewSource(galleryForm.imagePreview)} alt="Preview galeria" />
                  </div>
                )}

                <div className="gestion-form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    <FiPlusCircle /> {editing.galleryId ? 'Actualizar' : 'Crear pieza'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetGalleryForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </GestionModal>
          )}

          {activeModal === 'service' && (
            <GestionModal
              title={editing.serviceId ? 'Editar servicio' : 'Nuevo servicio'}
              description="Servicio general del estudio, sin precio fijo ni tatuador asignado."
              onClose={resetServiceForm}
            >
              <form className="gestion-form" onSubmit={submitService}>
                <div className="gestion-form-grid">
                  <Field label="Nombre">
                    <input
                      type="text"
                      required
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm((current) => ({ ...current, name: e.target.value }))}
                    />
                  </Field>
                </div>

                <Field label="Descripcion">
                  <textarea
                    required
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm((current) => ({ ...current, description: e.target.value }))}
                    placeholder="Ej. Cover, modificacion, retoque o cualquier servicio general del estudio."
                  />
                </Field>

                <div className="gestion-switch-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={serviceForm.active}
                      onChange={(e) => setServiceForm((current) => ({ ...current, active: e.target.checked }))}
                    />
                    Activo
                  </label>
                </div>

                <div className="gestion-form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    <FiPlusCircle /> {editing.serviceId ? 'Actualizar' : 'Crear servicio'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetServiceForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </GestionModal>
          )}

          {deleteTarget && (
            <GestionModal
              title={deleteTarget.title}
              description={deleteTarget.description}
              onClose={() => setDeleteTarget(null)}
            >
              <div className="gestion-delete-panel">
                <p>
                  Vas a eliminar <strong>{deleteTarget.name || 'este registro'}</strong>. Esta accion no se
                  puede deshacer desde el panel.
                </p>
                <div className="gestion-form-actions">
                  <button type="button" className="btn btn-primary gestion-danger-btn" onClick={confirmDelete} disabled={isSaving}>
                    <FiTrash2 /> Eliminar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </GestionModal>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
