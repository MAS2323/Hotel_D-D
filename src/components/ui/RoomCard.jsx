// components/ui/RoomCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  const navigate = useNavigate(); // Hook para navegar

  const handleDetailsClick = () => {
    // Opción 1: Pasar datos por state (más rápido)
    navigate(`/rooms/${room.id}`, { state: { room } });

    // Opción 2: Solo pasar ID y fetch en el destino (más actualizado)
    // navigate(`/rooms/${room.id}`);
  };

  return (
    <div className="room-card">
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
        <p className="room-card-price">XAF{room.price}/noche</p>

        <span
          className={`room-status ${
            room.is_available ? "available" : "occupied"
          }`}
        >
          {room.is_available ? "Disponible" : "Ocupada"}
        </span>

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

        {/* Botón con handler */}
        <button onClick={handleDetailsClick} className="room-card-button">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
