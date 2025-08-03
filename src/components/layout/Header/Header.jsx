import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TransButton from "../../TransButton";
import CarIcon from "../../../assets/CarIcon.png";
import { supabase } from "../../../Lib/supabaseClient";
import { useState, useEffect } from "react";

export default function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    getCurrentUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user immediately
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-none">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={CarIcon} alt="Car Icon" className="w-[30px] h-auto" />
          <h3 className="font-bold text-[16px] font-inter">
            {t("footer.name")}
          </h3>
        </Link>

        <button
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>

        <div className="hidden md:flex justify-between items-center flex-1 ml-6">
          <ul className="flex flex-1 justify-center gap-6">
            <li><NavLink to="/">{t("header.home")}</NavLink></li>
            <li><NavLink to="/vehicles">{t("header.vehicles")}</NavLink></li>
            <li><NavLink to="/RentYourVehicle">{t("header.rent_vehicle")}</NavLink></li>
            <li><NavLink to="/contactus">{t("header.contact")}</NavLink></li>
            <li><NavLink to="/aboutus">{t("header.about")}</NavLink></li>
          </ul>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <img
                  src={user.user_metadata?.avatar || "https://via.placeholder.com/40"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">
                  Hello, {user.user_metadata?.name || "User"}
                </span>
                <button onClick={handleSignOut} title="Sign Out">
                  <i className="fa-solid fa-right-from-bracket text-gray-700 hover:text-black" />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-black">
                <i className="fa-solid fa-user" />
                <span>{t("header.signin")}</span>
              </Link>
            )}
            <TransButton />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <ul className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <li><NavLink to="/" onClick={() => setMenuOpen(false)}>{t("header.home")}</NavLink></li>
              <li><NavLink to="/vehicles" onClick={() => setMenuOpen(false)}>{t("header.vehicles")}</NavLink></li>
              <li><NavLink to="/RentYourVehicle" onClick={() => setMenuOpen(false)}>{t("header.rent_vehicle")}</NavLink></li>
              <li><NavLink to="/contactus" onClick={() => setMenuOpen(false)}>{t("header.contact")}</NavLink></li>
              <li><NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>{t("header.about")}</NavLink></li>
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-black"
              >
                <i className="fa-solid fa-user" />
                <span>{t("header.signin")}</span>
              </Link>

              <Link 
               
               className="text-gray-700 hover:text-black">
                <i className="fa-solid fa-right-from-bracket" />
              </Link>

              {user ? (
                <>
                  <span>Hello, {user.user_metadata?.name}</span>
                  <button onClick={handleSignOut} title="Sign Out">
                    <i className="fa-solid fa-right-from-bracket" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-black">
                  <i className="fa-solid fa-user" />
                  <span>{t("header.signin")}</span>
                </Link>
              )}
              <TransButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


