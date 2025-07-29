
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import vehicleData from "../../data/vehicles.json";
import { useEffect, useState } from "react";
import AutoIcon from "./../../assets/AutoIcon.png";
import Fuel from "./../../assets/Fuel.png";
import Air from "./../../assets/Air.png";
import Group from "./../../assets/Group.png";
import Distance from "./../../assets/Distance.png";
import VehiclesCard from "../VehiclesCard/VehiclesCard"; 
import Reviews from "./Reviews/Reviews";

export default function DetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState(null);
  const [relatedVehicle, setRelatedVehicle] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);


  function getVehicleById(id) {
    const selected = vehicleData.find((v) => v.id === parseInt(id));
    setVehicle(selected);
    return selected;
  }

  function getRelatedVehicle(selectedVehicle) {
    const related = vehicleData.filter(
      (v) =>
        v.category === selectedVehicle.category && v.id !== selectedVehicle.id
    );
    setRelatedVehicle(related);
  }

  useEffect(() => {
    const selected = getVehicleById(id);
    if (selected) {
      getRelatedVehicle(selected);
      setMainImage(selected.imageCover);
    }
  }, [id]);

  if (!vehicle) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-10">
      {/* ===== تفاصيل السيارة main part 1===== */}
     <div className="flex flex-col md:flex-row gap-8 main-image">
            <div className="w-full md:w-1/2">
    {/* الصورة الكبيرة */}
    <img
      src={mainImage || vehicle.imageCover}
      alt={vehicle.type}
      className="w-full h-[300px] object-cover rounded-xl"
    />

    {/* الصور المصغرة */}
    {vehicle.images?.length > 0 && (
      <div className="mt-4 grid grid-cols-4 gap-4 ">
        {vehicle.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`thumb-${idx}`}
            className={`cursor-pointer h-20 object-cover rounded-md hover:scale-90 transition-all border ${
              img === mainImage ? "border-primary border-2" : "border-gray-300"
            }`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    )}
  </div>


      {/* main part 2 */}
        <div className="info w-full md:w-1/2 space-y-4">

           {/* part1 rate and name*/}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              {vehicle.type}
            </h2>
              <div>
            {Array.from({
              length: Math.round(vehicle.reviews?.[0]?.rating || 0),
            }).map((_, idx) => (
              <i
                key={idx}
                className="fa-solid fa-star text-yellow-500 mr-1"
              ></i>
            ))}
          </div>
         
          </div>

           {/* part2 Description */}
           <div>
            {vehicle.description}
           </div>

          {/* part3 Info */}
             <div className="flex justify-between pt-3 text-sm text-gray-700 mb-6">
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
                      <div className="flex items-center gap-1">
                        <span className="font-bold">Type:</span>
                        <span>{vehicle.category}</span>
                      </div>
                       <div className="flex items-center gap-1">
                        <img src={Group} alt="seats" className="w-4" />
                        <span>{vehicle.seats}</span>
                      </div>
                       <div className="flex items-center gap-1">
                        <img src={Distance} alt="distance" className="w-4" />
                        <span>{vehicle.distance}</span>
                      </div>
                      
            </div>
       

        
      {/* part4 price and rent */}
             <div className=" flex  flex-wrap ">
           <div className="me-10 flex gap-2">
              <p className="text-primary text-xl font-semibold ">
              {vehicle.price} $
            </p>
            <p className="text-gray-500">{t("vehicles.perDay")}</p>
           </div>
          

          <button className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90">
            {t("vehicles.rentNow")}
          </button>
          </div>

        </div>

      </div>

     {/* ==== التقييمات ==== */}
       <Reviews reviews={vehicle.reviews} />

      {/* ===== سيارات من نفس التصنيف  Main part 3===== */}
      {relatedVehicle.length > 0 && (
         <>
           <h3 className="text-xl font-bold mb-4">
      {t("relatedVehicles", "Other Vehicles from Same Category")}
    </h3>
    <div className="flex flex-wrap gap-6  px-4 pt-10">
      {relatedVehicle.map((v) => (
        <VehiclesCard key={v.id} vehicle={v} />
      ))}
    </div>
  </>
)}

    </div>
  );
}
