import React from "react";
import FacilityCard from "./FacilityCard";

const ApartmentsCard = ({ apartment }) => (
  <FacilityCard
    facility={apartment}
    type="apartments"
    // Props extra: e.g., rooms_count, kitchen
  />
);

export default ApartmentsCard;
