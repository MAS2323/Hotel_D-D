// src/components/common/Hero.js
import "./Hero.css";
import { useState, useEffect } from "react";

const Hero = () => {
  const images = [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
    // Agrega más URLs de imágenes aquí si lo deseas
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", // Asegura altura completa
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido al Hotel D&D</h1>
          <p className="hero-subtitle">
            Donde cada estancia es una aventura épica
          </p>
          <button className="hero-button">Explora Nuestras Habitaciones</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
