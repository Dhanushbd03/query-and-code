import Conversation from "./Conversation";
import { Search, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useChat from "@/stores/logic/useChat";
function Content() {
  const [message, set_message] = useState<string>("");
  const { convId, langId } = useParams();
  const { sendMessage, } = useChat();

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(langId as string, convId as string, message);
    set_message("");
    
  };

  return (
    <div className="w-full p-8 flex-col flex justify-between h-full max-h-full">
      <Conversation />
      <div className="relative w-full max-w-3xl mx-auto">
        <form className="relative" onSubmit={handleMessageSubmit}>
          <Search className="absolute left-3 top-1/3 size-6 text-ctp-text" />
          <Input
            type="text"
            placeholder="Message Query&Code ...."
            className="w-full h-16 pl-10 pr-4 py-2 border-ctp-flamingo text-ctp-text text-xl"
            value={message}
            onChange={(e) => set_message(e.target.value)}
          />
          <SendHorizontal className="absolute right-3 top-1/3 size-6  text-ctp-text" />
        </form>
      </div>
    </div>
  );
}

export default Content;
