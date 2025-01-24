import {
  BarChart3,
  Bot,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, active: true },
  { icon: Bot },
  { icon: Users },
  { icon: MessageSquare },
  { icon: FileText },
  { icon: BarChart3 },
  { icon: FlaskConical },
  { icon: Settings },
];

export function Sidebar() {
  return (
    <div className="bg-transparent flex flex-col items-center py-4 gap-4 w-28 border-r justify-center border-ctp-flamingo">
      <div className="flex flex-col gap-4 rounded-full border border-ctp-flamingo p-5"> 
        {" "}
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg ${
              item.active
                ? "bg-slate-800 text-ctp-text"
                : "text-slate-500 hover:text-ctp-text"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
