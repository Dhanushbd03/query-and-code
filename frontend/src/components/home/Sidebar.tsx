import { LogOut, LayoutDashboard } from "lucide-react";
import useAuthStore from "@/stores/logic/useAuthStore";
 
interface Props {
  className?: string;
}
export function Sidebar({className}:Props) {
  const { logout, isAuthenticated, loading } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return null;
  }

  const sidebarItems = [
    { icon: LayoutDashboard, active: true },
    ...(isAuthenticated ? [{ icon: LogOut, active: false, onClick: handleLogout }] : []),
  ];

  return (
    <div className={`bg-ctp-gradient flex flex-col items-center py-4 gap-4 border-r justify-center border-ctp-flamingo absolute sm:static ${className} overflow-hidden`}>
      <div className="flex flex-col gap-4 rounded-full border border-ctp-flamingo p-5 " > 
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg ${
              item.active
                ? "bg-slate-800 text-ctp-text" 
                : "text-slate-500 hover:text-ctp-text"
            }`}
            onClick={item.onClick}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
