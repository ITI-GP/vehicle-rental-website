import TransButton from "../../TransButton";
import { useTranslation } from "react-i18next";
import CarIcon from "../../../assets/CarIcon.png";
import { NavLink ,Link} from "react-router-dom";
export default function Header() {
  const { t } = useTranslation();
  return (
    <nav className="fixed z-50 top-0 right-0 left-0 " >

     <div className="flex flex-wrap justify-between items-center px-[72px] pt-[25px] pb-[25px] w-full max-w-[1920px] mx-auto bg-white">

           <div className="logo flex-wrap flex items-center gap-2 w-[180px]" >
              <img src={CarIcon} alt="Car Icon" className="w-[30px] h-auto " />
              <h3 className="font-bold text-[16px]  font-inter"> {t("footer.name")}</h3>
       </div>
        

        <div className="links  ">

           <ul className="flex flex-wrap items-center justify-between w-[500px]">
              <li className="font-medium"><NavLink to={'/'}>{t("header.home")}</NavLink></li>
              <li className="font-medium"><NavLink to={'/vehicles'}>{t("header.vehicles")}</NavLink></li>
              <li className="font-medium"><NavLink to={'/details'}>{t("header.details")}</NavLink></li>
              <li className="font-medium"><NavLink to={'/contactus'}>{t("header.about")}</NavLink></li>
              <li className="font-medium"><NavLink to={'/aboutus'}>{t("header.contact")}</NavLink></li>
            </ul>

           </div>

           <div className="Icons">
            <ul className="flex flex-wrap  items-center justify-between w-[180px]">
              <li><Link><i class="fa-solid fa-user "></i> <span>{t("header.signin")}</span></Link></li>
              <li><Link><i class="fa-solid fa-right-from-bracket"></i></Link></li>
              <li><TransButton/></li>
            </ul>

           </div>

</div>
    </nav>
    
  );
}
