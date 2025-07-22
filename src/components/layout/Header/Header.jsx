import TransButton from "../../TransButton";
import { useTranslation } from "react-i18next";
export default function Header() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="bg-primary-800 dark:bg-amber-100 underline ">
        {t("header.title")}
      </h1>
      <p>{t("header.subtitle")}</p>
      <TransButton />
    </div>
  );
}
