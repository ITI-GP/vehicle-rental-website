import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import {
  HomePage,
  RentYourVehicle,
  ChooseUserType,
  RegisterCompany,
  RegisterIndividual,
} from "../pages";
import Details from "../components/details/details";
import ContactUs from "./../components/ContactUs/ContactUs";
import AboutUs from "./../components/AboutUs/AboutUs";
import Vehicles from "./../components/Vehicles/Vehicles";
import Login from "./../Auth/Login/Login";
import Register from "./../Auth/Register/Register";
import ProtectUser from "../Protector/ProtectUser";
import Profile from "../pages/Profile/Profile"
import Dashboard from "../pages/Dashboard/Dashboard";
import FavoriteVehicles from "../pages/FavoriteVehicles/FavoriteVehicles";

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
       <Route path="profile" element={<Profile/>} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="favorites" element={<FavoriteVehicles/>}/>

      {/* protected routes */}

      <Route
        path="/RentYourVehicle"
        element={
          <ProtectUser requiredRole="admin">
            <RentYourVehicle />
          </ProtectUser>
        }
      />
      <Route
        path="/ChooseUserType"
        element={
          <ProtectUser requiredRole="admin">
            <ChooseUserType />
          </ProtectUser>
        }
      />
      <Route
        path="/register/individual"
        element={
          <ProtectUser requiredRole="admin">
            <RegisterIndividual />
          </ProtectUser>
        }
      />
      <Route
        path="/register/company"
        element={
          <ProtectUser requiredRole="admin">
            <RegisterCompany />
          </ProtectUser>
        }
      />
    </Route>
  )
);

export default router;
