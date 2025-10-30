// src/pages/admin/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Agrega Link para el enlace
import { useAuth } from "../../hooks/useAuth";
import { usersAPI } from "../../services/api";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Llama al endpoint real de login
      const response = await usersAPI.login({
        username: credentials.username,
        password: credentials.password,
      });

      // Asume que useAuth.login espera el access_token
      login(response.access_token);
      navigate("/admin");
    } catch (err) {
      setError(
        err.message || "Credenciales inválidas. Prueba: admin / password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">
            Accede al panel de control del Hotel D&D
          </p>
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
              placeholder="Usuario"
              value={credentials.username}
              onChange={handleChange}
              required
              aria-label="Nombre de usuario"
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

        <p className="login-hint">¿Usuario de prueba? admin / password</p>
        <p className="login-register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
