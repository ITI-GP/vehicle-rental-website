// import { useTranslation } from "react-i18next";
// import { useEffect, useState } from "react";
// import VehiclesCard from "../VehiclesCard/VehiclesCard";
// import vehicleData from "../../data/vehicles.json";

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
import VehiclesCard from "../VehiclesCard/VehiclesCard";
import vehicleData from "../../data/vehicles.json";

export default function VehiclesPage() {
  const { t } = useTranslation();

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setVehicles(vehicleData);

    // جلب الـ main categories بدون تكرار
    const categories = Array.from(new Set(vehicleData.map(v => v.mainCategory)));
    setMainCategories(categories);

    setFilteredVehicles(vehicleData); // بدايةً عرض كل العربيات
  }, []);

  // دالة اختيار فلتر حسب main category
  function handleCategoryClick(category) {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(v => v.mainCategory === category);
      setFilteredVehicles(filtered);
    }
  }

  return (
    <div className="px-4 pt-10">
      {/* الأزرار */}
      <div className="flex gap-4 justify-center mb-8 flex-wrap">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`px-8 py-2 rounded-2xl ${
            selectedCategory === "All" ? "bg-primary text-white" : "bg-gray-50"
          }`}
        >
          {t("vehicles.all", "All")}
        </button>
        {mainCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-8 py-2 rounded-2xl ${
              selectedCategory === cat ? "bg-primary text-white" : "bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* عرض العربيات */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehiclesCard key={vehicle.id} vehicle={vehicle} />
          ))
        ) : (
          <p>{t("vehicles.noVehicles", "No vehicles found.")}</p>
        )}
      </div>
    </div>
  );
}
