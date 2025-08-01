import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 0,
  formData: {
    personalInfo: {},
    vehicleInfo: {},
    vehicleImages: [],
  },
};

const individualSlice = createSlice({
  name: "individual",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < 2) state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },
    setPersonalInfo: (state, action) => {
      state.formData.personalInfo = action.payload;
    },
    setVehicleInfo: (state, action) => {
      state.formData.vehicleInfo = action.payload;
    },
    setVehicleImages: (state, action) => {
      state.formData.vehicleImages = action.payload;
    },
  },
});

export const {
  nextStep,
  prevStep,
  setPersonalInfo,
  setVehicleInfo,
  setVehicleImages,
} = individualSlice.actions;

export default individualSlice.reducer;
