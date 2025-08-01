import React from "react";
// import styles from "..";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../../components/rentYourVehicle/Button";

const RentYourVehicle = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-start px-4 py-12">
      {/* Header */}
      <div className="mb-10 mt-10">
        <h1 className="text-5xl font-extrabold">
          {t("rent_your_vehicle.subtitle")}
        </h1>
      </div>

      <Button onClick={() => navigate("/vehicles")}>
        {t("rent_your_vehicle.get_started")}
      </Button>
      {/* CTA Section */}
      <div className="flex flex-col i  gap-4">
        <div className="flex flex-col items-center mt-4">
          <p className="text-sm">{t("rent_your_vehicle.insurance_provider")}</p>
          <img
            alt="Insurance Provider"
            src="//resources.turo.com/f/81934/144x38/d144888a47/travelers_web_144_38.png/m/"
            srcSet="//resources.turo.com/f/81934/144x38/d144888a47/travelers_web_144_38.png/m/ 1x, //resources.turo.com/f/81934/288x75/ef3584ff7c/travelers_web_288_75-2x.png/m/ 2x"
            className="h-10 mt-2"
          />
        </div>
      </div>

      {/* Main image */}
      <img
        src="//resources.turo.com/f/81934/1000x667/68efbdaf74/us_list-your-car.jpg/m/"
        alt={t("rent_your_vehicle.image_alt")}
        className="my-12 max-w-full rounded-lg shadow-lg"
        srcSet="//resources.turo.com/f/81934/2000x1334/3f055da1df/us_list-your-car-2x.jpg/m/ 2x"
      />

      {/* Description Section */}
      <div className="max-w-3xl text-left">
        <p className="mb-4">{t("rent_your_vehicle.description1")}</p>
        <p className="mb-4">{t("rent_your_vehicle.description2")}</p>
        <p className="mb-6">{t("rent_your_vehicle.description3")}</p>
        <a
          href="/us/en/list-your-car/list"
          rel="nofollow"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded-full shadow"
        >
          {t("rent_your_vehicle.get_started")}
        </a>
      </div>
    </div>
  );
};

export default RentYourVehicle;
