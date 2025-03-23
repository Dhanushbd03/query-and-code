import { Header } from "@/components/common/Header";
import Auth from "@/components/home/Auth";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import useAuthStore from "@/stores/logic/useAuthStore";

export default function Layout() {
  const getUser = useAuthStore((state) => state.getUser);

  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <div className="h-full text-ctp-text flex flex-col">
      <Header />
      <main className="flex w-full gap-5 h-full">
        <Outlet />
      </main>
      <Auth />
      <Toaster />
    </div>
  );
}
