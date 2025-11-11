import React from "react";
import FacilityCard from "./FacilityCard";

const PoolCard = ({ pool }) => (
  <FacilityCard
    facility={pool}
    type="pools"
    // Props extra: e.g., depth, heated
  />
);

export default PoolCard;
