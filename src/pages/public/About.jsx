// src/pages/About.js
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="about-title"
        >
          Sobre Hotel D&D
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="about-text"
        >
          Somos un hotel único inspirado en Dungeons & Dragons, donde cada
          estancia es una aventura. Ubicados en el corazón de la fantasía,
          ofrecemos comodidad y magia para viajeros de todos los reinos.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="about-text"
        >
          Fundado en 2025, nuestro equipo se dedica a hacer tu visita
          inolvidable con habitaciones temáticas como la Cueva del Dragón o la
          Torre del Mago.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
