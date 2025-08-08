import React, { useState, useEffect } from "react";
import useMultiStepForm from "../../../hooks/useMultiStepForm";
import { PersonalInfoStep, VehicleInfoStep, RentingInfoStep } from "./steps";
import Button from "../../../components/rentYourVehicle/Button";
import { useTranslation } from "react-i18next";
import { validateCurrentStep } from "../validations/individualValidation";
import { supabase } from "../../../Lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";


const INITIAL_DATA = {


  price_per_day: "",
  type: "",
  owner_id: "",
  plate_num: "",
  location: "",
  // insurance_level: "",
  brand: "",
  model: "",
  year: "",
  color: "",

images: [],


};
const RegisterIndividual = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      // <PersonalInfoStep {...data} updateFields ={updateFields} />,
      <VehicleInfoStep {...data} updateFields={updateFields} />,
      // <RentingInfoStep {...data} updateFields={updateFields} />,
    ]);
  const StepComponent = step;
  // Handle back navigation without validation
  const handleBack = (e) => {
    e.preventDefault();
    setErrors({});
    setShowErrors(false);
    back();
  };

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    if (!isLastStep) {
      next();
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Prepare the vehicle data according to Supabase schema
      const vehicleData = {
        // Basic vehicle info
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year) || new Date().getFullYear(),
        color: data.color,
        plate_num: data.plate_num, // Note: Using plate_number instead of plate_num
        type: data.type,
        
        // Location and availability
        location: data.location,
        available: true,
        
        // Insurance and pricing
        // insurance: data.insurance_level, // Changed from insurance_level to insurance
        price_per_day: parseFloat(data.price_per_day) || 0,
        
        // Owner and metadata
        owner_id: user?.id,
        rating: 0,
        rentals_count: 0, // Changed from string to number
        created_at: new Date().toISOString(),
        
        // Handle images (assuming images is an array of base64 strings)
        images: data.images || []
      };

      // Insert the vehicle data into the database
      const { data: insertedData, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select();

      if (error) {
        throw error;
      }

      // Handle successful submission
      console.log('Vehicle registered successfully:', insertedData);
      setSubmitSuccess(true);
      // Optionally reset the form or redirect
      // setData(INITIAL_DATA);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
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
      
      {submitError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      {submitSuccess ? (
        <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('registration.vehicleRegisteredSuccessfully')}
        </div>
      ) : (
        <div className="mt-8 flex justify-center space-x-4">
          {!isfirstStep && (
            <Button 
              type="button" 
              onClick={handleBack} 
              variant="secondary"
              disabled={isSubmitting}
            >
              {t('common.back')}
            </Button>
          )}
          <div>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') : 
               isLastStep ? t('common.submit') : t('common.next')}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterIndividual;
