import React from "react";
import { useNavigate } from "react-router-dom";
import "./FacilityCard.css"; // Similar a RoomCard.css

const FacilityCard = ({ facility, type }) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/${type}/${facility.id}`, { state: { facility } });
  };

  return (
    <div className="facility-card">
      {facility.image && (
        <img
          src={facility.image.url}
          alt={facility.name}
          className="facility-image"
        />
      )}
      <div className="facility-content">
        <h3>{facility.name}</h3>
        <p>{facility.description || "Sin descripción"}</p>
        <p>Capacidad: {facility.capacity || "N/A"} personas</p>
        <p>Precio: XAF {facility.price || "Consultar"}/hora</p>
        <button onClick={handleDetails} className="facility-button">
          Más información
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;
