import { useTranslation } from "react-i18next";
import HowToUse from "../../../assets/how use.avif";

export default function HowToUseSection() {
  const { t } = useTranslation();
  const steps = t("howToUse.steps", { returnObjects: true });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center ">
        {/* Left Image + Heading */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            {t("howToUse.header")}
          </h2>
          <img
            src={HowToUse}
            alt="How To Use"
            className="rounded-lg shadow-md w-full max-w-md mx-auto lg:mx-0"
          />
        </div>

        {/* Right Steps List */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
