// components/ui/ImageCarousel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageCarousel.css";

const ImageCarousel = ({ images, roomName, roomId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Autoplay cada 5 segundos
  useEffect(() => {
    if (!images || images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images, isHovered]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullScreen = () => {
    if (!images || images.length === 0) return;

    // Navegar a vista de imagen completa
    navigate(`/rooms/${roomId}/image/${currentIndex}`, {
      state: { images, currentIndex, roomName },
    });
  };

  if (!images || images.length === 0) {
    return (
      <div className="no-carousel-images">No hay imágenes disponibles</div>
    );
  }

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-wrapper">
        <img
          src={images[currentIndex].url}
          alt={
            images[currentIndex].alt ||
            `${roomName} - Imagen ${currentIndex + 1}`
          }
          className="carousel-image"
          onClick={openFullScreen}
        />

        {images.length > 1 && (
          <>
            <button
              className="carousel-btn prev"
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              ❮
            </button>
            <button
              className="carousel-btn next"
              onClick={nextImage}
              aria-label="Imagen siguiente"
            >
              ❯
            </button>

            <div className="carousel-indicators">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator ${
                    idx === currentIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Contador de imágenes */}
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
