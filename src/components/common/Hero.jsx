// src/components/common/Hero.js
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido al Hotel D&D</h1>
          <p className="hero-subtitle">
            Donde cada estancia es una aventura épica en el mundo de Dungeons &
            Dragons
          </p>
          <button className="hero-button">Explora Nuestras Habitaciones</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
