import Hero from "../../components/home/HeroSection/hero";
import HowToUseSection from "../../components/home/HowToUseSection/HowToUseSection";
import DownloadApp from "../../components/home/DownloadAPP/DownloadAPP";
import Featuers from "../../components/home/Features";
import Facts from "../../components/home/Facts/Facts";
export default function HomePage() {
  return (
    <div>
      <Hero />
      <Featuers />
      <HowToUseSection />
      <Facts />
      <DownloadApp />
    </div>
  );
}
