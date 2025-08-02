// Individual Registration Form Validation
// This module contains all validation logic for the multi-step individual registration form

/**
 * Validates personal information step
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validatePersonalInfo = (data, t) => {
  const stepErrors = {};
  
  if (!data.fullName.trim()) {
    stepErrors.fullName = t('validation.fullNameRequired');
  }
  
  if (!data.email.trim()) {
    stepErrors.email = t('validation.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    stepErrors.email = t('validation.emailInvalid');
  }
  
  if (!data.phone.trim()) {
    stepErrors.phone = t('validation.phoneRequired');
  } else if (!/^[+]?[0-9]{10,15}$/.test(data.phone.replace(/\s/g, ''))) {
    stepErrors.phone = t('validation.phoneInvalid');
  }
  
  if (!data.nationalId.trim()) {
    stepErrors.nationalId = t('validation.nationalIdRequired');
  }
  
  if (!data.address.trim()) {
    stepErrors.address = t('validation.addressRequired');
  }
  
  if (!data.dateOfBirth) {
    stepErrors.dateOfBirth = t('validation.dateOfBirthRequired');
  } else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      stepErrors.dateOfBirth = t('validation.minimumAge');
    }
  }
  
  if (!data.nationality) {
    stepErrors.nationality = t('validation.nationalityRequired');
  }
  
  if (!data.profileImage) {
    stepErrors.profileImage = t('validation.profileImageRequired');
  }
  
  if (!data.licenseImage) {
    stepErrors.licenseImage = t('validation.licenseImageRequired');
  }
  
  return stepErrors;
};

/**
 * Validates vehicle information step
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateVehicleInfo = (data, t) => {
  const stepErrors = {};
  
  if (!data.vehicleBrand.trim()) {
    stepErrors.vehicleBrand = t('validation.vehicleBrandRequired');
  }
  
  if (!data.vehicleModel.trim()) {
    stepErrors.vehicleModel = t('validation.vehicleModelRequired');
  }
  
  if (!data.vehicleType) {
    stepErrors.vehicleType = t('validation.vehicleTypeRequired');
  }
  
  if (!data.vehicleColor.trim()) {
    stepErrors.vehicleColor = t('validation.vehicleColorRequired');
  }
  
  if (!data.vehicleYear) {
    stepErrors.vehicleYear = t('validation.vehicleYearRequired');
  } else {
    const year = parseInt(data.vehicleYear);
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear + 1) {
      stepErrors.vehicleYear = t('validation.vehicleYearInvalid');
    }
  }
  
  if (!data.fuelType) {
    stepErrors.fuelType = t('validation.fuelTypeRequired');
  }
  
  if (!data.transmission) {
    stepErrors.transmission = t('validation.transmissionRequired');
  }
  
  if (!data.seatCount) {
    stepErrors.seatCount = t('validation.seatCountRequired');
  } else {
    const seats = parseInt(data.seatCount);
    if (seats < 1 || seats > 50) {
      stepErrors.seatCount = t('validation.seatCountInvalid');
    }
  }
  
  if (!data.mileage) {
    stepErrors.mileage = t('validation.mileageRequired');
  } else if (parseInt(data.mileage) < 0) {
    stepErrors.mileage = t('validation.mileageInvalid');
  }
  
  if (!data.vehicleNumber.trim()) {
    stepErrors.vehicleNumber = t('validation.vehicleNumberRequired');
  }
  
  if (!data.insuranceLevel) {
    stepErrors.insuranceLevel = t('validation.insuranceLevelRequired');
  }
  
  if (!data.vehicleImages || data.vehicleImages.length === 0) {
    stepErrors.vehicleImages = t('validation.vehicleImagesRequired');
  }
  
  if (!data.registrationDoc) {
    stepErrors.registrationDoc = t('validation.registrationDocRequired');
  }
  
  if (!data.insuranceDoc) {
    stepErrors.insuranceDoc = t('validation.insuranceDocRequired');
  }
  
  return stepErrors;
};

/**
 * Validates renting information step
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateRentingInfo = (data, t) => {
  const stepErrors = {};
  
  if (!data.dailyPrice) {
    stepErrors.dailyPrice = t('validation.dailyPriceRequired');
  } else if (parseFloat(data.dailyPrice) <= 0) {
    stepErrors.dailyPrice = t('validation.dailyPriceInvalid');
  }
  
  if (data.weeklyPrice && parseFloat(data.weeklyPrice) <= 0) {
    stepErrors.weeklyPrice = t('validation.weeklyPriceInvalid');
  }
  
  if (data.monthlyPrice && parseFloat(data.monthlyPrice) <= 0) {
    stepErrors.monthlyPrice = t('validation.monthlyPriceInvalid');
  }
  
  if (!data.minRentalDays) {
    stepErrors.minRentalDays = t('validation.minRentalDaysRequired');
  } else if (parseInt(data.minRentalDays) < 1) {
    stepErrors.minRentalDays = t('validation.minRentalDaysInvalid');
  }
  
  if (!data.depositAmount) {
    stepErrors.depositAmount = t('validation.depositAmountRequired');
  } else if (parseFloat(data.depositAmount) < 0) {
    stepErrors.depositAmount = t('validation.depositAmountInvalid');
  }
  
  if (!data.cancellationPolicy) {
    stepErrors.cancellationPolicy = t('validation.cancellationPolicyRequired');
  }
  
  return stepErrors;
};

/**
 * Validates the current step based on step index
 * @param {Object} data - Form data object
 * @param {number} currentStepIndex - Current step index (0-based)
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateCurrentStep = (data, currentStepIndex, t) => {
  let stepErrors = {};
  
  switch (currentStepIndex) {
    case 0:
      stepErrors = validatePersonalInfo(data, t);
      break;
    case 1:
      stepErrors = validateVehicleInfo(data, t);
      break;
    case 2:
      stepErrors = validateRentingInfo(data, t);
      break;
    default:
      break;
  }
  
  return stepErrors;
};

/**
 * Validates all steps of the form
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing all validation errors grouped by step
 */
export const validateAllSteps = (data, t) => {
  return {
    personalInfo: validatePersonalInfo(data, t),
    vehicleInfo: validateVehicleInfo(data, t),
    rentingInfo: validateRentingInfo(data, t)
  };
};

/**
 * Checks if the form is valid (no errors in any step)
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {boolean} - True if form is valid, false otherwise
 */
export const isFormValid = (data, t) => {
  const allErrors = validateAllSteps(data, t);
  return Object.values(allErrors).every(stepErrors => Object.keys(stepErrors).length === 0);
};

/**
 * Gets a summary of validation errors across all steps
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Array} - Array of all error messages
 */
export const getValidationSummary = (data, t) => {
  const allErrors = validateAllSteps(data, t);
  const errorMessages = [];
  
  Object.values(allErrors).forEach(stepErrors => {
    Object.values(stepErrors).forEach(error => {
      errorMessages.push(error);
    });
  });
  
  return errorMessages;
};