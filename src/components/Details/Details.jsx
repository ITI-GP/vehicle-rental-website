// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../Lib/supabaseClient";
// import AutoIcon from "./../../assets/AutoIcon.png";
// import Fuel from "./../../assets/Fuel.png";
// import Air from "./../../assets/Air.png";
// import Group from "./../../assets/Group.png";
// import Distance from "./../../assets/Distance.png";
// import VehiclesCard from "../VehiclesCard/VehiclesCard";
// import Reviews from "./Reviews/Reviews";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../contexts/AuthContext";

// export default function DetailsPage() {
//   const { user } = useAuth();
//   const { id } = useParams();
//   console.log("Vehicle ID:", id);
//   const { t } = useTranslation();
//   const [vehicle, setVehicle] = useState(null);
//   const [relatedVehicle, setRelatedVehicle] = useState([]);
//   const [mainImage, setMainImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false); // add state for pending button

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     location: "",
//     address: "",
//     deliveryDate: "",
//     rentalDays: "", // new field
//     cardName: "",
//     cardNumber: "",
//     expiration: "",
//     cvv: "",
//     payment: "",
//     notes: "",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       orderDate: new Date().toISOString().split("T")[0],
//     }));
//   }, []);

//   const transformVehicleData = (vehicle) => ({
//     ...vehicle,
//     id: vehicle.id,
//     type: vehicle.type || "Vehicle",
//     category: vehicle.type || "Standard",
//     price: parseFloat(vehicle.price_per_day) || 0,
//     imageCover: vehicle.images?.[0] || "/default-vehicle.jpg",
//     manual: false,
//     fuel: "Petrol",
//     airCondition: true,
//     reviews: [
//       {
//         rating: parseFloat(vehicle.rating) || 0,
//         comment: "Great vehicle!",
//         user: "Anonymous",
//       },
//     ],
//     description: vehicle.description || "No description available",
//     location: vehicle.location || "Location not specified",
//     brand: vehicle.brand || "",
//     model: vehicle.model || "",
//     year: vehicle.year || new Date().getFullYear(),
//     seats: 4,
//     distance: "Unlimited",
//   });

//   const fetchVehicle = async (vehicleId) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("vehicles")
//         .select("*")
//         .eq("id", vehicleId)
//         .single();

//       if (error) throw error;
//       if (data) {
//         const transformed = transformVehicleData(data);
//         setVehicle(transformed);
//         setMainImage(transformed.imageCover);
//         return transformed;
//       }
//     } catch (err) {
//       console.error("Error fetching vehicle:", err);
//       setError(err.message || "Failed to load vehicle details");
//     } finally {
//       setIsLoading(false);
//     }
//     return null;
//   };

//   const fetchRelatedVehicles = async (vehicleType) => {
//     try {
//       const { data, error } = await supabase
//         .from("vehicles")
//         .select("*")
//         .eq("type", vehicleType)
//         .limit(4);

//       if (error) throw error;

//       const transformed = data
//         .filter((v) => v.id.toString() !== id)
//         .map(transformVehicleData);

//       setRelatedVehicle(transformed);
//     } catch (err) {
//       console.error("Error fetching related vehicles:", err);
//       setRelatedVehicle([]);
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const selected = await fetchVehicle(id);
//       if (selected) {
//         await fetchRelatedVehicles(selected.type);
//       }
//     };
//     loadData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const errors = {};

//     // Full Name Validation
//     if (!formData.fullName.trim()) errors.fullName = "Full name is required";

//     // Email Validation
//     if (!formData.email.trim()) errors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       errors.email = "Invalid email";

//     // Location Validation
//     if (!formData.location) errors.location = "Location is required";

//     // Address Validation
//     if (!formData.address.trim()) errors.address = "Address is required";

//     // Delivery Date Validation
//     if (!formData.deliveryDate)
//       errors.deliveryDate = "Delivery date is required";

//     // Rental Days Validation
//     if (
//       !formData.rentalDays ||
//       isNaN(formData.rentalDays) ||
//       Number(formData.rentalDays) < 1
//     )
//       errors.rentalDays = "Please enter a valid number of days";

//     // Payment Method Validation
//     if (!formData.payment) errors.payment = "Payment method is required";

