import { Users, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdminAuthStore } from "@/stores/logic/adminAuthStore"
import { useNavigate, useLocation } from "react-router-dom"
import useUsers from "@/stores/logic/useUsers"
import AdminLogo from "./AdminLogo"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAdminAuthStore((state) => state.logout)
  const { users } = useUsers()

  const handleLogout = () => {
    logout()
    navigate('/admin/signin')
  }

  const isUsersPage = location.pathname === '/admin/users'

  return (
    <div className="flex items-center justify-between p-4 border-b border-ctp-flamingo">
      <div className="flex items-center">
        <AdminLogo />
      </div>
      <div className="flex items-center space-x-4">
        {isUsersPage && (
          <Badge variant="outline" className="flex items-center bg-ctp-surface0 border-ctp-flamingo text-ctp-text">
            <Users className="mr-1 h-3 w-3" />
            {users?.length || 0} Users
          </Badge>
        )}
        <Button variant="outline" onClick={handleLogout} className="flex items-center bg-ctp-surface0 border-ctp-flamingo text-ctp-text hover:bg-ctp-surface1">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
} 