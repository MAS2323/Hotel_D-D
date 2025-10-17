// src/pages/Services.js
import { motion } from "framer-motion";
import "./Services.css";

const Services = () => {
  const services = [
    {
      icon: "🛏️",
      title: "Habitaciones Temáticas",
      description:
        "Estancias inspiradas en D&D: desde cuevas de dragón hasta torres mágicas, con comodidades modernas.",
    },
    {
      icon: "🏊",
      title: "Piscina Encantada",
      description:
        "Relájate en aguas termales con vistas al bosque, disponible 24/7 para huéspedes aventureros.",
    },
    {
      icon: "💪",
      title: "Gimnasio del Guerrero",
      description:
        "Equipo de entrenamiento para forjar tu fuerza, con clases de yoga élfico incluidas.",
    },
    {
      icon: "🧖",
      title: "Spa Arcano",
      description:
        "Masajes y tratamientos con esencias mágicas para restaurar tu vitalidad post-quest.",
    },
    {
      icon: "🚗",
      title: "Estacionamiento Seguro",
      description:
        "Guarda tu montura (o auto) en nuestro valet gratuito, custodiado por guardianes invisibles.",
    },
    {
      icon: "📶",
      title: "WiFi Mágico",
      description:
        "Conexión ilimitada en todo el hotel, para compartir tus hazañas en redes sociales.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="services-section"
    >
      <div className="services-container">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="services-title"
        >
          Servicios e Instalaciones
        </motion.h1>

        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="services-desc"
        >
          Descubre todas las maravillas que ofrecemos para hacer tu estancia en
          el Hotel D&D inolvidable.
        </motion.p>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="services-item"
            >
              <div className="services-icon">{service.icon}</div>
              <h3 className="services-item-title">{service.title}</h3>
              <p className="services-item-desc">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
