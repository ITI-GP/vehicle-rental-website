import React, { useState } from "react";
import useMultiStepForm from "../../../hooks/useMultiStepForm";
import { CompanyInfoStep, ContactInfoStep, DocumentsStep } from "./steps";
import Button from "../../../components/rentYourVehicle/Button";
import { useTranslation } from "react-i18next";
import { validateCurrentStep } from "../validations/companyValidation";

const INITIAL_COMPANY_DATA = {
  // بيانات الشركة
  companyName: "",
  commercialRegistrationNumber: "",
  taxId: "",
  field: "Car Rental",
  foundedYear: "",
  fleetSize: 0,

  // المسؤول
  managerName: "",
  managerPosition: "",
  managerEmail: "",
  managerPhone: "",
  // التواصل
  email: "",
  phone: "",
  website: "",
  address: "",


  // مستندات وصور
  licenseDocument: "",
  registrationDocument: "",
  insuranceCertificate: "",
  logo: "",
  companyImages: []
};

const RegisterCompany = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(INITIAL_COMPANY_DATA);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  function updateFields(data) {
    setData((prevData) => ({ ...prevData, ...data }));
    // Clear errors for updated fields
    if (showErrors) {
      const updatedErrors = { ...errors };
      Object.keys(data).forEach(key => {
        if (updatedErrors[key]) {
          delete updatedErrors[key];
        }
      });
      setErrors(updatedErrors);
    }
  }

  // Validation function using imported validation module
  const validateStep = () => {
    const stepErrors = validateCurrentStep(data, currentStepIndex, t);
    setErrors(stepErrors);
    setShowErrors(true);
    return Object.keys(stepErrors).length === 0;
  };

  const { steps, step, currentStepIndex, isfirstStep, isLastStep, back, next } =
    useMultiStepForm([
      <CompanyInfoStep {...data} updateFields={updateFields} />,
      <ContactInfoStep {...data} updateFields={updateFields} />,
      <DocumentsStep {...data} updateFields={updateFields} />,
    ]);

  const StepComponent = step;

  // Handle back navigation without validation
  const handleBack = (e) => {
    e.preventDefault();
    setErrors({});
    setShowErrors(false);
    back();
  };

  // Handle forward navigation with validation
  function onSubmit(e) {
    e.preventDefault();
    
    if (validateStep()) {
      if (isLastStep) {
        // Handle final form submission
        console.log('Company form submitted successfully:', data);
        alert(t('validation.formSubmitted'));
      } else {
        next();
      }
    }
  }

  return (
    <form className="pt-10" onSubmit={onSubmit}>
      {/* Header Section */}
      <div className="text-center mb-8 bg-orange-50 p-6">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          {t('registration.companyRegistration')}
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          {t('registration.completeCompanyProfile')}
        </p>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 transition-colors ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Counter */}
        <div className="text-sm text-gray-500">
          {t('registration.step')} {currentStepIndex + 1} {t('registration.of')} {steps.length}
        </div>
      </div>

      {React.cloneElement(StepComponent, { errors, showErrors })} 
      
      {/* Error Summary */}
      {showErrors && Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">{t('validation.errorsFound')}</h3>
          <ul className="text-sm text-red-600 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex m-20 px-3 justify-around ">
        {!isfirstStep && <Button type="button" onClick={handleBack}>{t('common.back')}</Button>}
        <Button type="submit">{isLastStep ? t('common.finish') : t('common.next')}</Button>
      </div>
    </form>
  );
};

export default RegisterCompany;
