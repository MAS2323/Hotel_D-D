// components/ui/RoomCard.jsx - Versión simplificada
import React from "react";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      {/* Imagen principal - mismo patrón que RoomsManagement */}
      {room.images?.[0] && (
        <img
          src={room.images[0].url}
          alt={room.images[0].alt || room.name}
          className="room-card-image"
        />
      )}

      <div className="room-card-content">
        <h3 className="room-card-title">{room.name}</h3>
        <p className="room-card-description">
          {room.description || "Sin descripción"}
        </p>
        <p className="room-card-price">${room.price}/noche</p>

        <span
          className={`room-status ${
            room.is_available ? "available" : "occupied"
          }`}
        >
          {room.is_available ? "Disponible" : "Ocupada"}
        </span>

        {/* Mini galería si hay imágenes */}
        {room.images && room.images.length > 0 && (
          <div className="room-mini-gallery">
            {room.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt || `Imagen ${idx + 1}`}
                className="mini-image"
              />
            ))}
          </div>
        )}

        <button className="room-card-button">Ver Detalles</button>
      </div>
    </div>
  );
};

export default RoomCard;
