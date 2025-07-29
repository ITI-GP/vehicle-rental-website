import React from 'react';
import { useTranslation } from "react-i18next";

export default function AboutInfo() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Header */}
      {/* <h2 className="text-center font-bold text-[40px] my-10">{t("aboutus.header")}</h2> */}

      {/* 3-Column Content Section */}
      <div className="  flex flex-col md:flex-row justify-between gap-10 mt-20 px-4 bg-gray-50 py-10 rounded-lg">
        {/* Left Section */}
        <div className="md:w-1/2">
          <h2 className="text-[40px] font-bold mt-4">
            {t("aboutus.leftTitle")}
          </h2>
        </div>

        {/* Middle Section (Top Right) */}
        <div className="md:w-1/3 space-y-6">
          <div>
            <h3 className="text-[20px] font-bold mb-2">{t("aboutus.middle1Title")}</h3>
            <p className="text-gray-600">
              {t("aboutus.middle1Desc")}
            </p>
          </div>
          <div>
            <h3 className="text-[20px] font-bold mb-2">{t("aboutus.middle2Title")}</h3>
            <p className="text-gray-600">
              {t("aboutus.middle2Desc")}
            </p>
          </div>
        </div>

        {/* Right Section (Bottom Right) */}
        <div className="md:w-1/3 space-y-6">
          <div>
            <h3 className="text-[20px] font-bold mb-2">{t("aboutus.right1Title")}</h3>
            <p className="text-gray-600">
              {t("aboutus.right1Desc")}
            </p>
          </div>
          <div>
            <h3 className="text-[20px] font-bold mb-2">{t("aboutus.right2Title")}</h3>
            <p className="text-gray-600">
              {t("aboutus.right2Desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
