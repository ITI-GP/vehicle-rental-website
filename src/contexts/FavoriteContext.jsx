import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { toast } from "react-toastify";
const FavoriteContext = createContext();

export const FavoriteProvider = ({ user, children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debug effect to log favorites changes
  useEffect(() => {
    console.log('Favorites updated:', favorites);
  }, [favorites]);

  useEffect(() => {
    const fetchFavorites = async () => {
      console.log('fetchFavorites called');
      if (!user?.id) {
        console.log('No user ID, setting empty favorites');
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching favorites for user:', user.id);
        const { data, error } = await supabase
          .from('favorites')
          .select('vehicle_id, vehicles(*)')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error from Supabase:', error);
          throw error;
        }

        console.log('Raw favorites data from Supabase:', data);
        
        // Map the data to match the vehicle objects in the favorites array
        const favoritesData = data.map(fav => {
          const vehicle = {
            ...fav.vehicles,
            id: fav.vehicle_id // Ensure we use vehicle_id as the id
          };
          console.log('Mapped favorite:', vehicle);
          return vehicle;
        });

        console.log('Setting favorites data:', favoritesData);
        setFavorites(favoritesData || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // Keep the existing favorites in case of error
      } finally {
        console.log('Finished loading favorites');
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (vehicleId) => {
    console.log('toggleFavorite called with vehicleId:', vehicleId);
    
    if (!user) {
      const errorMsg = 'Please sign in to add favorites';
      console.log(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Create a reference to the current favorites to avoid race conditions
    const currentFavorites = [...favorites];
    const isFavorite = currentFavorites.some(fav => fav.id.toString() === vehicleId.toString());
    const action = isFavorite ? 'remove' : 'add';
    
    console.log(`Current favorites before ${action}:`, currentFavorites);
    console.log(`Action: ${action} vehicle ${vehicleId}`);
    
    try {
      // Optimistically update the UI
      setFavorites(prev => {
        if (action === 'remove') {
          return prev.filter(v => v.id.toString() !== vehicleId.toString());
        } else {
          // If we don't have the full vehicle data, create a minimal object
          const existingVehicle = prev.find(v => v.id.toString() === vehicleId.toString()) || { id: vehicleId };
          return [...prev, existingVehicle];
        }
      });

      // Perform the database operation
      if (action === 'remove') {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, vehicle_id: vehicleId });

        if (deleteError) throw deleteError;
      } else {
        const { error: upsertError } = await supabase
          .from('favorites')
          .upsert(
            { user_id: user.id, vehicle_id: vehicleId },
            { onConflict: 'user_id,vehicle_id' }
          );

        if (upsertError) {
          // If it's a duplicate error, we can ignore it since the favorite already exists
          if (upsertError.code === '23505' || upsertError.status === 409) {
            console.log('Duplicate favorite detected, ignoring');
            return;
          }
          throw upsertError;
        }
      }
      
      // Show success message based on the action
      toast.success(
        action === 'add' 
          ? 'Added to favorites' 
          : 'Removed from favorites'
      );

      // Refresh favorites from the database
      const { data: favs, error: fetchError } = await supabase
        .from('favorites')
        .select('vehicle_id, vehicles(*)')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Map the data to match the vehicle objects in the favorites array
      const updatedFavorites = favs.map(fav => ({
        ...fav.vehicles,
        id: fav.vehicle_id
      }));

      setFavorites(updatedFavorites || []);
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
      toast.error(error.message || 'An error occurred');
      
      // Re-fetch favorites to ensure UI is in sync with database
      if (user?.id) {
        const { data } = await supabase
          .from('favorites')
          .select('vehicle_id')
          .eq('user_id', user.id);
          
        if (data) {
          const vehicleIds = data.map(fav => fav.vehicle_id);
          const { data: vehicles } = await supabase
            .from('vehicles')
            .select('*')
            .in('id', vehicleIds);
            
          setFavorites(vehicles || []);
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
