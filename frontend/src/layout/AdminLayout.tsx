import { Outlet } from "react-router-dom"
import Header from "@/components/admin/Header"
import Sidebar from "@/components/admin/Sidebar"

export default function AdminLayout() {
  return (
    <div className="h-screen bg-ctp-base overflow-hidden">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 