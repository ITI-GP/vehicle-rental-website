import { useTranslation } from "react-i18next";

export default function CategoryFilter({ categories, selected, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 justify-center mb-8 flex-wrap">
      <button
        onClick={() => onChange("All")}
        className={`px-8 py-2 rounded-2xl ${
          selected === "All" ? "bg-primary text-white" : "bg-gray-100"
        }`}
      >
        {t("vehicles.all", "All")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-8 py-2 rounded-2xl ${
            selected === cat ? "bg-primary text-white" : "bg-gray-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
