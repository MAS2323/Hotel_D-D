// src/components/sections/ServicesSection.js (actualizado con fetch dinámico desde API)
import { useState, useEffect } from "react";
import { servicesAPI } from "../../services/api";
import "./ServicesSection.css";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll();
        const list = Array.isArray(response)
          ? response
          : response.services || [];
        setServices(list);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]); // Fallback a vacío o array estático si error
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="services-section">
        <div className="services-container">
          <h2 className="services-title">Nuestros Servicios</h2>
          <div className="loading-spinner">Cargando servicios...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service.id || index} className="service-item">
                {service.icon_url ? (
                  <img
                    src={service.icon_url}
                    alt={service.title}
                    className="service-icon"
                  />
                ) : (
                  <span className="service-icon-placeholder">🏰</span>
                )}
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))
          ) : (
            <p className="no-services">
              No hay servicios disponibles en este momento.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
