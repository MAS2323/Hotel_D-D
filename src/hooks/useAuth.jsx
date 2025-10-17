// src/hooks/useAuth.js
import { useState } from "react";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Mock: set to true for testing

  const logout = () => {
    setIsAdmin(false);
    // Simulate logout logic
  };

  return { isAdmin, logout };
};
