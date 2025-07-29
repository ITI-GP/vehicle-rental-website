import { useTranslation } from "react-i18next";
import Card from "../../components/card/Card";
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <Card />
      <h1 className="text-3xl font-bold text-center my-8">
        {t("home.welcome")}
      </h1>
    </div>
  );
}
