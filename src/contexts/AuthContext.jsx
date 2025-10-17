import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Provider (componente React, por eso queda aquí)
export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exporta el contexto interno (para uso en el hook)
export default AuthContext;
