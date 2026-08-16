import React from "react";
import { toast } from "react-toastify";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaTriangleExclamation,
  FaCircleInfo,
} from "react-icons/fa6";

const baseClass = "rounded-xl! min-h-0! p-2! px-3.5! text-sm! font-semibold! shadow-lg!";

const classes = {
  success: `${baseClass} bg-[#22c55e]! text-white!`,
  error: `${baseClass} bg-error! text-error-content!`,
  warning: `${baseClass} bg-warning! text-warning-content!`,
  info: `${baseClass} bg-info! text-info-content!`,
};

const icons = {
  success: <FaCircleCheck className="w-4 h-4" />,
  error: <FaCircleXmark className="w-4 h-4" />,
  warning: <FaTriangleExclamation className="w-4 h-4" />,
  info: <FaCircleInfo className="w-4 h-4" />,
};

export const showToast = (msg, type = "success") => {
  const t = type === "error" ? "error" : type === "warning" ? "warning" : type === "info" ? "info" : "success";
  toast[t](msg, { className: classes[t], icon: icons[t] });
};

export { toast };
export default toast;
