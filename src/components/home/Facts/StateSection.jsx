import StatBox from "./StatBox";
import carImg from "../HeroSection/Images/Vector.png";
import busImg from "../HeroSection/Images/Icon.png";
import bikeImg from "../HeroSection/images/calendar.png";
import scooterImg from "../HeroSection/images/speed.png";

import { useTranslation } from "react-i18next";

// Convert Western to Arabic numerals
const convertToArabicNumbers = (numberStr) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return numberStr.replace(/\d/g, (digit) => arabicDigits[digit]);
};

const StatsSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "AR";

  const convertNumber = (numStr) => {
    const base = numStr.replace("+", "");
    const converted = isArabic ? convertToArabicNumbers(base) : base;
    return "+" + converted;
  };

  const marginClass = isArabic ? "mr-5" : "ml-2";

  const stats = [
    { imageSrc: carImg, number: convertNumber("540+"), label: t("facts.cars"), bgColor: "bg-orange-500", marginClass },
    { imageSrc: busImg, number: convertNumber("320+"), label: t("facts.buses"), bgColor: "bg-blue-500", marginClass },
    { imageSrc: bikeImg, number: convertNumber("210+"), label: t("facts.bikes"), bgColor: "bg-green-500", marginClass },
    { imageSrc: scooterImg, number: convertNumber("150+"), label: t("facts.scooters"), bgColor: "bg-purple-500", marginClass },
  ];

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {stats.map((item, i) => (
        <StatBox key={i} {...item} />
      ))}
    </div>
  );
};

export default StatsSection;
