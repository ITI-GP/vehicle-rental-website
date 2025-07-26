// import TransButton from "../../TransButton";
// import { useTranslation } from "react-i18next";
// import DownloadApp from "../../../assets/DownloadApp.png";
// import Appstore from "../../../assets/Appstore.jpg";
// import GooglePlay from "../../../assets/GooglePlay.jpg";
// import { NavLink ,Link} from "react-router-dom";
// export default function Header() {
//   const { t } = useTranslation();
//   return (
//    <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-[50px]">


//       <div className="info w-full md:w-1/2 mx-auto mb-3">
//       <p className="text-[50px] font-bold max-w-[313.51px] mb-3">Download mobile app</p>

//       <p className="text-[16px] leading-[24px] max-w-[536]px]">Imperdiet ut tristique viverra nunc. Ultrices orci vel auctor cursus turpis nibh placerat massa. Fermentum urna ut at et in. Turpis aliquet cras hendrerit enim condimentum. Condimentum interdum risus bibendum urna
//         . Augue aliquet varius faucibus ut integer tristique ut....</p>

// <div className="download-images flex gap-4 mt-4 ">
//    <img src={Appstore} alt="Appstore"  className=" max-w-[]173.08px max-h-[50px]"/>
//    <img src={GooglePlay} alt="GooglePlay"  className=" max-w-[]173.08px max-h-[50px]" />


// </div>
       
//       </div>

//       <div className="image max-w-[267px] max-h-[540px]  mx-auto">
//         <img src={DownloadApp} alt="DownloadAPP" />
//       </div>
//     </div>
  
//   );
// }

import { useTranslation } from "react-i18next";
import DownloadApp from "../../../assets/DownloadApp.png";
import Appstore from "../../../assets/Appstore.jpg";
import GooglePlay from "../../../assets/GooglePlay.jpg";

export default function Header() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-[50px]">
      
      <div className="info w-full md:w-1/2 mx-auto mb-3 text-center md:text-start">
        <p className="text-[30px] md:text-[50px] font-bold max-w-[313.51px] mb-3 mx-auto md:mx-0">
          {t("downloadAppTitle")}
        </p>

        <p className="text-[16px] leading-[24px] max-w-[536px] mx-auto md:mx-0">
          {t("downloadAppDescription")}
        </p>

        <div className="download-images flex gap-4 mt-4 justify-center md:justify-start">
          <img
            src={Appstore}
            alt="Appstore"
            className="max-w-[173.08px] max-h-[50px]"
          />
          <img
            src={GooglePlay}
            alt="GooglePlay"
            className="max-w-[173.08px] max-h-[50px]"
          />
        </div>
      </div>

      <div className="image max-w-[267px] max-h-[540px] mx-auto mb-4 md:mb-0">
        <img src={DownloadApp} alt="Download App" />
      </div>
    </div>
  );
}
