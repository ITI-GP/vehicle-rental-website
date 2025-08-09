// import { useEffect, useState } from "react";
// import { supabase } from "../../Lib/supabaseClient";
// import VehiclesCard from "../../components/VehiclesCard/VehiclesCard";
// import { useFavorites } from "../../contexts/FavoriteContext";
// const FavoriteVehicles = () => {
//   const [userId, setUserId] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { isFavorite } = useFavorites(); // علشان نتحقق من الفيفوريت وقت التحديث

//   useEffect(() => {
//     const fetchUserAndFavorites = async () => {
//       setLoading(true);
//       try {
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError) throw userError;

//         setUserId(user.id);

//         const { data: favs, error: favsError } = await supabase
//           .from("favorites")
//           .select("vehicle_id")
//           .eq("user_id", user.id);

//         if (favsError) throw favsError;

//         const vehicleIds = favs.map((fav) => fav.vehicle_id);

//         if (vehicleIds.length === 0) {
//           setVehicles([]);
//           return;
//         }

//         const { data: vehicleData, error: vehicleError } = await supabase
//           .from("vehicles")
//           .select("*")
//           .in("id", vehicleIds);

//         if (vehicleError) throw vehicleError;

//         setVehicles(vehicleData);
//       } catch (error) {
//         console.error("Error:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAndFavorites();
//   }, []);

//   // ✅ دالة لإزالة العنصر فورًا من الواجهة لما يتم Unfavorite
//   const handleRemoveVehicle = (vehicleId) => {
//     setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">My Favorite Vehicles</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : vehicles.length === 0 ? (
//         <p>No favorites found.</p>
//       ) : (
//         <div className="flex flex-wrap gap-6">
//           {vehicles.map((vehicle) =>
//             isFavorite(vehicle.id) ? (
//               <VehiclesCard
//                 key={vehicle.id}
//                 vehicle={vehicle}
//                 onUnfavorite={() => handleRemoveVehicle(vehicle.id)}
//               />
//             ) : null
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FavoriteVehicles;



import { useEffect, useState } from "react";
import { supabase } from "../../Lib/supabaseClient";
import VehiclesCard from "../../components/VehiclesCard/VehiclesCard";
import { useFavorites } from "../../contexts/FavoriteContext";

export default function FavoriteVehicles() {
  const [userId, setUserId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { favorites, isFavorite } = useFavorites(); 
  // favorites في Context مفترض يكون array كامل فيه بيانات العربيات عشان التحديث الحي

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      setLoading(true);
      try {
        // جلب بيانات المستخدم الحالي من Supabase Auth
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        setUserId(user.id);

        // جلب vehicle_id من جدول favorites بناءً على user_id
        const { data: favs, error: favsError } = await supabase
          .from("favorites")
          .select("vehicle_id")
          .eq("user_id", user.id);

        if (favsError) throw favsError;

        const vehicleIds = favs.map((fav) => fav.vehicle_id);

        if (vehicleIds.length === 0) {
          setVehicles([]);
          setLoading(false);
          return;
        }

        // جلب بيانات السيارات كاملة بناءً على vehicleIds
        const { data: vehicleData, error: vehicleError } = await supabase
          .from("vehicles")
          .select("*")
          .in("id", vehicleIds);

        if (vehicleError) throw vehicleError;

        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, []);

  // دالة لحذف سيارة من العرض لو اتشالت من الفيفوريت
  const handleRemoveVehicle = (vehicleId) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Favorite Vehicles</h2>

      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No favorites found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {vehicles.map((vehicle) =>
            isFavorite(vehicle.id) ? (
              <VehiclesCard
                key={vehicle.id}
                vehicle={vehicle}
                onUnfavorite={() => handleRemoveVehicle(vehicle.id)}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

