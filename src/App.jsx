import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { CiHome, CiWallet } from "react-icons/ci";
import { FaCoffee } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const menuItems = [
  { label: "Dashboard", path: "/", icon: <CiHome size={20} /> },
  { label: "Products", path: "/products", icon: <FaCoffee size={18} /> },
  { label: "Wallet", path: "/wallet", icon: <CiWallet size={20} /> },
  { label: "Workers", path: "/workers", icon: <MdOutlineWorkOutline size={20} /> },
];

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex relative min-h-screen overflow-hidden bg-base-100">

      <aside className="hidden md:block w-[17%] min-h-screen">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col w-full">
        {/* FIXED TOP NAVBAR */}
        <nav className="fixed top-0 left-0 md:left-[17%] w-full md:w-[83%] z-50">
          <Navbar />
        </nav>

        <section className="flex-1 w-full pt-[64px] md:pt-[64px] pb-[60px]">
          <Outlet />
        </section>

        <nav className="fixed bottom-0 left-0 w-full h-14 bg-base-300 border-t-2 border-warning flex justify-around items-center md:hidden z-50">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="text-gray-500 hover:text-warning transition-all flex flex-col items-center justify-center"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

    </div>
  );
}

export default App;
