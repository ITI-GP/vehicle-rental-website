import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ user, children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setFavorites([]);
        return;
      }

      try {
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

        const { data: vehicles, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("*")
          .in("id", vehicleIds);

        if (vehiclesError) throw vehiclesError;

        setFavorites(vehicles || []);
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (vehicleId) => {
    if (!user?.id) return;

    const isAlreadyFavorite = favorites.some((v) => v.id === vehicleId);

    if (isAlreadyFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("vehicle_id", vehicleId);

      if (error) {
        console.error("Error removing favorite:", error.message);
      } else {
        setFavorites((prev) => prev.filter((v) => v.id !== vehicleId));
      }
    } else {
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: user.id,
          vehicle_id: vehicleId,
        },
      ]);

      if (error) {
        console.error("Error adding favorite:", error.message);
      } else {
        try {
          const { data: newVehicle, error: vehicleError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("id", vehicleId)
            .single();

          if (vehicleError) throw vehicleError;

          setFavorites((prev) => [...prev, newVehicle]);
        } catch (error) {
          console.error("Error fetching new favorite vehicle:", error.message);
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
