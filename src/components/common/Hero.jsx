// src/components/common/Hero.js
import "./Hero.css";
import { useState, useEffect } from "react";
import { galleryAPI } from "../../services/api";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch de imágenes desde DB
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await galleryAPI.getAll();
        const list = Array.isArray(data) ? data : data.images || data || [];
        if (list.length === 0) {
          setError("No hay imágenes disponibles para el hero");
          return;
        }

        // Mezcla aleatoria
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setImages(shuffled);
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
            <h1 className="hero-subtitle-large">Hotel D&D</h1>
            <p className="hero-subtitle">Bienvenidos al Hotel D&D</p>
            <p className="hotel-location">
              Malabo, Bioko Norte, Guinea Ecuatorial
            </p>
            <button className="gallery-btn">📸 Ver la galería</button>
          </div>

          {/* Call-to-Action destacado */}
          <div className="cta-section">
            <p className="cta-text">¡Reserva tu aventura ahora!</p>
            <button className="cta-button">Haz tu reserva</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
