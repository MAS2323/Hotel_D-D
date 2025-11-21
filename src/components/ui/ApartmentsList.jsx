import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { apartmentsAPI } from "../../services/api";
import "./ApartmentsList.css";

// Componente ApartmentCard actualizado para navegación
const ApartmentCard = ({ apt }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Navega a la página de detalles pasando los datos
    navigate(`/apartments/${apt.id}`, { state: { property: apt } });
  };

  const handleTariffClick = () => {
    // Navega a la pantalla de reservas capturando el room actual
    navigate("/booking", { state: { apt } });
  };

  return (
    <div className="apartment-card">
      {apt.images?.[0] && (
        <div className="apartment-image-header">
          <img
            src={apt.images[0].url}
            alt={apt.images[0].alt || apt.name}
            className="apartment-card-image"
          />
          {apt.is_featured && (
            <span className="featured-badge">⭐ Destacada</span>
          )}
        </div>
      )}

      <div className="apartment-content">
        <div className="apartment-card-title-wrapper">
          <h3 className="apartment-card-title">{apt.name}</h3>
        </div>

        <div className="apartment-details-row">
          <div className="detail-left">
            <span className="detail-icon">📏</span>
            <span>Tamaño: {apt.square_meters} m²</span>
          </div>
          <div className="detail-right">
            <span className="detail-icon">👥</span>
            <span>
              Capacidad {apt.capacity} huésped{apt.capacity > 1 ? "es" : ""}
            </span>
          </div>
        </div>

        <div className="apartment-details-row">
          <div className="detail-left">
            <span className="detail-icon">🛏️</span>
            <span>{apt.num_bedrooms} hab.</span>
          </div>
          <div className="detail-right">
            <span className="detail-icon">🚿</span>
            <span>{apt.num_bathrooms} baños</span>
          </div>
        </div>

        <p className="apartment-card-description">
          {apt.description || "Sin descripción"}
        </p>
        <p className="apartment-card-price">${apt.price_per_night}/noche</p>

        <span
          className={`apartment-status ${
            apt.is_active ? "available" : "occupied"
          }`}
        >
          {apt.is_active ? "Activo" : "Inactivo"}
        </span>

        <div className="apartment-buttons">
          <button onClick={handleDetailsClick} className="btn-more-info">
            Más información
          </button>
          <button onClick={handleTariffClick} className="btn-select-tariff">
            Haz tu reserva
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal ApartmentsList
const ApartmentsList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apartmentsAPI.getAll();
        setApartments(
          Array.isArray(response)
            ? response
            : response.data || response.apartments || []
        );
      } catch (err) {
        const errorMsg = err.message || "Error al cargar apartamentos";
        console.error(err);
        setError(errorMsg);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando apartamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/" className="back-link">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <div className="empty-container">
        <p>No hay apartamentos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <section className="apartments-section">
      <div className="apartments-container">
        <header className="header-section">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="apartments-title"
          >
            Nuestros Apartamentos
          </motion.h1>
          <nav>
            <Link to="/rooms">Ver Habitaciones</Link>
          </nav>
        </header>

        <div className="apartments-grid">
          {apartments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApartmentCard apt={apt} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentsList;
