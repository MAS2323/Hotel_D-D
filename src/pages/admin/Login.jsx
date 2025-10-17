import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock: En real, llama a Django /api/admin/login/ y guarda JWT
    if (
      credentials.username === "admin" &&
      credentials.password === "password"
    ) {
      login("mock-jwt-token");
      navigate("/admin");
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <input
            type="text"
            placeholder="Usuario"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
