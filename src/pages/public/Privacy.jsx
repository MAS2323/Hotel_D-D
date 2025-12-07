// src/pages/public/Privacy.js
import React from "react";
import "./LegalPage.css";

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Política de Privacidad</h1>

        <div className="legal-section">
          <h2>1. Información que Recopilamos</h2>
          <ul>
            <li>
              <strong>Datos Personales:</strong> Nombre, email, teléfono, datos
              de pago para reservas.
            </li>
            <li>
              <strong>Datos de Uso:</strong> IP, preferencias (ej. habitación de
              elfos vs. dragones).
            </li>
            <li>
              <strong>Testimonios:</strong> Contenido compartido
              voluntariamente.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>2. Cómo Usamos Tus Datos</h2>
          <ul>
            <li>Procesar reservas y envíos de confirmaciones mágicas.</li>
            <li>Mejorar servicios (ej. quests personalizadas).</li>
            <li>
              Marketing: Emails sobre nuevas aventuras (puedes optar out).
            </li>
            <li>Cumplir leyes: Retenemos datos por 5 años para auditorías.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Compartir Datos</h2>
          <ul>
            <li>
              Con proveedores (ej. pasarelas de pago, proveedores de WiFi
              encantado).
            </li>
            <li>No vendemos datos; solo compartimos lo necesario.</li>
            <li>En fusiones o ventas: Notificaremos.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Tus Derechos</h2>
          <ul>
            <li>
              Acceso, rectificación o eliminación: Email a{" "}
              <a href="mailto:hotelddguineaecuatorial@gmail.com">
                hotelddguineaecuatorial@gmail.com
              </a>
              .
            </li>
            <li>
              GDPR/equivalentes: Residentes en UE tienen derechos adicionales.
            </li>
            <li>Cookies: Usamos para sesiones; acepta/rechaza en banner.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Seguridad</h2>
          <p>
            Encriptamos datos sensibles. Pero recuerda: En el mundo D&D, siempre
            hay un hechizo de detección de mentiras – ¡usa contraseñas fuertes!
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Modificaciones</h2>
          <p>
            Actualizaremos esta política. Revisa periódicamente. Contacta para
            dudas.
          </p>
          <p>
            <em>Última actualización: {new Date().getFullYear()}</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
