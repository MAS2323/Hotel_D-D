// components/client/ApartmentsList.js (actualizado para matching con RoomCard)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { apartmentsAPI } from "../../services/api";
import "./ApartmentsList.css";

const ApartmentsList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apartmentsAPI.getAll();
        setApartments(
          Array.isArray(response)
            ? response
            : response.data || response.apartments || []
        );
      } catch (err) {
        const errorMsg = err.message || "Error al cargar apartamentos";
        console.error(err);
        setError(errorMsg);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando apartamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <div className="empty-container">
        <p>No hay apartamentos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <section className="apartments-section">
      <div className="apartments-container">
        {/* Header con título y enlace a habitaciones */}
        <header className="header-section">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="apartments-title"
          >
            Nuestros Apartamentos
          </motion.h1>
          <nav>
            <Link to="/rooms">Ver Habitaciones</Link>
          </nav>
        </header>

        <div className="apartments-grid">
          {apartments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApartmentCard apt={apt} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente ApartmentCard similar a RoomCard
const ApartmentCard = ({ apt }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDetailsClick = () => {
    setShowModal(true);
    setCurrentImageIndex(0);
  };

  const handleTariffClick = () => {
    console.log("Seleccionar tarifas para", apt.name);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (apt.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (apt.images?.length || 1)) % (apt.images?.length || 1)
    );
  };

  // Arrays base de amenidades adaptadas para apartamentos
  const baseAmenitiesLeft = [
    {
      id: 1,
      icon: "📏",
      label: `Tamaño: ${apt?.square_meters || 50} m²`,
    }, // Siempre mostrar (dinámico)
    {
      id: 2,
      icon: "👥",
      label: `Capacidad: ${apt?.capacity || 2} huéspedes`,
    }, // Siempre (dinámico)
    { id: 5, icon: "🍳", label: "Cocina equipada" },
    { id: 6, icon: "🌡️", label: "Aire acondicionado" },
    { id: 7, icon: "🔒", label: "Caja fuerte" },
    { id: 8, icon: "🚿", label: "Baños completos" },
    { id: 9, icon: "🧺", label: "Lavadora/Secadora" },
    { id: 10, icon: "🚗", label: "Estacionamiento" },
  ];

  const baseAmenitiesRight = [
    {
      id: 0,
      icon: "🛏️",
      label: `${apt.num_bedrooms || 1} habitaciones`,
    }, // Dinámico
    { id: 4, icon: "📺", label: "Televisión" }, // Condicional si en amenities
    { id: 11, icon: "🛎️", label: "Servicio de limpieza" },
    { id: 12, icon: "🔐", label: "Cerradura de seguridad" },
    { id: 13, icon: "📶", label: "Wi-Fi gratuito" },
    { id: 14, icon: "🚪", label: "Balcón/Terraza" },
    { id: 15, icon: "♿", label: "Accesible para discapacitados" },
    { id: 16, icon: "👨‍💼", label: "Conserjería" },
    { id: 17, icon: "📞", label: "Teléfono" },
  ];

  // Filtrar basadas en apt.amenities (asumiendo array de strings, mapear a ids o mostrar matching)
  const amenitiesLeft = [
    ...baseAmenitiesLeft.slice(0, 2), // Siempre dinámicas
    ...baseAmenitiesLeft.slice(2).filter(
      (a) =>
        apt.amenities?.includes(a.label.split(":")[0].trim()) || // Matching aproximado
        apt.amenities?.some((am) =>
          a.label.toLowerCase().includes(am.toLowerCase())
        )
    ),
  ];

  const amenitiesRight = [
    baseAmenitiesRight[0], // Siempre habitaciones (dinámica)
    ...(apt.amenities?.includes("Televisión") ? [baseAmenitiesRight[1]] : []), // TV condicional
    ...baseAmenitiesRight
      .slice(2)
      .filter((a) =>
        apt.amenities?.some((am) =>
          a.label.toLowerCase().includes(am.toLowerCase())
        )
      ),
  ];

  return (
    <>
      <div className="apartment-card">
        {/* Imagen full-width arriba */}
        {apt.images?.[0] && (
          <div className="apartment-image-header">
            <img
              src={apt.images[0].url}
              alt={apt.images[0].alt || apt.name}
              className="apartment-card-image"
            />
            {/* ← NUEVO: Badge de destacada en la imagen si aplica */}
            {apt.is_featured && (
              <span className="featured-badge">⭐ Destacada</span>
            )}
          </div>
        )}

        {/* Contenido debajo: Título y detalles */}
        <div className="apartment-content">
          {/* ← MODIFICADO: Wrapper flex para nombre izquierda y badge derecha */}
          <div className="apartment-card-title-wrapper">
            <h3 className="apartment-card-title">{apt.name}</h3>
          </div>

          {/* Fila 1: Tamaño (izq) | Capacidad (der) */}
          <div className="apartment-details-row">
            <div className="detail-left">
              <span className="detail-icon">📏</span>
              <span>Tamaño: {apt.square_meters} m²</span>
            </div>
            <div className="detail-right">
              <span className="detail-icon">👥</span>
              <span>
                Capacidad {apt.capacity} huésped
                {apt.capacity > 1 ? "es" : ""}
              </span>
            </div>
          </div>

          {/* Fila 2: Habitaciones (izq) | Baños (der) */}
          <div className="apartment-details-row">
            <div className="detail-left">
              <span className="detail-icon">🛏️</span>
              <span>{apt.num_bedrooms} hab.</span>
            </div>
            <div className="detail-right">
              <span className="detail-icon">🚿</span>
              <span>{apt.num_bathrooms} baños</span>
            </div>
          </div>

          {/* Descripción corta, precio y status */}
          <p className="apartment-card-description">
            {apt.description || "Sin descripción"}
          </p>
          <p className="apartment-card-price">${apt.price_per_night}/noche</p>

          <span
            className={`apartment-status ${
              apt.is_active ? "available" : "occupied"
            }`}
          >
            {apt.is_active ? "Activo" : "Inactivo"}
          </span>

          {/* Botones abajo: Más info (izq) | Seleccionar tarifas (der, rojo) */}
          <div className="apartment-buttons">
            <button onClick={handleDetailsClick} className="btn-more-info">
              Más información
            </button>
            <button onClick={handleTariffClick} className="btn-select-tariff">
              Seleccionar tarifas
            </button>
          </div>
        </div>
      </div>

      {/* Popup/Modal para Más información - adaptado para apartamentos */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            {/* Header con logo y botón */}
            <div className="modal-header">
              <div className="hotel-logo">
                <span className="logo-text">D&D</span>
                <span className="logo-sub">Apartamentos</span>
              </div>
              <button className="header-btn">Seleccionar tarifas</button>
            </div>

            {/* Carrusel de imágenes */}
            <div className="modal-carousel">
              <button className="carousel-prev" onClick={prevImage}>
                ‹
              </button>
              {apt.images &&
                apt.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={img.alt || `Imagen ${index + 1}`}
                    className={`carousel-image ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                  />
                ))}
              <button className="carousel-next" onClick={nextImage}>
                ›
              </button>
            </div>

            {/* Contenido principal: Descripción arriba, Amenidades abajo */}
            <div className="modal-main-content">
              <div className="modal-description">
                <h3 className="modal-apartment-card-title">
                  {apt.name}
                  {/* ← NUEVO: Badge de destacada en el modal si aplica */}
                </h3>
                <p className="modal-apartment-card-description">
                  {apt.description ||
                    "Con amplio espacio y todas las comodidades modernas, nuestro apartamento es ideal para familias o grupos. Disfrute de una cocina completamente equipada, Wi-Fi de alta velocidad y vistas espectaculares. Relájese en un ambiente acogedor diseñado para su máxima comodidad."}
                </p>
                <p className="modal-apartment-card-price">
                  ${apt.price_per_night}/noche
                </p>
                <span
                  className={`modal-apartment-status ${
                    apt.is_active ? "available" : "occupied"
                  }`}
                >
                  {apt.is_active ? "Activo" : "Inactivo"}
                </span>
                {/* Información de contacto */}
                <div className="modal-contact-info">
                  <p>
                    <strong>Responsable:</strong> {apt.head}
                  </p>
                  <p>
                    <strong>Email:</strong> {apt.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {apt.phone}
                  </p>
                </div>
              </div>

              {/* Amenidades: Solo las seleccionadas, con checkboxes checked */}
              <div className="amenities-grid">
                <div className="amenities-left">
                  <ul className="amenities-list">
                    {amenitiesLeft.map((amenity, index) => (
                      <li key={index} className="amenity-item">
                        <input
                          type="checkbox"
                          id={`amenity-left-${index}`}
                          checked={
                            [1, 2].includes(amenity.id) || // Dinámicas siempre checked
                            apt.amenities?.some((am) =>
                              amenity.label
                                .toLowerCase()
                                .includes(am.toLowerCase())
                            )
                          }
                          disabled // Solo visual, no editable
                        />
                        <label htmlFor={`amenity-left-${index}`}>
                          <span className="amenity-icon">{amenity.icon}</span>
                          <span className="amenity-label">{amenity.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="amenities-right">
                  <ul className="amenities-list">
                    {amenitiesRight.map((amenity, index) => (
                      <li key={index} className="amenity-item">
                        <input
                          type="checkbox"
                          id={`amenity-right-${index}`}
                          checked={
                            amenity.id === 0 || // Habitaciones siempre
                            (amenity.id === 4 &&
                              apt.amenities?.includes("Televisión")) || // TV condicional
                            apt.amenities?.some((am) =>
                              amenity.label
                                .toLowerCase()
                                .includes(am.toLowerCase())
                            )
                          }
                          disabled
                        />
                        <label htmlFor={`amenity-right-${index}`}>
                          <span className="amenity-icon">{amenity.icon}</span>
                          <span className="amenity-label">{amenity.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botón seleccionar tarifas */}
              <div className="modal-booking-section">
                <button
                  className="btn-select-tariff"
                  onClick={handleTariffClick}
                >
                  Seleccionar tarifas
                </button>
              </div>
            </div>

            {/* Thumbnails abajo */}
            {apt.images && apt.images.length > 1 && (
              <div className="modal-apartment-thumbnails">
                <div className="thumbnails-indicator">
                  {currentImageIndex + 1}/{apt.images.length}
                </div>
                <div className="thumbnails-container">
                  {apt.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={img.alt || `Imagen ${idx + 1}`}
                      className="thumbnail-image"
                      onClick={() => setCurrentImageIndex(idx + 1)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ApartmentsList;
