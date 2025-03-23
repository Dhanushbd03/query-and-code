// src/routes.tsx
import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Layout from "@/layout/Layout";
import ProtectedRoute from "@/layout/ProtectRoute";
import AdminSignIn from "./pages/admin/admin-signin";
import AdminLayout from "./layout/AdminLayout";
import UsersList from "@/pages/admin/UserList";
import Settings from "@/pages/admin/Settings";
import Dashboard from "@/pages/admin/Dashboard";
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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "signin", element: <AdminSignIn /> },
      { index: true, element: <Dashboard /> },
      { path: "users", element: <UsersList /> },
      { path: "settings", element: <Settings /> },
      {path:"Context",element:<Context/>}
    ],
  },
];

export default routes;
