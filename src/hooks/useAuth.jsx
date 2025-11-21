// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    // Opcional: Decodifica token para user info (usa jwt-decode si instalado)
    // Ejemplo: import jwtDecode from 'jwt-decode';
    // const decoded = jwtDecode(accessToken);
    // setUser({ username: decoded.username || decoded.sub, role: decoded.role || 'user' });
    setUser({ username: "decoded_username", role: "user" }); // Placeholder; ajusta con jwt-decode y role real
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Computa isAdmin basado en user.role (para Header y lógica de admin)
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (token) {
      // Verifica token válido (opcional, e.g., con jwt-decode o llamada a API)
      // Si inválido, llama logout();
      localStorage.setItem("token", token); // Mantiene sync
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
