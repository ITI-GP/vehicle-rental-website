import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { HomePage } from "../pages";
import Details from "../components/details/details";
import ContactUs from './../components/ContactUs/ContactUs';
import AboutUs from './../components/AboutUs/AboutUs';
import Vehicles from './../components/Vehicles/Vehicles';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="details" element={<Details/>}/>
      <Route path="contactus" element={<ContactUs/>}/>
      <Route path="aboutus" element={<AboutUs/>}/>
      <Route path="vehicles" element={<Vehicles/>}/>
      

    </Route>
  )
);

export default router;