//     // Card Details Validation (only if payment is not "Cash on delivery")
//     if (formData.payment !== "Cash on delivery") {
//       // Card Name Validation
//       if (!formData.cardName.trim()) errors.cardName = "Card name is required";

//       // Card Number Validation (13 to 19 digits)
//       if (!formData.cardNumber.trim())
//         errors.cardNumber =
//           "Please enter a valid credit card number (13-19 digits)";
//       else if (!/^\d{13,19}$/.test(formData.cardNumber))
//         errors.cardNumber =
//           "Please enter a valid credit card number (13-19 digits)";

//       // Expiration Validation
//       if (!formData.expiration) errors.expiration = "Expiration is required";

//       // CVV Validation (3 or 4 digits)
//       if (!formData.cvv) errors.cvv = "Please enter a valid CVV (3-4 digits)";
//       else if (!/^\d{3,4}$/.test(formData.cvv))
//         errors.cvv = "Please enter a valid CVV (3 or 4 digits)";
//     }
//     // Notes Validation (optional, but can be added if needed)
//     if (formData.notes && formData.notes.length > 500) {
//       errors.notes = "Notes cannot exceed 500 characters";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       setIsSubmitting(true);
//       try {
//         // Validate user_id is UUID
//         const uuidRegex =
//           /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//         if (user?.id && !uuidRegex.test(user.id)) {
//           toast.error("User ID is not a valid UUID.", {
//             position: "top-right",
//           });
//           setIsSubmitting(false);
//           return;
//         }

//         // Ensure date format is correct
//         const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
//         if (!dateFormat.test(formData.deliveryDate)) {
//           toast.error("Date format must be YYYY-MM-DD.", {
//             position: "top-right",
//           });
//           setIsSubmitting(false);
//           return;
//         }

//         // Calculate start_date and end_date
//         const startDateObj = new Date(formData.deliveryDate);
//         const rentalDaysInt = parseInt(formData.rentalDays, 10);
//         const endDateObj = new Date(startDateObj);
//         endDateObj.setDate(startDateObj.getDate() + rentalDaysInt);

//         const startDate = startDateObj.toISOString();
//         const endDate = endDateObj.toISOString();

//         const { data, error } = await supabase
//           .from("rental_requests")
//           .insert([
//             {
//               user_id: user?.id,
//               vehicle_id: Number(id),
//               status: "pending",
//               is_delivered: false,
//               start_date: startDate,
//               end_date: endDate,
//               location: formData.location,
//               address: formData.address,
//               payment: formData.payment,
//               card_name: formData.cardName,
//               card_number: formData.cardNumber,
//               expiration: formData.expiration,
//               cvv: formData.cvv,
//               notes: formData.notes,
//             },
//           ])
//           .select();

//         if (error) throw error;

//         toast.success("Rental request submitted successfully!", {
//           position: "top-right",
//           autoClose: 5000,
//         });

//         setFormData({
//           fullName: "",
//           email: "",
//           location: "",
//           address: "",
//           deliveryDate: "",
//           rentalDays: "",
//           cardName: "",
//           cardNumber: "",
//           expiration: "",
//           cvv: "",
//           payment: "",
//           notes: "",
//         });
//         setFormErrors({});
//         setShowModal(false);
//       } catch (err) {
//         toast.error("Failed to submit the rental request", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//         console.error("Error submitting rental request:", err);
//       } finally {
//         setIsSubmitting(false);
//       }
//     } else {
//       toast.error("Please fill all fields!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       });
//     }
//   };

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="text-center py-10 text-red-500">
//         <p>Error: {error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-300"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   if (!vehicle) return <div className="p-8">Vehicle not found</div>;

//   return (
//     <div className="p-8 space-y-10">
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="w-full md:w-1/2">
//           <img
//             src={mainImage || vehicle.imageCover}
//             alt={vehicle.type}
//             className="w-full h-[300px] object-cover rounded-xl"
//           />
//           {vehicle.images?.length > 0 && (
//             <div className="mt-4 grid grid-cols-4 gap-4">
//               {vehicle.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`thumb-${idx}`}
//                   onClick={() => setMainImage(img)}
//                   className={`cursor-pointer h-20 object-cover rounded-md hover:scale-90 transition-all border ${
//                     img === mainImage
//                       ? "border-primary border-2"
//                       : "border-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="w-full md:w-1/2 space-y-4">
//           <div>
//             <h2 className="text-2xl font-bold mb-3">{vehicle.type}</h2>
//             <div>
//               {Array.from({
//                 length: Math.round(vehicle.reviews?.[0]?.rating || 0),
//               }).map((_, idx) => (
//                 <i
//                   key={idx}
//                   className="fa-solid fa-star text-yellow-500 mr-1"
//                 ></i>
//               ))}
//             </div>
//           </div>

