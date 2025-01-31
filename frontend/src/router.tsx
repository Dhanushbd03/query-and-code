// src/routes.tsx
import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Layout from "@/layout/Layout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "chat/:lang", element: <Chat /> },
    ],
  },
];

export default routes;
