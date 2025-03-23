import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ctp-base">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="fixed">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 