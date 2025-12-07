// src/components/common/Hero.js
import "./Hero.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { heroAPI } from "../../services/api";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch de imágenes solo de categoría hero
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await heroAPI.getAll();
        const list = Array.isArray(data) ? data : data.images || data || [];
        if (list.length === 0) {
          setError("No hay imágenes disponibles para el hero");
          return;
        }

        // No shuffle para hero: mantener orden de DB para slideshow coherente
        setImages(list);
      } catch (err) {
        console.error("Error al cargar imágenes para hero:", err);
        setError("No se pudieron cargar las imágenes del hero");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Autoplay
  useEffect(() => {
    if (loading || error || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, loading, error]);

  const handleViewGallery = () => {
    navigate("/full-gallery");
  };

  const handleBooking = () => {
    navigate("/booking");
  };

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-loading">
              <div className="spinner"></div>
              <p>Cargando aventura...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || images.length === 0) {
    return (
      <section className="hero" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Hotel D&D</h1>
            <p className="hero-subtitle">
              {error || "Donde cada estancia es una aventura épica"}
            </p>
            <button className="hero-button">
              Explora Nuestras Habitaciones
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${images[currentIndex]?.url || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "80vh",
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {/* Título hotel y ubicación */}
          <div className="hotel-info">
            <h1 className="text-4xl font-display font-bold">
              Bienvenidos al Hotel D&D
            </h1>
            <p className="text-lg leading-relaxed">
              Descubre aventuras en cada habitación...
            </p>
            <p className="hotel-location">
              Malabo, Bioko Norte, Guinea Ecuatorial
            </p>
            <button className="gallery-btn" onClick={handleViewGallery}>
              📸 Ver la galería
            </button>
          </div>

          {/* Call-to-Action destacado */}
          <div className="cta-section">
            <p className="cta-text">¡Reserva tu aventura ahora!</p>
            <button className="cta-button" onClick={handleBooking}>
              Haz tu reserva
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
