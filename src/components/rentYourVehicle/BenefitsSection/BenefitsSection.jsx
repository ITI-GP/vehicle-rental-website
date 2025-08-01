import { VerifiedUser, Headset, Search, Smartphone } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <VerifiedUser className="text-primary mt-1" fontSize="large" />,
      title: t("benefits_section.items.insurance.title"),
      description: (
        <>
          {t("benefits_section.items.insurance.description")}{" "}
          <a href="#" className="text-primary underline hover:no-underline">
            {t("benefits_section.items.insurance.learn_more")}
          </a>
        </>
      ),
    },
    {
      icon: <Headset className="text-primary mt-1" fontSize="large" />,
      title: t("benefits_section.items.safety.title"),
      description: t("benefits_section.items.safety.description"),
    },
    {
      icon: <Search className="text-primary mt-1" fontSize="large" />,
      title: t("benefits_section.items.demand.title"),
      description: t("benefits_section.items.demand.description"),
    },
    {
      icon: <Smartphone className="text-primary mt-1" fontSize="large" />,
      title: t("benefits_section.items.app.title"),
      description: t("benefits_section.items.app.description"),
    },
  ];

  return (
    <section className="py-16 px-4 md:px-20 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("benefits_section.title")} <br className="hidden md:block" />
          {t("benefits_section.subtitle")}
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          {t("benefits_section.description")}
        </p>

        <div className="grid md:grid-cols-2 gap-10  ">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 flex-col  text-start"
            >
              <div>{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
