// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../Lib/supabaseClient";
// import { toast } from "react-toastify";

// const FavoriteContext = createContext();

// export const FavoriteProvider = ({ user, children }) => {
//   const [favorites, setFavorites] = useState([]);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (user?.id) {
//         const { data, error } = await supabase
//           .from("favorites")
//           .select("vehicle_id")
//           .eq("user_id", user.id);

//         if (error) {
//           console.error("Error fetching favorites:", error.message);
//         } else {
//           //  console.log("Fetched favorites:", data);
//           setFavorites(data.map((fav) => fav.vehicle_id));
//         }
//       }
//     };

//     fetchFavorites();
//   }, [user]);

//   const toggleFavorite = async (vehicleId) => {
//     if (!user?.id) return;

//     const isAlreadyFavorite = favorites.includes(vehicleId);

//     if (isAlreadyFavorite) {
//       const { error } = await supabase
//         .from("favorites")
//         .delete()
//         .eq("user_id", user.id)
//         .eq("vehicle_id", vehicleId);

//       if (error) {
//         console.error("Error removing favorite:", error.message);
//         toast.error("❌ Failed to remove from favorites");
//       } else {
//         setFavorites((prev) => prev.filter((id) => id !== vehicleId));
//         toast.success("🗑️ Removed from favorites");
//       }
//     } else {
//       const { error } = await supabase.from("favorites").insert({
//         user_id: user.id,
//         vehicle_id: vehicleId,
//       });

//       if (error) {
//         console.error("Error adding favorite:", error.message);
//         toast.error("❌ Failed to add to favorites");
//       } else {
//         setFavorites((prev) => [...prev, vehicleId]);
//         toast.success("✅ Added to favorites");
//       }
//     }
//   };

//   const isFavorite = (vehicleId) => {
//     return favorites.includes(vehicleId);
//   };

//   return (
//     <FavoriteContext.Provider
//       value={{ favorites, toggleFavorite, isFavorite }}
//     >
//       {children}
//     </FavoriteContext.Provider>
//   );
// };

// export const useFavorites = () => useContext(FavoriteContext);





import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { toast } from "react-toastify";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ user, children }) => {
  const [favorites, setFavorites] = useState([]); // هتكون array من سيارات كاملة

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id) {
        try {
          // أولاً جلب vehicle_ids من جدول favorites
          const { data: favs, error: favsError } = await supabase
            .from("favorites")
            .select("vehicle_id")
            .eq("user_id", user.id);

          if (favsError) throw favsError;

          const vehicleIds = favs.map((fav) => fav.vehicle_id);
          if (vehicleIds.length === 0) {
            setFavorites([]);
            return;
          }

          // جلب بيانات العربيات كاملة من جدول vehicles
          const { data: vehicles, error: vehiclesError } = await supabase
            .from("vehicles")
            .select("*")
            .in("id", vehicleIds);

          if (vehiclesError) throw vehiclesError;

          setFavorites(vehicles || []);
        } catch (error) {
          console.error("Error fetching favorites:", error.message);
        }
      } else {
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (vehicleId) => {
    if (!user?.id) return;

    const isAlreadyFavorite = favorites.some((v) => v.id === vehicleId);

    if (isAlreadyFavorite) {
      // حذف من الفيفوريت
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("vehicle_id", vehicleId);

      if (error) {
        console.error("Error removing favorite:", error.message);
        toast.error("❌ Failed to remove from favorites");
      } else {
        setFavorites((prev) => prev.filter((v) => v.id !== vehicleId));
        toast.success("🗑️ Removed from favorites");
      }
    } else {
      // إضافة للفيفوريت
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        vehicle_id: vehicleId,
      });

      if (error) {
        console.error("Error adding favorite:", error.message);
        toast.error("❌ Failed to add to favorites");
      } else {
        try {
          // جلب بيانات السيارة المضافة عشان تضيفها مباشرة لـ favorites
          const { data: newVehicle, error: vehicleError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("id", vehicleId)
            .single();

          if (vehicleError) throw vehicleError;

          setFavorites((prev) => [...prev, newVehicle]);
          toast.success("✅ Added to favorites");
        } catch (error) {
          console.error("Error fetching new favorite vehicle:", error.message);
          // لو ما قدرناش نجيب بياناتها نضيف فقط الـ id
          setFavorites((prev) => [...prev, { id: vehicleId }]);
        }
      }
    }
  };

  const isFavorite = (vehicleId) => {
    return favorites.some((v) => v.id === vehicleId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);


