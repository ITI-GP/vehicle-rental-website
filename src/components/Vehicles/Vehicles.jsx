
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "../../Lib/supabaseClient";
import CategoryFilter from "./CategoryFilter/CategoryFilter";
import VehiclesList from "./VehiclesList/VehiclesList";

export default function VehiclesPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const { data: vehicles, error: fetchError } = await supabase
          .from('vehicles')
          .select('*')
          .order('rating', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform data to match the expected format in VehiclesCard
        const transformedVehicles = (vehicles || []).map(vehicle => ({
          ...vehicle,
          id: vehicle.id.toString(),
          type: vehicle.type || 'Vehicle',
          category: vehicle.type || 'Standard',
          price: parseFloat(vehicle.price_per_day) || 0,
          imageCover: vehicle.images?.[0] || '/default-vehicle.jpg',
          // Default values for required fields in VehiclesCard
          manual: false, // Assuming automatic by default
          fuel: 'Petrol', // Default fuel type
          airCondition: true, // Assuming AC is available by default
          reviews: [{
            rating: parseFloat(vehicle.rating) || 0
          }],
          // Keep additional fields for filtering
          mainCategory: vehicle.type || 'Other',
          available: vehicle.available || false,
          description: vehicle.description || 'No description available',
          location: vehicle.location || 'Location not specified',
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear()
        }));

        setVehicles(transformedVehicles);
        
        // Extract unique categories from the type field
        const categories = [...new Set(transformedVehicles.map(v => v.mainCategory))];
        setMainCategories(['All', ...categories]);
        
        setFilteredVehicles(transformedVehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err.message || 'Failed to load vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-300"
        >
          Retry
        </button>
      </div>
    );
  }

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

      {filteredVehicles.length > 0 ? (
        <VehiclesList
          vehicles={filteredVehicles}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No vehicles found in this category.</p>
        </div>
      )}
    </div>
  );
}
