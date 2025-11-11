import React from "react";
import FacilityCard from "./FacilityCard";

const TerraceCard = ({ terrace }) => (
  <FacilityCard
    facility={terrace}
    type="terraces"
    // Props extra: e.g., view_type, outdoor_seating
  />
);

export default TerraceCard;
