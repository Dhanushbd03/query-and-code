// src/routes.tsx
import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Layout from "@/layout/Layout";
import ProtectedRoute from "@/layout/ProtectRoute";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/:langId",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:langId/:convId",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default routes;
