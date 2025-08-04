

import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import TransButton from "../../TransButton";
import CarIcon from "../../../assets/CarIcon.png";

export default function Header() {
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`Logout failed: ${error}`);
    } else {
      toast.success(t("auth.logoutSuccess"));
    }
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || t("profile.user");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white ">
      {/* Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-2">
          <img src={CarIcon} alt="Car Icon" className="w-[30px] h-auto" />
          <h3 className="font-bold text-[16px] font-inter">
            {t("footer.name")}
          </h3>
        </Link>

        {/* Burger (only < md) */}
        <button
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>

        {/* Normal Nav md and up */}
        <div className="hidden md:flex justify-between items-center flex-1 ml-6">
          {/* Center Links */}
          <ul className="flex flex-1 justify-center gap-6">
            <li>
              <NavLink to="/" className="font-medium">
                {t("header.home")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/vehicles" className="font-medium">
                {t("header.vehicles")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/RentYourVehicle" className="font-medium">
                {t("header.rent_vehicle")}
              </NavLink>
            </li>
            {/* <li><NavLink to="/details" className="font-medium">{t("header.details")}</NavLink></li> */}
            <li>
              <NavLink to="/contactus" className="font-medium">
                {t("header.contact")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/aboutus" className="font-medium">
                {t("header.about")}
              </NavLink>
            </li>
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              // Logged in user
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{getUserDisplayName()}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500 transition-colors"
                  title={t("auth.logout")}
                >
                  <i className="fa-solid fa-right-from-bracket text-lg" />
                </button>
              </>
            ) : (
              // Not logged in
              <Link
                className="flex items-center gap-1 text-gray-700 hover:text-black"
                to="/login"
              >
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
            {/* Links */}
            <ul className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <li>
                <NavLink to="/" onClick={() => setMenuOpen(false)}>
                  {t("header.home")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/vehicles" onClick={() => setMenuOpen(false)}>
                  {t("header.vehicles")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/RentYourVehicle" onClick={() => setMenuOpen(false)}>
                  {t("header.rent_vehicle")}
                </NavLink>
              </li>
              {/* <li><NavLink to="/details" onClick={() => setMenuOpen(false)}>{t("header.details")}</NavLink></li> */}
              <li>
                <NavLink to="/contactus" onClick={() => setMenuOpen(false)}>
                  {t("header.contact")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>
                  {t("header.about")}
                </NavLink>
              </li>
            </ul>

            {/* Icons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {isAuthenticated ? (
                // Logged in user (mobile)
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-black"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{getUserDisplayName()}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-right-from-bracket" />
                    <span>{t("auth.logout")}</span>
                  </button>
                </>
              ) : (
                // Not logged in (mobile)
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-gray-700 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
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
