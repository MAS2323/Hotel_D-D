// src/components/ui/Gallery.js
import "./Gallery.css";

const Gallery = () => {
  const images = [
    "https://via.placeholder.com/400x300?text=Imagen+1+D&D",
    "https://via.placeholder.com/400x300?text=Imagen+2+D&D",
    "https://via.placeholder.com/400x300?text=Imagen+3+D&D",
    "https://via.placeholder.com/400x300?text=Imagen+4+D&D",
    "https://via.placeholder.com/400x300?text=Imagen+5+D&D",
    "https://via.placeholder.com/400x300?text=Imagen+6+D&D",
  ];

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">Galería de Aventuras</h2>
        <div className="gallery-grid">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Galería ${index + 1}`}
              className="gallery-image"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
