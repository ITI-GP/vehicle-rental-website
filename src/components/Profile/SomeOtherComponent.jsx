import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  UserCircleIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  TruckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../../../Lib/supabaseClient";

export default function OverviewTab({ user, userRoles }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [activeRentals, setActiveRentals] = useState([]);
  const [isLoadingRentals, setIsLoadingRentals] = useState(true);
  const [rentalError, setRentalError] = useState(null);

  // Fetch active rentals with vehicle details
  useEffect(() => {
    const fetchActiveRentals = async () => {
      if (!user?.id) {
        setIsLoadingRentals(false);
        return;
      }

      try {
        // First, get all active rentals for the user
        const { data: rentalsData, error: rentalsError } = await supabase
          .from("rentals")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["active", "in_progress", "approved"])
          .order("start_date", { ascending: true });

        if (rentalsError) throw rentalsError;

        if (!rentalsData || rentalsData.length === 0) {
          setActiveRentals([]);
          return;
        }

        // Get all unique vehicle IDs from active rentals
        const vehicleIds = [
          ...new Set(rentalsData.map((rental) => rental.vehicle_id)),
        ];

        // Fetch all vehicle details in a single query
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("*")
          .in("id", vehicleIds);

        if (vehiclesError) throw vehiclesError;

        // Create a map of vehicle ID to vehicle details for quick lookup
        const vehiclesMap = vehiclesData.reduce((acc, vehicle) => {
          acc[vehicle.id] = vehicle;
          return acc;
        }, {});

        // Combine rental data with vehicle details
        const rentalsWithVehicles = rentalsData.map((rental) => ({
          ...rental,
          vehicles: vehiclesMap[rental.vehicle_id] || null,
          // Map total_cost to total_price for backward compatibility with the UI
          total_price: rental.total_cost,
        }));

        setActiveRentals(rentalsWithVehicles);
        setRentalError(null);
      } catch (error) {
        console.error("Error fetching active rentals:", error);
        setRentalError(
          t(
            "overview.errorFetchingRentals",
            "Failed to load rental information"
          )
        );
      } finally {
        setIsLoadingRentals(false);
      }
    };

    fetchActiveRentals();
  }, [user?.id, t]);

  // Format rental period with localized dates
  const formatRentalPeriod = (startDate, endDate) => {
    if (!startDate || !endDate)
      return t("overview.datesNotSet", "Dates not set");

    const start = new Date(startDate);
    const end = new Date(endDate);

    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).formatRange(start, end);
  };

  // Format date based on current locale
  const formatDate = (dateString) => {
    if (!dateString) return t("common.never", "Never");

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate account age
  const getAccountAge = () => {
    if (!user?.created_at) return t("overview.joinedRecently", "Recently");

    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return t("overview.joinedDaysAgo", "{{count}} days ago", {
        count: diffDays,
      });
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return t("overview.joinedMonthsAgo", "{{count}} months ago", {
        count: months,
      });
    } else {
      const years = Math.floor(diffDays / 365);
      return t("overview.joinedYearsAgo", "{{count}} years ago", {
        count: years,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className={`ml-4 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("overview.welcome", "Welcome back")},{" "}
                {user?.user_metadata?.name || t("common.user", "User")}!
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t(
                  "overview.welcomeSubtitle",
                  "Here's what's happening with your account today."
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {userRoles?.isRenter
                ? t("overview.renterBadge", "Renter")
                : userRoles?.isCompany
                ? t("overview.companyBadge", "Company")
                : t("overview.ownerBadge", "Owner")}
            </span>
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Rentals Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <TruckIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("overview.activeRentals", "Active Rentals")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isLoadingRentals
                      ? t("common.loading", "Loading...")
                      : t("overview.rentalCount", "{{count}} active", {
                          count: activeRentals.length,
                        })}
                  </p>
                </div>
              </div>
            </div>
            {rentalError && (
              <div className="mt-4 text-sm text-red-600">{rentalError}</div>
            )}
            {!isLoadingRentals && activeRentals.length > 0 && (
              <div className="mt-4 space-y-4">
                {activeRentals.slice(0, 2).map((rental) => (
                  <div
                    key={rental.id}
                    className="flex items-start border-t border-gray-100 pt-3"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                      {rental.vehicles?.image_url ? (
                        <img
                          src={rental.vehicles.image_url}
                          alt={
                            rental.vehicles
                              ? `${rental.vehicles.make} ${rental.vehicles.model}`
                              : t("overview.vehicleImageAlt", "Vehicle image")
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <TruckIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {rental.vehicles
                          ? `${rental.vehicles.year} ${rental.vehicles.make} ${rental.vehicles.model}`
                          : t(
                              "overview.vehicleNotAvailable",
                              "Vehicle not available"
                            )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRentalPeriod(rental.start_date, rental.end_date)}
                      </p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {rental.status
                            ? t(
                                `overview.status.${rental.status}`,
                                rental.status.replace("_", " ")
                              )
                            : t("overview.active", "Active")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Account Status Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircleIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t("overview.accountStatus", "Account Status")}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {t("overview.active", "Active")}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-700">
                {t("overview.verifiedBadge", "Verified")}
              </span>
              <span className="text-gray-500 ml-2">
                {t("overview.emailVerified", "Email verified")}
              </span>
            </div>
          </div>
        </div>
        {/* Member Since Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <CalendarIcon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t("overview.memberSince", "Member since")}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {user?.created_at
                        ? formatDate(user.created_at).split(",")[0]
                        : t("overview.recently", "Recently")}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">{getAccountAge()}</span>
            </div>
          </div>
        </div>
        {/* Last Activity Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ClockIcon
                  className="h-6 w-6 text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t("overview.lastActivity", "Last activity")}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {user?.last_sign_in_at
                        ? formatDate(user.last_sign_in_at).split(",")[0]
                        : t("overview.never", "Never")}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">
                {user?.last_sign_in_at
                  ? t("overview.lastActive", "Last active {{time}}", {
                      time: (() => {
                        const parts = formatDate(user.last_sign_in_at).split(
                          ","
                        );
                        return parts[1] ? parts[1].trim() : "";
                      })(),
                    })
                  : t("overview.noActivity", "No activity recorded")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t("overview.recentActivity", "Recent Activity")}
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("overview.noActivity", "No recent activity")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t(
                "overview.activityAppearHere",
                "Your recent activities will appear here."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
