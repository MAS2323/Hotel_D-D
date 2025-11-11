import React, { useState } from "react";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDetailsClick = () => {
    setShowModal(true);
    setCurrentImageIndex(0);
  };

  const handleTariffClick = () => {
    console.log("Seleccionar tarifas para", room.name);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (room.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (room.images?.length || 1)) % (room.images?.length || 1)
    );
  };

  // Lista de amenidades dividida en grupos para distribución izquierda/derecha
  const amenitiesLeft = [
    {
      id: 1,
      icon: "📏",
      label: `Tamaño de habitación: ${room?.size || 25} m²`,
    },
    {
      id: 2,
      icon: "👥",
      label: `Adecuado para ${room?.max_guests || 2} huéspedes`,
    },
    { id: 5, icon: "🌅", label: "Área de estar" },
    { id: 6, icon: "🌡️", label: "Aire acondicionado" },
    { id: 7, icon: "🔒", label: "Caja fuerte" },
    { id: 8, icon: "🚿", label: "Baño o ducha" },
    { id: 9, icon: "🛁", label: "Secador de pelo" },
    { id: 10, icon: "🚭", label: "Habitaciones no fumadores" },
  ];

  const amenitiesRight = [
    { id: 0, icon: "🛏️", label: "Cama doble" },
    { id: 4, icon: "📺", label: "Televisión de pantalla plana" },
    { id: 11, icon: "🛎️", label: "Servicio de despertador" },
    { id: 12, icon: "🔐", label: "Cerradura de seguridad" },
    { id: 13, icon: "📶", label: "Wi-Fi gratuito" },
    { id: 14, icon: "🥤", label: "Minibar gratuito" },
    { id: 15, icon: "🔌", label: "Hervidor" },
    { id: 16, icon: "☕", label: "Máquina de café Nespresso" },
    { id: 17, icon: "📞", label: "Teléfono" },
  ];

  return (
    <>
      <div className="room-card">
        {/* Imagen full-width arriba */}
        {room.images?.[0] && (
          <div className="room-image-header">
            <img
              src={room.images[0].url}
              alt={room.images[0].alt || room.name}
              className="room-card-image"
            />
          </div>
        )}

        {/* Contenido debajo: Título y detalles */}
        <div className="room-content">
          <h3 className="room-card-title">{room.name}</h3>

          {/* Fila 1: Tamaño (izq) | Huéspedes (der) */}
          <div className="room-details-row">
            <div className="detail-left">
              <span className="detail-icon">📏</span>
              <span>Tamaño de habitación: {room.size} m²</span>
            </div>
            <div className="detail-right">
              <span className="detail-icon">👥</span>
              <span>
                Adecuado para {room.max_guests} huésped
                {room.max_guests > 1 ? "es" : ""}
              </span>
            </div>
          </div>

          {/* Fila 2: Cama (izq) | TV (der) */}
          <div className="room-details-row">
            <div className="detail-left">
              <span className="detail-icon">🛏️</span>
              <span>
                {room.bed_type === "doble" ? "Cama doble" : "2 camas"}
              </span>
            </div>
            {room.has_tv && (
              <div className="detail-right">
                <span className="detail-icon">📺</span>
                <span>Televisión de pantalla plana</span>
              </div>
            )}
          </div>

          {/* Descripción corta, precio y status */}
          <p className="room-card-description">
            {room.description || "Sin descripción"}
          </p>
          <p className="room-card-price">XAF {room.price}/noche</p>

          <span
            className={`room-status ${
              room.is_available ? "available" : "occupied"
            }`}
          >
            {room.is_available ? "Disponible" : "Ocupada"}
          </span>

          {/* Botones abajo: Más info (izq) | Seleccionar tarifas (der, rojo) */}
          <div className="room-buttons">
            <button onClick={handleDetailsClick} className="btn-more-info">
              Más información
            </button>
            <button onClick={handleTariffClick} className="btn-select-tariff">
              Seleccionar tarifas
            </button>
          </div>
        </div>
      </div>

      {/* Popup/Modal para Más información */}
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
                <span className="logo-sub">Hotel</span>
              </div>
              <button className="header-btn">Seleccionar tarifas</button>
            </div>

            {/* Carrusel de imágenes */}
            <div className="modal-carousel">
              <button className="carousel-prev" onClick={prevImage}>
                ‹
              </button>
              {room.images &&
                room.images.map((img, index) => (
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
                <h3 className="modal-room-card-title">{room.name}</h3>
                <p className="modal-room-card-description">
                  {room.description ||
                    "Con 25m² de espacio, cama doble y todo lo esencial a su alcance, nuestra habitación Comfort con 1 Cama Doble es ideal para dos huéspedes. Despiértese con una taza de café recién hecho de su cafetera Nespresso y relájese tras un día explorando Leeuwarden en un cuarto de baño equipado con una relajante bañera o una refrescante ducha. Sencilla, cómoda y perfecta."}
                </p>
                <p className="modal-room-card-price">XAF {room.price}/noche</p>
                <span
                  className={`modal-room-status ${
                    room.is_available ? "available" : "occupied"
                  }`}
                >
                  {room.is_available ? "Disponible" : "Ocupada"}
                </span>
              </div>

              {/* Amenidades debajo del precio, distribuidas izq/der */}
              <div className="amenities-grid">
                <div className="amenities-left">
                  <ul className="amenities-list">
                    {amenitiesLeft.map((amenity, index) => (
                      <li key={index} className="amenity-item">
                        <input
                          type="checkbox"
                          id={`amenity-left-${index}`}
                          checked
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
                          checked
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
            {room.images && room.images.length > 1 && (
              <div className="modal-room-thumbnails">
                <div className="thumbnails-indicator">3/4</div>
                <div className="thumbnails-container">
                  {room.images.slice(1, 5).map((img, idx) => (
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

export default RoomCard;
