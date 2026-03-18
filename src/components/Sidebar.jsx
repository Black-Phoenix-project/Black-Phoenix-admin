import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Wallet, Coffee, BriefcaseBusiness, ClipboardList, Plus, LayoutDashboard, PanelsTopLeft } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Дашборд", path: "/", icon: <LayoutDashboard size={20} /> },
    { label: "Товары", path: "/products", icon: <Coffee size={18} /> },
    { label: "Заказы", path: "/orders", icon: <ClipboardList size={20} /> },
    { label: "Сотрудники", path: "/workers", icon: <BriefcaseBusiness size={20} /> },
    { label: "Кошелёк", path: "/wallet", icon: <Wallet size={20} /> },
    { label: "Баннеры", path: "/swiper", icon: <PanelsTopLeft size={20} /> },
  ];

  const promoSlides = [
    {
      description: "Добавляйте новые товары в каталог.",
      image: "https://cdn-icons-png.flaticon.com/128/745/745449.png",
      link: "/products",
      buttonLabel: "Добавить товар",
    },
    {
      description: "Обновляйте баннеры для главной страницы.",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      link: "/swiper",
      buttonLabel: "Добавить баннер",
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

  if (!isMobile) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[17%] bg-base-300 shadow-xl flex flex-col p-3 border-r-2 border-warning rounded-b-2xl">
        <div className="h-[12%] flex flex-col justify-center px-3">
          <p className="text-xl font-bold text-warning">Black Phoenix</p>
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
          <p>Black Phoenix</p>
          <p>by Xojimurodov</p>
        </div>
      </aside>
    );
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[380px] bg-base-100/95 backdrop-blur-2xl shadow-2xl border border-warning/20 rounded-full px-3 py-2 flex justify-around items-center">
      {menuItems.map(({ path, icon }) => (
        <Link
          key={path}
          to={path}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all
            ${
              isActive(path)
                ? "bg-warning text-warning-content shadow-inner"
                : "text-base-content/50 hover:bg-base-200"
            }`}
        >
          {icon}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
