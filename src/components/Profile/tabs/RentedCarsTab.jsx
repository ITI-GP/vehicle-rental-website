import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../Lib/supabaseClient";
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function RentedCarsTab({ user, activeTab }) {
  const { t, i18n } = useTranslation();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRentalId, setSelectedRentalId] = useState(null);

  // Parse URL hash for rentalId parameter
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const rentalId = params.get("rentalId");
    if (rentalId) setSelectedRentalId(rentalId);
  }, [activeTab]);

  // Fetch user's rentals with vehicle details
  const fetchRentals = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: rentalsData, error: rentalsError } = await supabase
        .from("rentals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (rentalsError) throw rentalsError;
      if (!rentalsData || rentalsData.length === 0) {
        setRentals([]);
        setError(null);
        return;
      }
      const vehicleIds = [...new Set(rentalsData.map((r) => r.vehicle_id))];
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .in("id", vehicleIds);
      if (vehiclesError) throw vehiclesError;
      const vehiclesMap = vehiclesData.reduce((acc, v) => {
        acc[v.id] = v;
        return acc;
      }, {});
      const rentalsWithVehicles = rentalsData.map((r) => ({
        ...r,
        vehicles: vehiclesMap[r.vehicle_id] || null,
        total_price: r.total_cost,
      }));
      setRentals(rentalsWithVehicles);
      setError(null);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(
        t(
          "profile.rentedCars.fetchError",
          "Failed to load your rentals. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Helpers
  const formatDate = useCallback(
    (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    },
    [i18n.language]
  );

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${base} bg-green-100 text-green-800`;
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "completed":
        return `${base} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "h-4 w-4 mr-1";
    if (status === "active")
      return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
    if (status === "pending")
      return <ClockIcon className={`${iconClass} text-yellow-500`} />;
    if (status === "cancelled")
      return <XCircleIcon className={`${iconClass} text-red-500`} />;
    return null;
  };

  const handleRentalClick = (rentalId) =>
    setSelectedRentalId(selectedRentalId === rentalId ? null : rentalId);

  // Actions
  const handleCancelRental = async (rental) => {
    if (
      !window.confirm(
        t(
          "profile.rentedCars.cancelConfirm",
          "Are you sure you want to cancel this rental?"
        )
      )
    )
      return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from("rentals")
        .update({ status: "cancelled" })
        .eq("id", rental.id)
        .select();
      if (error) throw error;
      setRentals((rentals) =>
        rentals.map((r) =>
          r.id === rental.id ? { ...r, status: "cancelled" } : r
        )
      );
    } catch {
      setError(t("profile.rentedCars.cancelError", "Failed to cancel rental."));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRental = async (rental) => {
    if (
      !window.confirm(
        t(
          "profile.rentedCars.deleteConfirm",
          "Are you sure you want to delete this rental?"
        )
      )
    )
      return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from("rentals")
        .delete()
        .eq("id", rental.id);
      if (error) throw error;
      setRentals((rentals) => rentals.filter((r) => r.id !== rental.id));
      setSelectedRentalId(null);
    } catch {
      setError(t("profile.rentedCars.deleteError", "Failed to delete rental."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2">{t("common.loading", "Loading...")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="text-center py-12">
        <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {t("profile.rentedCars.noRentals", "No rentals yet")}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t(
            "profile.rentedCars.getStarted",
            "Get started by browsing our available vehicles."
          )}
        </p>
        <div className="mt-6">
          <a
            href="/vehicles"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary  hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t("profile.rentedCars.browseVehicles", "Browse Vehicles")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("profile.rentedCars.title", "Your Rented Cars")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {t(
            "profile.rentedCars.description",
            "View and manage your current and past car rentals"
          )}
        </p>
      </div>

      <div className="space-y-4">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className={`bg-white shadow-sm rounded-xl border transition-all duration-200 ${
              selectedRentalId === rental.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-gray-100 hover:shadow-md"
            }`}
          >
            <button
              onClick={() => handleRentalClick(rental.id)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-t-xl bg-white hover:bg-gray-50 transition"
              aria-expanded={selectedRentalId === rental.id}
              aria-controls={`rental-details-${rental.id}`}
            >
              <div className="px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {rental.vehicles?.image_url ? (
                        <img
                          src={rental.vehicles.image_url}
                          alt={`${rental.vehicles.make} ${rental.vehicles.model}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <TruckIcon className="h-full w-full text-gray-300" />
                      )}
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rental.vehicles
                          ? `${rental.vehicles.year} ${rental.vehicles.make} ${rental.vehicles.model}`
                          : t(
                              "profile.rentedCars.vehicleNotAvailable",
                              "Vehicle not available"
                            )}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={getStatusBadge(rental.status)}>
                          {getStatusIcon(rental.status)}
                          {rental.status || "N/A"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(rental.start_date)} -{" "}
                          {formatDate(rental.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        selectedRentalId === rental.id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            {selectedRentalId === rental.id && (
              <div
                id={`rental-details-${rental.id}`}
                className="border-t border-gray-200 px-4 py-5 sm:px-6"
              >
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("profile.rentedCars.rentalPeriod", "Rental Period")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(rental.start_date)} -{" "}
                      {formatDate(rental.end_date)}
                      <span className="ml-2 text-gray-500">
                        ({calculateDuration(rental.start_date, rental.end_date)}{" "}
                        {t("profile.rentedCars.days", "days")})
                      </span>
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("profile.rentedCars.dailyRate", "Daily Rate")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {rental.vehicles?.daily_rate
                        ? new Intl.NumberFormat(i18n.language, {
                            style: "currency",
                            currency: "EGP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(rental.vehicles.daily_rate)
                        : "N/A"}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("profile.rentedCars.totalCost", "Total Cost")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {rental.total_price
                        ? new Intl.NumberFormat(i18n.language, {
                            style: "currency",
                            currency: "EGP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(rental.total_price)
                        : "N/A"}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {t("profile.rentedCars.bookingDate", "Booking Date")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(rental.created_at)}
                    </dd>
                  </div>

                  {rental.notes && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        {t("profile.rentedCars.notes", "Notes")}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {rental.notes}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap gap-3 justify-end">
                  {rental.status === "active" && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      // Placeholder for extend logic
                      disabled
                    >
                      {t("profile.rentedCars.extendRental", "Extend Rental")}
                    </button>
                  )}
                  {rental.status === "active" && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => handleCancelRental(rental)}
                    >
                      {t("profile.rentedCars.cancelRental", "Cancel Rental")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => handleDeleteRental(rental)}
                  >
                    {t("profile.rentedCars.deleteRental", "Delete Rental")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t("profile.rentedCars.viewDetails", "View Details")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
