// src/pages/public/Terms.js
import React from "react";
import "./LegalPage.css";

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Términos y Condiciones</h1>

        <div className="legal-section">
          <h2>1. Introducción</h2>
          <p>
            Bienvenido a Hotel D&D ("nosotros", "nuestro" o "Hotel D&D"). Al
            reservar, acceder o usar nuestros servicios, aceptas estos Términos
            y Condiciones. Si no estás de acuerdo, no uses nuestros servicios.
            Estos términos se aplican a todas las estancias temáticas inspiradas
            en Dungeons & Dragons.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Reservas y Pagos</h2>
          <ul>
            <li>
              Las reservas son confirmadas solo tras pago completo. Usamos
              pasarelas seguras.
            </li>
            <li>
              Políticas de cancelación: Gratuita hasta 48 horas antes; 50%
              reembolso entre 24-48h; sin reembolso después.
            </li>
            <li>Edad mínima: 18 años para reservas. Menores con tutor.</li>
            <li>
              Precios incluyen impuestos; extras (ej. quests temáticas) se
              cobran aparte.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Uso de las Instalaciones</h2>
          <ul>
            <li>
              Respeta el tema D&D: No dañar props, armaduras o elementos
              mágicos.
            </li>
            <li>
              Prohibido: Armas reales, mascotas no autorizadas (excepto dragones
              de peluche), fiestas ruidosas después de las 22:00.
            </li>
            <li>
              Check-in: 15:00; Check-out: 12:00. Tardanza incurre en cargo
              extra.
            </li>
            <li>
              Responsabilidad: Reporta daños inmediatamente; eres responsable de
              pérdidas.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Privacidad y Datos</h2>
          <p>
            Ver nuestra <a href="/privacy">Política de Privacidad</a> para
            detalles sobre el manejo de tus datos de aventura.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Limitaciones de Responsabilidad</h2>
          <p>
            No somos responsables por quests fallidas en la vida real, solo por
            las de nuestras habitaciones. En caso de fuerza mayor (ej. invasión
            goblin), reembolsaremos proporcionalmente.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Modificaciones y Contacto</h2>
          <p>
            Podemos actualizar estos términos. Notificaremos por email.
            Contacta:{" "}
            <a href="mailto:hotelddguineaecuatorial@gmail.com">
              hotelddguineaecuatorial@gmail.com
            </a>
            .
          </p>
          <p>
            <em>Última actualización: {new Date().getFullYear()}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
