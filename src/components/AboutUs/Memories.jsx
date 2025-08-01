import { t } from "i18next";
import React from "react";
import fun from "./fun.jpg"; // adjust the path
import icon1 from "./icon1.png"; // adjust the path
import { useTranslation } from "react-i18next";

export default function Memories() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-12 mt-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div className=" space-y-2">
          <h2 className="text-[40px] font-bold mb-5">{t("memories.header")}</h2>
          <p className=" text-gray-600 mb-5">{t("memories.description")}</p>

          <div className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center">
                <img src={icon1} alt="Icon 1" className="w-8 h-8 mr-4" />
                <p className=" text-gray-700">{t("memories.icon1")}</p>
              </div>
              <div className="flex items-center">
                <img src={icon1} alt="Icon 2" className="w-8 h-8 mr-4" />
                <p className="text-gray-700">{t("memories.icon2")}</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center">
                <img src={icon1} alt="Icon 3" className="w-8 h-8 mr-4" />
                <p className=" text-gray-700">{t("memories.icon3")}</p>
              </div>
              <div className="flex items-center">
                <img src={icon1} alt="Icon 4" className="w-8 h-8 mr-4" />
                <p className=" text-gray-700">{t("memories.icon4")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative">
          <img
            src={fun}
            alt="Memories"
            className="w-full h-100 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
