import { useLanguage } from "../hooks/useLanguage";
import { useState } from "react";

const TransButton = () => {
  const { language, changeLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: "EN", label: "English" },
    { code: "AR", label: "Arabic" },
  ];

  const handleLanguageChange = (code) => {
    if (code !== language) {
      changeLanguage(code);
    }
    setIsDropdownOpen(false);
  };

  const isArabic = language.toLowerCase().startsWith("ar");

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen((open) => !open)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-800  rounded-lg shadow-sm   transition-all"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="orange"
          viewBox="0 0 24 24"
          className="text-primary-600"
        >
          <path d="M12 0C5.371 0 0 5.373 0 12s5.371 12 12 12 12-5.373 12-12S18.629 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
          <path d="M12 6a6 6 0 100 12A6 6 0 0012 6zm0 10a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
        <span>{language.toUpperCase()}</span>
        <svg
          className="w-4 h-4 text-gray-600 ml-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute ${
            isArabic ? "right-0" : "left-0"
          } mt-2 w-30  rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn`}
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              disabled={code === language}
              className={`w-full text-left px-4 py-2 text-sm  transition-all ${
                code === language
                  ? "text-orange-400  font-semibold"
                  : "text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransButton;

