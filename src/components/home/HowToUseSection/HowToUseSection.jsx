import { useTranslation } from "react-i18next";
import HowToUse from "../../../assets/HowToUse.png";

export default function Header() {
  const { t } = useTranslation();
  const steps = t("howToUse.steps", { returnObjects: true });

  return (
    <div className="flex flex-wrap justify-between items-center pt-[50px]">
      <div className="image max-w-[550px] max-h-[549px] mb-3 mx-auto">
        <img src={HowToUse} alt="How To Use" />
      </div>

      <div className="Info w-full md:w-1/2 mx-auto">
        {steps.map((step, index) => (
          <div className="step mb-3" key={index}>
            <h3>
              <span className="bg-primary py-[4px] px-[10px] rounded text-white text-[12px]">
                {step.number}
              </span>{" "}
              <span className="text-[16px] font-medium">{step.title}</span>
            </h3>
            <p className="text-[14px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
