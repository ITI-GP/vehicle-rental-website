import React from "react";
import myVideo from "./video.mp4"; // adjust the path
import myVideo2 from "./video2.mp4"; // adjust the path
import { useTranslation } from "react-i18next";

const Video = () => {
  const { t } = useTranslation();
  return (
    <div>
      {/* Video Row */}
      <div className="text-center my-10">
        <h1 className="text-4xl font-bold mb-4">{t("aboutus.header", "About Us")}</h1>
        <p className="text-lg text-gray-700">
          {t("aboutus.description")}
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 mx-auto my-8 px-4">
         <video controls  autoPlay muted loop className="w-full md:w-1/2 rounded-lg shadow-lg">
          <source src={myVideo2} type="video/mp4" />
        </video>
        <video controls autoPlay muted loop className="w-full md:w-1/2 rounded-lg shadow-lg">
          <source src={myVideo} type="video/mp4" />
        </video>

       
      </div>

      {/* Count Section */}
      <div className="flex flex-col md:flex-row justify-around items-center gap-3 mx-auto my-12 text-center">
        <div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: "#ff9e0c" }}>
              {t("aboutus.happy_customers_number", "20k+")}
            </h1>
            <p>{t("aboutus.happy_customers", "Happy customers")}</p>
        </div>
        <div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: "#ff9e0c" }}>
              {t("aboutus.count_of_cars_number", "540+")}
            </h1>
            <p>{t("aboutus.count_of_cars", "Count of cars")}</p>
        </div>
        <div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: "#ff9e0c" }}>
              {t("aboutus.years_of_experience_number", "25+")}
            </h1>
            <p>{t("aboutus.years_of_experience", "Years of experience")}</p>
        </div>
      </div>
    </div>
  );
};

export default Video;
