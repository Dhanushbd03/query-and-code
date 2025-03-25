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
import Languages from "@/pages/admin/Languages";
import DataCollection from "./components/admin/DataCollection/DataCollection";
import Vectorization from "./components/admin/Vectorization/Vectorization";

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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <UsersList /> },
      { path: "languages", element: <Languages /> },
      { path: "data-collection", element: <DataCollection /> },
      { path: "vectorization", element: <Vectorization /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/admin/signin",
    element: <AdminSignIn />,
  },
];

export default routes;
