import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";

const RootLayout = () => {
  return (
    <main className="">
      <Header />

      <div className="flex-grow min-h-[calc(100vh-128px)] mt-22 flex flex-col min-h-screen container mx-auto my-6 py-6 mt-20">
        <Outlet />
      </div>
      
      <Footer />
    </main>
  );
};

export default RootLayout;
