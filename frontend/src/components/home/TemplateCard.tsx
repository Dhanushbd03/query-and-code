import { Language } from "@/api/api_routes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import iconMap from "@/components/icons/Icons";
import useChat from "@/stores/logic/useChat";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/logic/useAuthStore";
import useDialogStore from "@/stores/ui/useAuthDialog";

interface Props {
  lang: Language;
}

export function TemplateCard({ lang }: Props) {
  const Icon = iconMap[lang.name.toLowerCase()] || iconMap["default"];
  const navigate = useNavigate();
  const { addNewChat } = useChat();
  const { isAuthenticated } = useAuthStore();
  const { openAuthDialog } = useDialogStore();
  const handleClick = async () => {
    if (!isAuthenticated) {
      openAuthDialog();
      toast({
        title: "Error",
        description: "Please login to use this feature ",
        variant: "destructive",
      });
      return;
    }

    const response = await addNewChat(lang.id.toString());
    if (response?.success) {
      navigate(`/${lang.id}/${response.data.id}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group hover:scale-95 transition duration-300 h-full cursor-pointer"
    >
      <div className="bg-ctp-base border border-ctp-flamingo rounded-lg p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-800 rounded-lg border">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            DEMO
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{lang.name.toUpperCase()}</h3>
          <p className="text-sm text-slate-400">{lang.description}</p>
        </div>
      </div>
    </div>
  );
}
