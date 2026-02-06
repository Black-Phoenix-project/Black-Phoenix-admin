import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKENT_URL = import.meta.env.BACKENT_URL;
  console.log("backent url:", BACKENT_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://black-phoenix-backent.onrender.com/api/auth/login",
        { email, password }
      );
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      navigate("/");
      toast.success("Login successful");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warning/5 via-base-100 to-warning/10 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-warning/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-warning/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-warning/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-4xl relative">
        <div className="bg-base-100 rounded-3xl shadow-2xl border border-warning/20 overflow-hidden backdrop-blur-sm">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-warning to-warning/80 p-8 text-center relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/80 text-sm">Sign in to continue your journey</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="bg-error/10 border border-error/30 text-error rounded-xl p-4 text-sm animate-shake">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-error rounded-full"></div>
                    {error}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className="w-5 h-5 text-warning group-focus-within:text-warning transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-warning focus:bg-base-200 outline-none transition-all duration-200 placeholder:text-base-content/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/70 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="w-5 h-5 text-warning group-focus-within:text-warning transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-warning focus:bg-base-200 outline-none transition-all duration-200 placeholder:text-base-content/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/50 hover:text-warning transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

          

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-warning to-warning/90 hover:from-warning/90 hover:to-warning text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-warning/30 hover:shadow-xl hover:shadow-warning/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-base-100 text-base-content/50">
                  New here?
                </span>
              </div>
            </div>

    
          </div>
        </div>

        <p className="text-center text-base-content/50 text-xs mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default Login;