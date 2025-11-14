// src/components/ui/FullGallery.js
import React, { useState, useEffect, useRef } from "react";
import { galleryAPI } from "../../services/api";
import "./FullGallery.css";

const FullGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const modalRef = useRef(null);
  const touchStartX = useRef(0);

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

  const openModal = (index) => {
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setCurrentImageIndex(-1);
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  useEffect(() => {
    if (currentImageIndex >= 0) {
      const modal = modalRef.current;
      if (modal) {
        modal.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });
        modal.addEventListener("touchend", handleTouchEnd, { passive: true });
      }

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeModal();
        } else if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "ArrowRight") {
          nextImage();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        if (modal) {
          modal.removeEventListener("touchstart", handleTouchStart);
          modal.removeEventListener("touchend", handleTouchEnd);
        }
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [currentImageIndex]);

  if (loading) {
    return (
      <section className="full-gallery-section">
        <div className="full-gallery-container">
          <h2 className="full-gallery-title">Galería Completa del Hotel</h2>
          <div className="full-gallery-loading">
            <div className="spinner"></div>
            <p>Cargando todas las imágenes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="full-gallery-section">
        <div className="full-gallery-container">
          <h2 className="full-gallery-title">Galería Completa del Hotel</h2>
          <div className="full-gallery-error">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="full-gallery-section">
        <div className="full-gallery-container">
          <h2 className="full-gallery-title">Galería Completa del Hotel</h2>
          <p className="no-images">
            No hay imágenes disponibles en la galería.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="full-gallery-section">
      <div className="full-gallery-container">
        <h2 className="full-gallery-title">Galería Completa del Hotel</h2>
        <p className="full-gallery-subtitle">
          Descubre todas las imágenes de nuestro hotel
        </p>
        <div className="full-gallery-grid">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="full-gallery-item"
              onClick={() => openModal(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Galería - ${image.desc || "Imagen"}`}
                className="full-gallery-image"
                loading="lazy"
              />
              <div className="full-gallery-overlay">
                <h4 className="full-gallery-item-title">
                  {image.alt || "Explorar"}
                </h4>
                <p className="full-gallery-item-desc">
                  {image.desc || "Descubre más"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {currentImageIndex >= 0 && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="nav-arrow left" onClick={prevImage}>
              ‹
            </button>
            <img
              src={images[currentImageIndex].url}
              alt={
                images[currentImageIndex].alt ||
                images[currentImageIndex].desc ||
                "Imagen ampliada"
              }
              className="modal-image"
            />
            <button className="nav-arrow right" onClick={nextImage}>
              ›
            </button>
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FullGallery;
