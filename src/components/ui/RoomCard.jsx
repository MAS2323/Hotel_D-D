import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Navega a la página de detalles pasando los datos
    navigate(`/rooms/${room.id}`, { state: { room } });
  };

  const handleTariffClick = () => {
    // Navega a la pantalla de reservas capturando el room actual
    navigate("/booking", { state: { room } });
  };

  return (
    <div className="room-card">
      {/* Imagen full-width arriba */}
      {room.images?.[0] && (
        <div className="room-image-header">
          <img
            src={room.images[0].url}
            alt={room.images[0].alt || room.name}
            className="room-card-image"
          />
          {room.is_featured && (
            <span className="featured-badge">⭐ Destacada</span>
          )}
        </div>
      )}

      {/* Contenido debajo */}
      <div className="room-content">
        <h3 className="room-card-title">{room.name}</h3>

        <div className="room-details-row">
          <div className="detail-left">
            <span className="detail-icon">📏</span>
            <span>Tamaño: {room.size || 25} m²</span>
          </div>
          <div className="detail-right">
            <span className="detail-icon">👥</span>
            <span>Capacidad: {room.max_guests || 2} huéspedes</span>
          </div>
        </div>

        <div className="room-details-row">
          <div className="detail-left">
            <span className="detail-icon">🛏️</span>
            <span>{room.bed_type === "doble" ? "Cama doble" : "2 camas"}</span>
          </div>
          {room.has_tv && (
            <div className="detail-right">
              <span className="detail-icon">📺</span>
              <span>TV pantalla plana</span>
            </div>
          )}
        </div>

        <div className="room-buttons">
          <button onClick={handleDetailsClick} className="btn-more-info">
            Más información
          </button>
          <button onClick={handleTariffClick} className="btn-select-tariff">
            Haz tu reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
