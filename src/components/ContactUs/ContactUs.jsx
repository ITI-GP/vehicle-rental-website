import { useState } from "react";
import { useTranslation } from "react-i18next";
import choose from "../home/HeroSection/Images/choose.webp";
import contact from "../home/HeroSection/Images/contactus.jpg";
import how from "../home/HeroSection/Images/how.webp";
import last from "../home/HeroSection/Images/last.avif";
import EmailIcon from "./../../assets/EmailIcon.png";
import LocationIcon from "./../../assets/LocationIcon.png";
import PhoneIcon from "./../../assets/PhoneIcon.png";
import TimeIcon from "./../../assets/TimeIcon.png";

export default function Header() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl"; // Detect RTL direction

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <>
      <div className="my-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-around gap-8">
          {/* LEFT: Image */}
          <div
            className="w-full md:w-1/2 h-[260px] md:h-[350px] bg-cover bg-center rounded-2xl "
            style={{ backgroundImage: `url(${contact})` }}
          ></div>

          {/* RIGHT: Form */}
          <div
            className={`w-full md:w-[360px] bg-primary text-white rounded-2xl p-6 shadow-xl transform transition-transform duration-300 ${isFocused
                ? "rotate-0"
                : isRTL
                  ? "-rotate-[10deg]"
                  : "rotate-[10deg]"
              }`}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
              {t("contact.title")}
            </h2>

            <form className="flex flex-col gap-4 text-sm">
              <input
                type="text"
                placeholder="Full Name"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="p-2 rounded-md border border-white text-black placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="p-2 rounded-md border border-white text-black placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Subject"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="p-2 rounded-md border border-white text-black placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Message"
                rows="3"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="p-2 rounded-md border border-white text-black placeholder-gray-500 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>

              <button
                type="submit"
                className="py-2 bg-white text-primary font-semibold rounded-md hover:bg-white/90 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* info section */}
      <div className="info flex flex-wrap justify-evenly items-center py-[30px]">
        <div className="flex items-start gap-3 pb-3">
          <img
            src={LocationIcon}
            alt="Location Icon"
            className="w-6 h-6 mt-[10px]"
          />
          <div>
            <h4 className="font-semibold text-sm">{t("footer.address")}</h4>
            <p className="text-xs opacity-70">
              {t("footer.addressDescription")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3">
          <img src={EmailIcon} alt="Email Icon" className="w-6 h-6 mt-[10px]" />
          <div>
            <h4 className="font-semibold text-sm">{t("footer.email")}</h4>
            <p className="text-xs opacity-70">vehicleRental@gmail.com</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3">
          <img src={PhoneIcon} alt="Phone Icon" className="w-6 h-6 mt-[10px]" />
          <div>
            <h4 className="font-semibold text-sm">{t("footer.phone")}</h4>
            <p className="text-xs opacity-70">01012636438</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3">
          <img src={TimeIcon} alt="Phone Icon" className="w-6 h-6 mt-[10px]" />
          <div>
            <h4 className="font-semibold text-sm">
              {t("contact.openingHours")}
            </h4>
            <p className="text-xs opacity-70">{t("contact.hoursText")}</p>
          </div>
        </div>
      </div>

      {/* blog section */}
      <div className="blog-section pb-[50px] mt-[50px]">
        <p className="text-[35px] font-bold leading-[100%] tracking-normal  text-center pb-[30px]">
          {t("contact.blogTitle")}
        </p>

        <div className="blogs flex flex-wrap">
          <div className="item1 w-full sm:w-1/2 lg:w-1/3 p-5 mx-auto">
            <img src={choose} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">
              {t("contact.blog1")}
            </p>
            <p>{t("contact.newsDate")}</p>
          </div>

          <div className="item2 w-full sm:w-1/2 lg:w-1/3 p-5 mx-auto">
            <img src={how} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">
              {t("contact.blog2")}
            </p>
            <p>{t("contact.newsDate")}</p>
          </div>

          <div className="item3 w-full sm:w-1/2 lg:w-1/3 p-5 mx-auto">
            <img src={last} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">
              {t("contact.blog3")}
            </p>
            <p>{t("contact.newsDate")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
