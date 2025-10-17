// src/pages/Rooms.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "../../components/ui/RoomCard";
import { roomsAPI } from "../../services/api";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    roomsAPI.getAll().then((res) => setRooms(res.data));
  }, []);

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
