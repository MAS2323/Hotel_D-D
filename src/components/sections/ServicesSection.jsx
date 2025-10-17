// src/components/sections/ServicesSection.js
import "./ServicesSection.css";

const ServicesSection = () => {
  const services = [
    {
      icon: "🏰",
      title: "Habitaciones Temáticas",
      desc: "Sumérgete en mundos de D&D",
    },
    { icon: "🍽️", title: "Restaurante Épico", desc: "Comidas de fantasía" },
    { icon: "🏊", title: "Piscina Mágica", desc: "Relájate como un hechicero" },
    { icon: "📶", title: "WiFi Gratuito", desc: "Conecta tu aventura" },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-item">
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
