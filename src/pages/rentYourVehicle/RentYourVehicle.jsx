import { useTranslation } from "react-i18next";
export default function RentYourVehicle() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("rent_your_vehicle.title")}</h1>;
    </div>
  );
}
