import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import individualReducer from "../pages/register/individual/individualSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    individual: individualReducer,
  },
});
