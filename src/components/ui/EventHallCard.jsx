import React from "react";
import FacilityCard from "./FacilityCard";

const EventHallCard = ({ eventHall }) => (
  <FacilityCard
    facility={eventHall}
    type="event-halls"
    // Props extra: e.g., seating_capacity, audio_system
  />
);

export default EventHallCard;
