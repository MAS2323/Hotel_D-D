// src/components/ui/Gallery.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { galleryAPI } from "../../services/api";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        // Solo imágenes de categoría "galeria"
        const data = await galleryAPI.getAll(undefined, undefined, "galeria");
        const list = Array.isArray(data) ? data : data.images || data || [];
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
            <div className="spinner"></div>
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

  const displayedImages = images.slice(0, 6); // Dos filas: 3 por fila en desktop
  const hasMore = images.length > 6;

  const handleViewGallery = () => {
    navigate("/full-gallery");
  };

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">Galería de Aventuras</h2>
        <p className="gallery-subtitle">Descubre la magia de nuestro hotel</p>
        <div className="gallery-grid">
          {displayedImages.map((image, index) => (
            <div key={image.id || index} className="gallery-item">
              <img
                src={image.url}
                alt={image.alt || `Galería - ${image.desc || "Imagen"}`}
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <h4 className="gallery-item-title">
                  {image.alt || "Explorar"}
                </h4>
                <p className="gallery-item-desc">
                  {image.desc || "Descubre más"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Botón siempre visible al final del componente */}
        <button className="gallery-view-more" onClick={handleViewGallery}>
          Ver Galería Completa
        </button>
      </div>
    </section>
  );
};

export default Gallery;
