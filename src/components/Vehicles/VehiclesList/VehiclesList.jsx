import VehiclesCard from "../../VehiclesCard/VehiclesCard";

export default function VehiclesList({
  vehicles,
  currentPage,
  setCurrentPage,
  perPage = 6,
  isFavorite,
  toggleFavorite,
}) {
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentVehicles = vehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(vehicles.length / perPage);

  return (
    <div>
      <div className="flex flex-wrap gap-6 justify-center">
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <VehiclesCard
              key={vehicle.id}
              vehicle={vehicle}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>

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
