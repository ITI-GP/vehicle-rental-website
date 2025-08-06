import React, { useState } from "react";
import useMultiStepForm from "../../../hooks/useMultiStepForm";
import { PersonalInfoStep, VehicleInfoStep, RentingInfoStep } from "./steps";
import Button from "../../../components/rentYourVehicle/Button";
import { useTranslation } from "react-i18next";
import { validateCurrentStep } from "../validations/individualValidation";


const INITIAL_DATA = {
  // بيانات شخصية
  fullName: "",
  email: "",
  phone: "",
  nationalId: "",      // رقم الهوية أو جواز السفر
  address: "",
  dateOfBirth: "",
  nationality: "",
  profileImage: "",    // صورة شخصية
  licenseImage: "",    // صورة رخصة القيادة

  // بيانات المركبة
 
  vehicleBrand: "",     // الماركة مثل Toyota
  vehicleModel: "",     // الموديل مثل Corolla
  vehicleType: "",      // سيارة / دراجة / فان
  vehicleColor: "",
  vehicleYear: "",
  fuelType: "",         // بنزين / ديزل / كهرباء
  transmission: "",     // أوتوماتيك / مانيوال
  seatCount: "",
  mileage: "",          // عدد الكيلومترات
  vehicleNumber: "",    // رقم اللوحة
  insuranceLevel: "",   // شامل / ضد الغير


  // صور المركبة
  vehicleImages: [],     // array of images: أمامية، خلفية، داخلية...

  // مستندات المركبة
  registrationDoc: "",   // صورة رخصة المركبة
  insuranceDoc: "",      // صورة التأمين


  // بيانات التأجير
  dailyPrice: "",
  weeklyPrice: "",
  monthlyPrice: "",
  minRentalDays: "",
  depositAmount: "",
  cancellationPolicy: "",


};
const RegisterIndividual = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(INITIAL_DATA);
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
      <PersonalInfoStep {...data} updateFields ={updateFields} />,
      <VehicleInfoStep {...data} updateFields={updateFields} />,
      <RentingInfoStep {...data} updateFields={updateFields} />,
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
        console.log('Form submitted successfully:', data);
        alert(t('validation.formSubmitted'));
      } else {
        next();
      }
    }
  }

  return (
    <form className="pt-10" onSubmit={onSubmit}>
      {/* Header Section */}
      <div className="text-center mb-8  bg-orange-50 p-6">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          {t('registration.individualRegistration')}
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          {t('registration.completeYourProfile')}
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
      {/* <MultiStepForm /> */}

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

export default RegisterIndividual;
