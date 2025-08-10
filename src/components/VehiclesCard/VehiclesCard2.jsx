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
export default function VehiclesCard2({
  vehicle,
  onUnfavorite,
  isFavorite: isFavoriteProp,
  toggleFavorite: toggleFavoriteProp,
}) {
  const { t } = useTranslation();
  // Get favorites and toggle function from context
  const { favorites = [], toggleFavorite: contextToggleFavorite } = useFavorites();
  
  // Get the current favorite status from the context
  const isFavorited = useMemo(() => {
    if (isFavoriteProp !== undefined) {
      return isFavoriteProp === vehicle?.id || 
             (Array.isArray(isFavoriteProp) && isFavoriteProp.includes(vehicle?.id));
    }
    const vehicleId = vehicle?.id?.toString();
    return Array.isArray(favorites) && 
           favorites.some(v => v && v.id && v.id.toString() === vehicleId);
  }, [favorites, vehicle?.id, isFavoriteProp]);
  
  // Local state for UI
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const toggleFavorite = toggleFavoriteProp || contextToggleFavorite || (() => {});

  if (!vehicle) return null;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== Favorite Click ===');
    console.log('Current isFavorited:', isFavorited);
    console.log('Vehicle ID:', vehicle?.id);
    
    // Prevent multiple rapid clicks
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    
    setIsProcessing(true);
    const newFavState = !isFavorited;
    console.log('New favorite state will be:', newFavState);
    
    try {
      console.log('Calling toggleFavorite with vehicle ID:', vehicle?.id);
      await toggleFavorite(vehicle.id);
      
      console.log('Toggle successful, context should update soon');
      
      // Only call onUnfavorite if we're actually removing a favorite
      if (onUnfavorite && !newFavState) {
        console.log('Calling onUnfavorite');
        onUnfavorite();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // The context will handle reverting the state if needed
      console.log('Error occurred, context will handle state reversion');
    } finally {
      console.log('Finished processing favorite click');
      setIsProcessing(false);
    }
  };

  // formData و formErrors ممكن تعيد تعريفهم هنا أو تبسطها حسب الحاجة
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
                {/* <p className="text-gray-600">{vehicle.category || "N/A"}</p> */}
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
