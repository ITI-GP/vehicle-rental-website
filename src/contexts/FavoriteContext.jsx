import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { toast } from "react-toastify";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ user, children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("favorites")
          .select("vehicle_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching favorites:", error.message);
        } else {
           console.log("Fetched favorites:", data);
          setFavorites(data.map((fav) => fav.vehicle_id));
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (vehicleId) => {
    if (!user?.id) return;

    const isAlreadyFavorite = favorites.includes(vehicleId);

    if (isAlreadyFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("vehicle_id", vehicleId);

      if (error) {
        console.error("Error removing favorite:", error.message);
        toast.error("❌ Failed to remove from favorites");
      } else {
        setFavorites((prev) => prev.filter((id) => id !== vehicleId));
        toast.success("🗑️ Removed from favorites");
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        vehicle_id: vehicleId,
      });

      if (error) {
        console.error("Error adding favorite:", error.message);
        toast.error("❌ Failed to add to favorites");
      } else {
        setFavorites((prev) => [...prev, vehicleId]);
        toast.success("✅ Added to favorites");
      }
    }
  };

  const isFavorite = (vehicleId) => {
    return favorites.includes(vehicleId);
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);







