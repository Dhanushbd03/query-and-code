import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  }
];

export default routes;
