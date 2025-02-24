import Conversation from "./Conversation";
import { Search, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { sendMessage } from "@/api/api_routes";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
function Content() {
  const [message, set_message] = useState<string>("");
  const { convId, langId } = useParams();
  const [loading, set_loading] = useState<boolean>(false);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_loading(true);

    const response = await sendMessage(
      langId as string,
      convId as string,
      message as string
    );

    if (response.success) {
      set_message("");
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    set_loading(false);
  };

  return (
    <div className="flex-1 p-8 flex-col flex justify-between">
      <Conversation loading={loading} />
      <div className="relative w-full max-w-3xl mx-auto mt-">
        <form className="relative" onSubmit={handleMessageSubmit}>
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ctp-text" />
          <Input
            type="text"
            placeholder="Message Query&Code ...."
            className="w-full pl-9 pr-4 py-2 border-ctp-flamingo text-ctp-text"
            value={message}
            onChange={(e) => set_message(e.target.value)}
          />
          <SendHorizontal className="absolute right-3 top-2.5 h-4 w-4 text-ctp-text" />
        </form>
      </div>
    </div>
  );
}

export default Content;
