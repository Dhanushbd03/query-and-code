import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./router";
import useAuthStore from "./stores/logic/useAuthStore";

const App: React.FC = () => {
  const element = useRoutes(routes);
  const getUser = useAuthStore((state) => state.getUser);

  useEffect(() => {
    getUser();
  }, [getUser]);
  return <>{element}</>;
};

export default App;
