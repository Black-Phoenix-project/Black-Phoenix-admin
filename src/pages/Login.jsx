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
    <div className="min-h-screen flex relative bg-neutral overflow-hidden">

      {/* ===== Brand panel (desktop) ===== */}
      <div className="relative hidden lg:flex w-[46%] shrink-0 flex-col justify-between p-12 xl:p-16 overflow-hidden bg-neutral text-neutral-content">
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-warning/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-48 -left-28 w-[32rem] h-[32rem] bg-warning/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-warning/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.06]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-warning text-warning-content flex items-center justify-center shadow-lg shadow-warning/30">
            <img src="/clothing.svg" alt="Black Phoenix icon" className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg tracking-tight text-neutral-content">
              BLACK <span className="text-warning">PHOENIX</span>
            </p>
            <p className="text-xs text-neutral-content/50">{t("login.brandPanel")}</p>
          </div>
        </div>

        <div className="relative z-10 space-y-7">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight text-neutral-content">
              {t("login.brandTitle")}
            </h1>
            <p className="text-sm xl:text-base text-neutral-content/60 max-w-sm leading-relaxed">
              {t("login.brandSubtitle")}
            </p>
          </div>

          <div className="flex justify-center py-2">
            <img
              src="/login-illustration.svg"
              alt="Black Phoenix"
              className="w-52 h-auto drop-shadow-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-neutral-content/5 border border-neutral-content/10 rounded-2xl p-3.5 backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-warning text-warning-content flex items-center justify-center mb-2.5">
                  <Icon size={17} />
                </div>
                <p className="text-xs font-medium text-neutral-content/80 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-neutral-content/40">
          © {new Date().getFullYear()} Black Phoenix
        </p>
      </div>

      {/* ===== Form panel (same background as brand panel) ===== */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 overflow-hidden bg-neutral text-neutral-content">
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-warning/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-48 -left-28 w-[32rem] h-[32rem] bg-warning/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-warning/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.06]"></div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle className="border-neutral-content/20 text-neutral-content/70 hover:text-warning hover:border-warning/40" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden mb-8 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-warning/20 rounded-3xl blur-xl"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-warning text-warning-content flex items-center justify-center shadow-lg shadow-warning/30">
                <img src="/clothing.svg" alt="Black Phoenix icon" className="w-7 h-7" />
              </div>
            </div>
            <p className="font-bold text-xl tracking-tight text-neutral-content mt-4">
              BLACK <span className="text-warning">PHOENIX</span>
            </p>
            <p className="text-xs text-neutral-content/50 mt-0.5">{t("login.brandPanel")}</p>
          </div>

          <div className="hidden lg:block mb-7">
            <h1 className="text-2xl xl:text-3xl font-bold text-neutral-content">{t("login.welcome")}</h1>
            <p className="text-sm text-neutral-content/60 mt-1.5">{t("login.wish")}</p>
          </div>

          <div className="rounded-3xl bg-neutral-content/[0.04] backdrop-blur-xl border border-neutral-content/10 shadow-2xl shadow-black/40">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-error/15 border border-error/40 text-error text-sm px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0"></div>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-content/70 ml-1">
                    {t("login.phone")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-content/40 group-focus-within:text-warning transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder={t("login.phonePlaceholder")}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="input w-full pl-11 pr-4 h-12 bg-neutral-content/10 border-neutral-content/15 focus:border-warning focus:outline-none rounded-xl placeholder:text-neutral-content/40 text-neutral-content transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-content/70 ml-1">
                    {t("login.password")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-content/40 group-focus-within:text-warning transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input w-full pl-11 pr-12 h-12 bg-neutral-content/10 border-neutral-content/15 focus:border-warning focus:outline-none rounded-xl placeholder:text-neutral-content/40 text-neutral-content transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-content/50 hover:text-warning transition-colors"
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
                      <div className="w-5 h-5 border-3 border-warning-content/30 border-t-warning-content rounded-full animate-spin"></div>
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

          <p className="flex items-center justify-center gap-1.5 text-center text-neutral-content/50 text-xs mt-6">
            <ShieldCheck size={14} className="text-warning" />
            {t("login.secure")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
