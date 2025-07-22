import { useTranslation } from "react-i18next";
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">
        {t("home.welcome")}
      </h1>
    </div>
  );
}
