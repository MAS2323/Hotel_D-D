// src/components/layout/Footer.js
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2025 Hotel D&D. ¡Aventura garantizada en cada estancia!</p>
        <p className="footer-contact">
          Email: <a href="mailto:info@hoteldnd.com">info@hoteldnd.com</a> | Tel:
          +1-234-567-890
        </p>
      </div>
    </footer>
  );
};

export default Footer;
