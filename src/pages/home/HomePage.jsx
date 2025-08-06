

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../Lib/supabaseClient";
import Hero from "../../components/home/HeroSection/hero";
import HowToUseSection from "../../components/home/HowToUseSection/HowToUseSection";
import DownloadApp from "../../components/home/DownloadAPP/DownloadAPP";
import Featuers from "../../components/home/Features";
import Facts from "../../components/home/Facts/Facts";
import VehiclesList from "../../components/Vehicles/VehiclesList/VehiclesList";

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const transformVehicleData = (vehicle) => ({
    ...vehicle,
    id: vehicle.id.toString(),
    type: vehicle.type || 'Vehicle',
    category: vehicle.type || 'Standard',
    price: parseFloat(vehicle.price_per_day) || 0,
    imageCover: vehicle.images?.[0] || '/default-vehicle.jpg',
    manual: false,
    fuel: 'Petrol',
    airCondition: true,
    reviews: [{
      rating: parseFloat(vehicle.rating) || 0,
      comment: 'Great vehicle!',
      user: 'Anonymous'
    }],
    description: vehicle.description || 'No description available',
    location: vehicle.location || 'Location not specified',
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    seats: 4,
    distance: 'Unlimited',
    rate: parseFloat(vehicle.rating) || 0
  });

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        setIsLoading(true);
        // Fetch top 6 highest rated vehicles for the home page
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('rating', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        const transformedVehicles = (data || []).map(transformVehicleData);
        setVehicles(transformedVehicles);
      } catch (err) {
        console.error('Error fetching featured vehicles:', err);
        setError(err.message || 'Failed to load featured vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);
  return (
    <div>
      <Hero />
      <Featuers />
      <HowToUseSection />
    
      <h2 className="text-3xl font-bold my-12 text-center">
        {t("home.cardshome")}
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-300"
          >
            Retry
          </button>
        </div>
      ) : vehicles.length > 0 ? (
        <VehiclesList
          vehicles={vehicles}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <p className="text-center py-10 text-gray-500">No featured vehicles available at the moment.</p>
      )}
      
      <Facts />
      <DownloadApp />
    </div>
  );
}
