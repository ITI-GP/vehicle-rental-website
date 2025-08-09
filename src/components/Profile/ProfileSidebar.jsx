import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function ProfileSidebar({
  user,
  navItems,
  activeTab,
  onTabChange,
  isMobileMenuOpen,
  onMobileMenuClose,
  isRTL = false,
}) {
  const { t } = useTranslation();
  const sidebarClasses = [
    "fixed inset-y-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out",
    "md:static md:inset-0 md:z-0",
    isRTL ? "right-0" : "left-0",
    isMobileMenuOpen
      ? "translate-x-0"
      : isRTL
      ? "translate-x-full"
      : "-translate-x-full",
    "md:translate-x-0",
  ].join(" ");

  const navigate = useNavigate();

  // Check if user is verified
  const isVerified = user?.user_metadata?.is_verified || false;
  // console.log("User verification status:", user?.id);

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileMenuClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={sidebarClasses}
        aria-label={t("profile.sidebar.navigation", "Profile navigation")}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-end p-4 md:hidden">
            <button
              onClick={onMobileMenuClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Verification Status Badge */}
            <div
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer ${
                isVerified
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              }`}
              onClick={() => {
                navigate("/verification");
                onMobileMenuClose();
              }}
            >
              <ShieldCheckIcon className="h-5 w-5 mr-3" />
              <span className="flex-1">
                {isVerified ? "Verified Account" : "Verify Your Account"}
              </span>
              {!isVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Required
                </span>
              )}
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(item.id);
                  onMobileMenuClose();
                }}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === item.id
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-medium">
                  {user?.user_metadata?.name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    t("profile.user", "U")}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.user_metadata?.name ||
                    user?.email?.split("@")[0] ||
                    t("profile.user", "User")}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
