import { BarChart3, Bot, FileText, FlaskConical, LayoutDashboard, MessageSquare, Settings, Users } from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, active: true },
  { icon: Bot },
  { icon: Users },
  { icon: MessageSquare },
  { icon: FileText },
  { icon: BarChart3 },
  { icon: FlaskConical },
  { icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4">
      {sidebarItems.map((item, index) => (
        <button
          key={index}
          className={`p-2 rounded-lg ${
            item.active
              ? "bg-slate-800 text-white"
              : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <item.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  )
}

