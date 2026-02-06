import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from 'react-toastify';
import "./index.css";
import App from "./App";
import { store, persistor } from "./redux/store";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Wallet from "./pages/Wallet";
import Workers from "./pages/Workers";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { 
        path: "/",
        element: <App />,
        children: [
        
          { path: "/", element: <Dashboard /> },
          { path: "orders", element: <Orders /> },
          { path: "products", element: <Products /> },
          { path: "/workers", element: <Workers /> },
          { path: "/wallet", element: <Wallet /> },
        ],
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer/>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
