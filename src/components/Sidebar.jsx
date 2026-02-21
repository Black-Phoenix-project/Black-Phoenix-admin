import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { CiHome, CiWallet } from "react-icons/ci";
import { FaCoffee, FaListUl } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { LuClipboardList, LuPlus } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <RxDashboard size={20} /> },
    { label: "Products", path: "/products", icon: <FaCoffee size={18} /> },
    { label: "Orders", path: "/orders", icon: <LuClipboardList size={20} /> },
    { label: "Workers", path: "/workers", icon: <MdOutlineWorkOutline size={20} /> },
    { label: "Wallet", path: "/wallet", icon: <CiWallet size={20} /> },
  ];

  const promoSlides = [
    {
      description: "Organize your menu by adding new products.",
      image: "https://cdn-icons-png.flaticon.com/128/745/745449.png",
      link: "/products",
      buttonLabel: "Add Product",
    },
    {
      description: "Add new workers to manage your business.",
      image: "https://png.pngtree.com/png-clipart/20250108/original/pngtree-cute-young-chef-png-image_6787274.png",
      link: "/workers",
      buttonLabel: "Add Worker",
    },
  ];

  /* ================= DESKTOP SIDEBAR ================= */
  if (!isMobile) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[17%] bg-base-300 shadow-xl flex flex-col p-3 border-r-2 border-warning rounded-b-2xl">
        <div className="h-[12%] flex flex-col justify-center px-3">
          <p className="text-xl font-bold text-warning">Black Phoenix</p>
        </div>

        <div className="h-[55%] ro rounded-xl p-2 overflow-hidden">
          <Swiper
            direction="vertical"
            slidesPerView={6.2}
            spaceBetween={4}
            className="h-full"
          >
            {menuItems.map(({ path, label, icon }) => (
              <SwiperSlide key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                    ${isActive(path) ? "bg-bg-warning text-white" : "t"}`}
                >
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="h-[23%] mt-3 bg-bg-warning rounded-xl overflow-hidden">
          <Swiper
            slidesPerView={1}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="h-full"
          >
            {promoSlides.map((item, index) => (
              <SwiperSlide key={index} className="flex items-center gap-3 p-3">
                <div className="flex-1 flex flex-col justify-between gap-3">
                  <p className="text-sm text-white font-semibold">{item.description}</p>
                  <Link
                    to={item.link}
                    className="btn btn-sm bg-white text-primary hover:bg-base-200 w-fit"
                  >
                    <LuPlus size={16} />
                    {item.buttonLabel}
                  </Link>
                </div>
                <div className="w-[40%]">
                  <img src={item.image} alt="promo" className="w-full h-auto object-contain" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="h-[10%] flex flex-col justify-center items-center text-xs text-base-content/40">
          <p>Black Phoenix</p>
          <p>by Xojimurodov</p>
        </div>
      </aside>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-base-300 border-t-2 border-warning shadow-xl flex justify-around items-center h-16">
      {menuItems.map(({ path, icon }) => (
        <Link
          key={path}
          to={path}
          className={`flex flex-col items-center justify-center text-xs transition-colors
            ${isActive(path) ? "text-warning" : "text-base-content/50"}`}
        >
          {icon}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
