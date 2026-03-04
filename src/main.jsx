import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";
import LoadingTemplate from "./components/LoadingTemplate";

import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Workers = lazy(() => import("./pages/Workers"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Banners = lazy(() => import("./pages/Banners"));

const withSuspense = (element) => (
  <Suspense fallback={<LoadingTemplate />}>
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { path: "/", element: withSuspense(<Dashboard />) },
          { path: "orders", element: withSuspense(<Orders />) },
          { path: "products", element: withSuspense(<Products />) },
          { path: "workers", element: withSuspense(<Workers />) },
          { path: "wallet", element: withSuspense(<Wallet />) },
          { path: "profile", element: withSuspense(<Profile />) },
          { path: "swiper", element: withSuspense(<Banners />) },
        ],
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      { path: "/login", element: withSuspense(<Login />) },
      { path: "/register", element: withSuspense(<Register />) },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
