import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderClosed, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Conversation, getConversations, startChat } from "@/api/api_routes";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export function Sidebar() {
  const { langId, convId } = useParams<{ langId: string; convId: string }>();
  const [conversations, set_conversations] = useState<Conversation[]>([]);
  const [loading, set_loading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchConversations = async () => {
      const response = await getConversations(langId as string);
      set_conversations(response.data as Conversation[]);
    };
    fetchConversations();
  }, [loading]);

  const handleNewChat = async () => {
    set_loading(true);
    const response = await startChat(convId as string, langId as string);
    if (response.success) {
      navigate(`/${langId}/${response.data.id}`);
    } else {
      toast({
        title: "ERROR",
        description: response.message,
        variant: "success",
      });
    }
    set_loading(false);
  };

  if (loading)
    return (
      <Spinner size={"80"} color={"white"} className="h-screen w-screen" />
    );

  return (
    <div className="w-80 border-r border-ctp-flamingo flex flex-col h-full">
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
            className="w-full justify-start text-ctp-text hover:bg-ctp-base hover:text-ctp-flamingo mb-1"
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
