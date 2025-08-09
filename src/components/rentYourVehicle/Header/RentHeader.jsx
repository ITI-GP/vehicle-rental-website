import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
export default function RentHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
      {/* Header */}
      <div className="w-full flex flex-col items-start px-4 py-12">
        <div className="mb-10 mt-10">
          <h1 className="text-5xl font-extrabold">
            {t("rent_your_vehicle.subtitle")}
          </h1>
        </div>

        <Button onClick={() => navigate("/ChooseUserType")}>
          {t("rent_your_vehicle.get_started")}
        </Button>
        
      </div>

      {/* Main image */}
      <img
        src="//resources.turo.com/f/81934/1000x667/68efbdaf74/us_list-your-car.jpg/m/"
        alt={t("rent_your_vehicle.image_alt")}
        className="my-12 rounded-lg shadow-lg h-[70vh]"
        srcSet="//resources.turo.com/f/81934/2000x1334/3f055da1df/us_list-your-car-2x.jpg/m/ 2x"
      />

      {/* Description Section */}
      <div className=" flex flex-col items-center w-full">
        <div className="max-w-3xl ">
          <p className="mb-4">{t("rent_your_vehicle.description1")}</p>
          <p className="mb-4">{t("rent_your_vehicle.description2")}</p>
          <p className="mb-6">{t("rent_your_vehicle.description3")}</p>
          <div className="text-center">
            <Button onClick={() => navigate("/ChooseUserType")}>
              {t("rent_your_vehicle.get_started")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
