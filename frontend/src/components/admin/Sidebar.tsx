import { LayoutDashboard, Database, Settings, BookOpen, Code } from "lucide-react"
import { FaVectorSquare } from "react-icons/fa6"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-ctp-surface0 border-r border-ctp-flamingo p-4">
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <Database className="h-5 w-5" />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/admin/languages"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <Code className="h-5 w-5" />
          <span>Languages</span>
        </NavLink>
        <NavLink
          to="/admin/data-collection"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <BookOpen className="h-5 w-5" />
          <span>Data Collection</span>
        </NavLink>
        <NavLink
          to="/admin/vectorization"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <FaVectorSquare className="h-5 w-5" />
          <span>Vectorization</span>
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-ctp-surface1 text-ctp-text border border-ctp-flamingo"
                : "text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>

      </nav>
    </div>
  )
} 