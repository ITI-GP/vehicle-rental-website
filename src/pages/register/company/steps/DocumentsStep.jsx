import React from "react";
import { useTranslation } from "react-i18next";

const DocumentsStep = ({
  licenseDocument,
  registrationDocument,
  insuranceCertificate,
  logo,
  companyImages,
  updateFields,
  errors,
  showErrors
}) => {
  const { t } = useTranslation();

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFields({ [field]: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((images) => {
      updateFields({ companyImages: [...companyImages, ...images] });
    });
  };

  const removeImage = (index) => {
    const newImages = companyImages.filter((_, i) => i !== index);
    updateFields({ companyImages: newImages });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t("registration.documentsAndMedia")}
      </h2>

      {/* License Document */}
      <div>
        <label htmlFor="licenseDocument" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.licenseDocument")} {t("registration.required")}
        </label>
        <input
          type="file"
          accept="image/*"
          id="licenseDocument"
          onChange={handleFileChange("licenseDocument")}
          className={`w-full p-3 border rounded-lg ${
            showErrors && errors?.licenseDocument ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showErrors && errors?.licenseDocument && (
          <p className="text-red-500 text-sm mt-1">{errors.licenseDocument}</p>
        )}
        {licenseDocument && (
          <img src={licenseDocument} alt="License" className="mt-2 w-32 h-20 object-cover rounded" />
        )}
      </div>

      {/* Registration Document */}
      <div>
        <label htmlFor="registrationDocument" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.registrationDocument")} {t("registration.required")}
        </label>
        <input
          type="file"
          accept="image/*"
          id="registrationDocument"
          onChange={handleFileChange("registrationDocument")}
          className={`w-full p-3 border rounded-lg ${
            showErrors && errors?.registrationDocument ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showErrors && errors?.registrationDocument && (
          <p className="text-red-500 text-sm mt-1">{errors.registrationDocument}</p>
        )}
        {registrationDocument && (
          <img src={registrationDocument} alt="Registration" className="mt-2 w-32 h-20 object-cover rounded" />
        )}
      </div>

      {/* Insurance Certificate */}
      <div>
        <label htmlFor="insuranceCertificate" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.insuranceCertificate")} {t("registration.required")}
        </label>
        <input
          type="file"
          accept="image/*"
          id="insuranceCertificate"
          onChange={handleFileChange("insuranceCertificate")}
          className={`w-full p-3 border rounded-lg ${
            showErrors && errors?.insuranceCertificate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showErrors && errors?.insuranceCertificate && (
          <p className="text-red-500 text-sm mt-1">{errors.insuranceCertificate}</p>
        )}
        {insuranceCertificate && (
          <img src={insuranceCertificate} alt="Insurance" className="mt-2 w-32 h-20 object-cover rounded" />
        )}
      </div>

      {/* Logo */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.companyLogo")} {t("registration.required")}
        </label>
        <input
          type="file"
          accept="image/*"
          id="logo"
          onChange={handleFileChange("logo")}
          className={`w-full p-3 border rounded-lg ${
            showErrors && errors?.logo ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showErrors && errors?.logo && (
          <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
        )}
        {logo && (
          <img src={logo} alt="Company Logo" className="mt-2 w-32 h-20 object-cover rounded" />
        )}
      </div>

      {/* Company Gallery */}
      <div>
        <label htmlFor="companyImages" className="block text-sm font-medium text-gray-700 mb-2">
          {t("registration.companyImages")} {t("registration.required")}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          id="companyImages"
          onChange={handleImageGalleryChange}
          className={`w-full p-3 border rounded-lg ${
            showErrors && errors?.companyImages ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showErrors && errors?.companyImages && (
          <p className="text-red-500 text-sm mt-1">{errors.companyImages}</p>
        )}
        {companyImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {companyImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsStep;
