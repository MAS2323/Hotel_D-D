// src/components/ui/Gallery.js
import React, { useState, useEffect } from "react";
import { galleryAPI } from "../../services/api"; // Importa la API para galería
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]); // Estado para imágenes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await galleryAPI.getAll(); // Fetch desde API
        const list = Array.isArray(data) ? data : data.images || []; // Maneja estructura de respuesta
        setImages(list);
      } catch (err) {
        console.error("Error al cargar galería:", err);
        setError("No se pudieron cargar las imágenes de la galería");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <h2 className="gallery-title">Galería de Aventuras</h2>
          <div className="gallery-loading">
            <div className="spinner"></div> {/* Reusa spinner CSS si existe */}
            <p>Cargando imágenes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <h2 className="gallery-title">Galería de Aventuras</h2>
          <div className="gallery-error">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <h2 className="gallery-title">Galería de Aventuras</h2>
          <p className="no-images">
            No hay imágenes disponibles en la galería.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">Galería de Aventuras</h2>
        <div className="gallery-grid">
          {images.map((image) => (
            <img
              key={image.id} // Usa ID único
              src={image.url}
              alt={image.alt || `Galería - ${image.desc || "Imagen"}`}
              className="gallery-image"
              loading="lazy" // Optimización para carga progresiva
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
