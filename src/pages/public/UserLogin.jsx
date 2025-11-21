// src/pages/UserLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usersAPI } from "../../services/api";
import "./UserLogin.css"; // Asume que crearás un CSS similar a Login.css, adaptado para usuarios

const UserLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth(); // Asume que useAuth expone isAuthenticated
  const navigate = useNavigate();

  // Si ya está autenticado, redirige a home o dashboard de usuario
  if (isAuthenticated) {
    navigate("/"); // O a "/dashboard" si tienes uno para usuarios normales
    return null;
  }

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await usersAPI.login({
        username: credentials.username,
        password: credentials.password,
      });

      login(response.access_token); // Almacena el token
      navigate("/"); // Redirige a home después de login exitoso para usuarios normales
    } catch (err) {
      setError(
        err.message ||
          "Credenciales inválidas. Prueba con tus datos de registro."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      {" "}
      {/* Reutiliza clases de Login.css o adapta */}
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Inicio de Sesión</h1>
          <p className="login-subtitle">Accede a tu cuenta en Hotel D&D</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="login-form-group">
            <input
              type="text"
              name="username"
              placeholder="Usuario o Email"
              value={credentials.username}
              onChange={handleChange}
              required
              aria-label="Nombre de usuario o email"
            />
          </div>

          <div className="login-form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
              aria-label="Contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="login-hint">
          ¿Usuario de prueba? Regístrate primero o contacta al admin.
        </p>
        <p className="login-register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
        <p className="login-admin-link">
          ¿Eres administrador?{" "}
          <Link to="/admin/login">Ve al login de admin</Link>
        </p>
      </div>
    </section>
  );
};

export default UserLogin;
