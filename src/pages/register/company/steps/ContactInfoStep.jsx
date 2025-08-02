import React from "react";
import { useTranslation } from "react-i18next";

const ContactInfoStep = ({
  email,
  phone,
  website,
  address,
  updateFields,
  errors,
  showErrors
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t("registration.contactInformation")}
      </h2>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.email")} {t("registration.required")}
        </label>
        <input
          id="email"
          name="email"
          placeholder={t("registration.emailPlaceholder")}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.email ? "border-red-500" : "border-gray-300"
          }`}
          type="email"
          value={email}
          onChange={(e) => updateFields({ email: e.target.value })}
        />
        {showErrors && errors?.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.phone")} {t("registration.required")}
        </label>
        <input
          id="phone"
          name="phone"
          placeholder={t("registration.phonePlaceholder")}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.phone ? "border-red-500" : "border-gray-300"
          }`}
          type="tel"
          value={phone}
          onChange={(e) => updateFields({ phone: e.target.value })}
        />
        {showErrors && errors?.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.website")}
        </label>
        <input
          id="website"
          name="website"
          placeholder={t("registration.websitePlaceholder")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="url"
          value={website}
          onChange={(e) => updateFields({ website: e.target.value })}
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.address")} {t("registration.required")}
        </label>
        <textarea
          id="address"
          name="address"
          placeholder={t("registration.addressPlaceholder")}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.address ? "border-red-500" : "border-gray-300"
          }`}
          value={address}
          rows="3"
          onChange={(e) => updateFields({ address: e.target.value })}
        />
        {showErrors && errors?.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default ContactInfoStep;
