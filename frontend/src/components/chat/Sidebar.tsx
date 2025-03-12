import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderClosed, Plus, Search } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import useChat from "@/stores/logic/useChat";

interface Props {
  className?: string;
}
export function Sidebar({ className }: Props) {
  const { langId } = useParams<{ langId: string; convId: string }>();
  const { loading, addNewChat, conversations, getConversations } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    getConversations(langId as string);
  }, [langId]);

  const handleNewChat = async () => {
    const response = await addNewChat(langId as string);
    if (response?.success) {
      navigate(`/${langId}/${response?.data.id}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
    }
  };

  if (loading)
    return <Spinner size={"80"} color={"white"} className="h-full w-full" />;

  return (
    <div
      className={` border-r border-ctp-flamingo flex flex-col h-full ${className} overflow-hidden absolute sm:static bg-ctp-gradient z-50`}
    >
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ctp-text bg-ctp-base" />
          <Input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 bg-ctp-base border-0 text-ctp-text placeholder:text-ctp-text focus:ring-2 !outine-none "
          />
        </div>
      </div>

      <div className="p-4">
        {conversations?.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start text-ctp-text hover:bg-ctp-base hover:text-ctp-flamingo mb-1 text-ellipsis overflow-hidden"
            onClick={() => navigate(`/${langId}/${item.id}`)}
          >
            <FolderClosed className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <Button
          className="w-full flex items-center gap-2 bg-ctp-base text-ctp-text active:scale-95 hover:shadow-2xl border border-ctp-flamingo transition-all duration-300 hover:bg-ctp-flamingo hover:text-ctp-crust"
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
      </div>
    </div>
  );
}
