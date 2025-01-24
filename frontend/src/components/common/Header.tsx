import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import useDialogStore from "@/stores/ui/useAuthDialog";
export function Header() {
  const openAuthDialog = useDialogStore((state) => state.openAuthDialog);
  return (
    <div className="flex items-center justify-between px-6 py-2 border-b border-ctp-flamingo">
      <Logo />
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-ctp-base text-ctp-text active:scale-95 hover:shadow-2xl border border-ctp-flamingo transition-all duration-300 hover:bg-ctp-flamingo hover:text-ctp-crust"
          onClick={openAuthDialog}
        >
          <LogIn className="w-4 h-4" />
          Signin / Signup
        </Button>
    </div>
  );
}
