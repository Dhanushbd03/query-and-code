import Intro from "./Intro";
import Conversation from "./Conversation";
import { Search, SendHorizontal  } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
function Content() {
  const [is_intro] = useState<boolean>(true);
  const [message, set_message] = useState<string>("");
  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
  };
  return (
    <div className="flex-1 p-8 flex-col flex justify-between">
      {is_intro ? <Intro /> : <Conversation />}
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
