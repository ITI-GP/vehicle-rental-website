import TransButton from "../../TransButton";
import { useTranslation } from "react-i18next";
import CarIcon from "../../../assets/CarIcon.png";
import { NavLink ,Link} from "react-router-dom";
export default function Header() {
  const { t } = useTranslation();
  return (
    <nav>

     <div className="flex flex-wrap justify-between items-center px-[72px] pt-[25px] pb-[25px] w-full max-w-[1920px] mx-auto bg-white">

           <div className="logo flex-wrap flex items-center gap-2 w-[180px]" >
              <img src={CarIcon} alt="Car Icon" className="w-[30px] h-auto " />
              <h3 className="font-bold text-[16px]  font-inter"> {t("footer.name")}</h3>
       </div>
        

        <div className="links  ">

           <ul className="flex flex-wrap items-center justify-between w-[500px]">
              <li><NavLink to={'/'}>{t("header.home")}</NavLink></li>
              <li><NavLink to={'/vehicles'}>{t("header.vehicles")}</NavLink></li>
              <li><NavLink to={'/details'}>{t("header.details")}</NavLink></li>
              <li><NavLink to={'/contactus'}>{t("header.about")}</NavLink></li>
              <li><NavLink to={'/aboutus'}>{t("header.contact")}</NavLink></li>
            </ul>

           </div>

           <div className="Icons">
            <ul className="flex flex-wrap  items-center justify-between w-[230px]">
              <li><Link><i class="fa-solid fa-user"></i> <span>{t("header.signin")}</span></Link></li>
              <li><Link><i class="fa-solid fa-right-from-bracket"></i></Link></li>
              <li><i class="fa-solid fa-circle-user"></i></li>
              <li><TransButton/></li>
            </ul>

           </div>

</div>
    </nav>
    
  );
}
