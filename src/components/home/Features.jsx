import location from "./HeroSection/Images/location.png";
import comfort from "./HeroSection/Images/comfort.png";
import savings from "./HeroSection/Images/savings.png";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white py-12 m-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center">
          {/* Availability */}
          <div className="w-full lg:w-1/3">
            <img src={location} alt="location" className="mx-auto w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("features.availabilityTitle")}</h3>
            <p className="text-gray-600 text-sm">
              {t("features.availabilityDesc")}
            </p>
          </div>

          {/* Comfort */}
          <div className="w-full lg:w-1/3">
            <img src={comfort} alt="comfort" className="mx-auto w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("features.comfortTitle")}</h3>
            <p className="text-gray-600 text-sm">
              {t("features.comfortDesc")}
            </p>
          </div>

          {/* Savings */}
          <div className="w-full lg:w-1/3">
            <img src={savings} alt="savings" className="mx-auto w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("features.savingsTitle")}</h3>
            <p className="text-gray-600 text-sm">
              {t("features.savingsDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
