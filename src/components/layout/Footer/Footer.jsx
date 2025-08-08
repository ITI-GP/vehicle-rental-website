import React from "react";
import { useTranslation } from "react-i18next";
import CarIcon from "../../../assets/CarIcon.png";
import Appstore from "../../../assets/Appstore.jpg";
import GooglePlay from "../../../assets/GooglePlay.jpg";
import LocationIcon from "../../../assets/LocationIcon.png";
import PhoneIcon from "../../../assets/PhoneIcon.png";
import EmailIcon from "../../../assets/EmailIcon.png";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className={`${i18n.language === "ar" ? "text-right" : "text-left"} w-full  `}
    >
      {/* Main Container */}
      <div className="flex justify-center items-center px-[72px] pt-[60px] pb-[40px] w-full max-w-[1920px] mx-auto">
        <div className="flex flex-wrap justify-between gap-[80px] w-[1296px]">
          {/* Column 1 */}
          <div className="w-[280px] min-h-[171px] flex flex-col justify-between mx-auto">

            <div className="logo flex items-center gap-2" >
              <h3 className="font-bold text-[16px]  font-inter"> 
                {/* {t("footer.name")} */}
                2GO
              </h3>
              <img src={CarIcon} alt="Car Icon" className="w-[30px] h-auto " />
            </div>

            <div className="mt-4">
              <p className="text-sm opacity-70 mb-4">
                {t("footer.companyDescription")}
              </p>
              <ul className="flex gap-4 text-2xl">
                <li><i className="fa-brands fa-facebook"></i></li>
                <li><i className="fa-brands fa-square-instagram"></i></li>
                <li><i className="fa-brands fa-square-x-twitter"></i></li>
                <li><i className="fa-brands fa-square-youtube"></i></li>
              </ul>
            </div>

          </div>

          {/* Column 2 */}
          <div className="w-[180px] min-h-[166px] flex flex-col gap-[24px]  mx-auto">

          <div className="flex items-start gap-3" >
                <img
                  src={LocationIcon}
                  alt="Location Icon"
                  className="w-6 h-6 mt-[10px]" // تظبيط دقيق علشان النص الصغير
                />

                <div>
                  <h4 className="font-semibold text-sm">{t("footer.address")}</h4>
                  <p className="text-xs opacity-70">{t("footer.addressDescription")}</p>
                </div>
                
              </div>


            <div>
              <h3 className="text-base font-semibold mb-2 ">{t("footer.usefulLinks")}</h3>
              <ul className="space-y-1 text-sm">
                <li>{t("footer.aboutUs")}</li>
                <li>{t("footer.contactUs")}</li>
                <li>{t("footer.gallery")}</li>
              </ul>
            </div>
          </div>

          {/* Column 3 */}
          <div className="w-[180px] min-h-[166px] flex flex-col gap-[24px]  mx-auto">
            <div className="flex items-start gap-3">
              <img src={EmailIcon} alt="Email Icon" className="w-6 h-6 mt-[10px]" />
              <div>
                <h4 className="font-semibold text-sm">{t("footer.email")}</h4>
                <p className="text-xs opacity-70">vehicleRental@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">{t("footer.vehicles")}</h3>
              <ul className="space-y-1 text-sm">
                <li>{t("footer.carList")}</li>
                <li>{t("footer.motorbikes")}</li>
                <li>{t("footer.specialOffers")}</li>
              </ul>
            </div>
          </div>

          {/* Column 4 */}
          <div className="w-[180px] min-h-[171px] flex flex-col gap-[24px]  mx-auto">
            <div className="flex items-start gap-3">
              <img src={PhoneIcon} alt="Phone Icon" className="w-6 h-6 mt-[10px]" />
              <div>
                <h4 className="font-semibold text-sm">{t("footer.phone")}</h4>
                <p className="text-xs opacity-70">01012636438</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[20px] leading-[100%]  mb-2"> {t("footer.downloadApp")}</h3>

              <div className="flex flex-col gap-2">
                <img src={Appstore} alt="App Store" className="w-32" />
                <img src={GooglePlay} alt="Google Play" className="w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs py-4 bg-gray-50 ">
        <p>{t("footer.rightsReserved", { year })}</p>
      </div>
    </footer>
  );
}
