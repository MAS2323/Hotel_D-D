// src/pages/Register.jsx (actualizado: maneja redirect URL desde query params, redirige de vuelta a SubmitTestimonial después del registro exitoso)
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usersAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (userData.password.length > 72) {
      setError("La contraseña no puede exceder 72 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await usersAPI.register(userData);

      login(response.access_token);
      setSuccess("¡Registro exitoso! Bienvenido al Hotel D&D.");
      setTimeout(() => {
        // Redirige a la URL de origen si existe, sino a home
        if (redirect) {
          navigate(decodeURIComponent(redirect));
        } else {
          navigate("/"); // O a "/admin" si es para admin
        }
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al registrar usuario. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Registro de Usuario</h1>
          <p className="register-subtitle">
            Crea tu cuenta en el Hotel D&D para reservar aventuras épicas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="register-success" role="alert">
              {success}
            </div>
          )}

          <div className="register-form-group">
            <input
              type="text"
              name="username"
              placeholder="Nombre de Usuario"
              value={userData.username}
              onChange={handleChange}
              required
              aria-label="Nombre de usuario"
            />
          </div>

          <div className="register-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
              aria-label="Email"
            />
          </div>

          <div className="register-form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={userData.password}
              onChange={(e) => {
                const truncated = e.target.value.slice(0, 72);
                setUserData({ ...userData, password: truncated });
              }}
              required
              minLength="6"
              maxLength="72"
              aria-label="Contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="register-submit-btn"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="register-hint">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="register-link">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
