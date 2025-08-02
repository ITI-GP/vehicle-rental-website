import React from "react";
import { useTranslation } from "react-i18next";

const VehicleInfoStep = ({
  vehicleBrand,
  vehicleModel,
  vehicleType,
  vehicleColor,
  vehicleYear,
  fuelType,
  transmission,
  seatCount,
  mileage,
  vehicleNumber,
  insuranceLevel,
  vehicleImages,
  registrationDoc,
  insuranceDoc,
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

  const handleVehicleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(imagePromises).then(images => {
      updateFields({ vehicleImages: [...vehicleImages, ...images] });
    });
  };

  const removeVehicleImage = (index) => {
    const newImages = vehicleImages.filter((_, i) => i !== index);
    updateFields({ vehicleImages: newImages });
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t('registration.vehicleInformation')}
      </h2>
      
      {/* Vehicle Brand */}
      <div>
        <label htmlFor="vehicleBrand" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleBrand')} {t('registration.required')}
        </label>
        <input
          id="vehicleBrand"
          name="vehicleBrand"
          placeholder={t('registration.vehicleBrandPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={vehicleBrand}
          onChange={e => updateFields({vehicleBrand: e.target.value})}
          required
        />
      </div>

      {/* Vehicle Model */}
      <div>
        <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleModel')} {t('registration.required')}
        </label>
        <input
          id="vehicleModel"
          name="vehicleModel"
          placeholder={t('registration.vehicleModelPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={vehicleModel}
          onChange={e => updateFields({vehicleModel: e.target.value})}
          required
        />
      </div>

      {/* Vehicle Type */}
      <div>
        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleType')} {t('registration.required')}
        </label>
        <select
          id="vehicleType"
          name="vehicleType"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={vehicleType}
          onChange={e => updateFields({vehicleType: e.target.value})}
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

      {/* Vehicle Color */}
      <div>
        <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleColor')} {t('registration.required')}
        </label>
        <input
          id="vehicleColor"
          name="vehicleColor"
          placeholder={t('registration.vehicleColorPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={vehicleColor}
          onChange={e => updateFields({vehicleColor: e.target.value})}
          required
        />
      </div>

      {/* Vehicle Year */}
      <div>
        <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleYear')} {t('registration.required')}
        </label>
        <input
          id="vehicleYear"
          name="vehicleYear"
          placeholder={t('registration.vehicleYearPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="1990"
          max={new Date().getFullYear() + 1}
          value={vehicleYear}
          onChange={e => updateFields({vehicleYear: e.target.value})}
          required
        />
      </div>

      {/* Fuel Type */}
      <div>
        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.fuelType')} {t('registration.required')}
        </label>
        <select
          id="fuelType"
          name="fuelType"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={fuelType}
          onChange={e => updateFields({fuelType: e.target.value})}
          required
        >
          <option value="">{t('registration.selectFuelType')}</option>
          <option value="Gasoline">{t('registration.gasoline')}</option>
          <option value="Diesel">{t('registration.diesel')}</option>
          <option value="Electric">{t('registration.electric')}</option>
          <option value="Hybrid">{t('registration.hybrid')}</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.transmission')} {t('registration.required')}
        </label>
        <select
          id="transmission"
          name="transmission"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={transmission}
          onChange={e => updateFields({transmission: e.target.value})}
          required
        >
          <option value="">{t('registration.selectTransmission')}</option>
          <option value="Automatic">{t('registration.automatic')}</option>
          <option value="Manual">{t('registration.manual')}</option>
        </select>
      </div>

      {/* Seat Count */}
      <div>
        <label htmlFor="seatCount" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.seatCount')} {t('registration.required')}
        </label>
        <input
          id="seatCount"
          name="seatCount"
          placeholder={t('registration.seatCountPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="1"
          max="50"
          value={seatCount}
          onChange={e => updateFields({seatCount: e.target.value})}
          required
        />
      </div>

      {/* Mileage */}
      <div>
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.mileage')} {t('registration.required')}
        </label>
        <input
          id="mileage"
          name="mileage"
          placeholder={t('registration.mileagePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="number"
          min="0"
          value={mileage}
          onChange={e => updateFields({mileage: e.target.value})}
          required
        />
      </div>

      {/* Vehicle Number */}
      <div>
        <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleNumber')} {t('registration.required')}
        </label>
        <input
          id="vehicleNumber"
          name="vehicleNumber"
          placeholder={t('registration.vehicleNumberPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={vehicleNumber}
          onChange={e => updateFields({vehicleNumber: e.target.value})}
          required
        />
      </div>

      {/* Insurance Level */}
      <div>
        <label htmlFor="insuranceLevel" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.insuranceLevel')} {t('registration.required')}
        </label>
        <select
          id="insuranceLevel"
          name="insuranceLevel"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={insuranceLevel}
          onChange={e => updateFields({insuranceLevel: e.target.value})}
          required
        >
          <option value="">{t('registration.selectInsuranceLevel')}</option>
          <option value="Comprehensive">{t('registration.comprehensive')}</option>
          <option value="Third Party">{t('registration.thirdParty')}</option>
        </select>
      </div>

      {/* Vehicle Images */}
      <div>
        <label htmlFor="vehicleImages" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.vehicleImages')} {t('registration.required')} {t('registration.vehicleImagesNote')}
        </label>
        <input
          id="vehicleImages"
          name="vehicleImages"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="file"
          accept="image/*"
          multiple
          onChange={handleVehicleImagesChange}
        />
        {vehicleImages.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-green-600 font-medium">
              ✓ {vehicleImages.length} {t('registration.imagesSelected')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {vehicleImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Vehicle ${index + 1}`} 
                    className="w-full h-20 object-cover rounded-lg" 
                  />
                  <button
                    type="button"
                    onClick={() => removeVehicleImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Document */}
      <div>
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
      </div>

      {/* Insurance Document */}
      <div>
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
      </div>
    </div>
  );
};

export default VehicleInfoStep;
