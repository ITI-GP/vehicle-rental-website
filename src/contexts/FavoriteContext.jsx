import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { toast } from "react-toastify";
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

    try {
      // First, check if the vehicle is in the database
      const { data: existingVehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (vehicleError) throw vehicleError;
      if (!existingVehicle) throw new Error('Vehicle not found');

      // Check if already favorited using a direct query to avoid race conditions
      const { data: existingFavorite, error: favCheckError } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('vehicle_id', vehicleId)
        .maybeSingle();

      if (favCheckError) throw favCheckError;

      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id);

        if (deleteError) throw deleteError;

        // Update local state
        setFavorites(prev => prev.filter(v => v.id !== vehicleId));
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        try {
          const { error: insertError } = await supabase
            .from('favorites')
            .insert([{ user_id: user.id, vehicle_id: vehicleId }]);

          if (insertError) throw insertError;

          // Update local state
          setFavorites(prev => [...prev, existingVehicle]);
          toast.success('Added to favorites');
        } catch (insertError) {
          // Handle duplicate key error (409 conflict)
          if (insertError.code === '23505' || insertError.status === 409) {
            // Already exists, just update the UI
            setFavorites(prev => [...prev, existingVehicle]);
            toast.info('Already in favorites');
          } else {
            throw insertError;
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorites');
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
