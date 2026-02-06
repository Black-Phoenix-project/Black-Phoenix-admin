import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex relative min-h-screen overflow-hidden bg-base-100">

      <aside className="w-2/12 min-h-screen">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col w-full">
        <nav className="fixed w-[83%] top-0 z-50">
          <Navbar />
        </nav>

        <section className="flex-1 w-full">
          <Outlet />
        </section>
      </main>

    </div>
  );
}

export default App;
