import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function RentForm() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  const vehicle = state?.vehicle;

  useEffect(() => {
    if (!vehicle) {
      navigate("/"); // Redirect if no vehicle passed
    }
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{t("vehicles.rentFormTitle", "Rent This Vehicle")}</h2>

      <div className="bg-white p-6 shadow-md rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-2">{vehicle.type}</h3>
        <p className="text-gray-600 mb-2">{vehicle.description}</p>
        <p className="text-primary font-bold">{vehicle.price} $ / {t("vehicles.perDay")}</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">{t("vehicles.name", "Full Name")}</label>
          <input type="text" className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("vehicles.phone", "Phone Number")}</label>
          <input type="tel" className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("vehicles.date", "Rental Date")}</label>
          <input type="date" className="w-full border px-3 py-2 rounded" required />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
        >
          {t("vehicles.confirmRental", "Confirm Rental")}
        </button>
      </form>
    </div>
  );
}
