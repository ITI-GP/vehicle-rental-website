
import AutoIcon from "./../../assets/AutoIcon.png";
import Fuel from "./../../assets/Fuel.png";
import Air from "./../../assets/Air.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VehiclesCard({ vehicle }) {
  const { t } = useTranslation();

  if (!vehicle) return null;

  return (
    <div
      className="
      card
      w-full
      sm:w-[calc((100%-24px)/2)]
      md:w-[calc((100%-48px)/3)]
      xl:w-[calc((100%-72px)/4)]
      rounded-2xl shadow-md bg-white
      hover:scale-105 transition-all
    "
    >
      <Link to={`/details/${vehicle.id}`}>
        {/* صورة السيارة */}
        <div className="image">
          <img
            src={vehicle.imageCover}
            alt={vehicle.type}
            className="rounded w-full h-[220px] object-cover"
          />
        </div>

        {/* معلومات السيارة */}
        <div className="info p-5">
          {/* النوع والسعر */}
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-lg">{vehicle.type}</p>  
              <p className="text-gray-600">{vehicle.category}</p>
            </div>
            <div>
              <p className="text-primary font-bold">{vehicle.price}$</p>
              <p className="text-sm text-gray-500">{t("vehicles.perDay")}</p>
            </div>
          </div>

          {/* التقييم */}
          <div className="rate py-2">
            {Array.from({ length: Math.round(vehicle.reviews?.[0]?.rating || 0) }).map((_, idx) => (
              <i key={idx} className="fa-solid fa-star text-yellow-500"></i>
            ))}
          </div>

          {/* الخصائص */}
          <div className="flex justify-between pt-3 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <img src={AutoIcon} alt="Transmission" className="w-4" />
              <span>{vehicle.manual ? t("vehicles.manual") : t("vehicles.automatic")}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Fuel} alt="Fuel" className="w-4" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Air} alt="A/C" className="w-4" />
              <span>{vehicle.airCondition ? t("vehicles.airCondition") : t("vehicles.noAirCondition")}</span>
            </div>
          </div>

          {/* الزر */}
          <button className="bg-primary w-full mt-4 rounded py-2 text-white text-sm hover:bg-opacity-90">
            {t("vehicles.rentNow")}
          </button>
        </div>
      </Link>
    </div>
  );
}
