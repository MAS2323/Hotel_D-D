// components/client/ApartmentsList.js (renombrado y actualizado con nuevos campos)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apartmentsAPI } from "../../services/api"; // ✅ Usando apartmentsAPI
import "./ApartmentsList.css";

const ApartmentsList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ahora será string

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null); // Limpia error previo
        const response = await apartmentsAPI.getAll();
        setApartments(
          Array.isArray(response)
            ? response
            : response.data || response.apartments || []
        );
      } catch (err) {
        const errorMsg = err.message || "Error al cargar apartamentos";
        console.error(err);
        setError(errorMsg); // Solo el mensaje como string
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
        <p>{error}</p> {/* Ahora es string, no objeto */}
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
        {/* Header con título y enlace para regresar a habitaciones */}
        <header className="header-section">
          <h1 className="apartments-title">Nuestros Apartamentos</h1>
          <nav>
            <Link to="/rooms">Ver Habitaciones</Link>
          </nav>
        </header>

        <div className="apartments-grid">
          {apartments.map((apt) => (
            <div key={apt.id} className="apartment-card">
              {apt.images && apt.images.length > 0 && (
                <img
                  src={apt.images[0].url}
                  alt={apt.images[0].alt || apt.name}
                  className="apartment-image"
                />
              )}
              <h3>{apt.name}</h3>
              <p>{apt.description}</p>
              <p>
                <strong>Jefe:</strong> {apt.head}
              </p>
              <p>
                <strong>Email:</strong> {apt.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {apt.phone}
              </p>
              <p>
                <strong>Capacidad:</strong> {apt.capacity} huéspedes
              </p>
              <p>
                <strong>Precio/Noche:</strong> ${apt.price_per_night}
              </p>
              <p>
                <strong>Amenidades:</strong>{" "}
                {apt.amenities ? apt.amenities.join(", ") : "N/A"}
              </p>
              <p>
                <strong>Habitaciones:</strong> {apt.num_bedrooms} |{" "}
                <strong>Baños:</strong> {apt.num_bathrooms}
              </p>
              <p>
                <strong>m²:</strong> {apt.square_meters}
              </p>
              <p>
                <strong>Estado:</strong> {apt.is_active ? "Activo" : "Inactivo"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentsList;
