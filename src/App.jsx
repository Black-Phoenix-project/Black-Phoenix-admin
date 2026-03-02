import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CiHome, CiWallet } from "react-icons/ci";
import { FaCoffee } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { TbCarouselHorizontal } from "react-icons/tb";

const menuItems = [
  { label: "Bosh sahifa", path: "/", icon: <CiHome size={20} /> },
  { label: "Mahsulotlar", path: "/products", icon: <FaCoffee size={18} /> },
  { label: "Hamyon", path: "/wallet", icon: <CiWallet size={20} /> },
  { label: "Swiper", path: "/swiper", icon: <TbCarouselHorizontal size={20} /> },
  { label: "Ishchilar", path: "/workers", icon: <MdOutlineWorkOutline size={20} /> },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
