import React from "react";
import { useTranslation } from "react-i18next";

const CompanyInfoStep = ({
  companyName,
  commercialRegistrationNumber,
  taxId,
  field,
  foundedYear,
  fleetSize,
  managerName,
  managerPosition,
  managerEmail,
  managerPhone,
  updateFields,
  errors,
  showErrors
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t('registration.companyInformation')}
      </h2>
      
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.companyName')} {t('registration.required')}
        </label>
        <input
          id="companyName"
          name="companyName"
          placeholder={t('registration.companyNamePlaceholder')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          type="text"
          value={companyName}
          onChange={e => updateFields({companyName: e.target.value})}
        />
        {showErrors && errors?.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
        )}
      </div>

      {/* Commercial Registration Number */}
      <div>
        <label htmlFor="commercialRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.commercialRegistrationNumber')} {t('registration.required')}
        </label>
        <input
          id="commercialRegistrationNumber"
          name="commercialRegistrationNumber"
          placeholder={t('registration.commercialRegistrationPlaceholder')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.commercialRegistrationNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          type="text"
          value={commercialRegistrationNumber}
          onChange={e => updateFields({commercialRegistrationNumber: e.target.value})}
        />
        {showErrors && errors?.commercialRegistrationNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.commercialRegistrationNumber}</p>
        )}
      </div>

      {/* Tax ID */}
      <div>
        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.taxId')} {t('registration.required')}
        </label>
        <input
          id="taxId"
          name="taxId"
          placeholder={t('registration.taxIdPlaceholder')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.taxId ? 'border-red-500' : 'border-gray-300'
          }`}
          type="text"
          value={taxId}
          onChange={e => updateFields({taxId: e.target.value})}
        />
        {showErrors && errors?.taxId && (
          <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
        )}
      </div>

      {/* Business Field */}
      <div>
        <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.businessField')} {t('registration.required')}
        </label>
        <select
          id="field"
          name="field"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={field}
          onChange={e => updateFields({field: e.target.value})}
        >
          <option value="Car Rental">{t('registration.carRental')}</option>
          <option value="Transportation">{t('registration.transportation')}</option>
          <option value="Logistics">{t('registration.logistics')}</option>
          <option value="Tourism">{t('registration.tourism')}</option>
        </select>
      </div>

      {/* Founded Year */}
      <div>
        <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.foundedYear')} {t('registration.required')}
        </label>
        <input
          id="foundedYear"
          name="foundedYear"
          placeholder={t('registration.foundedYearPlaceholder')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.foundedYear ? 'border-red-500' : 'border-gray-300'
          }`}
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={foundedYear}
          onChange={e => updateFields({foundedYear: e.target.value})}
        />
        {showErrors && errors?.foundedYear && (
          <p className="text-red-500 text-sm mt-1">{errors.foundedYear}</p>
        )}
      </div>

      {/* Fleet Size */}
      <div>
        <label htmlFor="fleetSize" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.fleetSize')} {t('registration.required')}
        </label>
        <input
          id="fleetSize"
          name="fleetSize"
          placeholder={t('registration.fleetSizePlaceholder')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
            showErrors && errors?.fleetSize ? 'border-red-500' : 'border-gray-300'
          }`}
          type="number"
          min="1"
          value={fleetSize}
          onChange={e => updateFields({fleetSize: parseInt(e.target.value) || 0})}
        />
        {showErrors && errors?.fleetSize && (
          <p className="text-red-500 text-sm mt-1">{errors.fleetSize}</p>
        )}
      </div>

      {/* Manager Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {t('registration.managerInformation')}
        </h3>

        {/* Manager Name */}
        <div className="mb-4">
          <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-2">
            {t('registration.managerName')} {t('registration.required')}
          </label>
          <input
            id="managerName"
            name="managerName"
            placeholder={t('registration.managerNamePlaceholder')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
              showErrors && errors?.managerName ? 'border-red-500' : 'border-gray-300'
            }`}
            type="text"
            value={managerName}
            onChange={e => updateFields({managerName: e.target.value})}
          />
          {showErrors && errors?.managerName && (
            <p className="text-red-500 text-sm mt-1">{errors.managerName}</p>
          )}
        </div>

        {/* Manager Position */}
        <div className="mb-4">
          <label htmlFor="managerPosition" className="block text-sm font-medium text-gray-700 mb-2">
            {t('registration.managerPosition')} {t('registration.required')}
          </label>
          <input
            id="managerPosition"
            name="managerPosition"
            placeholder={t('registration.managerPositionPlaceholder')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
              showErrors && errors?.managerPosition ? 'border-red-500' : 'border-gray-300'
            }`}
            type="text"
            value={managerPosition}
            onChange={e => updateFields({managerPosition: e.target.value})}
          />
          {showErrors && errors?.managerPosition && (
            <p className="text-red-500 text-sm mt-1">{errors.managerPosition}</p>
          )}
        </div>

        {/* Manager Email */}
        <div className="mb-4">
          <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            {t('registration.managerEmail')} {t('registration.required')}
          </label>
          <input
            id="managerEmail"
            name="managerEmail"
            placeholder={t('registration.managerEmailPlaceholder')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
              showErrors && errors?.managerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            type="email"
            value={managerEmail}
            onChange={e => updateFields({managerEmail: e.target.value})}
          />
          {showErrors && errors?.managerEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.managerEmail}</p>
          )}
        </div>

        {/* Manager Phone */}
        <div>
          <label htmlFor="managerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('registration.managerPhone')} {t('registration.required')}
          </label>
          <input
            id="managerPhone"
            name="managerPhone"
            placeholder={t('registration.managerPhonePlaceholder')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
              showErrors && errors?.managerPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            type="tel"
            value={managerPhone}
            onChange={e => updateFields({managerPhone: e.target.value})}
          />
          {showErrors && errors?.managerPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.managerPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoStep;

