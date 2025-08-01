
// export default function VehiclesPage() {
//   const { t } = useTranslation();
//   const [vehicles, setVehicles] = useState([]);
//   useEffect(() => {

//     setVehicles(vehicleData);
//   }, []);

//   return (
//     <div className="flex flex-wrap gap-6 justify-center px-4 pt-20">
//       {vehicles.map((vehicle) => (
//         <VehiclesCard key={vehicle.id} vehicle={vehicle} />
//       ))}
//     </div>
//   );
// }
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import vehicleData from "../../data/vehicles.json";
import CategoryFilter from "./CategoryFilter/CategoryFilter";
import VehiclesList from "./VehiclesList/VehiclesList";


export default function VehiclesPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const sortedVehicles = [...vehicleData].sort((a, b) => b.rate - a.rate);
    setVehicles(sortedVehicles);


    // جلب الـ main categories بدون تكرار

    const categories = Array.from(
      new Set(vehicleData.map((v) => v.mainCategory))
    );
    setMainCategories(categories);

    setFilteredVehicles(sortedVehicles);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    if (category === "All") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter((v) => v.mainCategory === category);
      setFilteredVehicles(filtered);
    }
  };

  return (
    <div className="px-4 pt-10">
      <h2 className="text-4xl font-bold mb-8 text-center">
        {t("vehicles.header")}
      </h2>

      <CategoryFilter
        categories={mainCategories}
        selected={selectedCategory}
        onChange={handleCategoryClick}
      />

      <VehiclesList
        vehicles={filteredVehicles}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
