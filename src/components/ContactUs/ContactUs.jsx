import LocationIcon from "./../../assets/LocationIcon.png";
import PhoneIcon from "./../../assets/PhoneIcon.png";
import EmailIcon from "./../../assets/EmailIcon.png";
import TimeIcon from "./../../assets/TimeIcon.png";
import HowToUse from "./../../assets/HowToUse.png";
import BMW from "./../../assets/BMW.png";
import Ford from "./../../assets/Ford.png";
import Jeep from "./../../assets/Jeep.png";
import Mercedes from "./../../assets/Mercedes.png";
import { useTranslation } from "react-i18next";
import FourFive from "./../../assets/FourFive.png";
import Hyundai from "./../../assets/Hyundai.png";
import contact from "../home/HeroSection/Images/contact.avif";
import last from "../home/HeroSection/Images/last.avif";
import how from "../home/HeroSection/Images/how.webp";
import choose from "../home/HeroSection/Images/choose.webp";



export default function Header() {
  const { t, i18n } = useTranslation();
   const isRTL = i18n.dir() === "rtl"; // Detect RTL direction
  return (
    

<><div className="">
      {/* Book section with background */}
      <div
        className="relative bg-cover bg-center bg-no-repeat p-10 rounded-[20px] text-center"
        style={{ backgroundImage: `url(${contact})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 z-0 rounded-[20px]"></div>

        {/* Content wrapper */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* LEFT: Placeholder */}
          <div className="hidden md:block w-full max-w-[300px] h-[180px] rounded-[20px]"></div>

          {/* RIGHT: Form with conditional rotation */}
          <div
            className={`w-full md:w-[300px] bg-white text-black rounded-[16px] p-6 flex flex-col justify-start items-center shadow-xl transform ${
              isRTL ? "-rotate-[5deg]" : "rotate-[5deg]"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">
              {t("contact.title")}
            </h2>

            <form className="flex flex-col gap-3 w-full text-sm">
              <input
                type="text"
                placeholder="Full Name"
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Subject"
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Message"
                rows="3"
                className="p-2 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>

              <button
                type="submit"
                className="mt-2 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  


{/* info section */}
<div className="info flex flex-wrap justify-evenly items-center py-[30px]">
  <div className="flex items-start gap-3 pb-3">
    <img src={LocationIcon} alt="Location Icon" className="w-6 h-6 mt-[10px]" />
    <div>
      <h4 className="font-semibold text-sm">{t("footer.address")}</h4>
      <p className="text-xs opacity-70">{t("footer.addressDescription")}</p>
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
      <h4 className="font-semibold text-sm">{t("contact.openingHours")}</h4>
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
