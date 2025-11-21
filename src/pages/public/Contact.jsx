import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { contactAPI } from "../../services/api";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirige a /login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await contactAPI.create(formData); // ✅ Usa el API centralizado (envía a BASE_URL/contact)
      alert(data.message || "¡Mensaje enviado! Te contactaremos pronto.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message || "Error al enviar el mensaje. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Tu Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <textarea
              name="message"
              placeholder="Tu Mensaje"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
            {error && (
              <p
                className="error-message"
                style={{ color: "red", fontSize: "14px" }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
