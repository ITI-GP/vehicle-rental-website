import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage, RentYourVehicle } from "../pages";
import Details from "../components/details/details";
import ContactUs from "./../components/ContactUs/ContactUs";
import AboutUs from "./../components/AboutUs/AboutUs";
import Vehicles from "./../components/Vehicles/Vehicles";
import Login from "./../Auth/Login/Login";
import Register from "./../Auth/Register/Register";
import ProtectUser from "../Protector/ProtectUser";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="details/:id" element={<Details />} />
      <Route path="contactus" element={<ContactUs />} />
      <Route path="aboutus" element={<AboutUs />} />
      <Route path="vehicles" element={<Vehicles />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* protected routes */}
      <Route
        path="/RentYourVehicle"
        element={
          <ProtectUser requiredRole="admin">
            <RentYourVehicle />
          </ProtectUser>
        }
      />
    </Route>
  )
);

export default router;
