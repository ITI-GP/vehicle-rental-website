import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import VehiclesCard from "../VehiclesCard/VehiclesCard";
import vehicleData from "../../data/vehicles.json";

export default function VehiclesPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
   
    setVehicles(vehicleData);
  }, []);

  return (
    <div className="flex flex-wrap gap-6 justify-center px-4 pt-20">
      {vehicles.map((vehicle) => (
        <VehiclesCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
