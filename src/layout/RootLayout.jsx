import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";

const RootLayout = () => {
  return (
    <main className="">
      <Header />

      <div className="flex-grow min-h-[calc(100vh-128px)] flex flex-col w-full max-w-[1920px] px-[72px] pt-[60px] pb-[40px] mx-auto">
        <Outlet />
      </div>
      
      
      <Footer />
    </main>
  );
};

export default RootLayout;
