import React from "react";
import { useTranslation } from "react-i18next";

const VehicleInfoStep = ({
  price_per_day,
  type,

  plate_num,
  location,
  // insurance_level,
  brand,
  model,
  year,
  color,
  images,
  updateFields
}) => {
  const { t } = useTranslation();
  
  const handleFileChange = (fieldName) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFields({ [fieldName]: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(imagePromises).then(newImages => {
      updateFields({ images: [...images, ...newImages] });
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    updateFields({ images: newImages });
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t('registration.vehicleInformation')}
      </h2>
      
      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleBrand')} {t('registration.required')}
        </label>
        <input
          id="brand"
          name="brand"
          placeholder={t('registration.vehicleBrandPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={brand || ''}
          onChange={e => updateFields({brand: e.target.value})}
          required
        />
      </div>
      
      {/* Model */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleModel')} {t('registration.required')}
        </label>
        <input
          id="model"
          name="model"
          placeholder={t('registration.vehicleModelPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={model || ''}
          onChange={e => updateFields({model: e.target.value})}
          required
        />
      </div>
      
      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleType')} {t('registration.required')}
        </label>
        <select
          id="type"
          name="vehicleType"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={type || ''}
          onChange={e => updateFields({type: e.target.value})}
          required
        >
          <option value="">{t('registration.selectVehicleType')}</option>
          <option value="Car">{t('registration.car')}</option>
          <option value="Motorcycle">{t('registration.motorcycle')}</option>
          <option value="Van">{t('registration.van')}</option>
          <option value="SUV">{t('registration.suv')}</option>
          <option value="Truck">{t('registration.truck')}</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.location')} {t('registration.required')}
        </label>
        <input
          id="location"
          name="location"
          placeholder={t('registration.locationPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={location || ''}
          onChange={e => updateFields({location: e.target.value})}
          required
        />
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleYear')} {t('registration.required')}
        </label>
        <input
          id="year"
          name="year"
          placeholder={t('registration.vehicleYearPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          value={year || ''}
          onChange={e => updateFields({year: e.target.value})}
          required
        />
      </div>

      {/* Color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleColor')} {t('registration.required')}
        </label>
        <input
          id="color"
          name="color"
          placeholder={t('registration.vehicleColorPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={color || ''}
          onChange={e => updateFields({color: e.target.value})}
          required
        />
      </div>
      
      {/* Price Per Day */}
      <div>
        <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.pricePerDay')} {t('registration.required')}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            id="price_per_day"
            name="price_per_day"
            placeholder={t('registration.pricePerDayPlaceholder')}
            className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            type="number"
            min="0"
            step="0.01"
            value={price_per_day || ''}
            onChange={e => updateFields({price_per_day: e.target.value})}
            required
          />
        </div>
      </div>

      {/* Plate Number */}
      <div>
        <label htmlFor="plate_num" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleNumber')} {t('registration.required')}
        </label>
        <input
          id="plate_num"
          name="plate_num"
          placeholder={t('registration.vehicleNumberPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={plate_num || ''}
          onChange={e => updateFields({plate_num: e.target.value})}
          required
        />
      </div>

      {/* Insurance Level */}
      {/* <div>
        <label htmlFor="insurance_level" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.insuranceLevel')} {t('registration.required')}
        </label>
        <select
          id="insurance_level"
          name="insurance_level"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={insurance_level || ''}
          onChange={e => updateFields({insurance_level: e.target.value})}
          required
        >
          <option value="">{t('registration.selectInsuranceLevel')}</option>
          <option value="Comprehensive">{t('registration.comprehensive')}</option>
          <option value="Third Party">{t('registration.thirdParty')}</option>
        </select>
      </div> */}

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleImages')} {t('registration.required')}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="images"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
              >
                <span>{t('registration.uploadImages')}</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                />
              </label>
              <p className="pl-1">{t('registration.orDragAndDrop')}</p>
            </div>
            <p className="text-xs text-gray-500">
              {t('registration.imageRequirements')}
            </p>
          </div>
        </div>
        
        {/* Preview uploaded images */}
        {images && images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('registration.uploadedImages')}</h4>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('registration.removeImage')}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Document */}
      {/* <div>
        <label htmlFor="registrationDoc" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.registrationDoc')} {t('registration.required')}
        </label>
        <input
          id="registrationDoc"
          name="registrationDoc"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="file"
          accept="image/*"
          onChange={handleFileChange('registrationDoc')}
          required
        />
        {registrationDoc && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-green-600 font-medium">
              ✓ {t('registration.fileSelected')}
            </div>
            <img src={registrationDoc} alt="Registration document" className="w-32 h-20 object-cover rounded-lg" />
          </div>
        )}
      </div> */}

      {/* Insurance Document */}
      {/* <div>
        <label htmlFor="insuranceDoc" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.insuranceDoc')} {t('registration.required')}
        </label>
        <input
          id="insuranceDoc"
          name="insuranceDoc"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="file"
          accept="image/*"
          onChange={handleFileChange('insuranceDoc')}
          required
        />
        {insuranceDoc && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-green-600 font-medium">
              ✓ {t('registration.fileSelected')}
            </div>
            <img src={insuranceDoc} alt="Insurance document" className="w-32 h-20 object-cover rounded-lg" />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default VehicleInfoStep;
