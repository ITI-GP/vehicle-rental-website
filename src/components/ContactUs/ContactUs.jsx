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



export default function Header() {
  const { t } = useTranslation();
  return (
     <div>
      {/* Header */}
       <h2 className='text-center font-bold text-[40px] my-10'>Contact Us</h2>
{/* book section */}
<div className="book-section py-[50px] flex flex-col md:flex-row justify-evenly items-center ">
  <div className="book-info w-full md:w-[350px] h-[450px] gap-[40px] opacity-100 rounded-[20px] p-[40px] bg-primary text-white">
    <h4 className="text-[28px] font-semibold leading-[100%] tracking-normal text-center">
      Book your car
    </h4>
  </div>

  <img 
    src={HowToUse} 
    alt="HowToUse" 
    className="hidden md:block w-full max-w-[556px] h-[400px] rotate-180 opacity-100 rounded-[20px] "
  />
</div>

{/* info section */}
      <div className="info flex flex-wrap justify-evenly items-center pb-[50px]" >

          <div className="flex items-start gap-3 pb-3" >
                        <img src={LocationIcon} alt="Location Icon" className="w-6 h-6 mt-[10px]" />
        
                        <div>
                          <h4 className="font-semibold text-sm">{t("footer.address")}</h4>
                          <p className="text-xs opacity-70">{t("footer.addressDescription")}</p>
                        </div>
                        
          </div>

          <div className="flex items-start gap-3  pb-3">
                      <img src={EmailIcon} alt="Email Icon" className="w-6 h-6 mt-[10px]" />
                      <div>
                        <h4 className="font-semibold text-sm">{t("footer.email")}</h4>
                        <p className="text-xs opacity-70">vehicleRental@gmail.com</p>
                      </div>
          </div>

         <div className="flex items-start gap-3  pb-3">
                      <img src={PhoneIcon} alt="Phone Icon" className="w-6 h-6 mt-[10px]" />
                      <div>
                        <h4 className="font-semibold text-sm">{t("footer.phone")}</h4>
                        <p className="text-xs opacity-70">01012636438</p>
                      </div>
        </div>

          <div className="flex items-start gap-3  pb-3">
                      <img src={TimeIcon} alt="Phone Icon" className="w-6 h-6 mt-[10px]" />
                      <div>
                        <h4 className="font-semibold text-sm">Opening hours</h4>
                        <p className="text-xs opacity-70">Sun-Mon: 10am - 10pm</p>
                      </div>
        </div>

      </div>

{/* blog section */}
      <div className="blog-section pb-[50px]">
        <p className="text-[35px] font-bold leading-[100%] tracking-normal  text-center pb-[30px]">Latest blog posts & news</p>

        <div className="blogs flex flex-wrap">
          <div className="item1 w-full sm:w-1/2 lg:w-1/3 p-5 mx-auto">
            <img src={HowToUse} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">How to choose the right car</p>
            <p>News / 12April 2025</p>
          </div>
          <div className="item2 w-full sm:w-1/2 lg:w-1/3 p-5  mx-auto">
            <img src={HowToUse} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">Which plan is right for me?</p>
            <p>News / 12April 2025</p>
          </div>
          <div className="item3 w-full sm:w-1/2 lg:w-1/3 p-5  mx-auto">
            <img src={HowToUse} className="rounded-lg" />
            <p className="text-[20px] font-semibold leading-[100%] tracking-normal capitalize py-3">Enjoy Speed, Choice & Total Control</p>
            <p>News / 12April 2025</p>
          </div>

        </div>
      </div>

      {/* marca section */}

      <div className="marca flex flex-wrap justify-evenly bg-gray-50 rounded-lg p-5">
        <img src={Ford} alt="Ford" />
        <img src={Jeep} alt="Jeep" />
        <img src={BMW} alt="BMW" />
        <img src={Mercedes} alt="Mercedes" />
        <img src={FourFive} alt="FourFive" />
        <img src={Hyundai} alt="" />


      </div>



    </div>
    
  );
}