//           <div>{vehicle.description}</div>

//           <div className="flex justify-between pt-3 text-sm text-gray-700 mb-6 flex-wrap gap-2">
//             <div className="flex items-center gap-1">
//               <img src={AutoIcon} alt="Transmission" className="w-4" />
//               <span>
//                 {vehicle.manual
//                   ? t("vehicles.manual")
//                   : t("vehicles.automatic")}
//               </span>
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={Fuel} alt="Fuel" className="w-4" />
//               <span>{vehicle.fuel}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={Air} alt="A/C" className="w-4" />
//               <span>
//                 {vehicle.airCondition
//                   ? t("vehicles.airCondition")
//                   : t("vehicles.noAirCondition")}
//               </span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="font-bold">Type:</span>
//               <span>{vehicle.category}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={Group} alt="seats" className="w-4" />
//               <span>{vehicle.seats}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={Distance} alt="distance" className="w-4" />
//               <span>{vehicle.distance}</span>
//             </div>
//           </div>

//           <div className="flex gap-4 items-center">
//             <div className="text-primary text-xl font-semibold">
//               {vehicle.price} $
//             </div>
//             <div className="text-gray-500">{t("vehicles.perDay")}</div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
//                   Pending...
//                 </span>
//               ) : (
//                 t("vehicles.rentNow")
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <Reviews reviews={vehicle.reviews} />

//       {relatedVehicle.length > 0 && (
//         <>
//           <h3 className="text-xl font-bold mb-4">
//             {t("relatedVehicles", "Other Vehicles from Same Category")}
//           </h3>
//           <div className="flex flex-wrap gap-6 px-4 pt-10">
//             {relatedVehicle.map((v) => (
//               <VehiclesCard key={v.id} vehicle={v} />
//             ))}
//           </div>
//         </>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
//           <div className="bg-white p-10 rounded-2xl w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
//             <h2 className="text-3xl font-bold mb-6 text-center">
//               Rent Vehicle
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Enter your full name"
//                   required
//                 />
//                 {formErrors.fullName && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.fullName}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Enter your email"
//                   required
//                 />
//                 {formErrors.email && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.email}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Location
//                 </label>
//                 <select
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   required
//                 >
//                   <option value="">Select a location</option>
//                   <option value="Cairo">Cairo</option>
//                   <option value="Giza">Giza</option>
//                   <option value="Alexandria">Alexandria</option>
//                 </select>
//                 {formErrors.location && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.location}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Address
//                 </label>
//                 <input
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Enter address"
//                   required
//                 />
//                 {formErrors.address && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.address}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Delivery Date
//                 </label>
//                 <input
//                   type="date"
//                   name="deliveryDate"
//                   value={formData.deliveryDate}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   required
//                 />
//                 {formErrors.deliveryDate && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.deliveryDate}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Rental Days
//                 </label>
//                 <input
//                   type="number"
//                   name="rentalDays"
//                   value={formData.rentalDays}
//                   onChange={handleChange}
//                   min={1}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Enter rental days"
//                   required
//                 />
//                 {formErrors.rentalDays && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.rentalDays}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Notes (optional)
//                 </label>
//                 <input
//                   type="text"
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Enter notes"
//                 />
//                 {formErrors.notes && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.notes}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <hr className="my-4" />
//             <h3 className="text-xl font-bold">Payment</h3>
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="Credit card"
//                     checked={formData.payment === "Credit card"}
//                     onChange={handleChange}
//                   />{" "}
//                   Credit card
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="Debit card"
//                     checked={formData.payment === "Debit card"}
//                     onChange={handleChange}
//                   />{" "}
//                   Debit card
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="Cash on delivery"
//                     checked={formData.payment === "Cash on delivery"}
//                     onChange={handleChange}
//                   />{" "}
//                   Cash on delivery
//                 </label>
//               </div>
//               {formErrors.payment && (
//                 <div className="text-red-500 text-xs mt-1">
//                   {formErrors.payment}
//                 </div>
//               )}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <input
//                   name="cardName"
//                   value={formData.cardName}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2"
//                   placeholder="Name on card"
//                   required={formData.payment !== "Cash on delivery"}
//                   disabled={formData.payment === "Cash on delivery"}
//                 />
//                 {formErrors.cardName && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.cardName}
//                   </div>
//                 )}
//                 <input
//                   name="cardNumber"
//                   value={formData.cardNumber}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2"
//                   placeholder="Card number"
//                   required={formData.payment !== "Cash on delivery"}
//                   disabled={formData.payment === "Cash on delivery"}
//                 />
//                 {formErrors.cardNumber && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.cardNumber}
//                   </div>
//                 )}
//                 <input
//                   name="expiration"
//                   value={formData.expiration}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2"
//                   placeholder="Expiration"
//                   type="month"
//                   required={formData.payment !== "Cash on delivery"}
//                   disabled={formData.payment === "Cash on delivery"}
//                 />
//                 {formErrors.expiration && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.expiration}
//                   </div>
//                 )}
//                 <input
//                   name="cvv"
//                   value={formData.cvv}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2"
//                   placeholder="CVV"
//                   type="password"
//                   required={formData.payment !== "Cash on delivery"}
//                   disabled={formData.payment === "Cash on delivery"}
//                 />
//                 {formErrors.cvv && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {formErrors.cvv}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 mt-8">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-primary text-white px-6 py-2 rounded-lg  transition"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
//                     Pending...
//                   </span>
//                 ) : (
//                   "Confirm Order"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useTranslation } from "react-i18next";
import { useParams} from "react-router-dom";
import { supabase } from "../../Lib/supabaseClient";
import AutoIcon from "./../../assets/AutoIcon.png";
import Fuel from "./../../assets/Fuel.png";
import Air from "./../../assets/Air.png";
import Group from "./../../assets/Group.png";
import Distance from "./../../assets/Distance.png";
import VehiclesCard from "../VehiclesCard/VehiclesCard";
import Reviews from "./Reviews/Reviews";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext";

