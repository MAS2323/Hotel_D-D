// pages/ImageFullView.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ImageFullView.css";

const ImageFullView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, imageIndex } = useParams();

  const [images, setImages] = useState(location.state?.images || []);
  const [currentIndex, setCurrentIndex] = useState(
    location.state?.currentIndex || parseInt(imageIndex) || 0
  );
  const [roomName] = useState(location.state?.roomName || "Habitación");

  if (!images || images.length === 0) {
    return (
      <div className="image-fullview-error">
        <p>No se encontraron imágenes</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          Volver
        </button>
      </div>
    );
  }

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    navigate(`/rooms/${roomId}/image/${newIndex}`, { replace: true });
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    navigate(`/rooms/${roomId}/image/${newIndex}`, { replace: true });
  };

  const closeViewer = () => {
    navigate(-1);
  };

  // Soporte para teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="image-fullview-container" onClick={closeViewer}>
      <button className="close-btn" onClick={closeViewer} aria-label="Cerrar">
        ✕
      </button>

      <div
        className="fullscreen-image-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex].url}
          alt={
            images[currentIndex].alt ||
            `${roomName} - Imagen ${currentIndex + 1}`
          }
          className="fullscreen-image"
        />

        {images.length > 1 && (
          <>
            <button className="nav-btn prev" onClick={prevImage}>
              ❮
            </button>
            <button className="nav-btn next" onClick={nextImage}>
              ❯
            </button>

            <div className="fullscreen-indicators">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator ${
                    idx === currentIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </>
        )}

        <div className="image-info">
          <h3>{roomName}</h3>
          <p>
            Imagen {currentIndex + 1} de {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageFullView;
