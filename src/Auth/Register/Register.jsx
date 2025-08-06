import { useState } from "react";
import { supabase } from "./../../Lib/supabaseClient";
import car from "./../../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [avatarFile, setAvatarFile] = useState(null);
  const [nationalIdImage, setNationalIdImage] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [nationalId, setNationalId] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 1:
        return "bg-red-500 w-1/4";
      case 2:
        return "bg-yellow-400 w-1/2";
      case 3:
        return "bg-blue-500 w-3/4";
      case 4:
        return "bg-green-500 w-full";
      default:
        return "bg-gray-300 w-0";
    }
  };

  const validateInputs = () => {
    if (
      !name || !email || !phone || !password || !rePassword ||
      !address || !dateOfBirth || !nationalId || !avatarFile || !nationalIdImage
    ) {
      setMessage(t("register.fillAllFields"));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage(t("register.invalidEmail"));
      return false;
    }

    if (!/^\d{10,}$/.test(phone)) {
      setMessage(t("register.invalidPhone"));
      return false;
    }

    if (password !== rePassword) {
      setMessage(t("register.passwordMismatch"));
      return false;
    }

    if (getPasswordStrength(password) < 2) {
      setMessage(t("register.weakPassword"));
      return false;
    }

    if (!nationalIdImage.type.startsWith("image")) {
      setMessage(t("register.nationalIdImageRequired"));
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }

    const userId = signUpData?.user?.id;
    let avatarUrl = null;
    let nationalIdImageUrl = null;

    // Upload avatar
    if (avatarFile && userId) {
      const ext = avatarFile.name.split(".").pop();
      const filePath = `${userId}-avatar.${ext}`;

      const { error: avatarError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (avatarError) {
        setMessage(`${t("register.avatarUploadFail")}: ${avatarError.message}`);
        return;
      }

      const { data: avatarData, error: avatarUrlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (avatarUrlError) {
        setMessage(`${t("register.avatarUrlFail")}: ${avatarUrlError.message}`);
        return;
      }

      avatarUrl = avatarData.publicUrl;
    }

    // Upload national ID image
    if (nationalIdImage && userId) {
      const ext = nationalIdImage.name.split(".").pop();
      const filePath = `${userId}-national-id.${ext}`;

      const { error: idUploadError } = await supabase.storage
        .from("national-ids")
        .upload(filePath, nationalIdImage);

      if (idUploadError) {
        setMessage(`${t("register.nationalIdUploadFail")}: ${idUploadError.message}`);
        return;
      }

      const { data: idUrlData, error: idUrlError } = supabase.storage
        .from("national-ids")
        .getPublicUrl(filePath);

      if (idUrlError) {
        setMessage(`${t("register.nationalIdUrlFail")}: ${idUrlError.message}`);
        return;
      }

      nationalIdImageUrl = idUrlData.publicUrl;
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        phone,
        address,
        dateOfBirth,
        gender,
        nationalId,
        avatar: avatarUrl,
        nationalIdImage: nationalIdImageUrl,
      },
    });

    if (updateError) {
      setMessage(`${t("register.profileUpdateFail")}: ${updateError.message}`);
      return;
    }

    toast.success(t("register.registrationSuccess"));
    navigate("/login");
  };

  const strengthScore = getPasswordStrength(password);
  const strengthBarColor = getStrengthColor(strengthScore);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center items-center">
        <img
          src={car}
          alt="Login Background"
          className="z-0"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-6 py-3 font-semibold text-lg rounded-full shadow-lg hover:scale-105 hover:bg-red-600 transition duration-300 animate-bounce"
        >
          {t("register.title")}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
          <div className="relative bg-white w-full max-w-md p-5 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {t("register.title")}
            </h2>

            <form onSubmit={handleRegister} className="space-y-3">
              {/* Avatar Upload */}
              <input type="file" accept="image/*" className="w-full p-2 border rounded-md"
                onChange={(e) => setAvatarFile(e.target.files[0])} />

              {/* Full Name */}
              <input type="text" placeholder={t("register.fullName")} className="w-full p-2 border rounded-md"
                value={name} onChange={(e) => setName(e.target.value)} required />

              {/* Phone */}
              <input type="tel" placeholder={t("register.phone")} className="w-full p-2 border rounded-md"
                value={phone} onChange={(e) => setPhone(e.target.value)} required />

              {/* Email */}
              <input type="email" placeholder={t("register.email")} className="w-full p-2 border rounded-md"
                value={email} onChange={(e) => setEmail(e.target.value)} required />

              {/* Address */}
              <input type="text" placeholder={t("register.address")} className="w-full p-2 border rounded-md"
                value={address} onChange={(e) => setAddress(e.target.value)} required />

              {/* Date of Birth */}
              <input type="date" className="w-full p-2 border rounded-md"
                value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />

              {/* Gender */}
              <select className="w-full p-2 border rounded-md"
                value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">{t("register.male")}</option>
                <option value="female">{t("register.female")}</option>
              </select>

              {/* Password */}
              <input type="password" placeholder={t("register.password")} className="w-full p-2 border rounded-md"
                value={password} onChange={(e) => setPassword(e.target.value)} required />

              {/* Password Strength Bar */}
              {password && (
                <div className="h-2 w-full bg-gray-200 rounded-md overflow-hidden">
                  <div className={`h-full ${strengthBarColor} transition-all duration-300`} />
                </div>
              )}

              {/* Confirm Password */}
              <input type="password" placeholder={t("register.confirmPassword")} className="w-full p-2 border rounded-md"
                value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />

              {/* National ID Number */}
              <input type="tel" placeholder={t("register.nationalId")} className="w-full p-2 border rounded-md"
                value={nationalId} onChange={(e) => setNationalId(e.target.value)} required />

              {/* National ID Image Upload */}
              <input type="file" accept="image/*" className="w-full p-2 border rounded-md"
                onChange={(e) => setNationalIdImage(e.target.files[0])} required />

              <button type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition">
                {t("register.registerBtn")}
              </button>

              {message && <p className="text-center text-sm text-red-600 mt-2">{message}</p>}
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
