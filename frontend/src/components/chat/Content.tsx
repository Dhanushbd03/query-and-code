import Intro from "./Intro";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Bot } from "lucide-react";
function Content() {
  return (
    <div className="flex-1 p-8 overflow-auto flex-col flex justify-between">
     <Intro />
      <div className="relative w-full max-w-3xl mx-auto mt-">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-ctp-text" />
        <Input
          type="text"
          placeholder="Message Query&Code ...."
          className="w-full pl-9 pr-4 py-2 border-ctp-flamingo"
        />
      </div>
    </div>
  );
}

export default Content;
