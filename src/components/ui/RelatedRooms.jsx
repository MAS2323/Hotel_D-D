// components/rooms/RelatedRooms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RelatedRooms.css";

const RelatedRooms = ({
  rooms,
  currentRoomId,
  title = "Otras Habitaciones",
}) => {
  const navigate = useNavigate();

  // Filtrar la habitación actual y tomar 3 aleatorias
  const relatedRooms = rooms
    .filter((room) => room.id !== parseInt(currentRoomId))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  if (relatedRooms.length === 0) return null;

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className="related-rooms-container">
      <h2 className="related-rooms-title">{title}</h2>
      <div className="related-rooms-grid">
        {relatedRooms.map((room) => (
          <div
            key={room.id}
            className="related-room-card"
            onClick={() => handleRoomClick(room.id)}
          >
            {room.images?.[0] && (
              <img
                src={room.images[0].url}
                alt={room.images[0].alt || room.name}
                className="related-room-image"
              />
            )}
            <div className="related-room-info">
              <h3>{room.name}</h3>
              <p className="price">XAF {room.price}/noche</p>
              <span
                className={`status ${
                  room.is_available ? "available" : "occupied"
                }`}
              >
                {room.is_available ? "Disponible" : "Ocupada"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedRooms;
