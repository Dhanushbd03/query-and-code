import { Outlet, useNavigate } from "react-router-dom"
import Header from "@/components/admin/Header"
import Sidebar from "@/components/admin/Sidebar"
import { useAdminAuthStore } from "@/stores/logic/adminAuthStore"

export default function AdminLayout() {
  const { is_authenticated } = useAdminAuthStore((state) => state)
  const navigate = useNavigate()
      if (!is_authenticated) {
        navigate('/admin/signin')
  }
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