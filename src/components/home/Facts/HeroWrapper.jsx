import image from "../HeroSection/Images/background.webp";

const HeroWrapper = ({ children }) => {
  return (
    <div
      className="min-h-[400px] flex justify-center items-center px-4 py-12 bg-cover bg-center rounded-lg shadow-lg"
      style={{ backgroundImage: `url(${image})` }}
    >
      {children}
    </div>
  );
};

export default HeroWrapper;
