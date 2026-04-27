import { MainLayout } from "@/components/layout/MainLayout";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { Login } from "@/pages/auth/Login";
import { Onboarding } from "@/pages/auth/Onboarding";
import { Register } from "@/pages/auth/Register";
import { RegisterInvite } from "@/pages/auth/RegisterInvite";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Verify2FA } from "@/pages/auth/Verify2FA";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { ProjectDashboard } from "@/pages/project/ProjectDashboard";
import { Projects } from "@/pages/project/Projects";
import { TeamMembers } from "@/pages/team/TeamMembers";
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
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/register/invite", element: <RegisterInvite /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/verify-2fa", element: <Verify2FA /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: "/onboarding", element: <Onboarding /> },
      {
        element: <MainLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/team", element: <TeamMembers /> },
          { path: "/projects", element: <Projects /> },
          { path: "/projects/:projectId", element: <ProjectDashboard /> },
        ],
      },
    ],
  },
]);
