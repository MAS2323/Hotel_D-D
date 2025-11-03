// src/pages/Rooms.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "../../components/ui/RoomCard";
import { roomsAPI } from "../../services/api";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await roomsAPI.getAll();

        // Maneja la respuesta igual que en RoomsManagement
        const roomsData = Array.isArray(response)
          ? response
          : response.rooms || response.data || [];

        console.log("Rooms data:", roomsData); // Para debug
        if (roomsData.length > 0) {
          console.log("First room images:", roomsData[0].images); // Para debug
        }

        setRooms(roomsData);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Error al cargar las habitaciones");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando habitaciones...</div>
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

  if (!rooms || rooms.length === 0) {
    return (
      <div className="empty-container">
        <p>No hay habitaciones disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <section className="rooms-section">
      <div className="rooms-container">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rooms-title"
        >
          Nuestras Habitaciones
        </motion.h1>
        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
