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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <BusinessIcon className="text-3xl text-primary" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
                {t("rent_your_vehicle.subtitle")}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                {t("choose_user_type.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Cards */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-5">
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
              className="cursor-pointer p-6 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Icon className="text-3xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseUserType;
