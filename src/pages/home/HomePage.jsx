import React from 'react';
import Hero from '../../components/home/HeroSection/hero';
import HowToUseSection from '../../components/home/HowToUseSection/HowToUseSection';
import DownloadApp from '../../components/home/DownloadAPP/DownloadAPP';
export default function HomePage() {

  return (
    <div>
      <Hero />
     <HowToUseSection/>
     <DownloadApp/>
    </div>
  );
}
