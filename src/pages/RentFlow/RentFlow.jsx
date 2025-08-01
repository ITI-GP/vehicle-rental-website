import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { useDispatch } from "react-redux";
import { setUserType } from "../../redux/userSlice";

const ChooseUserType = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelect = (type) => {
    dispatch(setUserType(type));
    navigate(`/register/${type}`);
  };

  return (
    <>
      <div className="w-full flex flex-col items-start px-4 py-12 mt-30">
        <div className="mb-10 mt-10">
          <h1 className="text-5xl font-extrabold">
            {t("rent_your_vehicle.subtitle")}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {[
          {
            type: "individual",
            Icon: PersonIcon,
            title: t("choose_user_type.individual"),
            description: t("choose_user_type.individual_description"),
          },
          {
            type: "company",
            Icon: BusinessIcon,
            title: t("choose_user_type.company"),
            description: t("choose_user_type.company_description"),
          },
        ].map(({ type, Icon, title, description }) => (
          <div
            key={type}
            onClick={() => handleSelect(type)}
            className="cursor-pointer p-6 border rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`flex items-center gap-4`}>
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Icon className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChooseUserType;
