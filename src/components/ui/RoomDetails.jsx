// pages/RoomDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { roomsAPI } from "../../services/api";
import ImageCarousel from "./ImageCarousel";
import RelatedRooms from "./RelatedRooms";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { roomId } = useParams();
  const { state } = useLocation();

  const [room, setRoom] = useState(state?.room || null);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(!state?.room);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!room) fetchRoom();
    fetchAllRooms();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await roomsAPI.rooms.getById(roomId, token);
      setRoom(response);
    } catch (err) {
      setError("No se pudo cargar la habitación");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await roomsAPI.rooms.getAll(token);
      setAllRooms(response);
    } catch (err) {
      console.error("Error cargando habitaciones relacionadas:", err);
    }
  };

  if (loading) return <div className="loading">Cargando habitación...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!room) return <div className="not-found">Habitación no encontrada</div>;

  return (
    <div className="room-details-page">
      <Link to="/rooms" className="back-button">
        ← Volver a habitaciones
      </Link>

      <div className="room-details-container">
        {/* Carrusel con autoplay y clic para pantalla completa */}
        <ImageCarousel
          images={room.images}
          roomName={room.name}
          roomId={roomId}
        />

        {/* Información principal */}
        <div className="room-main-info">
          <h1 className="room-title">{room.name}</h1>

          <div className="room-features">
            <div className="feature-item">
              <span className="label">Precio por noche:</span>
              <span className="value highlight">XAF {room.price}</span>
            </div>

            <div className="feature-item">
              <span className="label">Disponibilidad:</span>
              <span
                className={`status-badge ${
                  room.is_available ? "available" : "occupied"
                }`}
              >
                {room.is_available ? "✅ Disponible" : "❌ Ocupada"}
              </span>
            </div>
          </div>

          <div className="description-section">
            <h2>Descripción</h2>
            <p className="description-text">
              {room.description ||
                "Disfruta de una experiencia única en nuestra confortable habitación con todas las comodidades incluidas."}
            </p>
          </div>

          {/* Botón de reserva */}
          <div className="booking-section">
            <button
              className={`btn-reserve ${!room.is_available ? "disabled" : ""}`}
              disabled={!room.is_available}
              onClick={() =>
                alert(
                  room.is_available
                    ? "Procesando reserva..."
                    : "Habitación no disponible"
                )
              }
            >
              {room.is_available ? "Reservar Ahora" : "No Disponible"}
            </button>
          </div>
        </div>
      </div>

      {/* Habitaciones relacionadas */}
      <RelatedRooms
        rooms={allRooms}
        currentRoomId={roomId}
        title="Descubre Otras Habitaciones"
      />
    </div>
  );
};

export default RoomDetails;
