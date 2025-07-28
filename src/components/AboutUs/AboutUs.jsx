import React from 'react'
import { useTranslation } from "react-i18next";
export default function AboutUs() {
      const { t } = useTranslation();
  return (
    <div className=" my-12  flex items-center justify-center h-screen bg-gray-100">
        <h1>{t("About Us")}</h1>
        <h1>sssssss</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quod, voluptatum quo minima aut nemo dicta modi unde temporibus sit, voluptates pariatur aliquid ea natus dolore possimus, ad tempora blanditiis!</p>
        <p>ayayayya</p>
    </div>
    
  )
}
