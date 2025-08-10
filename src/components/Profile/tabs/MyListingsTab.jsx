import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../Lib/supabaseClient";
import VehiclesCard2 from "../../../components/VehiclesCard/VehiclesCard2";

export default function MyListingsTab({ user, isFavorite, toggleFavorite }) {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Error fetching vehicles:", error);
      } else {
        setVehicles(data || []);
      }
    };

    fetchUserVehicles();
  }, [user]);

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentVehicles = vehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(vehicles.length / perPage);

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("profile.myListings.title", "My Vehicle Listings")}
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            {t(
              "profile.myListings.description",
              "Manage your listed vehicles and view their performance"
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {t("profile.myListings.addVehicle", "Add Vehicle")}
          </button>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center">
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <VehiclesCard2
              key={vehicle.id}
              vehicle={vehicle}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p className="text-gray-500">No vehicles found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full border ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
