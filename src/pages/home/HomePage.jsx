import React, { useEffect, useState } from "react";
import Hero from "../../components/home/HeroSection/hero";
import HowToUseSection from "../../components/home/HowToUseSection/HowToUseSection";
import DownloadApp from "../../components/home/DownloadAPP/DownloadAPP";
import Featuers from "../../components/home/Features";
import Facts from "../../components/home/Facts/Facts";
import VehiclesPage from "../../components/Vehicles/Vehicles";
import VehiclesList from "../../components/Vehicles/VehiclesList/VehiclesList";
import vehicleData from "../../data/vehicles.json";
import { useTranslation } from "react-i18next";
export default function HomePage() {
   const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
   const { t } = useTranslation();

  useEffect(() => {
    // ترتيب العربيات حسب التقييم
    const sortedVehicles = [...vehicleData].sort((a, b) => b.rate - a.rate);
    setVehicles(sortedVehicles);
  }, []);
  return (
    <div>
      <Hero />
      <Featuers />
      <HowToUseSection />
    
     <h2 className="text-4xl font-bold mb-5 mt-10">
 {t("home.cardshome")}
      </h2>
      {vehicles.length > 0 && (
        <VehiclesList
          vehicles={vehicles}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      <Facts />
      <DownloadApp />
    </div>
  );
}
