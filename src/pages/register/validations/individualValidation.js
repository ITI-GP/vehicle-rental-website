// Individual Registration Form Validation
// This module contains all validation logic for the vehicle registration form

/**
 * Validates vehicle information
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateVehicleInfo = (data, t) => {
  const stepErrors = {};
  
  // Required fields validation
  const requiredFields = [
    'brand', 'model', 'type', 'year', 'color', 
    'plate_num', 'location', 'price_per_day'
  ];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      const fieldName = field.replace(/_/g, ' ');
      stepErrors[field] = t('validation.fieldRequired', { field: fieldName });
    }
  });
  
  // Year validation
  if (data.year) {
    const year = parseInt(data.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      stepErrors.year = t('validation.yearInvalid');
    }
  }
  
  // Price validation
  if (data.price_per_day) {
    const price = parseFloat(data.price_per_day);
    if (isNaN(price) || price <= 0) {
      stepErrors.price_per_day = t('validation.priceInvalid');
    }
  }
  
  // Images validation
  if (!data.images || data.images.length === 0) {
    stepErrors.images = t('validation.imagesRequired');
  }
  
  return stepErrors;
};

/**
 * Validates the form data
 * @param {Object} data - Form data object
 * @param {number} currentStepIndex - Current step index (0-based)
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateCurrentStep = (data, currentStepIndex, t) => {
  return validateVehicleInfo(data, t);
};

/**
 * Validates all form data
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Object} - Object containing validation errors
 */
export const validateAllSteps = (data, t) => {
  return validateVehicleInfo(data, t);
};

/**
 * Checks if the form is valid (no errors)
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {boolean} - True if form is valid, false otherwise
 */
export const isFormValid = (data, t) => {
  const errors = validateAllSteps(data, t);
  return Object.keys(errors).length === 0;
};

/**
 * Gets a summary of validation errors
 * @param {Object} data - Form data object
 * @param {Function} t - Translation function
 * @returns {Array} - Array of all error messages
 */
export const getValidationSummary = (data, t) => {
  const errors = validateAllSteps(data, t);
  return Object.values(errors).filter(error => error);
};