// src/components/ui/RoomCard.js
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <img src={room.image} alt={room.name} className="room-card-image" />
      <div className="room-card-content">
        <h3 className="room-card-title">{room.name}</h3>
        <p className="room-card-description">{room.description}</p>
        <div className="room-card-price">
          <span className="room-card-price-amount">${room.price}</span>
          <span className="room-card-price-per">por noche</span>
        </div>
        <button className="room-card-button">Reservar</button>
      </div>
    </div>
  );
};

export default RoomCard;
