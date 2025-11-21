// src/pages/Services.js
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { servicesAPI } from "../../services/api";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getAll(0, 100); // Fetch all services
        const servicesData = Array.isArray(response)
          ? response
          : response.services || response.data || [];
        setServices(
          servicesData.map((service) => ({
            ...service,
            icon: service.icon || "⭐", // Default icon if not provided
          }))
        );
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("No se pudieron cargar los servicios.");
        // Fallback to hardcoded if error
        setServices([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="services-section"
      >
        <div className="services-container">
          <h1 className="services-title">Cargando servicios...</h1>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="services-section"
      >
        <div className="services-container">
          <h1 className="services-title">{error}</h1>
        </div>
      </motion.section>
    );
  }

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
              key={service.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="services-item"
            >
              <div className="services-icon">
                {" "}
                {service.icon_url ? (
                  <img
                    src={service.icon_url}
                    alt={service.title}
                    className="service-icon"
                  />
                ) : (
                  <div className="service-icon-placeholder">🏰</div>
                )}
              </div>
              <h3 className="services-item-title">{service.title}</h3>
              <p className="services-item-desc">
                {service.desc || service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
