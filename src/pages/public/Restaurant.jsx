// src/pages/Restaurant.js
import { motion } from "framer-motion";
import { useState } from "react";
import "./Restaurant.css";

const Restaurant = () => {
  const [reservationTime, setReservationTime] = useState("");

  const handleReserve = (e) => {
    e.preventDefault();
    alert(
      `¡Reserva confirmada para las ${reservationTime}! Ven a probar nuestra poción especial (cóctel rojo dragón).`
    );
    setReservationTime("");
  };

  const menuItems = [
    {
      name: "Estofado de Dragón",
      description: "Carne tierna con especias mágicas, servido con pan élfico.",
      price: "$25",
    },
    {
      name: "Cóctel de Fuego",
      description:
        "Mezcla vibrante de ron y jugos exóticos, con un toque de chile para el ardor.",
      price: "$15",
    },
    {
      name: "Ensalada del Bosque",
      description:
        "Verduras frescas de nuestros jardines encantados, con aderezo de miel de abeja hada.",
      price: "$18",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="restaurant-section"
    >
      <div className="restaurant-container">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="restaurant-title"
        >
          Restaurante & Bar D&D
        </motion.h1>

        {/* Sección Hero */}
        <motion.section
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="restaurant-hero"
        >
          <h2 className="restaurant-hero-title">
            ¡Sabores Épicos para Héroes!
          </h2>
          <p className="restaurant-hero-desc">
            Disfruta de menús inspirados en D&D: desde estofados de dragón hasta
            cócteles de fuego. Abierto de 7am a 11pm.
          </p>
          <a href="#reserve" className="restaurant-hero-btn">
            Reservar Mesa
          </a>
        </motion.section>

        {/* Menú */}
        <section id="menu" className="restaurant-menu">
          <h2 className="restaurant-menu-title">Menú Destacado</h2>
          <div className="restaurant-menu-grid">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="restaurant-menu-item"
              >
                <h3 className="restaurant-menu-item-title">{item.name}</h3>
                <p className="restaurant-menu-item-desc">{item.description}</p>
                <p className="restaurant-menu-item-price">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reserva */}
        <section id="reserve" className="restaurant-reserve">
          <h2 className="restaurant-reserve-title">Reserva tu Mesa</h2>
          <form onSubmit={handleReserve} className="restaurant-reserve-form">
            <select
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className="restaurant-reserve-select"
              required
            >
              <option value="">Selecciona un horario</option>
              <option value="19:00">7:00 PM - Cena Épica</option>
              <option value="21:00">9:00 PM - Cócteles Nocturnos</option>
              <option value="22:00">10:00 PM - Cierre con Broche de Oro</option>
            </select>
            <button type="submit" className="restaurant-reserve-btn">
              Reservar
            </button>
          </form>
        </section>
      </div>
    </motion.section>
  );
};

export default Restaurant;
