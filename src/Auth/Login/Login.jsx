import { useState } from "react";
import { supabase } from "./../../Lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import car from "./../../assets/login.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t("auth.errors.invalidEmail"));
      return;
    }

    if (!password || password.length < 6) {
      toast.error(t("auth.errors.passwordTooShort"));
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.loginSuccess"));
      setShowModal(false);
      navigate("/");
    }

     

      
  };

  return (
    <>
      {/* ✅ Place ToastContainer at top-level (outside modal) */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999}}
      />

      <div className="relative w-full">
        {/* Background Image */}
        <div className="flex justify-center items-center ">
          <img
            src={car}
            alt={t("login.imageAlt", "Login Background")}
            className="z-0"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Animated Login Button */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-6 py-3 font-semibold text-lg rounded-full shadow-lg hover:scale-105 hover:bg-red-600 transition duration-300 animate-bounce"
          >
            {t("auth.loginNow")}
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all scale-100 animate-fadeInUp">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                aria-label={t("login.closeModal", "Close Modal")}
              >
                &times;
              </button>

              {/* Heading */}
              <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                {t("auth.welcomeBack")}
              </h2>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="email"
                  placeholder={t("auth.email")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder={t("auth.password")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  {t("auth.login")}
                </button>
              </form>

              {/* Sign up link */}
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  {t("auth.noAccount")}{" "}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate("/register");
                    }}
                    className="text-red-500 hover:text-red-600 font-medium underline transition"
                  >
                    {t("auth.signUpHere")}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
