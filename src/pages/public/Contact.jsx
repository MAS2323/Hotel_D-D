// src/pages/Contact.js
import { motion } from "framer-motion";
import { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Mensaje enviado! Te contactaremos pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="contact-section"
    >
      <div className="contact-container">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="contact-title"
        >
          Contáctanos
        </motion.h1>
        <div className="contact-grid">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="contact-info"
          >
            <h2 className="contact-info-title">Información de Contacto</h2>
            <p className="contact-detail">
              Dirección: Cruce Guinea Circula, Malabo Guinea Ecuatorial
            </p>
            <p className="contact-detail">
              Email:{" "}
              <a
                href="mailto:hotelddguineaecuatorial@gmail.com"
                className="contact-link"
              >
                hotelddguineaecuatorial@gmail.com
              </a>
            </p>
            <p className="contact-detail">
              Teléfono:{" "}
              <a href="tel:+240 555 317 945" className="contact-link">
                +240 555 317 945
              </a>
            </p>
            <p className="contact-note">
              ¡Envíanos un mensaje y comienza tu aventura!
            </p>
          </motion.div>
          <motion.form
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            onSubmit={handleSubmit}
            className="contact-form"
          >
            <input
              type="text"
              name="name"
              placeholder="Tu Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Tu Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Tu Mensaje"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="contact-submit-btn">
              Enviar Mensaje
            </button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
