import React from "react";
import Button from "./Button";
import carImage from "./Images/hero.png";
import styles from "./Hero.module.css";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
          <p className={styles.heroDescription}>{t("hero.description")}</p>
          <div className={styles.heroButtons}>
            <Button className={styles.heroBtn}>{t("hero.learnMore")}</Button>
          </div>
        </div>
        <div className={styles.heroImageWrapper}>
          <div className={styles.absoluteBackground}></div>
          <img src={carImage} alt="Hero Vehicle" className={styles.heroImage} />
        </div>
      </div>
    </div>
  );
};
export default Hero;