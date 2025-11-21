// src/pages/SubmitTestimonial.js (actualizado: redirige a /register si no hay token, pasando redirect URL para volver después del registro/login)
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { testimonialsAPI } from "../../services/api";
import "./SubmitTestimonial.css";

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.author.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirige a register pasando la URL actual como redirect
        const redirectUrl = encodeURIComponent(
          location.pathname + location.search
        );
        navigate(`/register?redirect=${redirectUrl}`);
        return;
      }

      const testimonialData = {
        content: formData.content.trim(),
        author: formData.author.trim(),
      };

      await testimonialsAPI.create(testimonialData);
      setSuccess(true);
      setFormData({ content: "", author: "" });
      setTimeout(() => navigate("/"), 3000); // Redirige a home después de éxito
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setError("Error al enviar el testimonio. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="submit-testimonial-container">
        <h2>¡Gracias por tu testimonio!</h2>
        <p>Tu experiencia ha sido enviada y será revisada pronto.</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="submit-testimonial-container">
      <h2>Comparte Tu Experiencia</h2>
      <p>¡Ayúdanos a mejorar! Cuéntanos sobre tu estancia en el Hotel D&D.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-group">
          <label htmlFor="author">Tu Nombre:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            placeholder="Ej: Elfo Viajero"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Tu Testimonio:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            placeholder="Describe tu experiencia..."
            rows="5"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Enviando..." : "Enviar Testimonio"}
        </button>
      </form>
      <button onClick={() => navigate("/")} className="back-btn">
        Volver al Inicio
      </button>
    </div>
  );
};

export default SubmitTestimonial;
