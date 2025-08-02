import React, { useState } from "react";
import { useTranslation } from "react-i18next";


const PersonalInfoStep = ( {fullName, email, phone, nationalId, address, dateOfBirth, nationality, profileImage, licenseImage, updateFields} ) => {
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

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        {t('registration.personalInformation')}
      </h2>
      
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.fullName')} {t('registration.required')}
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder={t('registration.fullNamePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={fullName}
          onChange={e => updateFields({fullName: e.target.value})}
          // required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.emailAddress')} {t('registration.required')}
        </label>
        <input
          id="email"
          name="email"
          placeholder={t('registration.emailPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="email"
          value={email}
          onChange={e => updateFields({email: e.target.value})}
          // required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.phoneNumber')} {t('registration.required')}
        </label>
        <input
          id="phone"
          name="phone"
          placeholder={t('registration.phonePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="tel"
          value={phone}
          onChange={e => updateFields({phone: e.target.value})}
          // required
        />
      </div>

      {/* National ID */}
      <div>
        <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.nationalId')} {t('registration.required')}
        </label>
        <input
          id="nationalId"
          name="nationalId"
          placeholder={t('registration.nationalIdPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="text"
          value={nationalId}
          onChange={e => updateFields({nationalId: e.target.value})}
          // required
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.address')} {t('registration.required')}
        </label>
        <textarea
          id="address"
          name="address"
          placeholder={t('registration.addressPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          rows="3"
          value={address}
          onChange={e => updateFields({address: e.target.value})}
          // required
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.dateOfBirth')} {t('registration.required')}
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="date"
          value={dateOfBirth}
          onChange={e => updateFields({dateOfBirth: e.target.value})}
          // required
        />
      </div>

      {/* Nationality */}
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.nationality')} {t('registration.required')}
        </label>
        <select
          id="nationality"
          name="nationality"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={nationality}
          onChange={e => updateFields({nationality: e.target.value})}
          required
        >
          <option value="">{t('registration.selectNationality')}</option>
          <option value="Saudi">{t('registration.saudi')}</option>
          <option value="Egyptian">{t('registration.egyptian')}</option>
          <option value="Jordanian">{t('registration.jordanian')}</option>
          <option value="Lebanese">{t('registration.lebanese')}</option>
          <option value="Syrian">{t('registration.syrian')}</option>
          <option value="Palestinian">{t('registration.palestinian')}</option>
          <option value="Iraqi">{t('registration.iraqi')}</option>
          <option value="Kuwaiti">{t('registration.kuwaiti')}</option>
          <option value="Emirati">{t('registration.emirati')}</option>
          <option value="Qatari">{t('registration.qatari')}</option>
          <option value="Bahraini">{t('registration.bahraini')}</option>
          <option value="Omani">{t('registration.omani')}</option>
          <option value="Yemeni">{t('registration.yemeni')}</option>
          <option value="Other">{t('registration.other')}</option>
        </select>
      </div>

      {/* Profile Image */}
      <div>
        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.profileImage')} {t('registration.required')}
        </label>
        <input
          id="profileImage"
          name="profileImage"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="file"
          accept="image/*"
          onChange={handleFileChange('profileImage')}
          // required
        />
        {profileImage && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-green-600 font-medium">
              ✓ {t('registration.fileSelected')}
            </div>
            <img src={profileImage} alt="Profile preview" className="w-20 h-20 object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* License Image */}
      <div>
        <label htmlFor="licenseImage" className="block text-sm font-medium text-gray-700 mb-2">
          {t('registration.licenseImage')} {t('registration.required')}
        </label>
        <input
          id="licenseImage"
          name="licenseImage"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          type="file"
          accept="image/*"
          onChange={handleFileChange('licenseImage')}
          // required
        />
        {licenseImage && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-green-600 font-medium">
              ✓ {t('registration.fileSelected')}
            </div>
            <img src={licenseImage} alt="License preview" className="w-32 h-20 object-cover rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
