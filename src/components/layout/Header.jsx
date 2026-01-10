// src/components/layout/Header.js
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import logo from "../../assets/img/d&d_logo.png"; // Ajusta la ruta si es necesario
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "header-link-active" : "";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img src={logo} alt="Hotel D&D" className="logo-image" />
        </Link>
        <div className="header-right">
          <button
            className="header-hamburger"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`header-menu ${isMenuOpen ? "header-menu-open" : ""}`}>
            <div className="header-menu-items">
              <li>
                <Link
                  to="/rooms"
                  className={`header-link ${isActive("/rooms")}`}
                  onClick={closeMenu}
                >
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`header-link ${isActive("/about")}`}
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className={`header-link ${isActive("/booking")}`}
                  onClick={closeMenu}
                >
                  Reservar
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`header-link ${isActive("/contact")}`}
                  onClick={closeMenu}
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`header-link ${isActive("/services")}`}
                  onClick={closeMenu}
                >
                  Servicios
                </Link>
              </li>
              {isAdmin ? (
                <>
                  <li>
                    <Link
                      to="/admin"
                      className="header-link header-link-active"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="header-logout-btn"
                    >
                      Salir
                    </button>
                  </li>
                </>
              ) : null}
            </div>
            {isMenuOpen && (
              <li
                className="header-powered-by"
                style={{
                  marginTop: "auto",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                <p className="footer-powered-by">
                  Powered by{" "}
                  <a
                    href="https://www.instagram.com/tecnologias_mas?igsh=MWh2c3h2ZTZsN2s5cg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tecnologías Más
                  </a>
                </p>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
