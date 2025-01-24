import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, FolderClosed, Plus, Search } from "lucide-react";

export function Sidebar() {
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
        <FolderSection title="Translation Option" />
        <ChatFolders />
      </div>

      <div className="p-4 mt-auto">
        <Button className="w-full flex items-center gap-2 bg-ctp-base text-ctp-text active:scale-95 hover:shadow-2xl border border-ctp-flamingo transition-all duration-300 hover:bg-ctp-flamingo hover:text-ctp-crust">
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
      </div>
    </div>
  );
}

function FolderSection({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-ctp-text">{title}</span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-ctp-text hover:text-ctp-flamingo hover:bg-ctp-base"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-ctp-text hover:text-ctp-flamingo hover:bg-ctp-base"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ChatFolders() {
  const folders = [
    "Work chats",
    "Life chats",
    "Projects chats",
    "Clients chats",
  ];
  return (
    <>
      {folders.map((folder) => (
        <Button
          key={folder}
          variant="ghost"
          className="w-full justify-start text-ctp-text hover:bg-ctp-base hover:text-ctp-flamingo mb-1"
        >
          <FolderClosed className="mr-2 h-4 w-4" />
          {folder}
        </Button>
      ))}
    </>
  );
}
