import React from "react";
import { useTranslation } from "react-i18next";
import carImage from "./abouthero.jpg"; // Ensure the image path is correct
import Button from "../home/HeroSection/Button";
import styles from "../home/HeroSection/Hero.module.css"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom";
const AboutHero = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
     const handleClick = () => {
    navigate("/vehicles"); // مثلاً صفحة المركبات
  };

  return (
    <div
      className=" mt-12 relative text-white rounded-2xl p-8 flex items-center justify-start shadow-lg min-h-[400px] md:min-h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${carImage})`,
      }}
    >
      {/* Dark overlay to reduce brightness */}
      <div className="absolute inset-0 bg-black/60 rounded-2xl z-0"></div>

      {/* Text Content */}
      <div className="z-10 max-w-lg">
        <h2 className="text-[40px] font-bold ">
          {t("aboutHero.title")}
        </h2>
        <p className="text-xl font-semibold  text-white mb-10">
          {t("aboutHero.phone")}
        </p>
        <p className="text-gray-200 mb-10">
          {t(
            "aboutHero.description",
          )}
        </p>
        <div className={styles.heroButtons}>
            <Button className={styles.heroBtn} onClick={handleClick}>{t("aboutHero.button")}</Button>
          </div>
      </div>
    </div>
  );
};

export default AboutHero;
