export const validateCurrentStep = (data, currentStepIndex, t) => {
    const errors = {};
  
    // ===== Step 0: Company Info =====
    if (currentStepIndex === 0) {
      if (!data.companyName) errors.companyName = t("validation.required", { field: t("form.companyName") });
      if (!data.commercialRegistrationNumber) errors.commercialRegistrationNumber = t("validation.required", { field: t("form.commercialRegistrationNumber") });
      if (!data.taxId) errors.taxId = t("validation.required", { field: t("form.taxId") });
      if (!data.foundedYear || isNaN(data.foundedYear)) errors.foundedYear = t("validation.invalidYear");
      if (!data.fleetSize || isNaN(data.fleetSize) || data.fleetSize <= 0) errors.fleetSize = t("validation.invalidFleetSize");
    }
  
    // ===== Step 1: Contact Info =====
    else if (currentStepIndex === 1) {
      if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = t("validation.invalidEmail");
      if (!data.phone || data.phone.length < 6) errors.phone = t("validation.invalidPhone");
      if (!data.address) errors.address = t("validation.required", { field: t("form.address") });
  
      if (!data.managerName) errors.managerName = t("validation.required", { field: t("form.managerName") });
      if (!data.managerPosition) errors.managerPosition = t("validation.required", { field: t("form.managerPosition") });
      if (!data.managerEmail || !/^\S+@\S+\.\S+$/.test(data.managerEmail)) errors.managerEmail = t("validation.invalidEmail");
      if (!data.managerPhone || data.managerPhone.length < 6) errors.managerPhone = t("validation.invalidPhone");
    }
  
    // ===== Step 2: Documents & Images =====
    else if (currentStepIndex === 2) {
      if (!data.licenseDocument) errors.licenseDocument = t("validation.required", { field: t("form.licenseDocument") });
      if (!data.registrationDocument) errors.registrationDocument = t("validation.required", { field: t("form.registrationDocument") });
      if (!data.insuranceCertificate) errors.insuranceCertificate = t("validation.required", { field: t("form.insuranceCertificate") });
      if (!data.logo) errors.logo = t("validation.required", { field: t("form.companyLogo") });
  
      if (!data.companyImages || data.companyImages.length < 1)
        errors.companyImages = t("validation.atLeastOneImage");
    }
  
    return errors;
  };
  