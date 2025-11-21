import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { apartmentsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./PropertyDetails.css";

const PropertyDetails = ({ apt }) => {
  const { id } = useParams();
  const location = useLocation();
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay datos en el state, cargarlos desde la API
    if (!property) {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const response = await apartmentsAPI.getById(id); // Necesitarás implementar este endpoint
          setProperty(response);
        } catch (err) {
          setError("No se pudo cargar la información del apartamento");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, property]);

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % (property?.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (property?.images?.length || 1)) %
        (property?.images?.length || 1)
    );
  };

  const handleTariffClick = () => {
    // Navega a la pantalla de reservas capturando el room actual
    navigate("/booking", { state: { apt } });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando información...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="error-container">
        <p>{error || "No se encontró la propiedad"}</p>
        <Link to="/apartments" className="back-link">
          ← Volver a apartamentos
        </Link>
      </div>
    );
  }

  return (
    <section className="property-details-section">
      <div className="property-details-container">
        {/* Carrusel de imágenes */}
        <div className="details-carousel">
          <button className="carousel-prev" onClick={prevImage}>
            ‹
          </button>
          {property.images?.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt || property.name}
              className={`carousel-image ${
                index === currentImageIndex ? "active" : ""
              }`}
            />
          ))}
          <button className="carousel-next" onClick={nextImage}>
            ›
          </button>
        </div>

        {/* Información principal */}
        <div className="details-main-content">
          <div className="details-info">
            <h1 className="property-title">
              {property.name}
              {property.is_featured && (
                <span className="featured-badge">⭐ Destacada</span>
              )}
            </h1>

            <div className="property-meta">
              <div className="meta-item">
                <span className="meta-icon">📏</span>
                <span>{property.square_meters || property.size} m²</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <span>
                  Capacidad: {property.capacity || property.max_guests} personas
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🛏️</span>
                <span>{property.num_bedrooms || 1} habitaciones</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🚿</span>
                <span>{property.num_bathrooms || 1} baños</span>
              </div>
            </div>

            <p className="property-description">
              {property.description || "Descripción no disponible."}
            </p>

            <div className="price-section">
              <p className="property-price">
                ${property.price_per_night || property.price}/noche
              </p>
              <span
                className={`property-status ${
                  property.is_active || property.is_available
                    ? "available"
                    : "occupied"
                }`}
              >
                {property.is_active || property.is_available
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>

            {/* Información de contacto (solo para apartamentos) */}
            {property.head && (
              <div className="contact-info">
                <h3>Información de contacto</h3>
                <p>
                  <strong>Responsable:</strong> {property.head}
                </p>
                <p>
                  <strong>Email:</strong> {property.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {property.phone}
                </p>
              </div>
            )}
          </div>

          {/* Amenidades */}
          <aside className="details-amenities">
            <h3 className="amenities-title">Amenidades</h3>
            <div className="amenities-grid">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-check">✓</span>
                  <span className="amenity-label">{amenity}</span>
                </div>
              )) || <p>No hay amenidades listadas.</p>}
            </div>
          </aside>
        </div>

        {/* Thumbnails */}
        {property.images?.length > 1 && (
          <div className="details-thumbnails">
            <div className="thumbnails-indicator">
              {currentImageIndex + 1}/{property.images.length}
            </div>
            <div className="thumbnails-container">
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || `Imagen ${idx + 1}`}
                  className={`thumbnail-image ${
                    idx === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="details-action">
          <button className="btn-select-tariff" onClick={handleTariffClick}>
            Haz tu reserva
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;
