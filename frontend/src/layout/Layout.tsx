import { Header } from "@/components/common/Header";
import Auth from "@/components/home/Auth";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="min-h-screen h-screen bg-gradient-to-r from-ctp-crust via-ctp-base to-ctp-crust/95 text-ctp-text flex flex-col">
      <Header />
      <main className="flex flex-1 gap-5">
        <Outlet />
      </main>
      <Auth />
      <Toaster />
    </div>
  );
}
