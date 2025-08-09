import { useState, useCallback,useMemo } from "react";
import { supabase } from "./../../Lib/supabaseClient";
import car from "./../../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    rePassword: "",
    address: "",
    dateOfBirth: "",
    gender: "male",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = useCallback((pass) => {
    if (!pass) return 0;
    
    let score = 0;
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
    
    // Calculate score based on met requirements
    score = Object.values(requirements).filter(Boolean).length;
    return Math.min(score, 4); // Cap at 4 for UI consistency
  }, []);

  const getStrengthInfo = useCallback((score) => {
    const strengthLevels = [
      { text: t("auth.veryWeak"), color: "bg-red-500", width: "w-1/4" },
      { text: t("auth.weak"), color: "bg-orange-500", width: "w-2/4" },
      { text: t("auth.fair"), color: "bg-yellow-500", width: "w-3/4" },
      { text: t("auth.strong"), color: "bg-green-500", width: "w-full" }
    ];
    
    return strengthLevels[Math.min(score - 1, 3)] || strengthLevels[0];
  }, [t]);
  
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password, getPasswordStrength]);
  const strengthInfo = useMemo(() => getStrengthInfo(passwordStrength), [passwordStrength, getStrengthInfo]);

  const validateInputs = () => {
    const validations = [
      {
        condition: !formData.name?.trim(),
        message: t("register.errors.nameRequired")
      },
      {
        condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        message: t("register.errors.invalidEmail")
      },
      {
        condition: !/^\+?[0-9\s-]{10,}$/.test(formData.phone),
        message: t("register.errors.invalidPhone")
      },
      {
        condition: formData.password.length < 8,
        message: t("register.errors.passwordMinLength")
      },
      {
        condition: formData.password !== formData.rePassword,
        message: t("register.errors.passwordMismatch")
      },
      {
        condition: !formData.address?.trim(),
        message: t("register.errors.addressRequired")
      },
      {
        condition: !formData.dateOfBirth,
        message: t("register.errors.dobRequired")
      },
      {
        condition: !avatarFile,
        message: t("register.errors.avatarRequired")
      },
      {
        condition: formData.dateOfBirth && (new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear() < 18),
        message: t("register.errors.minAgeRequired")
      }
    ];

    const failedValidation = validations.find(validation => validation.condition);
    if (failedValidation) {
      setMessage(failedValidation.message);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const formFields = [
    {
      id: "name",
      label: t("auth.name"),
      type: "text",
      required: true,
      placeholder: t("auth.enterYourName"),
    },
    {
      id: "email",
      label: t("auth.email"),
      type: "email",
      required: true,
      placeholder: t("auth.enterYourEmail"),
    },
    {
      id: "phone",
      label: t("auth.phone"),
      type: "tel",
      required: true,
      placeholder: t("auth.enterYourPhone"),
    },
    {
      id: "password",
      label: t("auth.password"),
      type: "password",
      required: true,
      placeholder: t("auth.enterYourPassword"),
    },
    {
      id: "rePassword",
      label: t("auth.confirmPassword"),
      type: "password",
      required: true,
      placeholder: t("auth.confirmYourPassword"),
    },
    {
      id: "address",
      label: t("auth.address"),
      type: "text",
      required: true,
      placeholder: t("auth.enterYourAddress"),
    },
    {
      id: "dateOfBirth",
      label: t("auth.dateOfBirth"),
      type: "date",
      required: true,
    },
    {
      id: "gender",
      label: t("auth.gender"),
      type: "select",
      required: true,
      options: [
        { value: "male", label: t("auth.male") },
        { value: "female", label: t("auth.female") },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateInputs()) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
          },
        },
      });

      if (error) {
        setMessage(`${t("register.signUpFailed")}: ${error.message}`);
        return;
      }

      const userId = data.user.id;
      if (avatarFile && userId) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) {
          setMessage(`${t("register.avatarFailed")}: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        if (urlError) {
          setMessage(`${t("register.avatarUrlFailed")}: ${urlError.message}`);
          return;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrlData.publicUrl })
          .eq("id", userId);

        if (profileError) {
          setMessage(`${t("register.profileUpdateFailed")}: ${profileError.message}`);
          return;
        }
      }

      toast.success(t("register.success"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(`${t("register.signUpFailed")}: ${error.message}`);
    }
  };

  // const strengthScore = getPasswordStrength(formData.password);
  // const strengthBarColor = getStrengthColor(strengthScore);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center items-center">
        <img
          src={car}
          alt={t("auth.loginBackground")}
          className="z-0  object-cover"
        />
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 font-semibold text-lg rounded-full shadow-lg hover:scale-105 hover:bg-primary/80 transition duration-300 animate-bounce"
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
              aria-label={t("auth.closeModal")}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {t("register.title")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="avatar" className="text-sm text-gray-600">
                  {t("auth.avatar")}
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {formFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label htmlFor={field.id} className="text-sm text-gray-600">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required={field.required}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      name={field.id}
                      placeholder={field.placeholder}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {formData.password && (
                <div className="h-2 w-full bg-gray-200 rounded-md overflow-hidden">
                  <div className={`h-full ${strengthBarColor} transition-all duration-300`} />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary shadow-lg text-white py-2 rounded-md font-semibold hover:bg-primary/80 transition"
              >
                {t("register.registerBtn")}
              </button>

              {message && <p className="text-center text-sm text-red-600 mt-2">{message}</p>}
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                {t("auth.alreadyHaveAccount")}{" "}
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/login");
                  }}
                  className="text-primary hover:text-primary/80 font-medium underline transition"
                >
                  {t("auth.loginHere")}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}