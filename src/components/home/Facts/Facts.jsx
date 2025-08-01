import HeroWrapper from "./HeroWrapper";
import StatsSection from "./StateSection";
import { useTranslation } from "react-i18next";

const Facts = () => {
  const { t } = useTranslation();

  return (
    <HeroWrapper>
      <div className="max-w-6xl w-full mx-auto px-6 ">
        {/* Header */}
        <div className="mb-10  p-6">
          <h2 className="text-4xl font-extrabold ">
            {t("facts.title.part1")}{" "}
            <span className="text-yellow-400">{t("facts.title.part2")}</span>
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl">{t("facts.subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row items-center gap-10 mt-10">
          <StatsSection />
        </div>
      </div>
    </HeroWrapper>
  );
};

export default Facts;
