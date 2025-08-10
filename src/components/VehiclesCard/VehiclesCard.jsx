import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../contexts/FavoriteContext";
import AutoIcon from "./../../assets/AutoIcon.png";
import Fuel from "./../../assets/Fuel.png";
import Air from "./../../assets/Air.png";
import RentalModal from "../Details/RentalModal"; // استيراد المودال

import { useMemo , useEffect} from "react";
// Accept isFavorite and toggleFavorite as optional props
export default function VehiclesCard({
  vehicle,
  onUnfavorite,
  isFavorite: isFavoriteProp,
  toggleFavorite: toggleFavoriteProp,
}) {
  const { t } = useTranslation();
  // Get favorites and toggle function from context
  const { favorites = [], toggleFavorite: contextToggleFavorite } = useFavorites();
  
  // Initialize local state based on initial favorites
  const [isFavorited, setIsFavorited] = useState(() => {
    // If isFavoriteProp is provided, use it directly
    if (isFavoriteProp !== undefined) {
      return isFavoriteProp === vehicle?.id || 
             (Array.isArray(isFavoriteProp) && isFavoriteProp.includes(vehicle?.id));
    }
    
    // Otherwise, check the favorites array from context
    const vehicleId = vehicle?.id?.toString();
    return Array.isArray(favorites) && 
           favorites.some(v => v && v.id && v.id.toString() === vehicleId);
  });
  
  const toggleFavorite = toggleFavoriteProp || contextToggleFavorite || (() => {});

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) return null;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation
    
    // Optimistically update the UI
    const wasFavorited = isFavorited;
    setIsFavorited(!wasFavorited);
    
    try {
      await toggleFavorite(vehicle.id);
      
      if (onUnfavorite && wasFavorited) {
        onUnfavorite();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the UI if there was an error
      setIsFavorited(wasFavorited);
    }
  };

  // formData و formErrors ممكن تعيد تعريفهم هنا أو تبسطها حسب الحاجة
  // لكن هنا مثال بسيط مع البيانات الأساسية:
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    address: "",
    deliveryDate: "",
    rentalDays: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    payment: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div
        className="
          card
          w-full
          sm:w-[calc((100%-24px)/2)]
          md:w-[calc((100%-48px)/3)]
          xl:w-[calc((100%-72px)/4)]
          rounded-2xl shadow-md bg-white
          hover:scale-105 transition-all
          relative
        "
      >
        {/* Favorite Button - Separate from the Link */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-2 right-2 z-10 p-2 rounded-full shadow-md
            transition-all duration-300 ease-in-out transform
            hover:scale-110 active:scale-95 focus:outline-none
            ${isFavorited 
              ? 'bg-red-50 hover:bg-red-100' 
              : 'bg-white/90 hover:bg-gray-100'}
          `}
          title={
            isFavorited
              ? "Remove from favorites"
              : "Add to favorites"
          }
          type="button"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <div className="relative w-7 h-7">
            {/* Background pulse effect */}
            {isFavorited && (
              <div className="absolute inset-0 rounded-full bg-red-100/80 animate-ping"></div>
            )}
            
            {/* Heart icon with smoother path */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={isFavorited ? 0 : 1.5}
              className={`
                w-full h-full transition-all duration-300 ease-in-out
                ${isFavorited 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-gray-600 fill-gray-400 '}
              `}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            </svg>
            
            {/* Subtle shine effect */}
            {isFavorited && (
              <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
            )}
          </div>
        </button>

        {/* Vehicle Image - Inside Link */}
        <Link to={`/details/${vehicle.id}`} className="block">
          <div className="relative">
            <img
              src={vehicle.images?.[0] || "/placeholder.jpg"}
              alt={vehicle.type || "Vehicle"}
              className="rounded w-full h-[220px] object-contain"
            />
          </div>

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

            {/* بدل الزرار العادي هنا نخليه بيفتح المودال */}
            <button
              onClick={(e) => {
                e.preventDefault(); // عشان ما ينقلش للرابط لما نفتح المودال
                setShowModal(true);
              }}
              className="bg-primary w-full mt-4 rounded py-2 text-white text-sm hover:bg-opacity-90"
            >
              {t("vehicles.rentNow")}
            </button>
          </div>
        </Link>
      </div>

      {showModal && (
        <RentalModal
          formData={formData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          handleChange={handleChange}
          setShowModal={setShowModal}
          vehicleId={vehicle.id}
          user={null} // لازم تمرر المستخدم لو متوفر Context مثلا
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
    </>
  );
}
