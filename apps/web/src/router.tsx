import { createBrowserRouter } from "react-router-dom";
import { NotFoundPage } from "./ui/NotFoundPage";
import { RouteLoading } from "./ui/RouteLoading";

export const router = createBrowserRouter([
  {
    path: "/auth/chzzk/callback",
    HydrateFallback: RouteLoading,
    lazy: async () => {
      const module = await import("./ui/ChzzkAuthCallback");
      return { Component: module.AuthCallback };
    }
  },
  {
    path: "/auth/twitch/callback",
    HydrateFallback: RouteLoading,
    lazy: async () => {
      const module = await import("./ui/ChzzkAuthCallback");
      return { Component: module.AuthCallback };
    }
  },
  {
    HydrateFallback: RouteLoading,
    lazy: async () => {
      const module = await import("./ui/App");
      return { Component: module.App };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("./ui/HomePage");
          return { Component: module.HomePage };
        }
      },
      {
        path: "streamer",
        lazy: async () => {
          const module = await import("./ui/StreamerPage");
          return { Component: module.StreamerPage };
        }
      },
      {
        path: "viewer",
        lazy: async () => {
          const module = await import("./ui/ViewerPage");
          return { Component: module.ViewerPage };
        }
      },
      {
        path: "privacy",
        lazy: async () => {
          const module = await import("./ui/PrivacyPolicyPage");
          return { Component: module.PrivacyPolicyPage };
        }
      },
      {
        path: "custom-css",
        lazy: async () => {
          const module = await import("./ui/CustomCssGuidePage");
          return { Component: module.CustomCssGuidePage };
        }
      },
      {
        path: "admin",
        lazy: async () => {
          const module = await import("./ui/AdminPage");
          return { Component: module.AdminPage };
        }
      },
      { path: "*", Component: NotFoundPage }
    ]
  }
]);
