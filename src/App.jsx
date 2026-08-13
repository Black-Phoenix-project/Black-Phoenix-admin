import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  BriefcaseBusiness,
  PanelsTopLeft,
  ClipboardList,
  ToolCase,
} from "lucide-react";
import { useLanguage } from "./i18n/LanguageContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: t("sidebar.dashboard"), path: "/", icon: <Home size={20} /> },
    { label: t("sidebar.products"), path: "/products", icon: <ToolCase size={18} /> },
    { label: t("sidebar.orders"), path: "/orders", icon: <ClipboardList size={20} /> },
    { label: t("sidebar.workers"), path: "/workers", icon: <BriefcaseBusiness size={20} /> },
    { label: t("sidebar.wallet"), path: "/wallet", icon: <Wallet size={20} /> },
    { label: t("sidebar.banners"), path: "/swiper", icon: <PanelsTopLeft size={20} /> },
  ];

  return (
    <div className="flex relative min-h-screen overflow-hidden bg-base-100">
      <aside className="hidden md:block w-[17%] min-h-screen">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col w-full">
        <nav className="fixed top-0 left-0 md:left-[17%] w-full md:w-[83%] z-50">
          <Navbar />
        </nav>

        <section className="flex-1 w-full pt-[64px] md:pt-[64px] pb-[60px]">
          <Outlet />
        </section>

        <nav className="fixed bottom-0 left-0 w-full h-14 bg-base-300 border-t-2 border-warning flex justify-around items-center md:hidden z-50 px-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`transition-all flex flex-col items-center justify-center px-2 py-1 rounded-lg
                ${
                  isActive(item.path)
                    ? "bg-warning text-warning-content"
                    : "text-base-content/60"
                }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

export default App;
