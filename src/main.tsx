import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Workspace from "@/components/chat/Workspace";
import LandingPage from "@/components/LandingPage"; // Import your landing page component
import { ThemeProvider } from "@/components/theme-provider";
import DevAnimationTest from "./components/dev-mode/animation-tester";

import "./index.css";
import { Toaster } from "sonner";

const isLoggedIn = () => {
  // Replace this with your actual authentication logic
  return true;
  // return Boolean(localStorage.getItem("authToken"));
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: isLoggedIn()
      ? Workspace
      : () => (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <LandingPage />
        </ThemeProvider>
      ),
  },
  {
    path: "/dev",
    Component: DevAnimationTest,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isLoggedIn() ? (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster position="top-center" /> 
      </ThemeProvider>
    ) : (
      <RouterProvider router={router} />
    )}
  </StrictMode>,
);
