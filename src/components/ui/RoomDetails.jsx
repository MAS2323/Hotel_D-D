import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { roomsAPI } from "../../services/api";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(location.state?.room || null);
  const [loading, setLoading] = useState(!room);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay datos en el state, cargarlos desde la API
    if (!room) {
      const fetchRoom = async () => {
        try {
          setLoading(true);
          const response = await roomsAPI.getById(roomId);
          setRoom(response);
        } catch (err) {
          setError("No se pudo cargar la información de la habitación");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [roomId, room]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (room?.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (room?.images?.length || 1)) % (room?.images?.length || 1)
    );
  };

  const handleTariffClick = () => {
    // Navega a la pantalla de reservas capturando el room actual
    navigate("/booking", { state: { room } });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando información...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="error-container">
        <p>{error || "No se encontró la habitación"}</p>
        <Link to="/rooms" className="back-link">
          ← Volver a habitaciones
        </Link>
      </div>
    );
  }

  // Arrays para columnas izquierda y derecha - Equitativos y distribuidos
  const leftColumnDetails = [
    { icon: "📏", label: `Tamaño de habitación: ${room?.size || 25} m²` },
    { icon: "🛏️", label: room.bed_type === "doble" ? "Cama doble" : "2 camas" },
    ...(room.amenities?.[5] ? [{ icon: "🌅", label: "Área de estar" }] : []),
    ...(room.amenities?.[6]
      ? [{ icon: "🌡️", label: "Aire acondicionado" }]
      : []),
    ...(room.amenities?.[7] ? [{ icon: "🔒", label: "Caja fuerte" }] : []),
    ...(room.amenities?.[8] ? [{ icon: "🚿", label: "Baño o ducha" }] : []),
  ];

  const rightColumnDetails = [
    { icon: "👥", label: `Adecuado para ${room?.max_guests || 2} huéspedes` },
    ...(room.has_tv
      ? [{ icon: "📺", label: "Televisión de pantalla plana" }]
      : []),
    ...(room.amenities?.[9] ? [{ icon: "🛁", label: "Secador de pelo" }] : []),
    ...(room.amenities?.[10]
      ? [{ icon: "🚭", label: "Habitaciones no fumadores" }]
      : []),
    ...(room.amenities?.[11]
      ? [{ icon: "🛎️", label: "Servicio de despertador" }]
      : []),
    ...(room.amenities?.[12]
      ? [{ icon: "🔐", label: "Cerradura de seguridad" }]
      : []),
    ...(room.amenities?.[13] ? [{ icon: "📶", label: "Wi-Fi gratuito" }] : []),
    ...(room.amenities?.[14]
      ? [{ icon: "🥤", label: "Minibar gratuito" }]
      : []),
    ...(room.amenities?.[15] ? [{ icon: "🔌", label: "Hervidor" }] : []),
    ...(room.amenities?.[16]
      ? [{ icon: "☕", label: "Máquina de café Nespresso" }]
      : []),
    ...(room.amenities?.[17] ? [{ icon: "📞", label: "Teléfono" }] : []),
  ];

  const imageCount = room.images?.length || 1;

  return (
    <section className="room-details-section">
      <div className="room-details-container">
        {/* Carrusel de imágenes */}
        <div className="details-carousel">
          <button className="carousel-prev" onClick={prevImage}>
            ‹
          </button>
          {room.images?.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt || room.name}
              className={`carousel-image ${
                index === currentImageIndex ? "active" : ""
              }`}
            />
          ))}
          <button className="carousel-next" onClick={nextImage}>
            ›
          </button>
        </div>

        {/* Información principal */}
        <div className="details-main-content">
          <div className="details-info">
            <h1 className="room-title">{room.name}</h1>

            <div className="room-meta">
              <div className="meta-item">
                <span className="meta-icon">📏</span>
                <span>{room.size || 25} m²</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <span>Capacidad: {room.max_guests || 2} personas</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🛏️</span>
                <span>
                  {room.bed_type === "doble" ? "Cama doble" : "2 camas"}
                </span>
              </div>
              {room.has_tv && (
                <div className="meta-item">
                  <span className="meta-icon">📺</span>
                  <span>TV pantalla plana</span>
                </div>
              )}
            </div>

            <p className="room-description">
              {room.description ||
                "Con 25m² de espacio, cama doble y todo lo esencial a su alcance, nuestra habitación Comfort con 1 Cama Doble es ideal para dos huéspedes. Disfrute de todas las comodidades modernas para una estancia perfecta."}
            </p>

            <div className="price-section">
              <p className="room-price">XAF {room.price}/noche</p>
              <span
                className={`room-status ${
                  room.is_available ? "available" : "occupied"
                }`}
              >
                {room.is_available ? "Disponible" : "Ocupada"}
              </span>
            </div>
          </div>

          {/* Amenidades */}
          <aside className="details-amenities">
            <h3 className="amenities-title">Detalles y Amenidades</h3>
            <div className="amenities-grid">
              <div className="amenities-column">
                <h4 className="column-title">Detalles</h4>
                <ul className="column-list">
                  {leftColumnDetails.map((detail, index) => (
                    <li key={index} className="detail-item">
                      <span className="detail-icon">{detail.icon}</span>
                      <span className="detail-label">{detail.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="amenities-column">
                <h4 className="column-title">Amenidades</h4>
                <ul className="column-list">
                  {rightColumnDetails.map((detail, index) => (
                    <li key={index} className="detail-item">
                      <span className="detail-icon">{detail.icon}</span>
                      <span className="detail-label">{detail.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Thumbnails */}
        {room.images?.length > 1 && (
          <div className="details-thumbnails">
            <div className="thumbnails-indicator">
              {currentImageIndex + 1}/{imageCount}
            </div>
            <div className="thumbnails-container">
              {room.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || `Imagen ${idx + 1}`}
                  className={`thumbnail-image ${
                    idx === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="details-action">
          <button
            className="btn-select-tariff"
            onClick={handleTariffClick}
            disabled={!room.is_available}
          >
            {room.is_available ? "Haz tu reserva" : "No disponible"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
