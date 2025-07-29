import React from "react";
import { useTranslation } from "react-i18next";
import AboutInfo from "./AboutInfo";
import Memories from "./Memories";
import Reviews from "./ReviewForm";
import Video from "./Video";
import ReviewForm from "./ReviewForm";
import AboutHero from "./AboutHero";
import Question from "./Question";
export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div>
      <Video className="mb-10" />
      <AboutInfo className="mb-10" />
      <Memories className="mb-10" />
      <ReviewForm className="mb-10"/>
      <AboutHero className="mb-10" />
      <Question className="mb-10" />
      
      
    </div>
  );
}
