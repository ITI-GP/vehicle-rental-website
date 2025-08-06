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
      toast.error(t("login.invalidEmail", "Please enter a valid email."));
      return;
    }

    if (!password || password.length < 6) {
      toast.error(
        t("login.invalidPassword", "Password must be at least 6 characters.")
      );
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("login.success", "Login successful!"));
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
        style={{ zIndex: 9999 }}
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
            className="bg-primary text-white px-6 py-3 font-semibold text-lg rounded-full shadow-lg hover:scale-105 hover:bg-primary/90 transition duration-300 animate-bounce"
          >
            {t("login.loginNow", "Login Now")}
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all scale-100 animate-fadeInUp">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold transition"
                aria-label={t("login.closeModal", "Close Modal")}
              >
                &times;
              </button>

              {/* Heading */}
              <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                {t("login.welcomeBack", "Welcome Back")}
              </h2>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="email"
                  placeholder={t("login.emailPlaceholder", "Email")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder={t("login.passwordPlaceholder", "Password")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  {t("login.loginButton", "Login")}
                </button>
              </form>

              {/* ✅ Register link */}
              <p className="text-center mt-4 text-sm text-gray-600">
                {t("login.noAccount", "Don’t have an account?")}{" "}
                <span
                  onClick={() => {
                    setShowModal(false);
                    navigate("/register");
                  }}
                  className="text-primary hover:underline cursor-pointer font-medium"
                >
                  {t("login.registerHere", "Register here")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