import RentalModal from "./RentalModal"; // استدعاء المودال
import { useEffect, useState } from "react";

export default function DetailsPage() {

  const { user } = useAuth();
  const { id } = useParams();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState(null);
  const [relatedVehicle, setRelatedVehicle] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orderDate: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const transformVehicleData = (vehicle) => ({
    ...vehicle,
    id: vehicle.id,
    type: vehicle.type || "Vehicle",
    category: vehicle.type || "Standard",
    price: parseFloat(vehicle.price_per_day) || 0,
    imageCover: vehicle.images?.[0] || "/default-vehicle.jpg",
    manual: false,
    fuel: "Petrol",
    airCondition: true,
    reviews: [
      {
        rating: parseFloat(vehicle.rating) || 0,
        comment: "Great vehicle!",
        user: "Anonymous",
      },
    ],
    description: vehicle.description || "No description available",
    location: vehicle.location || "Location not specified",
    brand: vehicle.brand || "",
    model: vehicle.model || "",
    year: vehicle.year || new Date().getFullYear(),
    seats: 4,
    distance: "Unlimited",
  });

  const fetchVehicle = async (vehicleId) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error) throw error;
      if (data) {
        const transformed = transformVehicleData(data);
        setVehicle(transformed);
        setMainImage(transformed.imageCover);
        return transformed;
      }
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      setError(err.message || "Failed to load vehicle details");
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const fetchRelatedVehicles = async (vehicleType) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("type", vehicleType)
        .limit(4);

      if (error) throw error;

      const transformed = data
        .filter((v) => v.id.toString() !== id)
        .map(transformVehicleData);

      setRelatedVehicle(transformed);
    } catch (err) {
      console.error("Error fetching related vehicles:", err);
      setRelatedVehicle([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const selected = await fetchVehicle(id);
      if (selected) {
        await fetchRelatedVehicles(selected.type);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email";

    if (!formData.location) errors.location = "Location is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.deliveryDate) errors.deliveryDate = "Delivery date is required";

    if (
      !formData.rentalDays ||
      isNaN(formData.rentalDays) ||
      Number(formData.rentalDays) < 1
    )
      errors.rentalDays = "Please enter a valid number of days";

    if (!formData.payment) errors.payment = "Payment method is required";

    if (formData.payment !== "Cash on delivery") {
      if (!formData.cardName.trim()) errors.cardName = "Card name is required";

      if (!formData.cardNumber.trim())
        errors.cardNumber =
          "Please enter a valid credit card number (13-19 digits)";
      else if (!/^\d{13,19}$/.test(formData.cardNumber))
        errors.cardNumber =
          "Please enter a valid credit card number (13-19 digits)";

      if (!formData.expiration) errors.expiration = "Expiration is required";

      if (!formData.cvv) errors.cvv = "Please enter a valid CVV (3-4 digits)";
      else if (!/^\d{3,4}$/.test(formData.cvv))
        errors.cvv = "Please enter a valid CVV (3 or 4 digits)";
    }

    if (formData.notes && formData.notes.length > 500) {
      errors.notes = "Notes cannot exceed 500 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Validate user_id is UUID
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (user?.id && !uuidRegex.test(user.id)) {
          toast.error("User ID is not a valid UUID.", {
            position: "top-right",
          });
          setIsSubmitting(false);
          return;
        }

        // Ensure date format is correct
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormat.test(formData.deliveryDate)) {
          toast.error("Date format must be YYYY-MM-DD.", {
            position: "top-right",
          });
          setIsSubmitting(false);
          return;
        }

        const startDateObj = new Date(formData.deliveryDate);
        const rentalDaysInt = parseInt(formData.rentalDays, 10);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(startDateObj.getDate() + rentalDaysInt);

        const startDate = startDateObj.toISOString();
        const endDate = endDateObj.toISOString();

        const { data, error } = await supabase
          .from("rental_requests")
          .insert([
            {
              user_id: user?.id,
              vehicle_id: Number(id),
              status: "pending",
              is_delivered: false,
              start_date: startDate,
              end_date: endDate,
              location: formData.location,
              address: formData.address,
              payment: formData.payment,
              card_name: formData.cardName,
              card_number: formData.cardNumber,
              expiration: formData.expiration,
              cvv: formData.cvv,
              notes: formData.notes,
            },
          ])
          .select();

        if (error) throw error;

        toast.success("Rental request submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        setFormData({
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
        setFormErrors({});
        setShowModal(false);
      } catch (err) {
        toast.error("Failed to submit the rental request", {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Error submitting rental request:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill all fields!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
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
  if (!vehicle) return <div className="p-8">Vehicle not found</div>;

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={mainImage || vehicle.imageCover}
            alt={vehicle.type}
            className="w-full h-[300px] object-contain rounded-xl"
          />
          {vehicle.images?.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {vehicle.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`cursor-pointer h-20 object-cover rounded-md hover:scale-90 transition-all border ${
                    img === mainImage
                      ? "border-primary border-2"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-3">{vehicle.type}</h2>
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

          <div>{vehicle.description}</div>

          <div className="flex justify-between pt-3 text-sm text-gray-700 mb-6 flex-wrap gap-2">
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
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Air} alt="A/C" className="w-4" />
              <span>
                {vehicle.airCondition
                  ? t("vehicles.airCondition")
                  : t("vehicles.noAirCondition")}
              </span>
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

          <div className="flex gap-4 items-center">
            <div className="text-primary text-xl font-semibold">
              {vehicle.price} $
            </div>
            <div className="text-gray-500">{t("vehicles.perDay")}</div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  Pending...
                </span>
              ) : (
                t("vehicles.rentNow")
              )}
            </button>
          </div>
        </div>
      </div>

      {/* <Reviews reviews={vehicle.reviews} /> */}
      {vehicle && vehicle.id && <Reviews vehicleId={vehicle.id} />}


      {relatedVehicle.length > 0 && (
        <>
          <h3 className="text-xl font-bold mb-4">
            {t("relatedVehicles", "Other Vehicles from Same Category")}
          </h3>
          <div className="flex flex-wrap gap-6 px-4 pt-10">
            {relatedVehicle.map((v) => (
              <VehiclesCard key={v.id} vehicle={v} />
            ))}
          </div>
        </>
      )}

      {showModal && (
        <RentalModal
          formData={formData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          handleChange={handleChange}
          setShowModal={setShowModal}
          vehicleId={id}
          user={user}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
    </div>
  );
}
