import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderClosed, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import useChat from "@/stores/logic/useChat";

interface Props {
  className?: string;
}

export function Sidebar({ className }: Props) {
  const { langId, convId } = useParams<{ langId: string; convId: string }>();
  const { loading, addNewChat, conversations, getConversations, deleteConversation } = useChat();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const result = getConversations(langId as string);
    if (!result) {
      navigate("/");
    }
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

  const handleDelete = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const success = await deleteConversation(convId, langId as string);
    if (success) {
      if (convId === useParams().convId) {
          navigate(`/${langId}`);
      }
    }
  };

  const filteredConversations = conversations?.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-ctp-base border-0 text-ctp-text placeholder:text-ctp-text focus:ring-2 !outine-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4">
        {filteredConversations?.length === 0 ? (
          <div className="text-ctp-text text-center py-2">
            {searchQuery ? "No conversations found" : "No conversations"}
          </div>
        ) : (
          filteredConversations?.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-center mb-1"
            >
              <Button
                variant="ghost"
                className={`w-full justify-start text-ellipsis overflow-hidden ${
                  item.id === convId
                    ? "border border-ctp-flamingo text-ctp-flamingo"
                    : "text-ctp-text hover:bg-ctp-base hover:text-ctp-flamingo"
                }`}
                onClick={() => navigate(`/${langId}/${item.id}`)}
              >
                <FolderClosed className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-0 transition-opacity ${
                  item.id === convId
                    ? "hidden"
                    : "opacity-0 group-hover:opacity-100 text-ctp-text hover:bg-ctp-text hover:text-ctp-base"
                }`}
                onClick={(e) => handleDelete(item.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
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
