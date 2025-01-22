import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, FolderClosed, Plus, Search } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-80 border-r border-gray-100 flex flex-col h-full">

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 bg-gray-100" />
          <Input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 text-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="p-4">
        <FolderSection title="Translation Option" />
        <ChatFolders />
      </div>

      <div className="flex-1 p-4">
        <ChatArchive />
      </div>

      <div className="p-4">
        <Button className="w-full bg-gray-100 hover:bg-gray-100/80 text-black">
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
      </div>
    </div>
  )
}

function FolderSection({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-400">{title}</span>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function ChatFolders() {
  const folders = ["Work chats", "Life chats", "Projects chats", "Clients chats"]
  return (
    <>
      {folders.map((folder) => (
        <Button key={folder} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-100 mb-1">
          <FolderClosed className="mr-2 h-4 w-4" />
          {folder}
        </Button>
      ))}
    </>
  )
}

function ChatArchive() {
  const chats = ["Plan a 3-day trip", "Ideas for a customer loyalty program", "Help me pick"]
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Query Archive</span>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {chats.map((chat) => (
        <Button
          key={chat}
          variant="ghost"
          className="w-full justify-start text-left px-3 py-2 text-gray-300 hover:bg-gray-100 mb-1"
        >
          {chat}
        </Button>
      ))}
    </>
  ) 
}

