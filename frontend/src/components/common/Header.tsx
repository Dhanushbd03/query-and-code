import { LogIn, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import useDialog from "@/stores/ui/useAuthDialog";
import useSidebar from "@/stores/ui/useSidebar";
import useAuthStore from "@/stores/logic/useAuthStore";

export function Header() {
  const openAuthDialog = useDialog((state) => state.openAuthDialog);
  const { set_is_sidebar_open } = useSidebar();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <div className="flex items-center justify-between px-6 py-2 border-b border-ctp-flamingo">
      <div className="flex items-center gap-5">
        <Logo />
        <Menu
          className="size-10"
          onClick={() => {
            set_is_sidebar_open();
          }}
        />
      </div>
      {!isAuthenticated ? (
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-ctp-base text-ctp-text active:scale-95 hover:shadow-2xl border border-ctp-flamingo transition-all duration-300 hover:bg-ctp-flamingo hover:text-ctp-crust"
          onClick={openAuthDialog}
        >
          <LogIn className="w-4 h-4" />
          Signin / Signup
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-ctp-base text-ctp-text active:scale-95 hover:shadow-2xl border border-ctp-flamingo transition-all duration-300 hover:bg-ctp-flamingo hover:text-ctp-crust"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      )}
    </div>
  );
}
