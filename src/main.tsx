import Workspace from "@/components/chat/Workspace";
import LandingPage from "@/components/landing-page/LandingPage";
import StartPage from "@/components/start-page/page";
import LoginPage from "@/components/login/login-page";
import { ProtectedRoute, PublicRoute } from "@/components/route-guards";
import { ThemeProvider } from "@/components/theme-provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import DevAnimationTest from "./components/dev-mode/animation-tester";
import "./index.css";
import { AuthProvider } from "./lib/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <StartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute>
        <Workspace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspace/:projectId",
    element: (
      <ProtectedRoute>
        <Workspace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <LoginPage />
        </ThemeProvider>
      </PublicRoute>
    ),
  },
  {
    path: "/landing",
    element: (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LandingPage />
      </ThemeProvider>
    ),
  },
  {
    path: "/dev",
    element: <DevAnimationTest />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
