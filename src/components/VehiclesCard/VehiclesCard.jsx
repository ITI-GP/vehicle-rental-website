import { useTranslation } from "react-i18next";
import AutoIcon from "./../../assets/AutoIcon.png";
import Fuel from "./../../assets/Fuel.png";
import Air from "./../../assets/Air.png";
import { useFavorites } from "../../contexts/FavoriteContext";

export default function VehiclesCard({ vehicle }) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!vehicle) return null;

  const favorite = isFavorite(vehicle.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id);
  };

  return (
    <div
      className="
        card
        w-full
        sm:w-[calc((100%-24px)/2)]
        md:w-[calc((100%-48px)/3)]
        xl:w-[calc((100%-72px)/4)]
        rounded-2xl shadow-md bg-white
        hover:scale-105 transition-all cursor-pointer
        relative
      "
      onClick={() => {
        window.location.href = `/details/${vehicle.id}`;
      }}
    >
      <img
        src={vehicle.images?.[0] || "/placeholder.jpg"}
        alt={vehicle.type || "Vehicle"}
        className="rounded w-full h-[220px] object-cover"
        style={{
          // border: favorite ? "3px solid #e11d48" : "3px solid transparent",
          transition: "border 0.3s",
        }}
      />

      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 p-1 rounded-full shadow transition-colors ${
          favorite ? "bg-red-100" : "bg-white"
        }`}
        title={favorite ? t("Remove from favorites") : t("Add to favorites")}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill={favorite ? "#e11d48" : "#ffffff"}
          stroke="#e11d48"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "fill 0.3s, stroke 0.3s" }}
        >
          <path d="M12 21s-7-5.686-7-10.25A4.75 4.75 0 0 1 12 6.25a4.75 4.75 0 0 1 7 4.5C19 15.314 12 21 12 21z" />
        </svg>
      </button>

      <div className="info p-5">
        <div className="flex justify-between">
          <div>
            <p className="font-bold text-lg">{vehicle.type || "Unknown"}</p>
            <p className="text-gray-600">{vehicle.category || "N/A"}</p>
          </div>
          <div>
            <p className="text-primary font-bold">
              {vehicle.price_per_day ? `${vehicle.price_per_day}$` : "N/A"}
            </p>
            <p className="text-sm text-gray-500">{t("vehicles.perDay")}</p>
          </div>
        </div>

        <div className="rate py-2">
          {Array.from({
            length: Math.round(vehicle.reviews?.[0]?.rating || 0),
          }).map((_, idx) => (
            <i key={idx} className="fa-solid fa-star text-yellow-500"></i>
          ))}
        </div>

        <div className="flex justify-between pt-3 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <img src={AutoIcon} alt="Transmission" className="w-4" />
            <span>
              {vehicle.manual
                ? t("vehicles.manual")
                : t("vehicles.automatic")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <img src={Fuel} alt="Fuel" className="w-4" />
            <span>{vehicle.fuel || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={Air} alt="A/C" className="w-4" />
            <span>
              {vehicle.airCondition
                ? t("vehicles.airCondition")
                : t("vehicles.noAirCondition")}
            </span>
          </div>
        </div>

        <button className="bg-primary w-full mt-4 rounded py-2 text-white text-sm hover:bg-opacity-90">
          {t("vehicles.rentNow")}
        </button>
      </div>
    </div>
  );
}
