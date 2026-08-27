import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Package,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../lib/toast";
import ThemeToggle from "../components/ThemeToggle";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedPhone = String(phoneNumber || "").trim();
    const normalizedPassword = String(password || "");

    if (!normalizedPhone || !normalizedPassword) {
      setError(t("login.fillFields"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { phoneNumber: normalizedPhone, password: normalizedPassword }
      );

      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      showToast(t("login.success"));
      navigate("/");
    } catch (err) {
      const serverMessage = err.response?.data?.message || t("login.failed");
      setError(serverMessage);
      showToast(serverMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Package, label: t("login.featProducts") },
    { icon: ShoppingCart, label: t("login.featOrders") },
    { icon: Users2, label: t("login.featWorkers") },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden p-4">
      {/* decorative blobs */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-warning/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-warning/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-warning/5 rounded-full blur-3xl pointer-events-none" />

      {/* top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle className="border-base-300 text-base-content/70 hover:text-warning" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* brand */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative">
            <div className="absolute -inset-3 bg-warning/20 rounded-3xl blur-xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-warning text-warning-content flex items-center justify-center shadow-lg shadow-warning/30">
              <img src="/clothing.svg" alt="Black Phoenix icon" className="w-9 h-9" />
            </div>
          </div>
          <p className="font-bold text-2xl tracking-tight text-base-content mt-4">
            BLACK <span className="text-warning">PHOENIX</span>
          </p>
          <p className="text-xs text-base-content/50 mt-0.5">{t("login.brandPanel")}</p>

          <h1 className="text-xl font-bold text-base-content mt-6">{t("login.welcome")}</h1>
          <p className="text-sm text-base-content/60 mt-1">{t("login.wish")}</p>
        </div>

        {/* form card */}
        <div className="rounded-3xl bg-base-100 border border-warning/20 shadow-2xl shadow-warning/10">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-error/15 border border-error/40 text-error text-sm px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70 ml-1">
                  {t("login.phone")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/40 group-focus-within:text-warning transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder={t("login.phonePlaceholder")}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input w-full pl-11 pr-4 h-12 bg-base-200 border-base-300 focus:border-warning focus:outline-none rounded-xl placeholder:text-base-content/40 text-base-content transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70 ml-1">
                  {t("login.password")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/40 group-focus-within:text-warning transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-11 pr-12 h-12 bg-base-200 border-base-300 focus:border-warning focus:outline-none rounded-xl placeholder:text-base-content/40 text-base-content transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/50 hover:text-warning transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-warning group w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-warning/30 hover:shadow-xl hover:shadow-warning/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-warning-content/30 border-t-warning-content rounded-full animate-spin" />
                    <span>{t("login.signingIn")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("login.signIn")}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* feature chips */}
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-warning/20 bg-base-100 px-3 py-1.5 text-xs font-medium text-base-content/70"
            >
              <Icon size={14} className="text-warning" />
              {label}
            </div>
          ))}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-base-content/50 text-xs mt-6">
          <ShieldCheck size={14} className="text-warning" />
          {t("login.secure")}
        </p>
      </div>
    </div>
  );
};

export default Login;
