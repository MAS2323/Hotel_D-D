import React from "react";
import FacilityCard from "./FacilityCard";

const DiscoCard = ({ disco }) => (
  <FacilityCard
    facility={disco}
    type="discos"
    // Props extra: e.g., dj_booth, lights
  />
);

export default DiscoCard;
