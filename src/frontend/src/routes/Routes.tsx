import { Login } from "@/pages/auth/Login";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <Login /> }],
  },

  {
    element: <PrivateRoute />,
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
]);
