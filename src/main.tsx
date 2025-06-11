import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Workspace from "@/components/chat/Workspace";
import LandingPage from "@/components/LandingPage"; // Import your landing page component
import { ThemeProvider } from "@/components/theme-provider";

import "./index.css";

const isLoggedIn = () => {
  // Replace this with your actual authentication logic
  return true;
  // return Boolean(localStorage.getItem("authToken"));
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: isLoggedIn() ? Workspace : LandingPage, // Conditional rendering
  },
]);



/*
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Workspace },
      { path: "svg", Component: SvgPreviewer },
    ],
  },
]);
*/

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
