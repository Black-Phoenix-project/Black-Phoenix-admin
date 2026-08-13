import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Wallet, Coffee, BriefcaseBusiness, ClipboardList, Plus, LayoutDashboard, PanelsTopLeft } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [promoIndex, setPromoIndex] = useState(0);
  const { t } = useLanguage();

  const menuItems = [
    { label: t("sidebar.dashboard"), path: "/", icon: <LayoutDashboard size={20} /> },
    { label: t("sidebar.products"), path: "/products", icon: <Coffee size={18} /> },
    { label: t("sidebar.orders"), path: "/orders", icon: <ClipboardList size={20} /> },
    { label: t("sidebar.workers"), path: "/workers", icon: <BriefcaseBusiness size={20} /> },
    { label: t("sidebar.wallet"), path: "/wallet", icon: <Wallet size={20} /> },
    { label: t("sidebar.banners"), path: "/swiper", icon: <PanelsTopLeft size={20} /> },
  ];

  const promoSlides = [
    {
      description: t("sidebar.promo1"),
      image: "https://cdn-icons-png.flaticon.com/128/745/745449.png",
      link: "/products",
      buttonLabel: t("sidebar.promo1Btn"),
    },
    {
      description: t("sidebar.promo2"),
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      link: "/swiper",
      buttonLabel: t("sidebar.promo2Btn"),
    },
  ];

  const currentPromo = promoSlides[promoIndex];

  useEffect(() => {
    if (promoSlides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [promoSlides.length]);

  return (
    <aside className="fixed top-0 left-0 h-screen w-[17%] bg-base-300 shadow-xl flex flex-col p-3 border-r-2 border-warning rounded-b-2xl">
      <div className="h-[12%] flex flex-col justify-center px-3">
        <p className="text-xl font-bold text-warning">{t("nav.brand")}</p>
      </div>

      <div className="h-[55%] rounded-xl p-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${
                  isActive(path)
                    ? "bg-warning text-warning-content shadow"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-[23%] mt-3 bg-warning rounded-xl overflow-hidden">
        <div className="h-full flex items-center gap-3 p-3">
          <div className="flex-1 flex flex-col justify-between gap-3">
            <p className="text-sm text-warning-content font-semibold">{currentPromo.description}</p>
            <Link
              to={currentPromo.link}
              className="btn btn-sm bg-base-100 text-warning hover:bg-base-200 border-none w-fit"
            >
              <Plus size={16} />
              {currentPromo.buttonLabel}
            </Link>
          </div>
          <div className="w-[40%]">
            <img
              src={currentPromo.image}
              alt="promo"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="h-[10%] flex flex-col justify-center items-center text-xs text-base-content/40">
        <p>{t("nav.brand")}</p>
        <p>{t("sidebar.by")}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
