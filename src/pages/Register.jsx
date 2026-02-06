import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }


    const newUser = {
      user: {
        name: formData.name,
        email: formData.email,
      },
    };

    dispatch(registerSuccess(newUser));

    navigate("/login");
  };
  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains a number", met: /\d/.test(formData.password) },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen from-cyan-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3/6 relative">
        <div className="bg-base-300/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-base-300/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 from-cyan-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-base-300" />
            </div>
            <h2 className="text-3xl font-bold text-base-300 mb-2">
              Create Account
            </h2>
            <p className="text-cyan-200">Join our admin dashboard today</p>
          </div>

          <div className="space-y-5">
            {/* NAME + EMAIL */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-cyan-100">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-base-300/10 border border-base-300/20 rounded-xl py-3 px-4 text-base-300"
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-cyan-100">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-base-300/10 border border-base-300/20 rounded-xl py-3 px-4 text-base-300"
                />
              </div>
            </div>

            {/* PASSWORDS */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-cyan-100">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleChange("password", e.target.value)
                    }
                    className="w-full bg-base-300/10 border border-base-300/20 rounded-xl py-3 px-4 text-base-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-cyan-300"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="text-sm text-cyan-100">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    className="w-full bg-base-300/10 border border-base-300/20 rounded-xl py-3 px-4 text-base-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3 text-cyan-300"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>

            {/* PASSWORD RULES */}
            {formData.password && (
              <div className="space-y-1">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${req.met ? "bg-green-500" : "bg-base-300/20"
                        }`}
                    >
                      {req.met && (
                        <Check className="w-3 h-3 text-base-300 mx-auto" />
                      )}
                    </div>
                    <span className="text-xs text-cyan-200">{req.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full from-cyan-500 to-blue-500 text-base-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight />
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-cyan-200">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
